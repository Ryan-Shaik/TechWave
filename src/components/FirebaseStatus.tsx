import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { getFirebaseStatus } from '../utils/firebaseTest';

const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState<string>('🔄 Checking Firebase...');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const statusText = await getFirebaseStatus();
        setStatus(statusText);
        setIsConnected(statusText.includes('🟢'));
      } catch (error) {
        setStatus('🔴 Firebase: Connection failed');
        setIsConnected(false);
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'text-yellow-400';
    return isConnected ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = () => {
    if (isConnected === null) return <Database className="w-4 h-4 animate-pulse" />;
    if (isConnected) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-2 flex items-center space-x-2">
        <div className={getStatusColor()}>
          {getStatusIcon()}
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
    </motion.div>
  );
};

export default FirebaseStatus;