import brandConfig from './brandConfig';

export const initiativeBaseRoute: { [key: string]: string } = {
  tts: brandConfig.initiativeBaseRoute.tts,
  asr: brandConfig.initiativeBaseRoute.asr,
  translation: brandConfig.initiativeBaseRoute.translation,
  ocr: brandConfig.initiativeBaseRoute.ocr,
} as const;

export const INITIATIVES_URL = Object.keys(initiativeBaseRoute) as Array<string>;

const routePaths: { [key: string]: string } = {
  root: '/',
  home: '/home',
  ttsInitiativeHome: `${initiativeBaseRoute.tts}`,
  ttsInitiativeContributeThankYou: `${initiativeBaseRoute.tts}/contribute/thank-you`,
  ttsInitiativeValidateThankYou: `${initiativeBaseRoute.tts}/validate/thank-you`,
  ttsInitiativeContribute: `${initiativeBaseRoute.tts}/contribute`,
  ttsInitiativeValidate: `${initiativeBaseRoute.tts}/validate`,
  ttsInitiativeDashboard: `${initiativeBaseRoute.tts}/dashboard`,
  asrInitiativeHome: `${initiativeBaseRoute.asr}`,
  asrInitiativeContribute: `${initiativeBaseRoute.asr}/contribute`,
  asrInitiativeValidate: `${initiativeBaseRoute.asr}/validate`,
  asrInitiativeDashboard: `${initiativeBaseRoute.asr}/dashboard`,
  asrInitiativeContributeThankYou: `${initiativeBaseRoute.asr}/contribute/thank-you`,
  asrInitiativeValidateThankYou: `${initiativeBaseRoute.asr}/validate/thank-you`,
  ocrInitiativeHome: `${initiativeBaseRoute.ocr}`,
  ocrInitiativeContribute: `${initiativeBaseRoute.ocr}/contribute`,
  ocrInitiativeValidate: `${initiativeBaseRoute.ocr}/validate`,
  ocrInitiativeDashboard: `${initiativeBaseRoute.ocr}/dashboard`,
  ocrInitiativeContributeThankYou: `${initiativeBaseRoute.ocr}/contribute/thank-you`,
  ocrInitiativeValidateThankYou: `${initiativeBaseRoute.ocr}/validate/thank-you`,
  translationInitiativeHome: `${initiativeBaseRoute.translation}`,
  translationInitiativeContribute: `${initiativeBaseRoute.translation}/contribute`,
  translationInitiativeValidate: `${initiativeBaseRoute.translation}/validate`,
  translationInitiativeDashboard: `${initiativeBaseRoute.translation}/dashboard`,
  translationInitiativeContributeThankYou: `${initiativeBaseRoute.translation}/contribute/thank-you`,
  translationInitiativeValidateThankYou: `${initiativeBaseRoute.translation}/validate/thank-you`,
  badges: '/badges',
  myBadges: '/my-badges',
  termsAndConditions: '/terms-and-conditions',
  termsOfUse: '/terms-and-conditions#terms-of-use',
  privacyPolicy: '/terms-and-conditions#privacy-policy',
  copyright: '/terms-and-conditions#copyright',
} as const;

export default routePaths;
