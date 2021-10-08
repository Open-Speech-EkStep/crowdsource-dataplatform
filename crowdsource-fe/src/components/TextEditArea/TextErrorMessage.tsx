interface TextErrorMessageProps {
  message: string;
}

const TextErrorMessage = ({ message }: TextErrorMessageProps) => {
  return (
    <span data-testid="ErrorText" className="d-block text-danger px-4 fst-italic mt-2 display-5">
      {message}
    </span>
  );
};

export default TextErrorMessage;
