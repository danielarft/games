import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GameState } from '@/hooks/useGameState';
import { getHint } from '@/hooks/useHints';

interface GameProps {
  gameState: GameState;
  onNextPlayer: () => void;
  onEndGame: () => void;
  onResetGame: () => void;
}

export default function Game({ gameState, onNextPlayer, onEndGame, onResetGame }: GameProps) {
  const [cardRevealed, setCardRevealed] = useState(false);
  const [showBlankScreen, setShowBlankScreen] = useState(false);

  const currentPlayer = gameState.currentPlayerIndex + 1;
  const totalPlayers = gameState.numberOfPlayers;
  const currentPlayerName = gameState.playerNames[gameState.currentPlayerIndex] || `Jogador ${currentPlayer}`;

  const handleRevealCard = () => {
    setCardRevealed(true);
  };

  const handlePassPhone = () => {
    setShowBlankScreen(true);
    setCardRevealed(false);
    
    // Wait for the next player to be ready
    setTimeout(() => {
      onNextPlayer();
      setShowBlankScreen(false);
    }, 1000);
  };

  const isImpostor = gameState.currentPlayerIndex === gameState.impostorIndex;

  // Blank screen for passing the phone safely
  if (showBlankScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Próximo jogador, pegue o celular!
          </p>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-white via-white to-purple-50" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            🎭 Impostor
          </h1>
          <p className="text-lg text-purple-600 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {currentPlayerName}
          </p>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            ({currentPlayer} de {totalPlayers})
          </p>
        </div>

        {/* Card Container */}
        <div className="mb-8">
          <div
            className={`relative w-full aspect-square rounded-3xl shadow-2xl cursor-pointer transition-all duration-500 transform ${
              cardRevealed ? 'scale-100' : 'hover:scale-105'
            }`}
            onClick={!cardRevealed ? handleRevealCard : undefined}
            style={{
              background: cardRevealed
                ? 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)'
                : 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)',
              perspective: '1000px',
            }}
          >
            {/* Card Content */}
            <div className="w-full h-full flex flex-col items-center justify-center">
              {!cardRevealed ? (
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-purple-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {currentPlayerName}
                  </p>
                  <div className="text-6xl">🎴</div>
                  <p className="text-gray-600 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Toque para revelar
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-white">
                    <div className="text-6xl mb-4">
                      {gameState.playerCards[gameState.currentPlayerIndex].includes('IMPOSTOR')
                        ? '❓'
                        : '🎯'}
                    </div>
                    <p
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {gameState.playerCards[gameState.currentPlayerIndex].replace('❓ ', '').replace('🎯 ', '')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!cardRevealed && (
          <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-200">
            <p className="text-center text-gray-700 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              👆 Toque no card para revelar sua carta
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {cardRevealed && (
          <div className="space-y-3">
            <Button
              onClick={handlePassPhone}
              className="w-full py-6 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              ➡️ Passar para o próximo
            </Button>
          </div>
        )}

        {/* Game Controls */}
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
          <Button
            onClick={onEndGame}
            variant="outline"
            className="w-full py-4 text-base font-semibold rounded-xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🛑 Finalizar Jogo
          </Button>
          <Button
            onClick={onResetGame}
            variant="ghost"
            className="w-full py-4 text-base font-semibold rounded-xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🔄 Novo Jogo
          </Button>
        </div>

        {/* Player Progress */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Progresso dos jogadores:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: totalPlayers }).map((_, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                  index === gameState.currentPlayerIndex
                    ? 'bg-purple-600 text-white scale-105 shadow-lg'
                    : gameState.revealedPlayers.has(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
                title={gameState.playerNames[index]}
              >
                {gameState.playerNames[index].substring(0, 8)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
