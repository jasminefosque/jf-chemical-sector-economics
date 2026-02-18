import { DataProvider } from './DataProvider';
import { SyntheticDataProvider } from './adapters/SyntheticDataProvider';
import { OpenDataProvider } from './adapters/OpenDataProvider';

/**
 * Factory to create the appropriate data provider based on environment
 */
export function createDataProvider(): DataProvider {
  const dataMode = import.meta.env.VITE_DATA_MODE || 'synthetic';

  switch (dataMode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      return new OpenDataProvider();
    default:
      console.warn(`Unknown data mode: ${dataMode}, defaulting to synthetic`);
      return new SyntheticDataProvider();
  }
}
