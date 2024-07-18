import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import {BrowserRouter} from "react-router-dom";
import firebase from "firebase";
import Cookies from "js-cookie";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_APP_ID,
  measurementId: process.env.REACT_APP_MESAUREMENT_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const requestPermission = async () => {
  let messaging;
  try {
    messaging = firebase.messaging();
  } catch (error) {
    console.error('Firebase messaging is not supported in this browser:', error);
  }

  if (!messaging) {
    console.log('This browser does not support Firebase messaging.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('승인 요청중....');
    if (permission === 'granted') {
      const token = await messaging.getToken({vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY});
      return token;
    } else {
      console.log('알림 권한 차단');
      return null;
    }
  } catch (err) {
    console.log('푸시 토큰 가져오는 중에 에러 발생', err);
    return null;
  }
};

const getFcmToken = async () => {
  const fcmToken = Cookies.get('fcmToken');
  if (fcmToken === null || fcmToken === undefined || fcmToken === 'null') {
    const newFcmToken = await requestPermission();
    if (newFcmToken) {
      Cookies.set('fcmToken', newFcmToken);
    }
  } else {
    console.log('FCM token already exists');
    console.log('FCM token:', fcmToken);
  }
};


if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      await getFcmToken();  // 서비스 워커 등록 후 FCM 토큰 요청
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
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
