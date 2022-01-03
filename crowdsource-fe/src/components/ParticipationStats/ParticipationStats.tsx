import React from 'react';

import { useTranslation } from 'next-i18next';

import Stats from 'components/Stats';
import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';

const TTS = 'tts';
const ASR = 'asr';
const TRANSLATION = 'translation';
const OCR = 'ocr';
const initiativeOrder = [TTS, ASR, TRANSLATION, OCR];
const typeMap: Record<string, string> = {
  tts: 'asr',
  asr: 'text',
  translation: 'parallel',
  ocr: 'ocr',
};

const ParticipationStats = () => {
  const { t } = useTranslation();
  const { data: participationStats, error } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.participationStats
  );

  const statsContents: Array<{
    id: string;
    stat: string | null;
    label: string;
  }> = [];

  initiativeOrder.forEach(initiative => {
    const stat =
      !participationStats || error
        ? null
        : participationStats.filter(stats => stats['type'] === typeMap[initiative])[0]?.count || '0';

    statsContents.push({
      id: initiative,
      stat: stat,
      label: `${t(initiative)} ${t('initiativeTextSuffix')}`.toUpperCase(),
    });
  });

  return (
    <div>
      <header className="d-flex flex-column align-items-center flex-md-row justify-content-md-between">
        <h2 className="mb-0">{t('totalParticipation')}</h2>
      </header>
      <div className="mt-4 mt-md-5">
        <Stats contents={statsContents} />
      </div>
    </div>
  );
};

export default ParticipationStats;
