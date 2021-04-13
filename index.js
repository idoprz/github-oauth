// this is example for Device flow (https://docs.github.com/en/developers/apps/authorizing-oauth-apps#device-flow)

const express = require('express');

const clientId = 'c5056de7977df5a87a7a';
// const clientSecret = 'ed458460dffd61af55205e293a89fcfbe178a3b6';

const axios = require('axios');

const body = {
  client_id: clientId,
  scope: "repo"
};
const opts = { headers: { accept: 'application/json' } };

axios.post(`https://github.com/login/device/code`, body, opts).
    then(res => {
      console.log(`${res.data.verification_uri}, ${res.data.user_code}`);
      setTimeout(()=>poll(res.data.device_code, res.data.interval), 1000 * res.data.interval);
    });

function poll(device_code, interval) {
  console.log('interviewing the interval');

  const body2 = {
    client_id: "c5056de7977df5a87a7a",
    device_code: device_code,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
  };
  const opts2 = { headers: { accept: 'application/json' } };
  
  axios.post(`https://github.com/login/oauth/access_token`, body2, opts2).
      then(res => {
        if (res.data && res.data.interval) {
          interval = res.data.interval;
        }
        if (res.data && res.data.access_token) {
          console.log(`Token ${res.data.access_token}`)
        } else if (res.data && res.data.error === "authorization_pending" || res.data.error === "slow_down") {
          setTimeout(()=>poll(device_code, interval),  1000 * interval);
        }
      });
}
