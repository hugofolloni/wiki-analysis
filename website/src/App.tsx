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
            <a target='_blank' rel='noreferrer' href="https://github.com/hugofolloni/wiki-analysis">About this</a>
        </div>
      <Routes>
        <Route path="/" element={<Analysis/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
      <div className="footer">
        <p>Made by <a target='_blank' rel='noreferrer' href="https://hugofolloni.netlify.app">Hugo Folloni</a></p>
      </div>
    </div>
    </Router>
  );
}

export default App;
