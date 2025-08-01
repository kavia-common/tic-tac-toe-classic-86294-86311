import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * -- Tic Tac Toe Game State Helpers --
 */

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Determines the winner or draw state based on the current squares.
      Returns:
        - {winner: 'X'|'O', line: [int, int, int]} if winner found
        - {draw: true} if all squares filled and no winner
        - null otherwise
   */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  if (squares.every(Boolean)) {
    return { draw: true };
  }
  return null;
}

// PUBLIC_INTERFACE
function getStatusMessage(gameResult, xIsNext) {
  /** Returns the display status string based on game state. */
  if (!gameResult) {
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  if (gameResult.winner) {
    return `Winner: ${gameResult.winner}!`;
  }
  if (gameResult.draw) {
    return `It's a draw.`;
  }
  return '';
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winningLine, disabled }) {
  /** Renders a 3x3 tic tac toe board. */
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <button
        className={`ttt-square${highlight ? ' winner' : ''}`}
        onClick={() => onClick(i)}
        key={i}
        disabled={!!squares[i] || disabled}
        aria-label={`cell ${Math.floor(i/3)+1},${i%3+1}`}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-row" key={row}>
          { [0, 1, 2].map(col => renderSquare(3*row + col)) }
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // --- Game state ---
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');

  // --- Game logic ---
  const gameResult = calculateWinner(squares);

  // --- THEME support via root attr ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    // Prevent move if occupied or game is over.
    if (squares[i] || gameResult) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setHistory(history => [...history, squares]);
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([]);
  }

  // PUBLIC_INTERFACE
  function handleUndo() {
    if (history.length === 0) return;
    setSquares(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
    setXIsNext(xIsNext => !xIsNext);
  }

  // --- Render ---
  return (
    <div className="App">
      <div className="ttt-outer-container">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            type="button"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>

        <main className="ttt-main">
          <div className="ttt-status" data-testid="game-status">
            {getStatusMessage(gameResult, xIsNext)}
          </div>
          <Board
            squares={squares}
            onClick={handleSquareClick}
            winningLine={gameResult && gameResult.line}
            disabled={!!gameResult}
          />
          <div className="ttt-controls">
            <button className="ttt-btn" onClick={handleReset}>Reset</button>
            <button
              className="ttt-btn"
              onClick={handleUndo}
              disabled={history.length === 0}
              aria-disabled={history.length === 0}
              style={{ marginLeft: 10 }}
            >
              Undo
            </button>
          </div>
        </main>

        <footer className="ttt-footer">
          <span>
            2-player local play &middot; Minimal, modern UI
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
