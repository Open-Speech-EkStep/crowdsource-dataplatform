import styles from './MapLegend.module.scss';

const MapLegend = ({ data }: { data: { value: string }[] }) => {
  return (
    <div className="d-flex mt-8">
      {data.map((quarter, index) => (
        <div key={quarter.value} className="flex-fill">
          <span className={`d-flex ${styles.legend} ${styles[`legendsBG${index}`]}`} />
          <span className="d-flex justify-content-center text-center mt-1 display-7">{quarter.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
