
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

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

// Add logging to createAuthenticatedClient
export const createAuthenticatedClient = (token: string) => {
  console.log('Creating authenticated client with token');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9-_\.]/g, '_'); // Replace invalid characters with underscores
};

export async function uploadFileToStorage(file: File, token: string): Promise<string | null> {
  try {
    console.log('Starting file upload with token');
    const authenticatedClient = createAuthenticatedClient(token);
    
    // Decode the JWT to get the user ID
    const decodedToken = jwt.decode(token) as { sub?: string };
    if (!decodedToken?.sub) {
      console.error('Invalid token: no user ID found');
      return null;
    }
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = `users/${decodedToken.sub}/${fileName}`;
    
    console.log('Attempting upload:', {
      bucket: STORAGE_BUCKET,
      filePath,
      fileSize: file.size,
      fileType: file.type
    });

    const { data, error } = await authenticatedClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', {
        error,
        errorMessage: error.message,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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