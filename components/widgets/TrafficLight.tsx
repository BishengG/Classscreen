import React from 'react';
import { WidgetInstance } from '../../types';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const TrafficLight: React.FC<Props> = ({ data, onUpdate }) => {
  const activeLight = data.active || 'none'; // 'red', 'yellow', 'green', 'none'

  const toggle = (color: string) => {
    onUpdate({ active: activeLight === color ? 'none' : color });
  };

  return (
    <div className="flex flex-col gap-4 items-center bg-gray-800 p-6 rounded-2xl w-32">
      <div 
        onClick={() => toggle('red')}
        className={`w-20 h-20 rounded-full cursor-pointer transition-all duration-300 shadow-inner border-4 border-gray-700 ${activeLight === 'red' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-105' : 'bg-red-900/30'}`}
      />
      <div 
        onClick={() => toggle('yellow')}
        className={`w-20 h-20 rounded-full cursor-pointer transition-all duration-300 shadow-inner border-4 border-gray-700 ${activeLight === 'yellow' ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] scale-105' : 'bg-yellow-900/30'}`}
      />
      <div 
        onClick={() => toggle('green')}
        className={`w-20 h-20 rounded-full cursor-pointer transition-all duration-300 shadow-inner border-4 border-gray-700 ${activeLight === 'green' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)] scale-105' : 'bg-green-900/30'}`}
      />
    </div>
  );
};