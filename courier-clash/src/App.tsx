import  React, { useState } from 'react';
import { GameProvider } from './context/game-context';
import Board from './board/BoardPresentation';


function App() {
  return (
    <div className="App">
      <GameProvider>
      <Board />
      </GameProvider>
    </div>
  );
}

export default App;
