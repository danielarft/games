import { useGameState } from '@/hooks/useGameState';
import Setup from './Setup';
import Naming from './Naming';
import Game from './Game';
import Reveal from './Reveal';

export default function Home() {
  const { gameState, goToNaming, setPlayerNames, startGame, nextPlayer, endGame, replayWithSameNames, resetGame } = useGameState();

  return (
    <>
      {gameState.phase === 'setup' && <Setup onGoToNaming={goToNaming} />}
      {gameState.phase === 'naming' && (
        <Naming
          numberOfPlayers={gameState.numberOfPlayers}
          onNamesSubmit={(names) => {
            setPlayerNames(names);
            startGame();
          }}
          onBack={resetGame}
        />
      )}
      {gameState.phase === 'playing' && (
        <Game
          gameState={gameState}
          onNextPlayer={nextPlayer}
          onEndGame={endGame}
          onResetGame={resetGame}
        />
      )}
      {gameState.phase === 'reveal' && (
        <Reveal 
          gameState={gameState} 
          onResetGame={resetGame}
          onReplayWithSameNames={replayWithSameNames}
        />
      )}
    </>
  );
}
