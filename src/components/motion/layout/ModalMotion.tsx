"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRINGS } from "../tokens";

export interface ModalMotionProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * ModalMotion (Effect 14):
 * Backdrop blur and spring-scaled dialog box with AnimatePresence.
 */
export default function ModalMotion({
  isOpen,
  onClose,
  children,
  className = "",
}: ModalMotionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={SPRINGS.modal}
            style={{ willChange: "transform, opacity" }}
            className={`relative z-10 w-full max-w-lg bg-[#141512] border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
