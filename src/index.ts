import dotenv from 'dotenv';
import { WorkWhizClient } from './config/client';
import { ClientConfig } from './interfaces/client';

dotenv.config();

class WorkWhizSDK {
  constructor(config: ClientConfig = {}) {
    const client = new WorkWhizClient(config);
  }
}

export default WorkWhizSDK;
