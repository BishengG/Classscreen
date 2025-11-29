
import React, { useState, useEffect } from 'react';
import { WidgetInstance, WidgetType, BackgroundSettings, AppState } from './types';
import { DraggableWidget } from './components/DraggableWidget';
import { AppToolbar } from './components/AppToolbar';
import { BackgroundControl } from './components/BackgroundControl';
import { TrafficLight } from './components/widgets/TrafficLight';
import { Timer } from './components/widgets/Timer';
import { DrawBoard } from './components/widgets/DrawBoard';
import { RandomName } from './components/widgets/RandomName';
import { CalendarWidget } from './components/widgets/Calendar';
import { GroupMaker } from './components/widgets/GroupMaker';
import { 
    Clock, Calendar as CalendarIcon, Dice5, Trophy, ExternalLink, Minus, Plus
} from 'lucide-react';

// --- Simple Inline Components for less complex widgets to keep file count managed ---

const TextWidget: React.FC<{data:any, onUpdate: (d:any)=>void}> = ({data, onUpdate}) => (
    <textarea 
        className="w-full h-full bg-transparent resize-none text-2xl font-bold focus:outline-none placeholder-gray-300 text-gray-800 p-2"
        placeholder="Type your announcement here..."
        value={data.text || ''}
        onChange={(e) => onUpdate({text: e.target.value})}
    />
);

const EmbedWidget: React.FC<{data:any, onUpdate: (d:any)=>void}> = ({data, onUpdate}) => {
    const [url, setUrl] = useState(data.url || '');
    const [active, setActive] = useState(!!data.url);
    
    // Convert YouTube watch URLs to embed if necessary
    const processUrl = (input: string) => {
        let final = input;
        if (input.includes('youtube.com/watch?v=')) {
            const videoId = input.split('v=')[1]?.split('&')[0];
            if (videoId) final = `https://www.youtube.com/embed/${videoId}`;
        } else if (input.includes('youtu.be/')) {
            const videoId = input.split('youtu.be/')[1]?.split('?')[0];
            if (videoId) final = `https://www.youtube.com/embed/${videoId}`;
        }
        return final;
    };

    const load = () => { 
        onUpdate({url: processUrl(url)}); 
        setActive(true); 
    }

    return active ? (
        <div className="flex flex-col h-full bg-black rounded overflow-hidden">
            <div className="flex justify-end p-1 bg-gray-900">
                <button onClick={() => setActive(false)} className="text-xs text-gray-300 hover:text-white underline">Change URL</button>
            </div>
            <iframe 
                src={data.url} 
                className="w-full flex-1 border-0" 
                title="Embed" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    ) : (
        <div className="p-4 flex flex-col gap-2 h-full justify-center">
            <div className="text-sm font-semibold text-gray-500">Embed URL (YouTube, etc.)</div>
            <input 
                type="text" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                placeholder="https://example.com"
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={load} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Load Embed</button>
        </div>
    )
};

const Stopwatch: React.FC<{data:any, onUpdate: (d:any)=>void}> = ({data, onUpdate}) => {
    const [time, setTime] = useState(data.time || 0);
    const [running, setRunning] = useState(data.running || false);
    
    useEffect(() => {
        let int: NodeJS.Timeout;
        if(running) {
            int = setInterval(() => setTime((t:number) => t + 10), 10);
        }
        return () => clearInterval(int);
    }, [running]);

    useEffect(() => onUpdate({time, running}), [running, time]); // Persist
    
    const format = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const rm = s % 60;
        const rms = Math.floor((ms % 1000) / 10);
        return `${m.toString().padStart(2, '0')}:${rm.toString().padStart(2, '0')}.${rms.toString().padStart(2, '0')}`;
    }

    return (
        <div className="text-center h-full flex flex-col justify-center">
            <div className="text-5xl font-mono mb-4 tabular-nums">{format(time)}</div>
            <div className="flex justify-center gap-2">
                <button onClick={() => setRunning(!running)} className={`px-4 py-2 rounded text-white ${running ? 'bg-red-500' : 'bg-green-500'}`}>
                    {running ? 'Stop' : 'Start'}
                </button>
                <button onClick={() => {setRunning(false); setTime(0);}} className="px-4 py-2 rounded bg-gray-500 text-white">Reset</button>
            </div>
        </div>
    )
};

