import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing API calls with request cancellation
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Object containing debouncedFetch function and cancelRequests function
 */
export function useDebouncedFetch(delay: number = 300) {
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<number | null>(null);

    const cancelRequests = useCallback(() => {
        // Cancel the current fetch request if it exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        // Clear the debounce timeout if it exists
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }
    }, []);

    const debouncedFetch = useCallback((
        url: string,
        options: RequestInit = {},
        customDelay?: number
    ): Promise<Response> => {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing requests and timeouts
            cancelRequests();
            
            // Set up new debounce timeout
            debounceTimeoutRef.current = window.setTimeout(() => {
                // Create new AbortController for this request
                const controller = new AbortController();
                abortControllerRef.current = controller;
                
                // Merge the signal with existing options
                const fetchOptions: RequestInit = {
                    ...options,
                    signal: controller.signal
                };
                
                fetch(url, fetchOptions)
                    .then(resolve)
                    .catch((error) => {
                        // Only reject if the request wasn't aborted
                        if (!controller.signal.aborted) {
                            reject(error);
                        }
                    })
                    .finally(() => {
                        // Clean up the abort controller reference
                        if (abortControllerRef.current === controller) {
                            abortControllerRef.current = null;
                        }
                    });
            }, customDelay ?? delay);
        });
    }, [delay, cancelRequests]);

    return { debouncedFetch, cancelRequests };
}
