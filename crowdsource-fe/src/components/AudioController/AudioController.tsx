import styles from './AudioController.module.scss';

const AudioController = () => {
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <span className={`${styles.label} display-3`}>Type the text as you hear the audio</span>
      <div className={`mt-2 mt-md-3`}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls className={styles.audioPlayer}>
          <source src="horse.ogg" type="audio/ogg" />
          <source src="horse.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioController;
