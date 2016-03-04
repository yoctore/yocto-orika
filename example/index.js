'use strict';

var _ = require('lodash');

var host      = '127.0.0.1';
var user      = 'user';
var password  = 'password';

var config = {
  order : {
    url : '/orkaisse/drive/api/order',
    value : {
      idm   : 1,
      idtrs : '123132',
      idcli : '1234567894561',
      items : [ { ean : '1234567894561', qte : 5, typ : 1 } ]
    }
  }
};

// define mock
var nock = require('nock');

// order request
//var req = nock('http://'+host+':80');

/*_.forOwn(config, function (value, key) {
	// post
	req.post(value.url, value.value).reply(200, {
		username: 'davidwalshblog',
		firstname: 'David'
	});
});*/

var api = require('../src/')();
api.init();
return false;
// test init
if (api.init(user, password, host)) {
  if (api.isReady()) {
    //console.log('build =>', api.orkaisse().build('order', {}));
    api.orkaisse().order(config.order.value).then(function (success) {
      console.log('s =>', success);
    }).catch(function (error) {
      console.log('e =>', error);
    });
  }
} else  {
  console.log('invalid init');
}