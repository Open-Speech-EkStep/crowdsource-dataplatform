const reportValues = [
  {
    label: 'offensive',
    value: 'Offensive',
    isSubtext: true,
    subtext: 'offensiveSubtext',
  },
  {
    label: 'others',
    value: 'Others',
    isSubtext: false,
    subtext: '',
  },
];

export const reportFieldsConstant: any = {
  ttscontribution: reportValues,
  ttsvalidation: reportValues,
  translationcontribution: reportValues,
  ocrcontribution: reportValues,
  ocrvalidation: reportValues,
  asrvalidation: reportValues,
  translationvalidation: reportValues,
  asrcontribution: [
    {
      label: 'offensive',
      value: 'Offensive',
      isSubtext: true,
      subtext: 'hurtingStatement',
    },
    {
      label: 'prohibitedContent',
      value: 'Prohibited Content',
      isSubtext: true,
      subtext: 'offensiveSubtext',
    },
    {
      label: 'politicalStatement',
      value: 'Political Statement',
      isSubtext: true,
      subtext: 'hatefulPolitical',
    },
    {
      label: 'misinformation',
      value: 'Misinformation',
      isSubtext: true,
      subtext: 'herseyRumors',
    },
    {
      label: 'others',
      value: 'Others',
      isSubtext: false,
      subtext: '',
    },
  ],
} as const;
