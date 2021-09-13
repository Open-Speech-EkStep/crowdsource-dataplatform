import Container from 'react-bootstrap/Container';

import Hero from 'components/Hero';
import InitiativesCarousel from 'components/InitiativesCarousel';

import styles from './HomePageBackground.module.scss';

const HomePageBackground = () => {
  return (
    <div data-testid="HomePageBackground" className={styles.root}>
      <Container fluid="lg" className="pt-7 pt-md-9">
        <section className="py-8 py-md-9 px-8 px-md-0">
          <Hero />
        </section>
        <section className="py-8 py-md-9">
          <InitiativesCarousel />
        </section>
      </Container>
    </div>
  );
};

export default HomePageBackground;
