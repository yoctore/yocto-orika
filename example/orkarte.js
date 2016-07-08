'use strict';

var _       = require('lodash');
var nock    = require('nock');
var moment  = require('moment');

var host      = 'http://www.example.com';
var user      = 'user';
var password  = 'password';

var config = {

  getClient : {
    request : {
      body : {
        idcli : '1234567891234'
      }
    },
    response : {
      status : 200,
      body : {
        test : false
      }
    }
  },
  updateClient : {
    request : {
      body : {
        idcli   : '1234567891234',
        nom     : 'toto',
        prenom  : 'tata',
        idm     : 1,
        idtcrt  : 1
      }
    },
    response : {
      status : 200,
      body : {
        status : 0
      }
    }
  }
};

var req = nock(host);

// _.forOwn(config, function (value, key) {
//   req.intercept(value.url, value.request.method).reply(value.response.status, value.response.body);
// });

var api = require('../src/')();

// test init
if (api.init(user, password, host.replace('http://', ''))) {
  if (api.isReady()) {

    // var b = config.order.request.body;
    // b.items = _.flatten([ b.items, b.items ]);
    // api.orkaisse().order(b);

    //console.log('build =>', api.orkaisse().build('order', {}));
    api.orkarte().getClient(config.getClient.request.body).then(function (success) {
      console.log('s =>', success);
    }).catch(function (error) {
      console.log('e =>', error);
    });

    // api.orkarte().updateClient(config.updateClient.request.body).then(function (success) {
    //   console.log('s =>', success);
    // }).catch(function (error) {
    //   console.log('e =>', error);
    // });

  }
} else  {
  console.log('invalid init');
}
