import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react';
import './App.css';
 
const NavBar = lazy(() => import('./Navbar/Navbar.jsx'));
const Home = lazy(() => import('./Pages/Home.jsx'));

function App() {
return (
  <BrowserRouter>
<div className="container">
<Suspense fallback={<div>Loading...</div>}>
<NavBar />
<main>
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
</main>
</Suspense>
</div>
</BrowserRouter>
);
 
}
 
export default App;