import React, {useState, useMemo, useEffect } from 'react'

const POSITION = {
  x:0,
  y:0
}

export default function Draggable({children, parentRef, childRef}) {

  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
    boxOrigin: POSITION
  });
	
  const handleDragStart = (e) => {
    // let dragImgEl = document.createElement('span')
    // dragImgEl.setAttribute('style','position:absolute; display:block; top:0; left:0; width:0; height:0;')
    // document.body.appendChild(dragImgEl)
    // e.DataTransfer.setDragImage(dragImgEl,0,0)
    setState(state => ({
      ...state,
      isDragging: true,
      origin: {x: e.clientX, y: e.clientY},
    }));
    // console.log('start',state)
  }
	
  const handleDrag = (e) => {
    e.preventDefault()

    const { offsetWidth, offsetHeight } = parentRef.current
    const translation = {
      x: e.clientX - state.origin.x + state.boxOrigin.x, 
      y: e.clientY - state.origin.y + state.boxOrigin.y
    };
    const childEl = childRef.current

    if(translation.x < 0){
      translation.x = 0
    } 
    if(translation.y < 0){
      translation.y = 0
    } 
    if(translation.x > offsetWidth - childEl.offsetWidth){
      translation.x = offsetWidth - childEl.offsetWidth
    }

    if(translation.y > offsetHeight - childEl.offsetHeight){
      translation.y = offsetHeight - childEl.offsetHeight
    }

    setState(state => ({
      ...state,
      translation
    }));
  }
	
  const handleDragEnd = ({clientX, clientY}) => {
    const translation = {
      x:clientX - state.origin.x + state.boxOrigin.x,
      y:clientY - state.origin.y + state.boxOrigin.y
    }

    if(clientX || clientY){
      setState({
        ...state,
        isDragging: false,
        boxOrigin: translation,
      })
    }
		// console.log('end',state)
    // onDragEnd();
  }
	
  useEffect(() => {
    if(childRef){
    setState({
      ...state,
      boxOrigin:{
        x: childRef.current.offsetLeft,
        y: childRef.current.offsetTop
      }
    })
  }
  }, []);
	
  const styles = useMemo(() => ({
    cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
    transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
    transition: state.isDragging ? 'none' : 'transform 500ms',
    zIndex: 1,
    position: 'absolute'
  }), [state.isDragging, state.translation]);
  
  return (
    <div
    draggable 
    style={styles} 
    onDragStart={handleDragStart}
    onDrag={handleDrag}
    onDragOver={(e)=> e.preventDefault()}
    onDragEnd={handleDragEnd}
    >
    {children}
  </div>
  )
}
