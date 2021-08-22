function Body({ children }) {
  return (
    <main data-testid="Body" role="main" className="container-xxl my-md-4">
      {children}
    </main>
  );
}

export default Body;
