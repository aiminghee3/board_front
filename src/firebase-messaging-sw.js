import firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIRE_APP_ID,
    measurementId: process.env.REACT_APP_MESAUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

export async function requestPermission() {
    void Notification.requestPermission().then((permission) => {
        console.log('승인 요청중....')
        if (permission === 'granted') {
            messaging
                .getToken({ vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
                .then((token) => {
                    console.log(`푸시 토큰 발급 완료 : ${token}`)
                })
                .catch((err) => {
                    console.log('푸시 토큰 에러 명 : ' +  err);
                    console.log('푸시 토큰 가져오는 중에 에러 발생')
                })
        } else if (permission === 'denied') {
            console.log('푸시 권한 차단')
        }
    })
}
