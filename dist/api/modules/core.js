"use strict";function OrikaCore(a){this.logger=a,this.host="",this.required={},this.state=!1,this.request=require("../core/request")(a)}var logger=require("yocto-logger"),_=require("lodash"),joi=require("joi"),Q=require("q"),utils=require("yocto-utils");OrikaCore.prototype.init=function(a){var b=joi.object().keys({host:joi.string().required().empty(),port:joi.number().required(),user:joi.string().required().empty(),pwd:joi.string().required().empty()}).allow(["host","port","user","pwd"]),c=joi.validate(a,b,{abortEarly:!1});return _.isEmpty(c.error)?(this.host=c.value.host,delete c.value.host,delete c.value.port,this.required=c.value,!0):(this.logger.error(["[ YoctoOrika.OrikaCore.init ] - Invalid config given :",c.error].join(" ")),!1)},OrikaCore.prototype.isReady=function(){return this.state},OrikaCore.prototype.process=function(a,b,c,d){var e=Q.defer();if(console.log(b,c),a){var f=joi.validate(d,a.request,{abortEarly:!1});f.error?(this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot process",b,":",f.error].join(" ")),e.reject(f.error)):this.request.process(this.host,c,b,this.required,f.value).then(function(c){f=joi.validate(c,a.response,{abortEarly:!1}),f.error?(this.logger.error(["[ YoctoOrika.OrikaCore.process ] -","Invalid reponse givent from action :",b,":",f.error].join(" ")),e.reject(f.error)):0===f.value.status?e.resolve(f.value):(this.logger.error(["[ YoctoOrika.OrikaCore.process ] -","Remove api return an invalid status  : ",utils.obj.inspect(f.value.errors)]),e.reject(f.value.errors||[]))}.bind(this))["catch"](function(a){this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot process",b,"request with given data."].join(" ")),e.reject(a)}.bind(this))}else this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot get schema for",b,"method"].join()),e.reject();return e.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.OrikaCore.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new OrikaCore(a)};