import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from './pages/Admin';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Router>
    <div className="App">
      <div className="background"/>
        <div className="header">
            <h2>wikianalysis</h2>
            <a target='_blank' rel='noreferrer' href="https://github.com/hugofolloni/wiki-analysis">Saiba mais</a>
        </div>
      <Routes>
        <Route path="/" element={<Analysis/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
      <div className="footer">
        <p>Trabalho Final de Álgebra Linear Algorítmica de Hugo Folloni</p>
      </div>
    </div>
    </Router>
  );
}

export default App;
