import { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Job, Candidate, Interview, Client, TeamMember } from '@/types';
import { seedData } from '@/lib/seedData';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: Interview }
  | { type: 'DELETE_INTERVIEW'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_TEAM_MEMBER'; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE': return action.payload;
    case 'ADD_JOB': return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB': return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };
    case 'DELETE_JOB': return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    case 'ADD_CANDIDATE': return { ...state, candidates: [...state.candidates, action.payload] };
    case 'UPDATE_CANDIDATE': return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CANDIDATE': return { ...state, candidates: state.candidates.filter(c => c.id !== action.payload) };
    case 'ADD_INTERVIEW': return { ...state, interviews: [...state.interviews, action.payload] };
    case 'UPDATE_INTERVIEW': return { ...state, interviews: state.interviews.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INTERVIEW': return { ...state, interviews: state.interviews.filter(i => i.id !== action.payload) };
    case 'ADD_CLIENT': return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT': return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENT': return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };
    case 'ADD_TEAM_MEMBER': return { ...state, team: [...state.team, action.payload] };
    case 'UPDATE_TEAM_MEMBER': return { ...state, team: state.team.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_TEAM_MEMBER': return { ...state, team: state.team.filter(m => m.id !== action.payload) };
    default: return state;
  }
}

const STORAGE_KEY = 'talentflow_ats_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // ignore
  }
  return seedData;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
