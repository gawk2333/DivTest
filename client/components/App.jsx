import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Draggable from './Draggable';

const App = () => {
  const parentRef = useRef()
  const childRef = useRef()
  const [inside, setInside] = useState(true)

  return (
    <BodyContainer onDragOver={(e)=> e.preventDefault()} inside={inside}>
      <Container className="parent" ref={parentRef} onMouseOut={()=> setInside(false)} onMouseOver={()=> setInside(true)}>
            <Draggable parentRef={parentRef} childRef={childRef}>
              <Rect className="child" ref={childRef} >
              </Rect>
            </Draggable>
      </Container>
    </BodyContainer>
  );
};

export default App

const BodyContainer = styled.div.attrs(props => ({
  style: {
    cursor: props.inside ? 'auto' : 'none'
  }
}))`
  width:100vw;
  height:100vh;
`

const Container = styled.div`
  position: absolute;
  top:10vh;
  left:10vw;
  width: 80vw;
  min-height: 80vh;
  background-color:#29f0e1;
`;

const Rect = styled.div.attrs(props => ({
  style: {
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: 40px;
  height: 40px;
  user-select: none;
  background: #fff000;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: #777;
`;
