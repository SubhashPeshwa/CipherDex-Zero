export interface GameState {
    currentMission: string | null;
    playerProgress: {
      level: number;
      completedMissions: string[];
    };
  }
  
  export interface Mission {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    location: string;
  }