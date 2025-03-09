
import { handleFileUpload } from '@/utils/chat/fileUtils';

class FileHandlingService {
  async uploadFile(file: File): Promise<string> {
    return await handleFileUpload(file);
  }
}

export default new FileHandlingService();
