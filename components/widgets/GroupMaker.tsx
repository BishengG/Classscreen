import React, { useState } from 'react';
import { Users, Shuffle, RotateCcw } from 'lucide-react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const GroupMaker: React.FC<Props> = ({ data, onUpdate }) => {
  const [names, setNames] = useState<string>(data.names || '');
  const [groupCount, setGroupCount] = useState<number>(data.groupCount || 2);
  const [groups, setGroups] = useState<string[][]>(data.groups || []);

  const handleNamesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNames(e.target.value);
    onUpdate({ ...data, names: e.target.value });
  };

  const handleCreateGroups = () => {
    const nameList = names.split('\n').filter(n => n.trim().length > 0);
    if (nameList.length === 0) return;

    // Shuffle
    const shuffled = [...nameList].sort(() => Math.random() - 0.5);
    
    // Distribute
    const newGroups: string[][] = Array.from({ length: groupCount }, () => []);
    
    shuffled.forEach((name, index) => {
        const groupIndex = index % groupCount;
        newGroups[groupIndex].push(name);
    });

    setGroups(newGroups);
    onUpdate({ ...data, names, groupCount, groups: newGroups });
  };

  const handleReset = () => {
      setGroups([]);
      onUpdate({ ...data, groups: [] });
  };

  const incrementGroups = () => {
      const newVal = Math.min(20, groupCount + 1);
      setGroupCount(newVal);
      onUpdate({ ...data, groupCount: newVal });
  }

  const decrementGroups = () => {
      const newVal = Math.max(2, groupCount - 1);
      setGroupCount(newVal);
      onUpdate({ ...data, groupCount: newVal });
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      {/* Input / Control Mode */}
      {groups.length === 0 ? (
        <div className="flex flex-col h-full gap-4">
            <div className="text-sm text-gray-500 italic">
                Enter student names (one per line):
            </div>
            <textarea
                className="flex-1 w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50"
                placeholder="Alice&#10;Bob&#10;Charlie&#10;..."
                value={names}
                onChange={handleNamesChange}
            />
            
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Number of Groups:</span>
                <div className="flex items-center gap-2">
                    <button onClick={decrementGroups} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-50 font-bold text-gray-600">-</button>
                    <span className="font-bold w-6 text-center">{groupCount}</span>
                    <button onClick={incrementGroups} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-50 font-bold text-gray-600">+</button>
                </div>
            </div>

            <button
                onClick={handleCreateGroups}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-lg hover:shadow-xl"
            >
                <Shuffle size={18} />
                Generate Groups
            </button>
        </div>
      ) : (
        /* Results Mode */
        <div className="flex flex-col h-full">
             <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-gray-700">Groups Created</h3>
                <button 
                    onClick={handleReset} 
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition"
                >
                    <RotateCcw size={12}/> Restart
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                    {groups.map((group, i) => (
                        <div key={i} className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 shadow-sm">
                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1">Group {i + 1}</div>
                            <ul className="text-sm text-gray-800">
                                {group.map((member, idx) => (
                                    <li key={idx} className="truncate">• {member}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      )}
    </div>
  );
};