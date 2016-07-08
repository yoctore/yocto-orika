"use strict";function OrikaCore(a){this.logger=a,this.host="",this.required={},this.state=!1,this.request=require("../core/request")(a)}var logger=require("yocto-logger"),_=require("lodash"),joi=require("joi"),Q=require("q");OrikaCore.prototype.init=function(a){var b=joi.object().keys({host:joi.string().required().empty(),port:joi.number().required(),user:joi.string().required().empty(),pwd:joi.string().required().empty()}).allow(["host","port","user","pwd"]),c=joi.validate(a,b,{abortEarly:!1});return _.isEmpty(c.error)?(this.host=c.value.host,delete c.value.host,delete c.value.port,this.required=c.value,!0):(this.logger.error(["[ YoctoOrika.OrikaCore.init ] - Invalid config given :",c.error].join(" ")),!1)},OrikaCore.prototype.isReady=function(){return this.state},OrikaCore.prototype.process=function(a,b,c,d,e,f){var g=Q.defer();if(e=e||!1,f=!!_.isUndefined(f)||f,a){var h=joi.validate(d,a.request,{abortEarly:!1});h.error?(this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot process",b,":",h.error].join(" ")),g.reject(h.error)):this.request.process(this.host,c,b,e?_.extend(this.required,{action:b}):this.required,h.value,f).then(function(c){h=joi.validate(c,a.response,{abortEarly:!1}),h.error?(this.logger.error(["[ YoctoOrika.OrikaCore.process ] -","Invalid reponse givent from action :",b,":",h.error].join(" ")),g.reject(h.error)):g.resolve(h.value)}.bind(this))["catch"](function(a){this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot process",b,"request with given data."].join(" ")),g.reject(a)}.bind(this))}else this.logger.error(["[ YoctoOrika.OrikaCore.process ] - Cannot get schema for",b,"method"].join()),g.reject();return g.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.OrikaCore.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new OrikaCore(a)};