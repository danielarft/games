import { Button } from '@/components/ui/button';
import { GameState } from '@/hooks/useGameState';

interface RevealProps {
  gameState: GameState;
  onResetGame: () => void;
  onReplayWithSameNames: () => void;
}

export default function Reveal({ gameState, onResetGame, onReplayWithSameNames }: RevealProps) {
  const impostorName = gameState.playerNames[gameState.impostorIndex] || `Jogador ${gameState.impostorIndex + 1}`;
  const secretWord = gameState.secretWord;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="w-full max-w-md">
        {/* Impostor Reveal */}
        <div className="mb-8 text-center">
          <div className="text-7xl mb-6 animate-bounce">🎭</div>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Jogo Finalizado!
          </h1>
        </div>

        {/* Impostor Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 mb-8 shadow-2xl text-center text-white">
          <p className="text-lg mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            O IMPOSTOR ERA:
          </p>
          <div className="text-7xl mb-4">👤</div>
          <p className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {impostorName}
          </p>
        </div>

        {/* Secret Word */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-8 mb-8 border-2 border-purple-300 text-center">
          <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            A PALAVRA SECRETA ERA:
          </p>
          <p className="text-5xl font-bold text-purple-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {secretWord}
          </p>
        </div>

        {/* Player List */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Todos os Jogadores:
          </h2>
          <div className="space-y-2">
            {Array.from({ length: gameState.numberOfPlayers }).map((_, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  index === gameState.impostorIndex
                    ? 'bg-red-100 border-2 border-red-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span style={{ fontFamily: 'Inter, sans-serif' }}>
                  {gameState.playerNames[index]}
                </span>
                <span className="font-semibold">
                  {index === gameState.impostorIndex ? '❓ IMPOSTOR' : '✓ Conhecedor'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onReplayWithSameNames}
            className="w-full py-6 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🔄 Jogar Novamente (Mesmos Nomes)
          </Button>
          <Button
            onClick={onResetGame}
            className="w-full py-6 text-lg font-semibold rounded-xl bg-gray-300 hover:bg-gray-400 transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Novo Jogo (Novos Jogadores)
          </Button>
        </div>
      </div>
    </div>
  );
}
