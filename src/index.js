import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import {BrowserRouter} from "react-router-dom";

// 서비스 워커 등록 로직 추가
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