const Scoreboard: React.FC<{data:any, onUpdate: (d:any)=>void}> = ({data, onUpdate}) => {
    const scores = data.scores || [{name: 'Team A', score: 0}, {name: 'Team B', score: 0}];
    const updateScore = (idx:number, delta:number) => {
        const newScores = [...scores];
        newScores[idx].score += delta;
        onUpdate({scores: newScores});
    }
    const updateName = (idx:number, val:string) => {
        const newScores = [...scores];
        newScores[idx].name = val;
        onUpdate({scores: newScores});
    }
    return (
        <div className="flex gap-4 h-full items-center justify-center">
            {scores.map((s:any, i:number) => (
                <div key={i} className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <input className="text-center font-bold bg-transparent mb-2 w-24" value={s.name} onChange={(e) => updateName(i, e.target.value)} />
                    <div className="text-4xl font-bold mb-2">{s.score}</div>
                    <div className="flex gap-1">
                        <button onClick={() => updateScore(i, 1)} className="p-1 bg-green-100 rounded hover:bg-green-200"><Plus size={16}/></button>
                        <button onClick={() => updateScore(i, -1)} className="p-1 bg-red-100 rounded hover:bg-red-200"><Minus size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Dice: React.FC<{data:any, onUpdate: (d:any)=>void}> = ({data, onUpdate}) => {
    const [val, setVal] = useState<number[]>(data.val || [1]);
    const [rolling, setRolling] = useState(false);

    const roll = (count: number) => {
        setRolling(true);
        setTimeout(() => {
            const res = Array(count).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
            setVal(res);
            setRolling(false);
            onUpdate({val: res});
        }, 500);
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex gap-4 flex-wrap justify-center">
                {val.map((v, i) => (
                    <div key={i} className={`w-16 h-16 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center text-4xl shadow-md transition-transform ${rolling ? 'animate-spin' : ''}`}>
                        {rolling ? '?' : v}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <button onClick={() => roll(1)} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm">1 Die</button>
                <button onClick={() => roll(2)} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm">2 Dice</button>
                <button onClick={() => roll(3)} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm">3 Dice</button>
            </div>
        </div>
    )
}

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const i = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(i);
    }, []);
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-5xl font-mono font-bold text-gray-800">{time.toLocaleTimeString()}</div>
        </div>
    );
}

// --- Main App ---

const DEFAULT_BG = "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop";

const App: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [background, setBackground] = useState<BackgroundSettings>({ type: 'image', value: DEFAULT_BG });
  const [nextId, setNextId] = useState(1);
  const [topZ, setTopZ] = useState(10);

  const getDefaultSize = (type: WidgetType) => {
      switch(type) {
          case 'background': return { w: 350, h: 500 };
          case 'draw': return { w: 600, h: 450 };
          case 'text': return { w: 500, h: 300 };
          case 'embed': return { w: 500, h: 400 };
          case 'calendar': return { w: 600, h: 500 };
          case 'score': return { w: 350, h: 200 };
          case 'timer': return { w: 300, h: 250 };
          case 'stopwatch': return { w: 350, h: 200 };
          case 'traffic': return { w: 200, h: 450 };
          case 'random': return { w: 300, h: 400 };
          case 'group': return { w: 400, h: 500 };
          case 'dice': return { w: 300, h: 250 };
          case 'clock': return { w: 350, h: 150 };
          default: return { w: 300, h: 300 };
      }
  }

  const addWidget = (type: WidgetType) => {
    if (type === 'background') {
       const existing = widgets.find(w => w.type === 'background');
       if (existing) {
         focusWidget(existing.id);
         return;
       }
    }

    const id = `widget-${nextId}`;
    setNextId(nextId + 1);
    
    const size = getDefaultSize(type);

    const newWidget: WidgetInstance = {
      id,
      type,
      position: { x: 100 + (widgets.length * 20), y: 100 + (widgets.length * 20) },
      zIndex: topZ + 1,
      width: size.w,
      height: size.h,
      data: {}
    };
    
    setTopZ(topZ + 1);
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidget = (id: string, updates: Partial<WidgetInstance>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const focusWidget = (id: string) => {
    const maxZ = Math.max(...widgets.map(w => w.zIndex), 0);
    updateWidget(id, { zIndex: maxZ + 1 });
  };

  const saveState = () => {
    const state: AppState = { widgets, background };
    localStorage.setItem('classroom-screen-state', JSON.stringify(state));
    alert('Screen saved successfully!');
  };

  const loadState = () => {
    const saved = localStorage.getItem('classroom-screen-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure loaded widgets have width/height if migrating from old version
        const migratedWidgets = parsed.widgets.map((w: any) => ({
            ...w,
            width: w.width || getDefaultSize(w.type).w,
            height: w.height || getDefaultSize(w.type).h
        }));
        setWidgets(migratedWidgets);
        setBackground(parsed.background);
        setNextId(migratedWidgets.length + 10);
        alert('Screen loaded successfully!');
      } catch (e) {
          console.error("Failed to load state", e);
          alert("Failed to load saved state.");
      }
    } else {
        alert("No saved state found.");
    }
  };

  const clearScreen = () => {
      if(window.confirm("Are you sure you want to clear all widgets?")) {
          setWidgets([]);
      }
  }

  const renderWidgetContent = (widget: WidgetInstance) => {
    const commonProps = {
        data: widget.data,
        onUpdate: (data: any) => updateWidget(widget.id, { data: { ...widget.data, ...data } })
    };

    switch (widget.type) {
      case 'text': return <TextWidget {...commonProps} />;
      case 'embed': return <EmbedWidget {...commonProps} />;
      case 'traffic': return <TrafficLight {...commonProps} />;
      case 'timer': return <Timer {...commonProps} />;
      case 'stopwatch': return <Stopwatch {...commonProps} />;
      case 'score': return <Scoreboard {...commonProps} />;
      case 'draw': return <DrawBoard {...commonProps} />;
      case 'random': return <RandomName {...commonProps} />;
      case 'group': return <GroupMaker {...commonProps} />;
      case 'dice': return <Dice {...commonProps} />;
      case 'clock': return <LiveClock />;
      case 'calendar': return <CalendarWidget {...commonProps} />;
      case 'background': return <BackgroundControl onUpdateBackground={setBackground} />;
      default: return <div>Unknown Widget</div>;
    }
  };

  const getWidgetTitle = (type: WidgetType) => {
      const map: Record<string, string> = {
          text: 'Announcement', embed: 'Embed Link', traffic: 'Traffic Light',
          timer: 'Timer', stopwatch: 'Stopwatch', score: 'Scoreboard',
          draw: 'Drawing Board', random: 'Name Picker', group: 'Group Maker',
          dice: 'Dice Roll', clock: 'Clock', calendar: 'Calendar', 
          background: 'Background Settings'
      };
      return map[type] || 'Widget';
  };

  return (
    <div 
        className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ 
            backgroundImage: background.type === 'image' || background.type === 'ai' ? `url(${background.value})` : undefined,
            backgroundColor: background.type === 'color' ? background.value : '#f3f4f6'
        }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {widgets.map(w => (
        <DraggableWidget
          key={w.id}
          widget={w}
          title={getWidgetTitle(w.type)}
          onClose={removeWidget}
          onUpdate={updateWidget}
          onFocus={focusWidget}
        >
          {renderWidgetContent(w)}
        </DraggableWidget>
      ))}

      <AppToolbar 
        onAddWidget={addWidget} 
        onSave={saveState}
        onLoad={loadState}
        onClear={clearScreen}
      />
    </div>
  );
};

export default App;