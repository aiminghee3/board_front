import logo from './logo.svg';
import './input.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import BoardPage from './page/BoardPage';
import MainPage from './page/MainPage';
import Header from './components/common/HeaderComponent';
import WritingPage from './page/WritingPage';

function App() {
  return (
    <div className = "h-screen w-full">
      <Header/>
      <Routes>
      <Route path = "/" Component = {MainPage} />
      <Route path = "/signup" Component = {SignupPage} />
      <Route path = "/board" Component = {BoardPage} />
      <Route path = "/write" Component = {WritingPage} />
      </Routes>
    </div>
  );
}

export default App;
