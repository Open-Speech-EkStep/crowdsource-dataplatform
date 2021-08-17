import useTranslate from 'hooks/useTranslate';

function SunoIndia() {
  const { translate } = useTranslate();

  return (
    <h1>
      {translate('suno')} {translate('india')}
    </h1>
  );
}

export default SunoIndia;
