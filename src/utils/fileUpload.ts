
import { supabase } from '@/integrations/supabase/client';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
};

export const validateFile = (file: File): boolean => {
  if (!file) return false;
  return file.size <= MAX_FILE_SIZE && ALLOWED_FILE_TYPES[file.type];
};

export const uploadFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-files')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('chat-files')
    .getPublicUrl(fileName);

  return publicUrl;
};
