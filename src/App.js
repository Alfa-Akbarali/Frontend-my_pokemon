import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Card from './components/card/Card'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="card/:name" element={<Card />} />
    </Routes>
  );
}
export default App;
