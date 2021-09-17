import type { ElementType } from 'react';

import classnames from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Container from 'react-bootstrap/Container';

import { DEFAULT_LOCALE } from 'constants/localesConstants';

const StyleGuide: NextPage = () => {
  return (
    <Container as="section" className="p-4">
      <article className="shadow p-4">
        <header>
          <h1 className="text-center">Colors</h1>
          <br />
        </header>

        <section className="d-flex flex-wrap">
          <div>
            <div className="p-10 inline-flex bg-primary"></div>
            <p className="text-center text-primary">primary</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-secondary"></div>
            <p className="text-center text-secondary">secondary</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-success"></div>
            <p className="text-center text-success">success</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-info"></div>
            <p className="text-center text-info">info</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-warning"></div>
            <p className="text-center text-warning">warning</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-danger"></div>
            <p className="text-center text-danger">danger</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-light"></div>
            <p className="text-center text-light bg-dark">light</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-dark"></div>
            <p className="text-center text-dark">dark</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-primary-80"></div>
            <p className="text-center text-primary-80">primary-80</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-primary-64"></div>
            <p className="text-center text-primary-64">primary-64</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-primary-40"></div>
            <p className="text-center text-primary-40">primary-40</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-primary-10"></div>
            <p className="text-center text-primary-10">primary-10</p>
          </div>
          <div>
            <div className="p-10 inline-flex bg-strong-warning"></div>
            <p className="text-center text-strong-warning">strong-warning</p>
          </div>
        </section>
      </article>
      <article className="shadow p-4">
        <header>
          <h1 className="text-center">Padding/Margin</h1>
          <br />
        </header>

        <section className="d-flex flex-wrap">
          {Array.from({ length: 15 })
            .fill(undefined)
            .map((_, index) => (
              <div key={index} className={classnames('border', `p-${index}`, `m-${index}`)}>
                <p className="text-primary p-2">
                  p-{index}, m-{index}
                </p>
              </div>
            ))}
        </section>
      </article>
      <article className="shadow p-4">
        <header>
          <h1 className="text-center">Typography</h1>
          <br />
        </header>

        <section>
          {Array.from({ length: 6 })
            .fill(undefined)
            .map((_, index) => {
              const Heading = `h${index + 1}` as ElementType;

              return (
                <Heading key={index} className="mb-2">
                  Heading: {Heading}
                </Heading>
              );
            })}
          {Array.from({ length: 6 })
            .fill(undefined)
            .map((_, index) => {
              return (
                <p key={index} className={classnames(`display-${index + 1}`, 'mb-2')}>
                  Body-{index + 1}
                </p>
              );
            })}
          <a className="mb-2" href="https://www.google.co.in">
            Link Text
          </a>
          <p className="display-2 mb-2">
            <strong>Bold-1</strong>
          </p>
          <p className="display-3 mb-2">
            <strong>Bold-2</strong>
          </p>
          <p className="display-2 mb-2">
            <em>Italics-1</em>
          </p>
          <p className="display-3 mb-2">
            <em>Italics-1</em>
          </p>
        </section>
      </article>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default StyleGuide;
