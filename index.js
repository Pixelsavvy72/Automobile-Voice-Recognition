'use strict';

const express = require('express');
const app = express();
const fs = require('fs');

const cors = require('cors');

// Web UI
app.get('/', (req, res) => {
  res.sendFile('./views/index.html');
});

const filestreamWrite = (text) => {
  fs.writeFile("../../output/output", text, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
}

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});