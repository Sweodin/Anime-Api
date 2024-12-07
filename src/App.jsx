import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './Navbar/Navbar.jsx';
import Home from "./Pages/Home.jsx";
import './App.css';
 
function App() {
return (
  <BrowserRouter>
<div className="container">
<NavBar />
<main>
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
</main>
</div>
</BrowserRouter>
);
 
}
 
export default App;