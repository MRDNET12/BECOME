"use client";

import { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

interface SwipeGestureCallbacks {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}

export function useSwipeGestures(callbacks: SwipeGestureCallbacks = {}) {
  const { onSwipeRight, onSwipeLeft } = callbacks;

  const handlers = useSwipeable({
    onSwipedRight: () => onSwipeRight?.(),
    onSwipedLeft: () => onSwipeLeft?.(),
    trackMouse: true,
    preventScrollOnSwipe: false,
    swipeDuration: 250,
    swipeThreshold: 10,
  });

  return handlers;
}

// Haptic feedback utility
export function triggerHapticFeedback(type: "light" | "medium" | "heavy" = "light") {
  if ("vibrate" in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50,
    };
    navigator.vibrate(patterns[type]);
  }
}
