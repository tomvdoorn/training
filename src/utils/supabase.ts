/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a basic client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
  },
});

// Constants for bucket names
export const STORAGE_BUCKET = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

// Create an authenticated client function
export const createAuthenticatedClient = (userId: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    },
  });
};

export async function uploadFileToStorage(file: File, userId: string): Promise<string | null> {
  try {
    const authenticatedClient = createAuthenticatedClient(userId);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `users/${userId}/${fileName}`;
    
    const { data, error } = await authenticatedClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', {
        error,
        bucket: STORAGE_BUCKET,
        filePath,
      });
      return null;
    }

    return authenticatedClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path).data.publicUrl;
  } catch (error) {
    console.error('Error in uploadFileToStorage:', error);
    return null;
  }
}

export async function getSignedUrls(paths: string[], expiresIn = 3600): Promise<Record<string, string>> {
  try {
    const signedUrls = await Promise.all(
      paths.map(async (path) => {
        const { data } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(path, expiresIn);
        return { [path]: data?.signedUrl ?? '' };
      })
    );

    return Object.assign({}, ...signedUrls);
  } catch (error) {
    console.error('Error in getSignedUrls:', error);
    return {};
  }
}

export async function getImageUrl(path: string): Promise<string> {
  const { data } = await supabase.storage
    .from('media')
    .createSignedUrl(path, 3600); // 1 hour expiration

  return data?.signedUrl ?? '';
}

// Either export the function if it's used elsewhere or remove it
// If you need it later, uncomment and export it
/* 
const getPublicUrl = (path: string): string => {
  const url_base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${url_base}/storage/v1/object/public/${path}`
} 
*/