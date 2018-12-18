
# VA-Plan

VA-Plan is a node web app that scrapes bills from [Virginia Legislative Information System](http://lis.virginia.gov/cgi-bin/legp604.exe?191+lst+ALL) and makes it a lot easier to search and keep track of favorite bills

- [Heroku Deployed App](http://va-plan.herokuapp.com)

## Quickstart

```sh
  git clone https://github.com/Superjisan/vaplan.git
  cd vaplan
  npm install
  npm start:dev
```

**Note : Please make sure your MongoDB is running.** For MongoDB installation guide see [this](https://docs.mongodb.org/v3.0/installation/). Also `npm6` is required to install dependencies properly.

## Available Commands

1. `npm run start:dev` - starts the development server with hot reloading enabled

2. `npm run bs` - bundles the code and starts the production server

3. `npm run test` - start the test runner

4. `npm run watch:test` - start the test runner with watch mode

5. `npm run cover` - generates test coverage report

6. `npm run lint` - runs linter to check for lint errors

## File Structure

### Server

VAPLAN uses express web framework. Our app sits in server.js where we check for NODE_ENV.

If NODE_ENV is development, we apply Webpack middlewares for bundling and Hot Module Replacement.

### Client

Client directory contains all the shared components, routes, modules.

#### components
This folder contains all the common components which are used throughout the project.

#### index.js
Index.js simply does client side rendering using the data provided from `window.__INITIAL_STATE__`.

#### modules
Modules are the way of organising different domain-specific modules in the project. A typical module contains the following
```
.
└── Bill
    ├── __tests__                    // all the tests for this module goes here
    |   ├── components               // Sub components of this module
    |   |   ├── Bill.spec.js
    |   |   ├── BillList.spec.js
    |   |   ├── BillItem.spec.js
    |   |   └── BillImage.spec.js
    |   ├── pages
    |   |   ├── BillPage.spec.js
    |   |   └── BillViewPage.spec.js
    |   ├── BillReducer.spec.js
    |   └── BillActions.spec.js
    ├── components                   // Sub components of this module
    |   ├── Bill.js
    |   ├── BillList.js
    |   ├── BillItem.js
    |   └── BillImage.js
    ├── pages                        // React Router Pages from this module
    |   ├── BillPage
    |   |   ├── BillPage.js
    |   |   └── BillPage.css
    |   └── BillViewPage
    |       ├── BillViewPage.js
    |       └── BillViewPage.css
    ├── BillReducer.js
    └── BillActions.js
```

This app was built using the [MERN boilerplate](http://mern.io/)

## License
VAPLAN is released under the [MIT License](http://www.opensource.org/licenses/MIT).
