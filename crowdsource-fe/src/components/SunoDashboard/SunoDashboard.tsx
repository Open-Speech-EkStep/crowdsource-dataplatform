import { useState } from 'react';

import ContributionStats from 'components/ContributionStats';
import ContributionStatsByLanguage from 'components/ContributionStatsByLanguage';
import DataLastUpdated from 'components/DataLastUpdated';
import LanguageSelector from 'components/LanguageSelector';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const SunoDashboard = () => {
  const [language, setLanguage] = useState('All Languages');

  return (
    <div>
      <LanguageSelector
        selectedLanguage={language}
        updateSelectedLanguage={(language: string) => setLanguage(language)}
      />
      <DataLastUpdated />
      {language == 'All Languages' && <ContributionStats initiative={INITIATIVES_MAPPING.suno} />}
      {language != 'All Languages' && (
        <ContributionStatsByLanguage initiative={INITIATIVES_MAPPING.suno} language={language} />
      )}
    </div>
  );
};

export default SunoDashboard;
