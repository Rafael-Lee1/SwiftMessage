
import { supabase } from '@/integrations/supabase/client';

export const fetchClaudeResponse = async (message: string): Promise<string> => {
  try {
    // Call the Supabase Edge Function to interact with Claude API
    const { data, error } = await supabase.functions.invoke('chat-with-claude', {
      body: { message: message.trim() }
    });

    if (error) {
      console.error('Failed to get Claude response:', error);
      throw new Error('Failed to get Claude response');
    }

    return data.response;
  } catch (error) {
    console.error('Error in fetchClaudeResponse:', error);
    throw error;
  }
};
