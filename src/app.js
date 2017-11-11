const express = require('express');
const Github = require('github');
const bodyParser = require('body-parser');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
const config = require('./config');

const helpers = require('./helpers');

const server = express();


server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// const githubAPI = new Github({
//   baseUri: 'https://api.github.com',
//   token: config.GITHUB_TOKEN,
// });

const githubAPI = new Github({
  debug: true,
});

githubAPI.authenticate({
  type: 'oauth',
  token: config.GITHUB_GIST,
});

server.post('/login', (req, res) => {
  //  const { username, oauth_token } = req.body;
  const { username } = req.body;
  githubAPI.users.getForUser({ username })
    .then((response) => {
      res.json(response.files);
    });
});

server.post('/gists', (req, res) => {
  // TODO retrieve a list of gists for the currently authed user
  const { username } = req.body;
  githubAPI.gists.getForUser({ username })
    .then((response) => {
      res.json(response.data[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

server.get('/keypair', (req, res) => {
  const keyPair = nacl.box.keyPair();
  const publicKey = nacl.util.encodeBase64(keyPair.publicKey);
  const secretKey = nacl.util.encodeBase64(keyPair.secretKey);
  res.json({ publicKey, secretKey });
});

server.listen(3000);
