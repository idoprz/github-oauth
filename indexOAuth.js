// This is example for Web application flow (https://docs.github.com/en/developers/apps/authorizing-oauth-apps#web-application-flow)
const express = require('express');

const app = express();

const clientId = 'c5056de7977df5a87a7a';
const clientSecret = 'ed458460dffd61af55205e293a89fcfbe178a3b6';

app.get('/', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3001/oauth-callback&scope=repo`);
});

app.listen(3001);
console.log('App listening on port 3001');

const axios = require('axios');
let token = null;

app.get('/oauth-callback', (req, res) => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: req.query.code
  };
  const opts = { headers: { accept: 'application/json' } };
  axios.post(`https://github.com/login/oauth/access_token`, body, opts).
    then(res => res.data['access_token']).
    then(_token => {
      console.log('My token:', token);
      token = _token;
      res.json({ ok: 1 });
    }).
    catch(err => res.status(500).json({ message: err.message }));
});