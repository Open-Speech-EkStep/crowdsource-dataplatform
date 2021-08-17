import useTranslate from 'hooks/useTranslate';

function Home() {
  const { translate } = useTranslate();

  return <h1>{translate('home')}</h1>;
}

export default Home;
