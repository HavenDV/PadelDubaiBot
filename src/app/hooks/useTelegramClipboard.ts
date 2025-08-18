"use client";

import { useState, useCallback } from "react";
import { useTelegram } from "@/app/hooks/useTelegram";
import { useTelegramClipboardEvent } from "@/app/hooks/useTelegramEvent";

export interface TelegramClipboardResult {
  // Clipboard text state
  clipboardText: string | null;
  isReading: boolean;
  error: string | null;
  
  // Actions
  requestClipboardRead: () => void;
  clearClipboard: () => void;
  clearError: () => void;
}

/**
 * Hook for Telegram clipboard operations
 * 
 * Provides both event-based clipboard text reception and manual clipboard reading
 * 
 * Features:
 * - Listen for clipboardTextReceived events from Telegram
 * - Manually request clipboard read via readTextFromClipboard
 * - Handle loading states and errors
 * - Clear clipboard state
 * 
 * @param options - Configuration options
 * @returns TelegramClipboardResult with clipboard state and actions
 * 
 * @example
 * ```typescript
 * function SmartPasteComponent() {
 *   const { 
 *     clipboardText, 
 *     isReading, 
 *     requestClipboardRead,
 *     clearClipboard 
 *   } = useTelegramClipboard();
 *   
 *   return (
 *     <div>
 *       <button onClick={requestClipboardRead} disabled={isReading}>
 *         {isReading ? 'Reading...' : 'Paste from Clipboard'}
 *       </button>
 *       {clipboardText && (
 *         <div>
 *           <p>Clipboard: {clipboardText}</p>
 *           <button onClick={clearClipboard}>Clear</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTelegramClipboard(options: {
  debug?: boolean;
} = {}): TelegramClipboardResult {
  const { debug = false } = options;
  const { webApp, isTelegram } = useTelegram();
  
  // State management
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Listen for clipboard text received events
  useTelegramClipboardEvent(
    (text: string) => {
      if (debug) {
        console.log('useTelegramClipboard: Received clipboard text:', text);
      }
      setClipboardText(text);
      setIsReading(false);
      setError(null);
    },
    webApp,
    { 
      debug 
    }
  );
  
  // Action to request clipboard read from Telegram
  const requestClipboardRead = useCallback(() => {
    if (!isTelegram || !webApp) {
      const errorMsg = 'Clipboard access is only available in Telegram Mini Apps';
      setError(errorMsg);
      if (debug) {
        console.warn('useTelegramClipboard:', errorMsg);
      }
      return;
    }
    
    // Check if readTextFromClipboard is available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (webApp as any).readTextFromClipboard !== 'function') {
      const errorMsg = 'readTextFromClipboard is not available in this Telegram version';
      setError(errorMsg);
      if (debug) {
        console.warn('useTelegramClipboard:', errorMsg);
      }
      return;
    }
    
    try {
      setIsReading(true);
      setError(null);
      
      if (debug) {
        console.log('useTelegramClipboard: Requesting clipboard read...');
      }
      
      // Request clipboard read from Telegram
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (webApp as any).readTextFromClipboard();
      
      // Note: The actual text will arrive via the clipboardTextReceived event
      // which is handled by the event listener above
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to read clipboard';
      setError(errorMsg);
      setIsReading(false);
      
      if (debug) {
        console.error('useTelegramClipboard: Error requesting clipboard read:', err);
      }
    }
  }, [webApp, isTelegram, debug]);
  
  // Clear clipboard text
  const clearClipboard = useCallback(() => {
    setClipboardText(null);
    setError(null);
    
    if (debug) {
      console.log('useTelegramClipboard: Clipboard cleared');
    }
  }, [debug]);
  
  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    clipboardText,
    isReading,
    error,
    requestClipboardRead,
    clearClipboard,
    clearError,
  };
}