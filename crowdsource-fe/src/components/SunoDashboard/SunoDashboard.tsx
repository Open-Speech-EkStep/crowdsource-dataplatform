import { useState } from 'react';

import DataLastUpdated from 'components/DataLastUpdated';
import LanguageSelector from 'components/LanguageSelector';

const SunoDashboard = () => {
  const [language, setLanguage] = useState('All Languages');

  return (
    <div>
      <LanguageSelector
        selectedLanguage={language}
        updateSelectedLanguage={(language: string) => setLanguage(language)}
      />
      <DataLastUpdated />
    </div>
  );
};

export default SunoDashboard;
