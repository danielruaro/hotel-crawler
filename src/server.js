const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api/index');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use('/', api);
app.use((req, res) => {
  res.status(404).json({ message: 'You lost mate?' });
});
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: `An unexpected error has ocurred. Err: ${err.message}` });
});
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
