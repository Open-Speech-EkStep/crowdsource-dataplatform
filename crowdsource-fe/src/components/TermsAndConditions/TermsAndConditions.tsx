import type { LegacyRef } from 'react';
import { Fragment, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';

import Button from 'components/Button';
import routePaths from 'constants/routePaths';

import styles from './TermsAndConditions.module.scss';

const hashMapping = {
  termsOfuse: 'terms-of-use',
  privacyPolicy: 'privacy-policy',
  copyright: 'copyright',
} as const;

const TermsAndConditions = () => {
  const router = useRouter();
  const termsOfUseRef = useRef() as LegacyRef<HTMLDivElement> | undefined;

  const privacyPolicyRef = useRef() as LegacyRef<HTMLDivElement> | undefined;
  const copyrightRef = useRef() as LegacyRef<HTMLDivElement> | undefined;

  useEffect(() => {
    const hashToElementMapping: { [key: string]: any } = {
      [hashMapping.termsOfuse]: termsOfUseRef,
      [hashMapping.privacyPolicy]: privacyPolicyRef,
      [hashMapping.copyright]: copyrightRef,
    };

    const scrollToElement = (hash: string) => {
      const elementRef = hashToElementMapping[hash];
      const headerOffset = 144;
      const elementPosition = elementRef.current.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    };

    const initialHash = window.location.hash.slice(1);

    if (initialHash) {
      scrollToElement(initialHash);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      scrollToElement(hash);
    };

    router.events.on('hashChangeComplete', handleHashChange);

    return () => {
      router.events.off('hashChangeComplete', handleHashChange);
    };
  }, [router.events]);

  const handleTermsOfUseClick = () => {
    router.push({
      pathname: `${routePaths.termsAndConditions}/`,
      hash: hashMapping.termsOfuse,
    });
  };

  const handlePrivacyPolicyClick = () => {
    router.push({
      pathname: `${routePaths.termsAndConditions}/`,
      hash: hashMapping.privacyPolicy,
    });
  };

  const handleCopyrightClick = () => {
    router.push({
      pathname: `${routePaths.termsAndConditions}/`,
      hash: hashMapping.copyright,
    });
  };

  return (
    <Fragment>
      <header
        className={`${styles.header} bg-secondary d-flex align-items-center justify-content-md-center overflow-auto position-fixed w-100`}
      >
        <Button
          variant="normal"
          as="a"
          className={`${styles.link} d-flex flex-shrink-0 align-items-center mx-2 mx-md-4 border border-1 border-primary-10 rounded-24 px-6 text-primary fw-bold`}
          onClick={handleTermsOfUseClick}
          data-testid="TermsOfUse"
        >
          Terms of Use
        </Button>
        <Button
          variant="normal"
          as="a"
          className={`${styles.link} d-flex flex-shrink-0 align-items-center mx-2 mx-md-4 border border-1 border-primary-10 rounded-24 px-6 text-primary fw-bold`}
          onClick={handlePrivacyPolicyClick}
          data-testid="PrivacyPolicy"
        >
          Privacy Policy
        </Button>
        <Button
          variant="normal"
          as="a"
          className={`${styles.link} d-flex flex-shrink-0 align-items-center mx-2 mx-md-4 border border-1 border-primary-10 rounded-24 px-6 text-primary fw-bold`}
          onClick={handleCopyrightClick}
          data-testid="Copyright"
        >
          Copyright & Licensing Notice
        </Button>
      </header>
      <div className="px-2 px-lg-0 pb-8 mt-13">
        <Container fluid="lg">
          <div className="text-center pt-6 pb-6 pt-md-9 pb-md-8" ref={termsOfUseRef}>
            <h1>Terms of Use</h1>
          </div>
          <div>
            <p className="mb-4">Effective Date: 1st April, 2021</p>
            <p className="mb-4">
              This data collection and validation Web Application <b>(&quot;Website&quot;)</b> is an open
              source application brought to you by the National Language Translation Mission (NLTM) -
              Bhashini, MeiTY. The Website has been developed to invite the people of India, to contribute
              data to develop Speech Recognition, Text-to-Speech, Machine Translation and Optical Character
              Recognition for Indian languages <b>(“Purpose”).</b>
            </p>
          </div>
          <div>
            <p className="mb-4">Indians can contribute in the following way on the Website</p>
            <ol className="mt-5 mb-8">
              <li>
                Record their voices on the Bolo India Website while reading prompted texts{' '}
                <b>(“Voice Recordings”)</b> to create an open database of diverse voice recordings that can be
                used to develop open source speech-to-text technology tools.
              </li>
              <li>
                Transcribe text on the Suno India Website while listening to the audio clips{' '}
                <b>(“Transcribed Texts”)</b> to create an open database of voice recordings and respective
                transcription that can be used to develop open source text-to-speech technology tools.
              </li>
              <li>
                Translate a text <b>(“Translated Texts”)</b> from one Indian language to another on the Likho
                India Website to create an open database of parallel translations.
              </li>
              <li>
                Label an image <b>(“Labelled Images”)</b> on the Dekho India Website while reading the text on
                the Image to create an open database of labelled images for optical character recognition.
              </li>
            </ol>
            <p className="mb-4">
              The terms ‘you’, ‘your’ refer to anyone who accesses, uses or contributes to the Website{' '}
              <b>(“User”)</b>. These terms of use, as amended, govern the usage of Website by its Users{' '}
              <b>(“Terms”)</b>.
            </p>
            <p className="mb-4">
              By using the Website, you have accepted and agree to be governed by these Terms, as may be
              amended from time to time.
            </p>
          </div>
          <div>
            <b>1. Access and Use</b>
            <ol className="mt-5 mb-8">
              <li>
                Users can contribute Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images
                on the Website.
              </li>
              <li>
                Anyone over the age of 18 can contribute to the Website. If you are below 18 years, you must
                have your parent or guardian’s consent and they must supervise your voluntary contribution to
                the Website.
              </li>
              <li>
                As a User you represent and warrant that you are of legal age and are legally competent to
                form a binding contract (or if not, you&apos;ve received your parent&apos;s or guardian&apos;s
                permission to use the Website and they have agreed to these Terms on your behalf).
              </li>
              <li>
                As a User, you agree to adhere to these Terms when you access, use or contribute Voice
                Recordings, Transcribed Texts, Translated Texts and Labelled Images on the Website. As a User,
                you will be responsible for all your actions and activities in relation to your usage of the
                Website.
              </li>
              <li>
                Your access and use of the Website may possibly be disrupted due to technical or operational
                difficulties, without prior notice of downtime.
              </li>
            </ol>
            <b>
              2. Voluntary contribution of Voice Recordings, Transcribed Texts, Translated Texts and Labelled
              Images
            </b>
            <ol className="mt-5 mb-8">
              <li>
                Users shall contribute Voice Recordings, Transcribed Texts, Translated Texts and Labelled
                Images on this Website and accept the terms of voluntary contribution in the Creative Commons
                for the use of their Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images
                without restrictions of any manner.
              </li>
              <li>
                Users shall ensure that Voice Recordings, Translated Texts and Labelled Images only contain
                the User reading out the text prompt displayed to them on the screen. Similarly, the
                Transcribed Texts will contain only the transcription of the text that the User hears while
                listening to the audio.
              </li>
              <li>
                Users shall not contribute Voice Recordings, Transcribed Texts, Translated Texts or Labelled
                Images that:
                <ol>
                  <li>
                    Are unlawful or that a reasonable person could deem to be objectionable, offensive,
                    pornographic, threatening, hateful, racially or ethnically offensive, or otherwise
                    inappropriate;
                  </li>
                  <li>Are harmful to any person, including minors; or</li>
                  <li>
                    Include any personal information or sensitive personal data or information of the Users.
                  </li>
                </ol>
              </li>
              <li>
                {' '}
                Such Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images shall be
                discarded and will not form part of the Website dataset repository.
              </li>
              <li>
                If you can’t make these assurances, please do not contribute Voice Recordings, Transcribed
                Texts, Translated Texts and Labelled Images on the Website.
              </li>
              <li>
                Users are entirely responsible for the Voice Recordings, Transcribed Texts, Translated Texts
                and Labelled Images contributed on the Website.
              </li>
              <li>
                NLTM reserves the right to make the Voice Recordings, Transcribed Texts, Translated Texts and
                Labelled Images available on a public database. Voice Recordings, Transcribed Texts,
                Translated Texts and Labelled Images will be available under the CC0 1.0 Universal (CC0 1.0)
                Public Domain Dedication. That means that they will be public and NLTM has waived all
                copyrights to the extent NLTM can under law. If you participate by contributing your Voice
                Recordings, Transcribed Texts, Translated Texts and Labelled Images, we require you to do the
                same. If you choose to provide Voice Recording, Transcribed Text, Translated Text and Labelled
                Image on the Website, you consent to NLTM offering your Voice Recordings, Transcribed Texts,
                Translated Texts and Labelled Images to the public under the CC0 1.0 Universal (CC0 1.0)
                Public Domain Dedication.
              </li>
              <li>
                NLTM reserves the right to pre-screen or review Voice Recording, Transcribed Texts, Translated
                Texts and Labelled Images and to refuse to publish or delete any Voice Recordings, Transcribed
                Texts, Translated Texts and Labelled Images which it deems does not fulfill the Purpose.
              </li>
              <li>
                After the Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images are made
                publicly available, users bear all risks associated with the use of any Voice Recordings,
                Transcribed Texts, Translated Texts and Labelled Images including reliance on accuracy,
                completeness or usefulness of such Voice Recordings, Transcribed Texts, Translated Texts and
                Labelled Images.
              </li>
            </ol>

            <b>3. User Information & Privacy:</b>
            <div className="ms-5 mt-5 mb-8">
              In order to contribute Voice Recordings, Transcribed Texts, Translated Texts and Labelled
              Images, Users are not required to provide and the Website does not knowingly collect any
              personal information or sensitive personal data or information. Providing demographic metadata
              such as age group, gender and mother tongue is completely optional. If you do provide any
              demographic metadata on the Website, you consent to the collection and use of the same in
              accordance with the Privacy Policy. The IP address of a User is collected once for the limited
              purpose of determining your approximate location, i.e. your State. The IP address is not stored
              and the precise location of any User cannot be determined.
            </div>

            <b>4. Changes in Policies:</b>
            <div className="ms-5 mt-5 mb-8">
              These Terms (including any other Website policies), may be updated or modified from time to time
              and the revised Terms will be reflected herein. Your continued use of the Website constitutes
              acceptance of the then-current Terms. Hence, we encourage you to visit this page periodically to
              review any changes. We will post an effective date at the top of this page to make it clear when
              we made our most recent update.
            </div>

            <b>5. Disclaimers:</b>
            <div className="ms-5 mt-5 mb-8">
              The Website is available on an “As-Is” basis and there are no warranties or legal guarantees of
              any kind such as “merchantability”, “fitness for a particular purpose”, “non-infringement”. By
              using the Website and contributing Voice Recordings, Transcribed Texts, Translated Texts and
              Labelled Images, you agree that NLTM will not be liable in any way for any inability to use the
              Website, or for any claim arising out of these Terms. NLTM specifically disclaims the following:
              indirect, special, incidental, consequential or exemplary damages, direct or indirect damages
              for loss of goodwill, work stoppage, lost profits, loss of data or computer malfunction. You
              agree to indemnify and hold NLTM harmless for any liability or claim that comes as a result of
              contributing Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images.
            </div>

            <b>6. Infringement:</b>
            <div className="ms-5 mt-5 mb-8">
              If you think that something on the Website infringes your right to privacy or intellectual
              property rights, including copyright or trademark rights, please contact us on
              <b>support@bhashini.gov.in</b> with details of the alleged infringement and your contact
              details.
            </div>

            <b>7. Termination:</b>
            <ol className="mt-5 mb-8">
              <li>
                If you violate any of these Terms, your permission to use the Website can be terminated or
                suspended. NLTM can also suspend or end anyone’s access to the Website at any time for any
                reason.
              </li>
              <li>
                The Voice Recordings, Transcribed Texts, Translated Texts and Labelled Images you contribute
                on the Website may remain publicly available even if your access is terminated or suspended.
              </li>
            </ol>

            <b>8. Governing Law:</b>
            <div className="ms-5 mt-5">
              These Terms shall be governed by and construed in accordance with the Indian law. Any dispute
              arising under these Terms shall be subject to the exclusive jurisdiction of the courts of New
              Delhi, India.
            </div>
          </div>
          <div className="text-center pt-6 pb-6 pt-md-9 pb-md-8" ref={privacyPolicyRef}>
            <h1>Privacy Policy</h1>
          </div>
          <div>
            <p className="mb-4">Effective Date: 1st April 2021</p>
            <p className="mb-4">
              We respect your privacy and are committed to protecting the privacy of our Users.
            </p>
            <p className="mb-4">
              Please read this Privacy Policy carefully, to learn more about the ways in which the Website
              uses and protects your information and data. This Privacy Policy covers the information and data
              that is collected from its User(s). The terms ‘you’, ‘your’ refer to any User of the Website.
            </p>
            <p className="mb-4">
              By using the Website and providing your information on the Website, you consent to the
              collection and use of the information you disclose by the Website in accordance with the{' '}
              <b>Terms of Use</b> and this <b>Privacy Policy</b>. If you do not agree with the contents of
              this policy, please do not access or use the Website.
            </p>
            <p className="mb-4">
              This Privacy Policy should be read in conjunction and together with the Terms of Use. Defined
              terms used but not defined herein shall have the meaning ascribed to them in the Terms of Use.
            </p>

            <b>1. Data we collect, how it is used and who has access:</b>
            <div className="ms-5 mt-5 mb-8">
              You understand, agree and acknowledge that the collection, storage and processing of your
              information or data on the Website is for a lawful purpose connected with the Purpose. Set out
              below are the types of data and information we collect, how it is used and who has access.
              <ol className="mt-5 mb-8">
                <li>
                  <b>Voice Recordings:</b> Users may choose to contribute Voice Recordings on the Website.
                  Voice recordings are used for the Purpose, including to develop speech-to-text technology
                  and tools. Voice Recordings, along with your State, any optionally provided demographic
                  metadata such as age group, gender and mother tongue, may be aggregated and made available
                  publically available for public consumption, for use under CC0 1.0 Universal (CC0 1.0)
                  Public Domain Dedication. No personal metadata that can be used to identify a User or their
                  voices will be collected or disclosed along with the Voice Recordings.
                </li>

                <li>
                  <b>Transcribed Texts, Translated Texts and Labelled Images:</b>
                  Users may choose to contribute Transcribed Texts, Translated Texts and Labelled Images.
                  Transcribed Texts, Translated Texts and Labelled Images are used for the Purpose, including
                  to develop text-to-speech, machine translation and optical character recognition and
                  speech-to-text technology and tools.
                </li>

                <li>
                  <b>Personal meta data and information:</b> The Website does not mandate a User to provide
                  any personal information or sensitive personal data or information. You do not need to
                  create an account to use the Website or contribute Voice Recordings, Transcribed Texts,
                  Translated Texts and Labelled Images. You may choose to provide a username, which together
                  with cookie will only be used to ensure uniqueness of the User and associated with your
                  demographic and interaction metadata. Your username will not be shared to the public.
                </li>

                <li>
                  <b>Demographic metadata:</b> You can optionally provide information such as your gender, age
                  group, and mother tongue. Your IP address is collected once for the limited purpose of
                  determining your approximate location, i.e. your State. The IP address is not stored and the
                  precise location of any User cannot be determined. This will help NLTM and other researchers
                  to understand the demographic distribution of the speakers in the dataset repository and to
                  improve and create speech-to-text technology and tools. Aggregated and anonymised
                  demographic data may be used for the purposes of analysis and may be shared to the public.
                  Individual demographic data will not be shared to the public.
                </li>

                <li>
                  <b>Interaction data:</b> We may use cookies to track de-identified information such as
                  identifying the uniqueness of anonymous Users who contribute Voice Recordings, Transcribed
                  Texts, Translated Texts and Labelled Images, the number of Voice Recordings you record, the
                  number of Transcribed Texts, Translated Texts or Labelled Images you contribute,
                  interactions with buttons and menus, and session length. The cookie will be stored by the
                  Website to identify anonymous users uniquely and hence, to provide you a personalized
                  experience when you re-visit the Website. It can also be used to identify a unique speaker
                  in some cases to their voices for a pure aggregated demographic view of all the consumers
                  who have contributed to the dataset. You can delete the cookie anytime as per your
                  discretion.
                </li>

                <li>
                  <b>Technical data:</b> We may use cookies to track de-identified information such as the
                  number of Voice Recordings you record or listen to, interactions with buttons and menus, and
                  session length. We also collect the URL and title of the Website pages you visit. To
                  consistently improve the Website experience, we collect information about browser type and
                  version, viewport size, and screen resolution. This allows us to understand how people
                  interact with Website so we can improve it. We also collect your location, and the language
                  preference on the Website to make sure it looks right for you.
                </li>
              </ol>
            </div>

            <b>2. Storage of your data:</b>
            <div className="ms-5 mt-5 mb-8">
              {' '}
              Your data will be stored in electronic form using Azure, Central India cloud services. NLTM may
              enter into agreements with third parties to store and process your information or data. These
              third parties will follow security standards to safeguard your information or data and the NLTM
              will, on a reasonable basis, require such third parties to adopt reasonable security standards
              to safeguard your information or data.
            </div>

            <b>3. Data protection and security:</b>
            <ol className="mt-5 mb-8">
              <li>
                We do not knowingly collect any personal information or sensitive personal data or
                information. However, while using the Website, you may choose to provide Voice Recordings,
                Transcribed Texts, Translated Texts and Labelled Images, a username and certain demographic
                metadata on the Website. All your data and information will be encrypted and stored securely.
                Additionally, a variety of methods such as network and infrastructure security, secure sockets
                layer certificates, encryption and manual security measures are used to secure your
                information and data against loss or damage, to help protect the accuracy and security of your
                information and data, and to prevent unauthorised access or improper use.
              </li>
              <li>
                We use reasonable security measures as mandated under the (Indian) Information Technology Act,
                2000 as amended and read with (Indian) Information Technology (Reasonable Security Practices
                and Procedures and Sensitive Personal Data or Information) Rules, 2011, to safeguard and
                protect your data and information.
              </li>
              <li>
                Although we strive to protect your data and information by using appropriate practices such as
                secure sockets layer certificates, we cannot guarantee the security of your data while it is
                being transmitted to our site; any transmission is at your own risk. Once we have received
                your data and information, we have reasonable procedures and security features in place to
                reasonably endeavor to prevent unauthorized access in accordance with Indian law.
              </li>
            </ol>

            <b>4. Compliance with laws and law enforcement:</b>
            <ol className="mt-5 mb-8">
              <li>
                NLTM cooperates with governments and law enforcement agencies or any third party by any order
                under law for the time being in force to enforce and comply with the law.
              </li>
              <li>
                Any information about you will be disclosed to the government or law enforcement officials or
                private parties as, in the sole discretion of NLTM, if we believe necessary or appropriate to
                respond to claims and legal process, to protect their property and rights or a third party, to
                protect the safety of the public or any person, or to prevent or stop any illegal, unethical
                or legally actionable activity. Your information or data may also be provided to various tax
                authorities upon any demand or request from them.
              </li>
              <li>
                You acknowledge that the Website can be accessed from anywhere in the world and it may have
                users from all over the world and therefore governments, judiciaries or law enforcement
                authorities in various parts of the world may have or assume jurisdiction over the Website and
                the Website may be subject to the laws, rules, regulations and judgments of various countries,
                states, municipalities or provinces where it may not have a direct presence to store, process,
                collect, use or keep your information or data. You acknowledge that government or law
                enforcement authorities in the countries where your data or information is stored may have the
                right to decrypt, collect, monitor or access your data or information, which actions are
                completely out of the control of NLTM. NLTM does not take any responsibility for such actions.
              </li>
            </ol>

            <b>5. Deleting your information:</b>
            <div className="ms-5 mt-5">
              {' '}
              If you wish to have the data that you have provided deleted, you can always do so by sending an
              email request to <b>support@bhashini.gov.in</b>. You also agree and acknowledge that certain
              data or information cannot be deleted, because it cannot be uniquely identified as that of the
              requesting User, or may be prohibited to be deleted as required under any applicable law, law
              enforcement requests or under any judicial proceedings.
            </div>
          </div>
          <div className="text-center pt-6 pb-6 pt-md-9 pb-md-8" ref={copyrightRef}>
            <h1>Copyright & Licensing Notice</h1>
          </div>
          <div>
            <p className="mb-4">
              Voice recordings, Transcribed Texts, Translated Texts and Labelled Images along with any
              optionally provided demographic data, shall be available in the Website database for public
              consumption and use under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
            </p>
            <p className="mb-4">
              Text prompts, Images and audio clips provided on the Website to create Voice Recordings,
              Transcribed Texts, Translated Texts and Labelled Images are selected from the following open
              source resource databases: -
            </p>
            <ul className="text-break">
              <li>
                <a
                  href="https://github.com/indicnlpweb/indicnlp_catalog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/indicnlpweb/indicnlp_catalog
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/facebookresearch/LASER/tree/master/tasks/WikiMatrix"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/facebookresearch/LASER/tree/master/tasks/WikiMatrix
                </a>
              </li>
              <li>
                <a href="https://www.sahapedia.org/" target="_blank" rel="noopener noreferrer">
                  https://www.sahapedia.org
                </a>
              </li>
              <li>
                <a href="https://ai4bharat.org/" target="_blank" rel="noopener noreferrer">
                  https://ai4bharat.org
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default TermsAndConditions;
