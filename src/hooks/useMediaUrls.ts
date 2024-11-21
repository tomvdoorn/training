import { useState, useEffect } from 'react';
import { getSignedUrls } from '~/utils/supabase';
import { getCachedUrl, setCachedUrl } from '~/utils/mediaCache';

export function useMediaUrls(paths: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const uncachedPaths = paths.filter(path => !getCachedUrl(path));
    
    if (uncachedPaths.length === 0) {
      const cachedUrls = Object.fromEntries(
        paths.map(path => [path, getCachedUrl(path)!])
      );
      setUrls(cachedUrls);
      return;
    }

    const fetchUrls = async () => {
      const signedUrls = await getSignedUrls(uncachedPaths);
      Object.entries(signedUrls).forEach(([path, url]) => {
        setCachedUrl(path, url, 3300);
      });

      setUrls(prev => ({
        ...prev,
        ...signedUrls,
        ...Object.fromEntries(
          paths
            .filter(path => !uncachedPaths.includes(path))
            .map(path => [path, getCachedUrl(path)!])
        )
      }));
    };

    void fetchUrls();
  }, [paths]);

  return urls;
} 