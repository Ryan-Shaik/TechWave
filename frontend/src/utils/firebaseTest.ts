import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export interface FirebaseTestResult {
  isConnected: boolean;
  canWrite: boolean;
  canRead: boolean;
  error?: string;
  latency?: number;
}

export const testFirebaseConnection = async (): Promise<FirebaseTestResult> => {
  const startTime = Date.now();
  
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test 1: Try to read from a collection (this tests basic connectivity)
    console.log('📖 Testing read access...');
    const testCollection = collection(db, 'connectionTest');
    await getDocs(testCollection);
    console.log('✅ Read access successful');
    
    // Test 2: Try to write a test document
    console.log('✍️ Testing write access...');
    const testDoc = await addDoc(collection(db, 'connectionTest'), {
      timestamp: new Date(),
      test: true,
      message: 'Firebase connection test'
    });
    console.log('✅ Write access successful, doc ID:', testDoc.id);
    
    // Test 3: Clean up the test document
    console.log('🧹 Cleaning up test document...');
    await deleteDoc(doc(db, 'connectionTest', testDoc.id));
    console.log('✅ Cleanup successful');
    
    const latency = Date.now() - startTime;
    console.log(`🚀 Firebase fully operational! Latency: ${latency}ms`);
    
    return {
      isConnected: true,
      canWrite: true,
      canRead: true,
      latency
    };
    
  } catch (error) {
    const latency = Date.now() - startTime;
    console.error('❌ Firebase connection failed:', error);
    
    return {
      isConnected: false,
      canWrite: false,
      canRead: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency
    };
  }
};

export const getFirebaseStatus = async (): Promise<string> => {
  const result = await testFirebaseConnection();
  
  if (result.isConnected && result.canWrite && result.canRead) {
    return `🟢 Firebase: Connected (${result.latency}ms)`;
  } else if (result.isConnected && result.canRead) {
    return `🟡 Firebase: Read-only access`;
  } else {
    return `🔴 Firebase: Disconnected (${result.error})`;
  }
};