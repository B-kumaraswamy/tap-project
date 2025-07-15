import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DataProvider } from './context/DataProvider';
import { Toaster } from './components/ui/sonner';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <App />
      <Toaster position='bottom-right'/>
    </DataProvider>
  </React.StrictMode>
);
