const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    /*s
    '/beta/insights/starter': {
      host: `https://${localhost}:8002`
    },
    '/insights/starter': {
      host: `https://${localhost}:8002`
    },
    '/beta/apps/starter': {
      host: `https://${localhost}:8002`
    },
    '/apps/starter': {
      host: `https://${localhost}:8002`
    },
    */
    // needed if you want to local run the new stuff
    '/insights/subscriptions': {
      host: `https://${localhost}:8002`
    },
    '/beta/insights/subscriptions': {
      host: `https://${localhost}:8002`
    },
    '/apps/subscriptions': {
      host: `https://${localhost}:8002`
    },
    '/beta/apps/subscriptions': {
      host: `https://${localhost}:8002`
    },
    '/subscriptions': {
      host: `https://${localhost}:8002`
    },
    '/beta/subscriptions': {
      host: `https://${localhost}:8002`
    },
    /*
    '/locales': {
      host: `https://${localhost}:5001`
    },
    '/static': {
      host: `https://${localhost}:5001`
    },
    '/apps/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/apps/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/staging/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/staging/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/api/rhsm-subscriptions': {
      host: 'https://ci.cloud.redhat.com'
    }

     */
  }
};
