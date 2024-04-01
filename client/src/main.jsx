import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/index'
import Il from './components/il'
import './index.css'


const Title = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

const App = () => (
  <Router>
    <Routes>
      <Route path='/' element={
        <>
          <Title title="Seçim 2024 - Yerel Seçim" />
          <Index />
        </>
      } />
       <Route path='/il/:ilkodu' element={
        <>
          <Title title="Seçim 2023 - İl Araması" />
          <Il />
        </>
       } />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);