import { useState, useEffect, useMemo } from 'react';
import { getSignedUrls, STORAGE_BUCKET, createAuthenticatedClient } from '~/utils/supabase';
import { getCachedUrl, setCachedUrl } from '~/utils/mediaCache';
import { useAuthSession } from './useSession';

export function useMediaUrls(paths: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const session = useAuthSession();

  const memoizedPaths = useMemo(() => paths, [paths.join(',')]);

  useEffect(() => {
    if (!session?.supabaseAccessToken || !memoizedPaths.length) {
      console.log('Missing token or paths');
      return;
    }


    const getFullPath = (path: string) => {
          console.log('paths', path);
      if (path.includes('token=')) return path;
      const pathSegments = path.split('/');
      const path_full = pathSegments.slice(-3).join('/'); // Take the last 3 elements
      return path_full
    };

    // Check cache first
    const allUrls: Record<string, string> = {};
    const pathsToFetch: string[] = [];

    memoizedPaths.forEach(path => {
      const fullPath = getFullPath(path);
      const cachedUrl = getCachedUrl(fullPath);
      if (cachedUrl) {
        allUrls[path] = cachedUrl;
      } else if (!path.includes('token=')) {
        pathsToFetch.push(fullPath);
      } else {
        allUrls[path] = path;
      }
    });

    // If all URLs are cached, set them and return
    if (pathsToFetch.length === 0) {
      setUrls(allUrls);
      return;
    }

    // Fetch missing URLs
    let mounted = true;
    void getSignedUrls(pathsToFetch, 3600, session.supabaseAccessToken).then(signedUrls => {
      if (!mounted) return;

      // Cache new URLs
      Object.entries(signedUrls).forEach(([path, url]) => {
        setCachedUrl(path, url, 3300);
      });

      // Combine cached and new URLs
      setUrls({
        ...allUrls,
        ...Object.fromEntries(
          memoizedPaths.map(path => {
            const fullPath = getFullPath(path);
            return [path, signedUrls[fullPath] ?? allUrls[path] ?? path];
          })
        )
      });
    });

    return () => {
      mounted = false;
    };
  }, [memoizedPaths, session?.supabaseAccessToken]);

  return urls;
} 