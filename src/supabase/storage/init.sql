
-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true);

-- Allow public access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-files');
