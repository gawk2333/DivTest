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
 
  const handleDragStart = ({clientX, clientY}) => {
    setState(state => ({
      ...state,
      isDragging: true,
      origin: {x: clientX, y: clientY},
    }));
  }
 
  const handleDrag = (e) => {
    e.preventDefault()
    const { offsetWidth, offsetHeight } = parentRef.current
    const childEl = childRef.current
    const translation = {
      x: e.clientX - state.origin.x + state.boxOrigin.x, 
      y: e.clientY - state.origin.y + state.boxOrigin.y
    };
    if(translation !== state.boxOrigin){
      //keep dragged box inside the boundary
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
      // prevent unexpected {x:0,y:0}
      if(!(translation.x || translation.y)){
        return
      }
        setState(state => ({
          ...state,
          translation
        }));
    }
  }
 
  const handleDragEnd = ({clientX, clientY}) => {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = parentRef.current
    const childEl = childRef.current

    let fixedClientX = clientX
    let fixedClientY = clientY

    // keep position when cursor out of boundary
    if(fixedClientX < offsetLeft){
      fixedClientX = offsetLeft
    }

    if(fixedClientY < offsetTop){
      fixedClientY = offsetTop
    } 
    if(fixedClientX > offsetLeft + offsetWidth - childEl.offsetWidth){
      fixedClientX = offsetLeft + offsetWidth - childEl.offsetWidth
    }

    if(fixedClientY > offsetTop + offsetHeight - childEl.offsetHeight){
      fixedClientY = offsetTop + offsetHeight - childEl.offsetHeight
    }

    const translation = {
      x:fixedClientX - state.origin.x + state.boxOrigin.x,
      y:fixedClientY - state.origin.y + state.boxOrigin.y
    }

      setState({
        ...state,
        isDragging: false,
        boxOrigin: translation,
      })
  }

  const handleResize = (e) => {
    const { innerWidth, innerHeight } = e.currentTarget
    const boundaries = {
      left: parseInt( innerWidth * 0.1 ),
      right: parseInt( innerWidth * 0.9 ),
      top: parseInt( innerHeight * 0.1 ),
      bottom: parseInt( innerHeight * 0.9 )
    }

    const child = document.getElementsByClassName("child")
    const { left ,right, top, bottom } = child[0].getBoundingClientRect()
    const childEl = childRef.current
    const parentEl = parentRef.current

    let childPosition = {
      x: left - parentEl.offsetLeft,
      y: top - parentEl.offsetTop
    }

    // keep child in parent div when window resizing
    if(left < boundaries.left ){
      childPosition.x = 0
    }
    if(right > boundaries.right - childEl.offsetWidth ){
      childPosition.x = parentEl.offsetWidth - childEl.offsetWidth
    }
    if(top < boundaries.top ){
      childPosition.y = 0
    }
    if(bottom > boundaries.bottom - childEl.offsetHeight ){
      childPosition.y = parentEl.offsetHeight - childEl.offsetHeight
    }

    setState({
      ...state,
      translation: childPosition,
      boxOrigin: childPosition
    })
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
    window.addEventListener("resize",handleResize)
  }
  return () => window.removeEventListener("resize", handleResize)
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
