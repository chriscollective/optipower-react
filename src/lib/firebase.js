// Firebase 初始化設定
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDkVh4dQ4ZREHvIuj-5gCCoU4OL4_0Cd_4',
  authDomain: 'optipower-f10f3.firebaseapp.com',
  databaseURL: 'https://optipower-f10f3-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'optipower-f10f3',
  storageBucket: 'optipower-f10f3.firebasestorage.app',
  messagingSenderId: '1077480492224',
  appId: '1:1077480492224:web:d961a3ba35e2ea4cb07125',
  measurementId: 'G-XQ0FM7FVYC',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // Realtime Database：計數器、即時總和
export const firestore = getFirestore(app); // Firestore：每筆試算紀錄（後台分析用）
