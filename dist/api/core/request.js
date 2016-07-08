"use strict";function ApiRequest(a){this.logger=a}var joi=require("joi"),logger=require("yocto-logger"),_=require("lodash"),Q=require("q"),utils=require("yocto-utils"),request=require("request");ApiRequest.prototype.prepare=function(a,b){var c=joi.object().keys({user:joi.string().required().empty(),pwd:joi.string().required().empty(),data:joi.object().required().min(1),action:joi.string().optional().empty()}).allow(["user","pwd","data"]),d=joi.validate(b,c,{abortEarly:!1});return _.isEmpty(d.error)&&_.isString(a)&&!_.isEmpty(a)?!0:(this.logger.error(["[ YoctoOrika.ApiRequest.prepare ] - Invalid data given :",d.error||"host is invalid"].join(" ")),!1)},ApiRequest.prototype.process=function(a,b,c,d,e){var f=Q.defer();return a=[a,b,c].join("/"),e=_.merge(_.clone(d),{data:e}),this.prepare(a,e)?(this.logger.debug(["[ YoctoOrika.ApiRequest.process ] - Processing a POST request to :",a,"with data below :",utils.obj.inspect(e)].join(" ")),request({json:!0,method:"POST",uri:a,body:e},function(a,b,c){this.logger.debug(["[ YoctoOrika.ApiRequest.process ] -","Receiving response with data below :",utils.obj.inspect(c)].join(" ")),!a&&b&&_.has(b,"statusCode")&&200===b.statusCode?f.resolve(c):(a=a||[b.statusCode||"Cannot find request status message",b.statusMessage||"Cannot find request message"].join(" "),this.logger.error(["[ YoctoOrika.ApiRequest.process ] - Http request error :",a].join(" ")),f.reject(a))}.bind(this))):(this.logger.error(["[ YoctoOrika.ApiRequest.process ] - Cannot process request for",c,"method.","Cannot prepare data with given value :",utils.obj.inspect(_.values(arguments))].join(" ")),f.reject()),f.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.ApiRequest.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new ApiRequest(a)};