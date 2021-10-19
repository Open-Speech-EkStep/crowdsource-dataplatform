import { useState } from 'react';

import ContributionStats from 'components/ContributionStats';
import ContributionStatsByLanguage from 'components/ContributionStatsByLanguage';
import DataLastUpdated from 'components/DataLastUpdated';
import IndiaMapChart from 'components/IndiaMapChart';
import LanguageSelector from 'components/LanguageSelector';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';

const SunoDashboard = () => {
  const [language, setLanguage] = useState<string | undefined>(undefined);

  return (
    <div>
      <LanguageSelector
        selectedLanguage={language}
        updateSelectedLanguage={(language: string | undefined) => setLanguage(language)}
      />
      <DataLastUpdated />
      {(!language && <ContributionStats initiative={INITIATIVES_MAPPING.suno} />) ||
        (language && (
          <ContributionStatsByLanguage initiative={INITIATIVES_MAPPING.suno} language={language} />
        ))}
      <IndiaMapChart type={INITIATIVES_MEDIA_MAPPING.suno} language={language} />
    </div>
  );
};

export default SunoDashboard;
