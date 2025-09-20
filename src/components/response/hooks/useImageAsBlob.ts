import { useState, useEffect } from 'react';

/**
 * A custom hook to fetch an image and provide its URL as a local blob.
 * This gives more control over the loading and error states.
 * @param url The remote URL of the image to fetch.
 * @returns An object with the blobUrl, isLoading, and error state.
 */
export const useImageAsBlob = (url: string | null | undefined) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't do anything if the URL is not valid
    if (!url) {
      setIsLoading(false);
      setBlobUrl(null);
      setError(null);
      return;
    }

    // This is a controller to cancel the fetch request if the component unmounts
    // or if the URL changes before the fetch is complete.
    const abortController = new AbortController();

    const fetchImage = async () => {
      setIsLoading(true);
      setBlobUrl(null);
      setError(null);
      
      try {
        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Create a temporary local URL for the downloaded image data
        const localUrl = URL.createObjectURL(blob);
        setBlobUrl(localUrl);

      } catch (err: any) {
        if (err.name !== 'AbortError') {
            console.error('[useImageAsBlob] Error fetching image:', err);
            setError(err.message || 'An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();

    // Cleanup function: This will be called when the component unmounts
    // or when the `url` dependency changes.
    return () => {
      abortController.abort(); // Cancel any ongoing fetch
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl); // Revoke the old blob URL to free up memory
      }
    };
  }, [url]); // This effect re-runs whenever the `url` prop changes

  return { blobUrl, isLoading, error };
};
