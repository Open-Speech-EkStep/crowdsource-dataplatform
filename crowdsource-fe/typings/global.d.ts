import 'jest-fetch-mock';

interface CrowdsourceFENodeConfig {
  fe: {
    apiUrl: string;
    cdnUrl: string;
    whitelistingEmail: boolean;
    showDataSource: boolean;
    feedbackTopComponent: boolean;
    bhashadaanLogoUrl: string;
    contextRoot: string;
    enabled_languages: string[];
  };
}

declare global {
  const CROWDSOURCE_FE_NODE_CONFIG: CrowdsourceFENodeConfig;
}
