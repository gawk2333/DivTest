import React from 'react'
import Draggable from 'react-draggable'

const App = () => {
  return (
    <div 
    style={{ width: '80vw', height: '80vh', position:'absolute', top:'10vh', left:'10vw' ,backgroundColor: '#86e3cb'}}>
      <Draggable bounds='parent'>
        <div style={{ width: 50, height: 50, backgroundColor: 'red'}}>
        </div>
      </Draggable>
    </div>
  )
}

export default App
