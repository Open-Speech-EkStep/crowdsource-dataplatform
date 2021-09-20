import 'jest-fetch-mock';

interface CrowdsourceFENodeConfig {
  fe: {
    apiUrl: string;
    cdnUrl: string;
    staticFileUrl: string;
    whitelistingEmail: boolean;
    showDataSource: boolean;
    feedbackTopComponent: boolean;
    contextRoot: string;
    enabled_languages: string[];
  };
}

declare global {
  const CROWDSOURCE_FE_NODE_CONFIG: CrowdsourceFENodeConfig;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(options?: any): R;
    }
  }
}
