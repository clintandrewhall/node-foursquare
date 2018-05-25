/* flow */
const casper = require('casper').create();
const env = require('system').env;

Object.keys(env).forEach(function(key) {
  console.log(key + '=' + env[key]);
});

casper.on('resource.received', function(resource) {
  casper.echo(resource.url);
});

const url =
  'https://foursquare.com/oauth2/authenticate?client_id=' +
  env.CLIENT_ID +
  '&response_type=code&redirect_uri=' +
  env.REDIRECT_URL;

casper.start(url);

casper.then(function waitForLoginForm() {
  this.echo('waitForLoginForm()');
  this.waitForSelector('form#loginToFoursquare');
});

casper.then(function fillLoginForm() {
  this.echo('fillLoginForm()');
  this.fillSelectors(
    'form#loginToFoursquare',
    {
      'input[name = emailOrPhone ]': 'test@clintandrewhall.com',
      'input[name = password ]': 't3stf0ursqu2r3',
    },
    true
  );
});

/* casper.then(function waitForChange() {
  this.echo('waitForChange()');
  casper.waitWhileSelector('form#loginToFoursquare', function login() {
    this.echo('login()');
    this.waitForSelector('form#responseForm');
  });
}); */

casper.then(function waitForResponseForm() {
  this.echo('waitForResponseForm()');
  this.waitForSelector('form#responseForm');
});

casper.then(function clickAllow() {
  this.echo('clickAllow()');
  this.click('span#allowButton');
});

casper.run();
