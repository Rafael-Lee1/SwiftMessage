
import { toast } from "@/hooks/use-toast";
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

  if (file.size > MAX_FILE_SIZE) {
    toast({
      title: 'File too large',
      description: 'Please select a file under 5MB',
      variant: 'destructive',
    });
    return false;
  }

  if (!ALLOWED_FILE_TYPES[file.type]) {
    toast({
      title: 'Invalid file type',
      description: 'Please select an image, PDF, or Word document',
      variant: 'destructive',
    });
    return false;
  }

  return true;
};

export const handleFileUpload = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
};
