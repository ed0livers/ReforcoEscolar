import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  key?: any;
}

export const Toast = ({ message, onClose }: ToastProps) => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white py-3 px-6 rounded-full flex items-center gap-3 shadow-2xl"
  >
    <CheckCircle2 className="text-green-400 w-5 h-5" />
    <span className="text-sm font-semibold">{message}</span>
  </motion.div>
);
