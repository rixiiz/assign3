import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const { Badge, Button, Card } = ReactBootstrap

// function to check if a player has won the game
// squares is array of length 9 to represent the board
function calculateWinner(squares){
  // all possible winning combinations for a player
  const possibleWinCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // check each combination
  for(let i=0;i<possibleWinCombinations.length;i++){
    const [a, b, c] = possibleWinCombinations[i];

    // see if a player occupies all three of the winning squares
    if(squares[a] !== null && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }

  // no winner
  return null;
}

// a single square on the board
// value is either X, O, or null
// onSquareClick is called when square is clicked
function Square({value, onSquareClick}){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

// board component
// renders all 9 squares, determines game state, and handles click logic
function Board({turn, squares, onPlay}){
  // check for winner
  const winner = calculateWinner(squares);

  // check if board is full (all non-null)
  let isBoardFull = true;
  for(let i=0;i<squares.length;i++){
    if(squares[i] === null){
      isBoardFull = false;
      break;
    }
  }

  // draw if board is full and no winner
  const isDraw = isBoardFull && !winner;

  // click handler (when user clicks on a square)
  function handleClick(index){
    // square can't be already filled and a player hasn't won yet
    if(squares[index] !== null || winner) return;

    // copies the board and send the updated board to App
    const newSquares = squares.slice();
    newSquares[index] = turn ? 'X' : 'O';
    onPlay(newSquares);
  }

  // determines the message to show to the user
  let status;
  if(winner){
    status = `Winner: ${winner}`;
  }
  else if(isDraw){
    status = 'Draw!';
  }
  else{
    status = `Next player: ${turn ? 'X' : 'O'}`;
  }

  return(
    <>
      {/* display game status (turn, win, or draw) */}
      <div className="status">{status}</div>

      {/* 3x3 board */}
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

// main component render point
// stores game state, tracks turns, passes data to the board
export default function App() {
  // turn = true means X, false means O
  const [turn, setTurn] = React.useState(true);
  // squares array stores board state
  const [squares, setSquares] = React.useState(Array(9).fill(null));

  // function that handles UI when a move is made
  function handlePlay(newSquares){
    // updates board and switches turns
    setSquares(newSquares);
    setTurn(!turn);
  }

  return(
    <div className="container py-4">
      <Card className="starter-card shadow-sm">
        <Card.Body className="p-4">
          {/* passes state and handler to board */}
          <Board turn={turn} squares={squares} onPlay={handlePlay} />
        </Card.Body>
      </Card>
    </div>
  )
}
