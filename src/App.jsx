import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const { Badge, Button, Card } = ReactBootstrap

function Square(){
  return <button className="square"></button>
}

function Board(){
  return(
    <>
      <div className="status">Next player: X</div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  )
}

export default function App() {
  return(
    <div className="container py-4">
      <Board />
    </div>
  )
}
