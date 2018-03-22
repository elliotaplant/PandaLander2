const express = require('express');
const app = express();

app.use(express.static('scripts/pwinty/photos'))
const port = 1337;

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Express server listening on port ${port}`);
  }
});
