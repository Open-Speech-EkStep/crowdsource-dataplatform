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
  sunocontribution: reportValues,
  sunovalidation: reportValues,
  likhocontribution: reportValues,
  dekhocontribution: reportValues,
  dekhovalidation: reportValues,
  bolovalidation: reportValues,
  likhovalidation: reportValues,
  bolocontribution: [
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
