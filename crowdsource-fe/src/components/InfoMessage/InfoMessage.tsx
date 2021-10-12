import Image from 'next/image';

interface InfoMessageProps {
  text: string;
}

const InfoMessage = ({ text }: InfoMessageProps) => {
  return (
    <div
      data-testid="InfoMessage"
      className="rounded-20 border border-1 border-primary d-flex align-items-center px-2 py-2 bg-light fst-italic text-primary"
    >
      <Image src="/images/info_icon.svg" width="24" height="24" alt="Info Icon" />
      <span className="ms-2">{text}</span>
    </div>
  );
};

export default InfoMessage;
