import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIRE_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

let messaging;
try {
    messaging = firebase.messaging();
} catch (error) {
    console.error('Firebase messaging is not supported in this browser:', error);
}

export async function requestPermission() {
    if (!messaging) {
        console.log('This browser does not support Firebase messaging.');
        return null;
    }

    try {
        const permission = await Notification.requestPermission();
        console.log('승인 요청중....');
        if (permission === 'granted') {
            const token = await messaging.getToken({ vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
            console.log(`푸시 토큰 발급 완료 : ${token}`);
            return token;
        } else {
            console.log('푸시 권한 차단');
            return null;
        }
    } catch (err) {
        console.log('푸시 토큰 가져오는 중에 에러 발생', err);
        return null;
    }
}