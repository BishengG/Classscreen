import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const Timer: React.FC<Props> = ({ data, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(data.timeLeft || 300); // default 5 mins
  const [isRunning, setIsRunning] = useState(data.isRunning || false);
  const [initialTime, setInitialTime] = useState(data.initialTime || 300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync local state with prop data if it changes externally (loading state)
  useEffect(() => {
    if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);
    if (data.isRunning !== undefined) setIsRunning(data.isRunning);
    if (data.initialTime !== undefined) setInitialTime(data.initialTime);
  }, [data.timeLeft, data.isRunning, data.initialTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
             setIsRunning(false);
             onUpdate({ isRunning: false, timeLeft: 0 });
             // Could add audio beep here
             return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]); // Depends on isRunning

  // Persist state periodically or on change
  useEffect(() => {
    onUpdate({ timeLeft, isRunning, initialTime });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, initialTime]); // Don't update on every second tick to save performance, just status changes

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    onUpdate({ isRunning: false, timeLeft: initialTime });
  };

  const adjustTime = (delta: number) => {
    const newTime = Math.max(0, initialTime + delta);
    setInitialTime(newTime);
    setTimeLeft(newTime);
    onUpdate({ initialTime: newTime, timeLeft: newTime });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-6xl font-mono font-bold text-gray-800 tabular-nums">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex gap-2 mb-2">
        <button onClick={() => adjustTime(60)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">+1m</button>
        <button onClick={() => adjustTime(-60)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">-1m</button>
        <button onClick={() => adjustTime(10)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">+10s</button>
        <button onClick={() => adjustTime(-10)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">-10s</button>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleStartStop}
          className={`p-3 rounded-full text-white transition ${isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          onClick={handleReset}
          className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};