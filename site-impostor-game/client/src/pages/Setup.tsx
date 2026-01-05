import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SetupProps {
  onGoToNaming: (numberOfPlayers: number) => void;
}

export default function Setup({ onGoToNaming }: SetupProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);

  const playerOptions = [3, 4, 5, 6, 7, 8];

  const handleStart = () => {
    if (selectedPlayers) {
      onGoToNaming(selectedPlayers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-white via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            🎭 Impostor
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Descubra quem é o impostor!
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-purple-100">
          <h2 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Como jogar:
          </h2>
          <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li>✓ Um jogador é o impostor (não sabe a palavra)</li>
            <li>✓ Os outros conhecem a palavra secreta</li>
            <li>✓ Cada um fala uma dica sem revelar a palavra</li>
            <li>✓ Descubram quem é o impostor!</li>
          </ul>
        </div>

        {/* Player Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quantos jogadores?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {playerOptions.map((num) => (
              <button
                key={num}
                onClick={() => setSelectedPlayers(num)}
                className={`py-4 px-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  selectedPlayers === num
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          disabled={!selectedPlayers}
          className="w-full py-6 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {selectedPlayers ? '🎮 Começar Jogo' : 'Selecione o número de jogadores'}
        </Button>
      </div>
    </div>
  );
}
