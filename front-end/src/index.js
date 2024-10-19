import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store';
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
// import "../node_modules/bootstrap-icons/font/bootstrap-icons.css"
import './styles/index.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

