import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAzPeODGXsuRUCjtk_VXHAUl-a2nxoSGqI',
  authDomain: 'aacoolpoint-1d1c1.firebaseapp.com',
  projectId: 'aacoolpoint-1d1c1',
  storageBucket: 'aacoolpoint-1d1c1.firebasestorage.app',
  messagingSenderId: '874567477461',
  appId: '1:874567477461:web:f9c814921f39a9f3fc1a5c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log('Testing connection to Firebase Firestore (project: aacoolpoint-1d1c1)...');
  try {
    const snap = await getDocs(collection(db, 'products'));
    console.log('✅ FIRESTORE READ SUCCESS! Total products currently in DB:', snap.docs.length);
    const testDoc = await addDoc(collection(db, 'products'), {
      name: 'Test Product',
      price: 100,
      createdAt: new Date(),
    });
    console.log('✅ FIRESTORE WRITE SUCCESS! New ID:', testDoc.id);
  } catch (err) {
    console.error('❌ FIRESTORE FAILED:', err.code, err.message);
  }
}

check();

