import { WorkWhizClient } from './config';
import { ClientConfig } from './interfaces';

class WorkWhizSDK {
  constructor(config: ClientConfig = {}) {
    const client = new WorkWhizClient(config);
  }
}

export default WorkWhizSDK;
