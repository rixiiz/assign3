import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const { Badge, Button, Card } = ReactBootstrap

// function to check if a player has won the game
// squares is array of length 9 to represent the board
function calculateWinner(squares){
  // all possible winning combinations for a player
  const possibleWinCombinations = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
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
// isSelectd indicates if this square is currently selected for move phase
function Square({value, onSquareClick, isSelected}){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
      {/* * is used to visually mark the selected square */}
      {isSelected ? ' *' : ''}
    </button>
  )
}

// board component
// renders all 9 squares, determines game state, and handles click logic
function Board({turn, squares, onPlay, selectedSquare, setSelectedSquare}){
  // check for winner
  const winner = calculateWinner(squares);

  // count how many X and O squares are currently on the board
  // used to determine when to switch to move phase
  let xCount = 0;
  let oCount = 0;
  for(let i=0;i<squares.length;i++){
    if(squares[i] === 'X'){
      xCount++;
    }
    else if(squares[i] === 'O'){
      oCount++;
    }
  }

  // get current player's symbol
  const currentPlayer = turn ? 'X' : 'O';

  // check if game is in move phase (either player has 3 squares)
  let isMovePhase = false;
  if(currentPlayer === 'X' && xCount === 3){
    isMovePhase = true;
  }
  else if(currentPlayer === 'O' && oCount === 3){
    isMovePhase = true;
  }

  // function to check whether 2 squares are adjacent
  // invalid move = true, valid move = false
  function isAdjacent(fromIndex, toIndex){
    // get from and to indices
    const fromRow = Math.floor(fromIndex / 3);
    const fromCol = fromIndex % 3;
    const toRow = Math.floor(toIndex / 3);
    const toCol = toIndex % 3;

    // get distance
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    // must be at most 1 square away in both directions and not the same square
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  }

  // function to implement the center rule
  function mustVacateOrWin(fromIndex, toIndex){
    // rule only applies in move phase
    if(!isMovePhase){
      return false;
    }

    // rule only applies if current player occupies the center square
    if(squares[4] !== currentPlayer){
      return false;
    }

    // simulate the move
    const newSquares = squares.slice();
    newSquares[fromIndex] = null;
    newSquares[toIndex] = currentPlayer;

    // check if this move wins the game
    const newWinner = calculateWinner(newSquares);
    if(newWinner === currentPlayer){
      return false; // winning move is already allowed
    }

    // moving the center square is allowed
    if(fromIndex === 4){
      return false;
    }

    // center remains occupied and no win, so invalid
    return true;
  }

  // click handler (when user clicks on a square)
  function handleClick(index){
    // do nothing if game is over
    if(winner){
      return;
    }

    // placement phase
    if(!isMovePhase){
      // can't place on occupied square
      if(squares[index] !== null){
        return;
      }

      // create copy of board and send updates to parent (App)
      const newSquares = squares.slice();
      newSquares[index] = turn ? 'X' : 'O';
      onPlay(newSquares);
      return;
    }

    // move phase
    
    // first click (select a square to move)
    if(selectedSquare === null){
      // can only select own square
      if(squares[index] !== currentPlayer){
        return;
      }
      setSelectedSquare(index);
      return;
    }

    // clicking the same square cancels selection
    if(index === selectedSquare){
      setSelectedSquare(null);
      return;
    }

    // second click must be empty square
    if(squares[index] !== null){
      setSelectedSquare(null);
      return;
    }

    // second click must be adjacent square
    if(!isAdjacent(selectedSquare, index)){
      setSelectedSquare(null);
      return;
    }

    // center square rule
    if(mustVacateOrWin(selectedSquare, index)){
      setSelectedSquare(null);
      return;
    }

    // valid move (move square from selectedSquare to index)
    const newSquares = squares.slice();
    newSquares[selectedSquare] = null;
    newSquares[index] = currentPlayer;

    // clear selection and update board
    setSelectedSquare(null);
    onPlay(newSquares);
  }

  // determines the message to show to the user
  let status;
  if(winner){
    status = `Winner: ${winner}`;
  }
  else if(isMovePhase){
    // gives instructions depending on selection step
    if(selectedSquare === null){
      status = `Next player: ${turn ? 'X' : 'O'} (select a piece to move)`;
    }
    else{
      status = `Next player: ${turn ? 'X' : 'O'} (select an adjacent empty square)`;
    }
  }
  else{
    status = `Next player: ${turn ? 'X' : 'O'}`;
  }

  return(
    <>
      {/* display game status (turn, win, or move instructions) */}
      <div className="status">{status}</div>

      {/* 3x3 board */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selectedSquare === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selectedSquare === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selectedSquare === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selectedSquare === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selectedSquare === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selectedSquare === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selectedSquare === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selectedSquare === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selectedSquare === 8} />
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
  // stores currently selected square during move phase
  const [selectedSquare, setSelectedSquare] = React.useState(null);

  // function that handles UI when a move is made
  function handlePlay(newSquares){
    // updates board and switches turns
    setSquares(newSquares);
    setTurn(!turn);
    setSelectedSquare(null); // resets selection after move ends 
  }

  return(
    <div className="container py-4">
      <Card className="starter-card shadow-sm">
        <Card.Body className="p-4">
          {/* passes states and handlers to board */}
          <Board turn={turn} squares={squares} onPlay={handlePlay} selectedSquare={selectedSquare} setSelectedSquare={setSelectedSquare} />
        </Card.Body>
      </Card>
    </div>
  )
}
