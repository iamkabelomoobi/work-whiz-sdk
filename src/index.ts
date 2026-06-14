import { WorkWhizClient } from './config/client';
import { ClientConfig } from './interfaces/client';

class WorkWhizSDK extends WorkWhizClient {
  constructor(config: ClientConfig = {}) {
    super(config);
  }
}

export { WorkWhizClient } from './config/client';
export * from './interfaces';
export default WorkWhizSDK;
