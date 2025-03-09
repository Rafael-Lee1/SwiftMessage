
import { supabase } from '@/integrations/supabase/client';

export const fetchGeminiResponse = async (message: string): Promise<string> => {
  try {
    console.log('Sending message to Gemini:', message);
    
    // Call the Supabase Edge Function to interact with Gemini API
    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: { message: message.trim() }
    });

    if (error) {
      console.error('Failed to get Gemini response:', error);
      throw new Error(`Failed to get Gemini response: ${error.message}`);
    }

    if (!data || !data.response) {
      console.error('Invalid response from Gemini:', data);
      throw new Error('Received an invalid response from Gemini');
    }

    console.log('Received response from Gemini:', data.response.substring(0, 100) + '...');
    return data.response;
  } catch (error) {
    console.error('Error in fetchGeminiResponse:', error);
    throw error;
  }
};
