import 'dotenv/config';
import { WorkWhizClient } from './config/client';
import { ClientConfig } from './interfaces/client';

class WorkWhizSDK {
  constructor(config: ClientConfig = {}) {
    const client = new WorkWhizClient(config);
  }
}

export default WorkWhizSDK;
