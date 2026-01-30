// Firebase 初始化設定
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCIKmwgTcOCGKJutQmP1pTmRBxi7UFW6H0',
  authDomain: 'beautinail-246ef.firebaseapp.com',
  databaseURL: 'https://beautinail-246ef-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'beautinail-246ef',
  storageBucket: 'beautinail-246ef.firebasestorage.app',
  messagingSenderId: '994314487145',
  appId: '1:994314487145:web:ffecb6001204dd9df869f8',
  measurementId: 'G-DT259RVFL6',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
