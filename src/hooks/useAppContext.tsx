import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppState, Action } from '../types';
import {
  seedJobs,
  seedCandidates,
  seedInterviews,
  seedClients,
  seedTeam,
  currentUser,
} from '../lib/seedData';

const initialState: AppState = {
  jobs: seedJobs,
  candidates: seedCandidates,
  interviews: seedInterviews,
  clients: seedClients,
  team: seedTeam,
  currentUser,
};

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
    case 'DELETE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter(c => c.id !== action.payload) };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [...state.interviews, action.payload] };
    case 'UPDATE_INTERVIEW':
      return { ...state, interviews: state.interviews.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INTERVIEW':
      return { ...state, interviews: state.interviews.filter(i => i.id !== action.payload) };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
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
