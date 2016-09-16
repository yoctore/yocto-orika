"use strict";function Orkarte(a){this.logger=a,this.version="1.0.17",this.endpoint="orkarte/api",this.state=!1,this.core=require("../core")(a),this.schema=require("./schema")(a),this.factory=require("./factory")(a)}var logger=require("yocto-logger"),_=require("lodash"),Q=require("q");Orkarte.prototype.init=function(a){return this.core.init(a)},Orkarte.prototype.isReady=function(){return this.state},Orkarte.prototype.getClient=function(a){return this.process("getClient",null,a)},Orkarte.prototype.updateClient=function(a){return this.process("updateClient",null,a)},Orkarte.prototype.build=function(a,b){return _.isFunction(this.factory[a])?this.factory[a](b):!1},Orkarte.prototype.process=function(a,b,c){var d=Q.defer();return this.core.process(this.schema.get(a),a,this.endpoint,c,!0,!1).then(function(a){_.includes(this.schema.getStatusCodes(!0),a.status)&&0!==a.status&&this.logger.error(["[ Orkarte.process ] - An error occured :",this.schema.getStatusCodesMessage(a.status)].join(" ")),d.resolve(a)}.bind(this))["catch"](function(a){d.reject(a)}),d.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.Orkarte.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new Orkarte(a)};