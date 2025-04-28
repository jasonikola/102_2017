import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { persistor, store } from "./store";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import './App.css';
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
