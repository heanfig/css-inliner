const express = require('express');
const path = require('path');
var Styliner = require('styliner');
var styliner = new Styliner();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(express.json());

app.post('/generate', function(req, res) {
  let html = req.body.html;
  styliner.processHTML(html).then(function(processedSource) {
    res.send(processedSource);
  });
});

app.listen(8080, () => {
  console.log('App started and available at http://localhost:8080');
});
