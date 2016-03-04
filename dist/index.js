"use strict";function YoctoOrika(a){this.logger=a,this.config={https:!1,host:"",port:80,user:"",pwd:""},this.version="1.0.0",this.modules={orkaisse:require("./api/modules/orkaisse/")(logger)}}var logger=require("yocto-logger"),_=require("lodash"),joi=require("joi"),utils=require("yocto-utils");YoctoOrika.prototype.versions=function(a){a=_.isBoolean(a)?a:!1;var b={api:this.version};return _.forOwn(this.modules,function(a,c){_.merge(b,_.set({},c,this.modules[c].version))}.bind(this)),a?utils.obj.inspect(b):b},YoctoOrika.prototype.init=function(a,b,c,d,e){var f=_.merge(_.clone(this.config),{user:a,pwd:b,host:c,port:d,https:e}),g=joi.object().keys({https:joi["boolean"]().required(),host:joi.string().required().empty(),port:joi.alternatives().when("https",{is:!0,then:443,otherwise:80}),user:joi.string().required().empty(),pwd:joi.string().required().empty()}).allow(["https","host","port","user","pwd"]),h=joi.validate(f,g,{abortEarly:!1});return _.isEmpty(h.error)?(h.value.host=[h.value.https?"https":"http","://",h.value.host,":",h.value.port].join(""),delete h.value.https,this.config=h.value,_.forOwn(this.modules,function(a,b){this.modules[b].init(this.config)}.bind(this)),this.logger.debug(["[ YoctoOrika.init ] - available module are :",this.versions(!0)].join(" ")),!0):(this.logger.error(["[ YoctoOrika.init ] - Cannot validate config :",h.error].join(" ")),!1)},YoctoOrika.prototype.isReady=function(){var a=joi.object().keys({host:joi.string().required().empty(),port:joi.number().required(),user:joi.string().required().empty(),pwd:joi.string().required().empty()}).allow(["host","port","user","pwd"]),b=joi.validate(this.config,a,{abortEarly:!1});return _.isEmpty(b.error)?!0:(this.logger.error(["[ YoctoOrika.isReady ] - API is not ready, use init method first :",b.error].join(" ")),!1)},YoctoOrika.prototype.orkaisse=function(){return this.modules.orkaisse},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ YoctoOrika.constructor ] - Invalid logger given. Use internal logger"),a=logger),new YoctoOrika(a)};