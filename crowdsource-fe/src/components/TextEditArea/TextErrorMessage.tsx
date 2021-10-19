interface TextErrorMessageProps {
  message: string;
}

const TextErrorMessage = ({ message }: TextErrorMessageProps) => {
  return (
    <span data-testid="ErrorText" className="d-block text-danger fst-italic mt-2 display-5">
      {message}
    </span>
  );
};

export default TextErrorMessage;
