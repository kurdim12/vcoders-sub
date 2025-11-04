"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function StoreInitializer() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      const initialize = useStore.getState().initialize;
      const initialized = useStore.getState().initialized;
      
      if (!initialized) {
        initialize();
        
        // Auto-set current user if seed data exists
        setTimeout(() => {
          const users = useStore.getState().users;
          const currentUser = useStore.getState().getCurrentUser();
          if (users.length > 0 && !currentUser) {
            useStore.getState().setCurrentUser(users[0]);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Store initialization error:', error);
    }
  }, []);

  return null;
}

