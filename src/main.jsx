import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store'; // Asegúrate de que la ruta sea correcta
import './styles/variables.css';  // Importar primero las variables
import './styles/common.css';     // Luego los estilos comunes 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
      <App />
  </Provider>
);

