const { registerHandler, withrawBalanceHandler, depositBalanceHandler } = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
  {
    method: 'POST',
    path: '/withdraw',
    handler: withrawBalanceHandler,
  },
  {
    method: 'POST',
    path: '/deposit',
    handler: depositBalanceHandler,
  },
];

module.exports = routes;
