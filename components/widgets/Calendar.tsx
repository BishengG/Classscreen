
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

type ViewMode = 'month' | 'week';

export const CalendarWidget: React.FC<Props> = ({ data, onUpdate }) => {
  const [view, setView] = useState<ViewMode>(data.view || 'month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleView = () => {
    const newView = view === 'month' ? 'week' : 'month';
    setView(newView);
    onUpdate({ view: newView });
  };

  const today = new Date();
  const isToday = (d: Date) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  // --- Navigation ---
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
      setCurrentDate(new Date());
  }

  // --- Rendering Helpers ---
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
            <button onClick={toggleView} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium flex gap-1 items-center">
                {view === 'month' ? <List size={14}/> : <CalendarIcon size={14}/>}
                {view === 'month' ? 'Week View' : 'Month View'}
            </button>
            <button onClick={handleToday} className="text-xs text-blue-600 font-bold hover:underline">Today</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={18} /></button>
          <span className="font-bold text-gray-800 w-32 text-center select-none">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={18} /></button>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create grid array
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="w-full h-full flex flex-col">
        <div className="grid grid-cols-7 mb-2 text-center">
          {weekDays.map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
          {days.map((d, i) => {
             if (!d) return <div key={i} className="bg-transparent"></div>;
             const isCurrent = isToday(d);
             return (
               <div 
                  key={i} 
                  className={`
                    flex flex-col items-center justify-start p-1 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition
                    ${isCurrent ? 'bg-blue-50 border-blue-200' : ''}
                  `}
                >
                  <span className={`text-sm font-medium ${isCurrent ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                      {d.getDate()}
                  </span>
               </div>
             );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // adjust when day is sunday
    startOfWeek.setDate(diff);

    const weekDays = [];
    for(let i=0; i<7; i++){
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        weekDays.push(d);
    }

    return (
        <div className="flex h-full gap-2">
            {weekDays.map((d, i) => {
                const isCurrent = isToday(d);
                return (
                    <div key={i} className={`flex-1 flex flex-col rounded-xl border ${isCurrent ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                        <div className={`p-2 text-center border-b ${isCurrent ? 'border-blue-200 bg-blue-100' : 'border-gray-100 bg-gray-50'} rounded-t-xl`}>
                            <div className="text-xs uppercase font-bold text-gray-500">{d.toLocaleString('default', { weekday: 'short' })}</div>
                            <div className={`text-xl font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-800'}`}>{d.getDate()}</div>
                        </div>
                        <div className="flex-1 p-2">
                            {/* Placeholder for events if we wanted to add them later */}
                        </div>
                    </div>
                )
            })}
        </div>
    )
  };

  return (
    <div className="flex flex-col w-full h-full">
      {renderHeader()}
      <div className="flex-1 overflow-hidden">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>
    </div>
  );
};
