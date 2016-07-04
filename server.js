'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
process.env.NODE_ENV = 'production';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});

