
import { supabase } from '@/integrations/supabase/client';

export const fetchGeminiResponse = async (message: string): Promise<string> => {
  try {
    // Call the Supabase Edge Function to interact with Gemini API
    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: { message: message.trim() }
    });

    if (error) {
      console.error('Failed to get Gemini response:', error);
      throw new Error('Failed to get Gemini response');
    }

    return data.response;
  } catch (error) {
    console.error('Error in fetchGeminiResponse:', error);
    throw error;
  }
};
