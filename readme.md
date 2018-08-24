# node-foursquare

Fault-tolerant Foursquare API wrapper for Node JS.

![GitHub package version](https://img.shields.io/github/package-json/v/clintandrewhall/node-foursquare.svg?style=for-the-badge)
![CircleCI](https://img.shields.io/circleci/project/github/clintandrewhall/node-foursquare.svg?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/clintandrewhall/node-foursquare.svg?style=for-the-badge)

![node](https://img.shields.io/node/v/node-foursquare.svg?style=for-the-badge)
![David](https://img.shields.io/david/clintandrewhall/node-foursquare.svg?style=for-the-badge)
![David](https://img.shields.io/david/dev/clintandrewhall/node-foursquare.svg?style=for-the-badge)

## Install

    npm install node-foursquare

    yarn install node-foursquare

## About

Version 0.4.x is a full rewrite of the older version of this library, using ES6,
Flow, Babel, etc to create a more modern API library.

## Use

The Foursquare module takes a configuration parameter containing logging and
client keys. It also supports alternate Foursquare URLs if necessary, (but that
is unlikely). `config-default.js` contains a full configuration which is
merged with the provided configuration.

To use the library, you must supply, at a minimum, the following:

    const config = {
      'secrets' : {
        'clientId' : 'CLIENT_ID',
        'clientSecret' : 'CLIENT_SECRET',
        'redirectUrl' : 'REDIRECT_URL'
      }
    }

    import nodeFoursquare from 'node-foursquare';
    const Foursquare = nodeFoursquare(config);

Once instantiated, `node-foursquare` provides you with some OAuth help to get
an access token. You can set up endpoints on your own server that match your
OAuth configuration in Foursquare. Using Express, for example:

    const Foursquare = nodeFoursquare(config);
    const app = express();

    app.get('/', (req: express$Request, res: express$Response) => {
      const url = Foursquare.getAuthClientRedirectUrl();
      res.writeHead(303, { location: url });
      res.end();
    });

    app.get('/callback', (req: express$Request, res: express$Response) => {
      const code = ((req.query.code: any): string);

      Foursquare.getAccessToken(
        {
          code,
        },
        (error: ?Error, accessToken: ?string) => {
          if (error) {
            res.send(`An error was thrown: ${error.message}`);
          } else if (!accessToken) {
            res.send(`No access token was provided`);
          } else {
            // Save access token and continue.
          }
        }
      );
    });

If you already have the ability to glean an access token, (e.g. you have your
own OAuth, or the key is stored in the database), you can instantiate the
entire library:

    import nodeFoursquare from 'node-foursquare';
    import config from './config';

    const Foursquare = nodeFoursquare(config);
    const foo = Foursquare.Venues.search(...);
    const bar = Foursquare.Tips.getByID(...);

## Foursquare API Version and Deprecation Warnings

Foursquare allows consumers to specify a 'version' of their API to invoke,
based on the date that version became active. For example, passing a version
string of '20110101' uses the API as of Jan 1, 2011. By default, this library
will use a version of '20140806', the minimum date for the Foursquare/Swarm
migration.

To enable a different version of the API, add the following to configuration:

    const config = {
      ...
      foursquare : {
        ...
        version : '20140806',
        ...
      }
      ...
    }

When using an older API, Foursquare will provide deprecation warnings, (if
applicable). By default, this library will write these warnings to the log,
which will only be visible if logging for 'node-foursquare' is turned on, (see
'Logging', below).

You can configure this library to throw an error instead:

    const config = {
      ...
      foursquare : {
        ...
        warnings : 'ERROR',
        ...
      }
      ...
    }

## Logging

This module uses winston to log events. In configuration, you can set the
default logging level, (which is `warn`), and transports, (which includes
console by default). Each module within the library has its own named logger,
which can be set to different levels:

    const config = {
      winston : {
        all: {
          level: 'warn',
        },
        venues: {
          level: 'trace',
          transports: [winston.transports.File()]
        }
    }

## I18n

Add locale param to config:

    const config = {
      ...
      locale : 'it'
      ...
    }

Valid locales are listed in https://developer.foursquare.com/overview/versioning

## Testing

Testing in node-foursquare has been dramatically improved, and is now run in CI,
using Jest. It uses CasperJS to independently log into Foursquare and get
the access token redirect... therefore, you'll need to supply credentials if
you wish to test independently.

The tests run using environment variables:

    CLIENT_ID=     Testing Client ID
    CLIENT_SECRET= Testing Client Secret
    REDIRECT_URL=  The redirect URL for the testing console, (usually localhost).
    VERSION=       The override Version, if applicable

    // Test User Credentials and ID
    TEST_EMAIL=     Test User Email
    TEST_PASSWORD=  Test User Password
    TEST_USER_ID=   486035012

    // Checkin Module Testing
    TEST_CHECKIN= Checkin of which the Test User has visibility.

    // Lists Module Testing
    TEST_LIST_ID=        ID of a list visible to the test user.
    TEST_LIST_NAME=      Name of a list visible to the test user.
    TEST_LIST_USER_ID=   User ID of the list owner.
    TEST_LIST_USER_NAME= User name of the list owner.

    // Photo Module Testing
    TEST_PHOTO_ID= ID of a photo visibile to the test user.

    // Tip Module Testing
    TEST_TIP_ID= ID of a tip visible to the test user.

    // Users Module Testing
    TEST_USERS_USER_ID= ID of a friend to the test user.

    // Venues Module Testing
    TEST_VENUES_PLACE=             City and State
    TEST_VENUES_VENUE_ID=          ID of a public venue
    TEST_VENUES_VENUE_SHORT_QUERY= A short query, (e.g. 'Harr')
    TEST_VENUES_VENUE_LONG_QUERY=  A long query, (e.g. 'Harrys Bar')

## Version History

* v0.0.1 - First release
* v0.0.2 - Bug Fixes and Downstream Merges
* v0.1.0 - Suggested Refactoring and latest endpoints from Foursquare (VERY NON-PASSIVE)
  * Surround results with field name.
  * Userless Access Tokens (for Venues.explore, etc).
  * Ability to load single portions of the library, (e.g. only import Venues).
  * Users - Leaderboard, Requests
  * Venues - Categories, Explore
* v0.1.1 - Support for Foursquare API Version + Deprecation Warnings (via configuration).
* v0.1.2 - Added new mayorships endpoint, removed extraneous field from User.getBadges (non-passive).
* v0.1.3 - Added Updates endpoint, updated to log4js v0.3.x.
* v0.1.4 - Added Lists and Events endpoints.
* v0.2.0 - Overhaul
  * Replaced log4js with winston.
  * Added new endpoints, modules, methods.
  * Refactored testing suite.
* v0.2.1 - Unit test fixes and bugs/merges
* v0.3.0 - Remove deprecated Foursquare API endpoints, support new parameters.
* v0.3.2 - Latest updates and pull requests
* v0.3.3 - Latest updates and pull requests
* v0.4.0 - Refactor, modernization and update to latest API.
* v0.4.1 - Fixes to semver
* v0.4.2 - Fixes to Flow and access token URL
* v0.4.3 - Distribution of Flow libdefs, removal of 'mode' parameter.
* v0.4.4 - Make module compatible with CommonJS environments; lose individual module imports.

## Notes

Bugs and Pull Requests are, of course, gladly accepted! :-)

This project is a refactoring and enhancement of:
https://github.com/yikulju/Foursquare-on-node
