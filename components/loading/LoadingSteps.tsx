'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_STEPS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (currentStep >= LOADING_STEPS.length) {
      // All steps completed, redirect
      setTimeout(() => {
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/chat');
        }
      }, 500);
      return;
    }

    const step = LOADING_STEPS[currentStep];
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AnimatePresence mode="wait">
          {LOADING_STEPS.map((step, index) => {
            if (index !== currentStep) return null;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{step.label}</h2>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {currentStep < LOADING_STEPS.length && (
          <div className="mt-8 flex justify-center gap-2">
            {LOADING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
