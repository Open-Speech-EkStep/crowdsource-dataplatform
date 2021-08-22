import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
};

function Body({ children }) {
  return (
    <main data-testid="Body" role="main" className="container-xxl my-md-4">
      {children}
    </main>
  );
}

Body.propTypes = propTypes;

export default Body;
