/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadFileToStorage(file: File): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(process.env.NODE_ENV === 'development' ? 'dev' : 'prod')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    const url_base = process.env.NEXT_PUBLIC_SUPABASE_URL

    return `${url_base}/${data.fullPath}`;
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
          .from('media')
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