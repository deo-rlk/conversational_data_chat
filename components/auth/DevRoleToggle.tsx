'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';

const STORAGE_KEY = 'dev-role-toggle-position';

export function DevRoleToggle() {
  const { user, updateRole } = useAuth();
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { x, y } = JSON.parse(saved);
          setPosition({ x, y });
        } catch (e) {
          // Invalid data, use default
        }
      }
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    }
  }, [position]);

  // Only show in development
  if (process.env.NODE_ENV === 'production' || !user) return null;

  const toggleRole = () => {
    const newRole: Role = user.role === 'admin' ? 'user' : 'admin';
    updateRole(newRole);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 200);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 100);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={containerRef}
      className="fixed bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-sm cursor-move select-none shadow-lg z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <p className="font-semibold mb-2">DEV MODE</p>
      <button
        onClick={toggleRole}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
        aria-label="Toggle role"
        onMouseDown={(e) => e.stopPropagation()}
      >
        Toggle Role: {user.role === 'admin' ? 'Admin' : 'User'}
      </button>
    </div>
  );
}
