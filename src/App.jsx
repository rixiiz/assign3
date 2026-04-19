import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const { Badge, Button, Card } = ReactBootstrap

function Square({value, onSquareClick}){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({turn, squares, onPlay}){
  function handleClick(index){
    if(squares[index] !== null) return;
    const newSquares = squares.slice();
    newSquares[index] = turn ? 'X' : 'O';
    onPlay(newSquares);
  }

  return(
    <>
      <div className="status">Next player: {turn ? 'X' : 'O'}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

export default function App() {
  const [turn, setTurn] = React.useState(true);
  const [squares, setSquares] = React.useState(Array(9).fill(null));

  function handlePlay(newSquares){
    setSquares(newSquares);
    setTurn(!turn);
  }

  return(
    <div className="container py-4">
      <Card className="starter-card shadow-sm">
        <Card.Body className="p-4">
          <Board turn={turn} squares={squares} onPlay={handlePlay} />
        </Card.Body>
      </Card>
    </div>
  )
}
