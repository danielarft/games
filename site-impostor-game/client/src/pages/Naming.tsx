import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NamingProps {
  numberOfPlayers: number;
  onNamesSubmit: (names: string[]) => void;
  onBack: () => void;
}

export default function Naming({ numberOfPlayers, onNamesSubmit, onBack }: NamingProps) {
  const [names, setNames] = useState<string[]>(Array(numberOfPlayers).fill(''));
  const [errors, setErrors] = useState<boolean[]>(Array(numberOfPlayers).fill(false));

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
    
    // Clear error when user starts typing
    if (value.trim()) {
      const newErrors = [...errors];
      newErrors[index] = false;
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    // Validate that all names are filled
    const newErrors = names.map((name) => !name.trim());
    
    if (newErrors.some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    onNamesSubmit(names.map((name) => name.trim()));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-white via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            🎭 Impostor
          </h1>
          <p className="text-lg text-purple-600 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Digite o nome de cada jogador
          </p>
        </div>

        {/* Names Input */}
        <div className="space-y-3 mb-8">
          {Array.from({ length: numberOfPlayers }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Jogador {index + 1}
              </label>
              <input
                type="text"
                value={names[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Nome do jogador ${index + 1}`}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  errors[index]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-purple-300 focus:border-purple-600'
                } focus:outline-none`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              {errors[index] && (
                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Nome obrigatório
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ✓ Começar Jogo
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full py-4 text-base font-semibold rounded-xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ← Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
