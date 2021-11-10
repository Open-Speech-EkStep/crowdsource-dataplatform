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

export const reportFieldsConstant = {
  suno: reportValues,
  likho: reportValues,
  dekho: reportValues,
  bolo: [
    {
      label: 'offensive',
      value: 'Offensive',
      isSubtext: true,
      subtext: 'Hurting sentiments of religion, community or abusive content etc.',
    },
    {
      label: 'Prohibited Content',
      value: 'Prohibited Content',
      isSubtext: true,
      subtext: 'offensiveSubtext',
    },
    {
      label: 'Political Statement',
      value: 'Political Statement',
      isSubtext: true,
      subtext: 'Hateful Political views, amplifying hate-speech etc.',
    },
    {
      label: 'Misinformation',
      value: 'Misinformation',
      isSubtext: true,
      subtext: 'Hearsay / Rumors, deliberate falsified facts etc.',
    },
    {
      label: 'others',
      value: 'Others',
      isSubtext: false,
      subtext: '',
    },
  ],
} as const;
