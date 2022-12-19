import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App onDragOver={(e)=> e.preventDefault()}/>,
    document.getElementById('app')
  )
})
