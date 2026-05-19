import { createContext, useContext, useReducer, ReactNode } from 'react';
import { seedData } from '@/lib/seedData';
import type { Job, Candidate, Application, Interview, Client, TeamMember } from '@/types';

export type AppState = {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  clients: Client[];
  team: TeamMember[];
  currentUser: TeamMember;
};

type Action =
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: Interview }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [...state.candidates, action.payload] };
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    case 'UPDATE_APPLICATION':
      return { ...state, applications: state.applications.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [...state.interviews, action.payload] };
    case 'UPDATE_INTERVIEW':
      return { ...state, interviews: state.interviews.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'ADD_TEAM_MEMBER':
      return { ...state, team: [...state.team, action.payload] };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedData as AppState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
