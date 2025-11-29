
import React from 'react';
import { Upload } from 'lucide-react';
import { BackgroundSettings } from '../types';

interface Props {
  onUpdateBackground: (settings: BackgroundSettings) => void;
}

const PRESETS = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80", // Classroom
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80", // Coffee
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1000&q=80", // Nature
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80", // Tech
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80", // White Office
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80", // Workspace
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80", // Landscape
  "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1000&q=80", // Apple/Desk
  "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?auto=format&fit=crop&w=1000&q=80", // Cozy
  "https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?auto=format&fit=crop&w=1000&q=80", // Books
  "https://images.unsplash.com/photo-1507842217121-ad0773cf4a0f?auto=format&fit=crop&w=1000&q=80", // Forest
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80", // Foggy Nature
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80", // Bookshelf
  "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=1000&q=80", // Wood
  "https://images.unsplash.com/photo-1534067783741-512d0deaf5df?auto=format&fit=crop&w=1000&q=80", // City
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1000&q=80", // Space
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80", // Water
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80", // Books/Reading
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1000&q=80", // Leaves
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80", // Strategy/Work
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80", // Empty Classroom
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80", // Learning/Pencils
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80", // Library
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80", // Science
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80", // Furniture/Modern
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80", // Math Blackboard
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80", // School Hallway
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1000&q=80", // Globe
  "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?auto=format&fit=crop&w=1000&q=80", // Writing
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80", // Colorful supplies
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80", // Library Rows
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80", // Books & Glasses
  "https://images.unsplash.com/photo-1588075592446-39e673792139?auto=format&fit=crop&w=1000&q=80", // Classroom window
  "https://images.unsplash.com/photo-1629904853716-6b0318e79881?auto=format&fit=crop&w=1000&q=80", // Coding screen
  "https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&w=1000&q=80", // Graduation
];

export const BackgroundControl: React.FC<Props> = ({ onUpdateBackground }) => {

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateBackground({ type: 'image', value: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-80">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Presets</h3>
      <div className="grid grid-cols-3 gap-2 h-80 overflow-y-auto custom-scrollbar pr-1">
        {PRESETS.map((url, i) => (
          <button 
            key={i}
            onClick={() => onUpdateBackground({ type: 'image', value: url })}
            className="h-16 rounded-lg bg-cover bg-center hover:opacity-80 transition border border-gray-200"
            style={{ backgroundImage: `url(${url})` }}
            title={`Preset ${i+1}`}
          />
        ))}
      </div>

       <div className="border-t border-gray-200 my-2"></div>

       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upload</h3>
       <label className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
           <Upload size={16} />
           <span>Choose File</span>
           <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
       </label>
    </div>
  );
};
