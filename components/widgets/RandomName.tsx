import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const RandomName: React.FC<Props> = ({ data, onUpdate }) => {
  const [names, setNames] = useState<string>(data.names || '');
  const [currentName, setCurrentName] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNamesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNames(e.target.value);
    onUpdate({ names: e.target.value });
  };

  const pickName = () => {
    const nameList = names.split('\n').filter(n => n.trim().length > 0);
    if (nameList.length === 0) return;

    setIsAnimating(true);
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * nameList.length);
      setCurrentName(nameList[randomIdx]);
      count++;
      if (count > maxCount) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4 w-64">
      {currentName && (
        <div className={`text-center py-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl transition-all ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100 shadow-lg'}`}>
          {currentName}
        </div>
      )}
      
      {!currentName && (
        <div className="text-center py-6 text-gray-400 italic">
            Enter names below...
        </div>
      )}

      <textarea
        className="w-full h-32 p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        placeholder="Enter one name per line..."
        value={names}
        onChange={handleNamesChange}
      />
      
      <button
        onClick={pickName}
        disabled={isAnimating}
        className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50"
      >
        <Shuffle size={18} />
        {isAnimating ? 'Choosing...' : 'Pick Random Name'}
      </button>
    </div>
  );
};