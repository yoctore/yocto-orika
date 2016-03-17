'use strict';

var _       = require('lodash');
var nock    = require('nock');
var moment  = require('moment');

var host      = 'http://www.example.com';
var user      = 'user';
var password  = 'password';

var config = {
  order : {
    url : '/orkaisse/drive/api/order',
    request : {
      method : 'POST',
      body : {
        idm   : 1,
        idtrs : '123132',
        idcli : '1234567894561',
        items : [ { ean : '1234567894561', qte : 5, typ : 1 } ]
      }
    },
    response : {
      status  : 200,
      body    : {
        idm     : 1,
        dt      : moment().format('YYYY-MM-DD'),
        idtrs   : '123132',
        idcli   : '1234567894561',
        idtkt   : '111111111111111111111111',
        netttc  : 8.89,
        mntavg  : 2.36,
        items   : [ { ean : '1234567894561', qte : 5, typ : 1, puvttc : 4.33, netttc : 1, mntavg : 3 } ],
        lots    : [ { idlot : "3", articles : [ { ean : '1234567894561', qte : 1 } ] }  ]
      }
    }
  }
};

var req = nock(host);

_.forOwn(config, function (value, key) {
  req.intercept(value.url, value.request.method).reply(value.response.status, value.response.body);
});

var api = require('../src/')();

// test init
if (api.init(user, password, host.replace('http://', ''))) {
  if (api.isReady()) {

    var b = config.order.request.body;
    b.items = _.flatten([ b.items, b.items ]);
    api.orkaisse().order(b);

    //console.log('build =>', api.orkaisse().build('order', {}));
    api.orkaisse().order(config.order.request.body).then(function (success) {
      console.log('s =>', success);
    }).catch(function (error) {
      console.log('e =>', error);
    });


  }
} else  {
  console.log('invalid init');
}