const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(express.static(`${__dirname}/ui/dist/ui`));
app.get('*', (req, res) =>
  res.sendFile(`${__dirname}/app-ui/dist/app-ui/index.html`)
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
