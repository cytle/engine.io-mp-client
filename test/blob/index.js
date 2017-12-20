var env = require('../support/env');

if (env.wsSupport && !env.isOldSimulator && !env.isAndroid && !env.isIE11) {
  require('./ws.js');
}
