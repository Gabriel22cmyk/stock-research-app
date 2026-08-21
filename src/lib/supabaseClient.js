import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzztwmicedxnqcuvhpxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bPUO0NkmzLcmR1fsHXqqGA_He3uqNXG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', 'gabriel');

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data || [];
};

/* ===== File Storage ===== */

const BUCKET = 'property-files';

export const listPropertyFiles = async (propertyId, folder) => {
  try {
    const path = `${propertyId}/${folder}`;
    const { data, error } = await supabase.storage.from(BUCKET).list(path, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });
    if (error) {
      console.error(`Error listing files [${path}]:`, error.message);
      return [];
    }
    return (data || []).filter(f => f.name && !f.name.startsWith('.'));
  } catch (err) {
    console.error('listPropertyFiles exception:', err.message);
    return [];
  }
};

export const uploadPropertyFile = async (propertyId, folder, file) => {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${propertyId}/${folder}/${timestamp}_${safeName}`;
    console.log(`Uploading to bucket '${BUCKET}', path: ${path}`);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) {
      console.error(`Upload error [${path}]:`, error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }
    console.log('Upload successful:', data);
    return data;
  } catch (err) {
    console.error('uploadPropertyFile exception:', err.message);
    throw err;
  }
};

export const getPropertyFileUrl = async (propertyId, folder, fileName) => {
  try {
    const path = `${propertyId}/${folder}/${fileName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60);
    if (error) {
      console.error(`Error creating signed URL [${path}]:`, error.message);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error('getPropertyFileUrl exception:', err.message);
    return null;
  }
};

export const deletePropertyFile = async (propertyId, folder, fileName) => {
  try {
    const path = `${propertyId}/${folder}/${fileName}`;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error(`Delete error [${path}]:`, error.message);
      throw new Error(`Delete failed: ${error.message}`);
    }
    return true;
  } catch (err) {
    console.error('deletePropertyFile exception:', err.message);
    throw err;
  }
};
