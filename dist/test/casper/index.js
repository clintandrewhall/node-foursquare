'use strict';

var casper = require('casper').create();
var env = require('system').env;

var url = 'https://foursquare.com/oauth2/authenticate?client_id=' + env.CLIENT_ID + '&response_type=code&redirect_uri=' + env.REDIRECT_URL;

casper.start(url);

casper.then(function waitForLoginForm() {
  this.echo('Waiting for Foursquare login form...');
  this.waitForSelector('form#loginToFoursquare');
});

casper.then(function fillLoginForm() {
  this.echo('...populating login form...');
  this.fillSelectors('form#loginToFoursquare', {
    'input[name = emailOrPhone ]': env.TEST_EMAIL,
    'input[name = password ]': env.TEST_PASSWORD
  }, true);
});

casper.then(function waitForResponseForm() {
  this.echo('...waiting for response.');
  this.waitForSelector('form#responseForm');
});

casper.then(function clickAllow() {
  this.echo('...allowing access.');
  this.click('span#allowButton');
});

casper.then(function () {
  this.exit();
});

casper.run();