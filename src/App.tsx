import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/analysis" element={<Analysis/>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
