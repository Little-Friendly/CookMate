import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import Recipes from './components/Recipes';



export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/recipes' element={<Recipes />} />
    </Routes>
  );
}
