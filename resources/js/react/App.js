import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ShoppingCartRoutes from './components/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastProvider } from 'react-toast-notifications';

function App() {
    return (
      <Routes>
        {ShoppingCartRoutes.map((route, i) => <Route key={i} {...route} />)}
      </Routes>
    );
}

export default App;

// DOM element
if (document.getElementById('root')) {
  ReactDOM.render(
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
}