import React from 'react';
import { 
  Type, Link, TrafficCone, Timer, Watch, 
  Trophy, PenTool, Shuffle, Dices, Clock, 
  Calendar, Image, Save, FolderOpen, Trash2,
  Users
} from 'lucide-react';
import { WidgetType } from '../types';

interface Props {
  onAddWidget: (type: WidgetType) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export const AppToolbar: React.FC<Props> = ({ onAddWidget, onSave, onLoad, onClear }) => {
  const tools = [
    { type: 'background', icon: Image, label: 'Bg' },
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'embed', icon: Link, label: 'Link' },
    { type: 'traffic', icon: TrafficCone, label: 'Light' },
    { type: 'timer', icon: Timer, label: 'Timer' },
    { type: 'stopwatch', icon: Watch, label: 'Stopwatch' },
    { type: 'score', icon: Trophy, label: 'Score' },
    { type: 'draw', icon: PenTool, label: 'Draw' },
    { type: 'random', icon: Shuffle, label: 'Random' },
    { type: 'group', icon: Users, label: 'Groups' },
    { type: 'dice', icon: Dices, label: 'Dice' },
    { type: 'clock', icon: Clock, label: 'Clock' },
    { type: 'calendar', icon: Calendar, label: 'Calendar' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 pt-4 z-50 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-2 flex items-center gap-2 pointer-events-auto border border-gray-200 overflow-x-auto max-w-[95vw] custom-scrollbar">
        
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => onAddWidget(tool.type as WidgetType)}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors gap-1 group"
            title={tool.label}
          >
            <tool.icon size={24} className="text-gray-700 group-hover:text-blue-600" />
            <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">{tool.label}</span>
          </button>
        ))}

        <div className="w-px h-10 bg-gray-300 mx-2"></div>

        <button onClick={onSave} className="flex flex-col items-center w-12 gap-1 hover:bg-green-50 rounded-xl group transition-colors">
           <Save size={20} className="text-gray-700 group-hover:text-green-600"/>
           <span className="text-[10px] text-gray-500 group-hover:text-green-600">Save</span>
        </button>
        <button onClick={onLoad} className="flex flex-col items-center w-12 gap-1 hover:bg-blue-50 rounded-xl group transition-colors">
           <FolderOpen size={20} className="text-gray-700 group-hover:text-blue-600"/>
           <span className="text-[10px] text-gray-500 group-hover:text-blue-600">Load</span>
        </button>

        <div className="w-px h-10 bg-gray-300 mx-2"></div>

         <button onClick={onClear} className="flex flex-col items-center w-12 gap-1 hover:bg-red-50 rounded-xl group transition-colors">
           <Trash2 size={20} className="text-red-500 group-hover:text-red-600" />
           <span className="text-[10px] font-medium text-red-500 group-hover:text-red-600">Clear</span>
        </button>

      </div>
    </div>
  );
};