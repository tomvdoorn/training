import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

export async function uploadFileToStorage(file: File, bucket = 'media'): Promise<string | null> {
  try {
    // Create a unique file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFileToStorage:', error);
    return null;
  }
} 