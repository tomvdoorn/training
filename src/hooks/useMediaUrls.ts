import { useState, useEffect, useMemo } from 'react';
import { getSignedUrls, STORAGE_BUCKET, createAuthenticatedClient } from '~/utils/supabase';
import { getCachedUrl, setCachedUrl } from '~/utils/mediaCache';
import { useAuthSession } from './useSession';

export function useMediaUrls(paths: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const session = useAuthSession();

  const memoizedPaths = useMemo(() => paths, [paths.join(',')]);

  useEffect(() => {
    if (!session?.user?.id || !memoizedPaths.length) return;

    const authenticatedClient = createAuthenticatedClient(session.user.id);

    const getFullPath = (path: string) => {
      if (path.includes('token=')) return path;
      const fileName = path.split('/').pop();
      return fileName ? `users/${session.user.id}/${fileName}` : path;
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
    void getSignedUrls(pathsToFetch).then(signedUrls => {
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
  }, [memoizedPaths, session?.user?.id]);

  return urls;
} 