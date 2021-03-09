const app = require('./app')

const PORT = process.env.PORT || 443;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });