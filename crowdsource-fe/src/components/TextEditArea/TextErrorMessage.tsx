interface TextErrorMessageProps {
  message: string;
  isWarning?: boolean;
}

const TextErrorMessage = ({ message, isWarning = false }: TextErrorMessageProps) => {
  return (
    <span
      data-testid="ErrorText"
      className={`d-block ${isWarning ? 'text-strong-warning' : 'text-danger'} fst-italic mt-2 display-5`}
    >
      {message}
    </span>
  );
};

export default TextErrorMessage;
