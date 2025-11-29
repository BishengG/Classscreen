
export type WidgetType = 
  | 'text' 
  | 'embed' 
  | 'traffic' 
  | 'timer' 
  | 'stopwatch' 
  | 'score' 
  | 'draw' 
  | 'random' 
  | 'dice' 
  | 'clock' 
  | 'calendar'
  | 'group'
  | 'background';

export interface Position {
  x: number;
  y: number;
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  position: Position;
  zIndex: number;
  width: number;
  height: number;
  data: any; // Flexible data storage for each widget's state
  minimized?: boolean;
}

export interface BackgroundSettings {
  type: 'image' | 'color' | 'ai';
  value: string; // URL or Hex
  prompt?: string;
}

export interface AppState {
  widgets: WidgetInstance[];
  background: BackgroundSettings;
}