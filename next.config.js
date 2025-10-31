// ESM wrapper: delegate to CommonJS config to avoid __dirname issues under ESM
import cjsConfig from './next.config.cjs';

export default cjsConfig;
