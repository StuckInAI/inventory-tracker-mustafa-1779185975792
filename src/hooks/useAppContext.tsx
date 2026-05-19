import React, { createContext, useContext, useReducer } from 'react';
import { seedData } from '@/lib/seedData';

type AppState = {
  jobs: any[];
  candidates: any[];
  applications: any[];
  clients: any[];
  interviews: any[];
  teamMembers: any[];
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
};

type Action =
  | { type: 'ADD_JOB'; payload: any }
  | { type: 'UPDATE_JOB'; payload: any }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_CANDIDATE'; payload: any }
  | { type: 'UPDATE_CANDIDATE'; payload: any }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'ADD_APPLICATION'; payload: any }
  | { type: 'UPDATE_APPLICATION'; payload: any }
  | { type: 'SET_STATE'; payload: Partial<AppState> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [action.payload, ...state.jobs] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };
    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [action.payload, ...state.candidates] };
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter(c => c.id !== action.payload) };
    case 'ADD_APPLICATION':
      return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE_APPLICATION':
      return { ...state, applications: state.applications.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'SET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const initialState: AppState = {
  jobs: seedData.jobs || [],
  candidates: seedData.candidates || [],
  applications: seedData.applications || [],
  clients: seedData.clients || [],
  interviews: seedData.interviews || [],
  teamMembers: seedData.teamMembers || [],
  currentUser: {
    name: 'Alex Johnson',
    role: 'Senior Recruiter',
    avatar: 'AJ',
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
