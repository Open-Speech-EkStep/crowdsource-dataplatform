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
    autoValidation: boolean;
    appUrl: string;
    brand: string;
  };
}

declare global {
  const CROWDSOURCE_FE_NODE_CONFIG: CrowdsourceFENodeConfig;
}
