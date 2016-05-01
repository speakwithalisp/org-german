var fs = require('fs');
fs.readFile('vocab.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/None/g, '\"None\"');

  fs.writeFile('vocabulary.json', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
