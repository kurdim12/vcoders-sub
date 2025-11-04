"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { getCurrentAccountId } from "@/lib/accounts";

export function StoreInitializer() {
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    
    const initializeStore = async () => {
      try {
        const store = useStore.getState();
        const initialized = store.initialized;
        const currentAccountId = getCurrentAccountId();
        
        if (!initialized && mounted) {
          // Initialize with current account (async)
          await store.initialize(currentAccountId);
          
          // Auto-set current user if seed data exists
          if (mounted) {
            setTimeout(() => {
              if (mounted) {
                const users = useStore.getState().users;
                const currentUser = useStore.getState().getCurrentUser();
                if (users.length > 0 && !currentUser) {
                  useStore.getState().setCurrentUser(users[0]);
                }
                setInitializing(false);
              }
            }, 100);
          }
        } else {
          setInitializing(false);
        }
      } catch (error) {
        console.error('Store initialization error:', error);
        if (mounted) {
          setInitializing(false);
        }
      }
    };
    
    initializeStore();
    
    return () => {
      mounted = false;
    };
  }, []);

  return null;
}

