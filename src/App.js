import logo from './logo.svg';
import './input.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import BoardPage from './page/BoardPage';
import MainPage from './page/MainPage';
import Header from './components/common/HeaderComponent';
import WritingPage from './page/WritingPage';
import TestPage from './TestPage';
import Post from './components/posting/Post';
import MyPage from './components/member/MyPage';
import Detail from './components/main/Detail';


function App() {
  return (
    <div className = "h-screen w-full">
      <Header/>
      <Routes>
      <Route path = "/" Component = {MainPage} />
      <Route path = "/login" Component = {LoginPage} />
      <Route path = "/signup" Component = {SignupPage} />
      <Route path = "/board" Component = {BoardPage} />
      <Route path = "/write" Component = {WritingPage} />
      <Route path = "/test" Component = {TestPage} />
      <Route path = "/post" Component = {Post} />
      <Route path = "/mypage" Component = {MyPage} />
      <Route path = "/detail" Component = {Detail} />
      </Routes>
    </div>
  );
}

export default App;
