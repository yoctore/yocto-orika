"use strict";function Orkaisse(a){this.logger=a,this.version="1.0.3",this.endpoint="orkaisse/drive/api",this.state=!1,this.core=require("../core")(a),this.schema=require("./schema")(a),this.factory=require("./factory")(a)}var logger=require("yocto-logger"),_=require("lodash");Orkaisse.prototype.init=function(a){return this.core.init(a)},Orkaisse.prototype.isReady=function(){return this.state},Orkaisse.prototype.order=function(a){return this.process("order",a)},Orkaisse.prototype.prepare=function(a){return this.process("prepare",a)},Orkaisse.prototype.paid=function(a){return this.process("paid",a)},Orkaisse.prototype.cancel=function(a){return this.process("cancel",a)},Orkaisse.prototype.build=function(a,b){return _.isFunction(this.factory[a])?this.factory[a](b):!1},Orkaisse.prototype.process=function(a,b){return this.core.process(this.schema.get(a),a,this.endpoint,b)},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.Orkaisse.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new Orkaisse(a)};