"use strict";function OrkaisseSchema(a){this.logger=a}var logger=require("yocto-logger"),_=require("lodash"),joi=require("joi"),moment=require("moment");OrkaisseSchema.prototype.get=function(a){var b={request:{idm:joi.number().required().min(1),dt:joi.date()["default"](moment().format("YYYY-MM-DD")),idtrs:joi.string().required().empty(),idcli:joi.string().required().empty().min(13).max(13),idtkt:joi.string().required().empty().min(24).max(24),items:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().empty().min(13).max(13),qte:joi.number().required().min(0),typ:joi.number().required().valid([0,1]),replacement:joi.object().optional().keys({ean:joi.string().required().empty().min(13).max(13),puvttc:joi.number().required().positive().precision(2)})})),vouchers:joi.array().optional().items(joi.string().required().empty()),netttc:joi.number().required().positive().precision(2),payments:joi.array().required().items(joi.object().required().keys({idreg:joi.number().required().min(1),mntttc:joi.number().required().positive().precision(2)}))},response:{retour:joi.number().required().valid([0,1,2]),idm:joi.number().required().min(1),dt:joi.date().required().format("YYYY-MM-DD"),idtrs:joi.string().required().empty(),idcli:joi.string().required().empty().min(13).max(13),idtkt:joi.string().required().empty().min(24).max(24),netttc:joi.number().required().positive().precision(2),mntavg:joi.number().required().positive().precision(2),items:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().empty().min(13).max(13),qte:joi.number().required().min(0),typ:joi.number().required().valid([0,1]),puvttc:joi.number().required().positive().precision(2),netttc:joi.number().required().positive().precision(2),mntavg:joi.number().required().positive().precision(2)})),lots:joi.array().optional().items(joi.object().required().keys({idlot:joi.string().required().empty(),articles:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().empty().min(13).max(13),qte:joi.number().required().min(0)}))}))},rules:{order:{request:["idm","dt","idtrs","idcli","items","vouchers"],response:["idm","dt","idtrs","idcli","idtkt","netttc","mntavg","items","lots"]},prepare:{request:["idm","dt","idtrs","idcli","idtkt","items","vouchers"],response:["idm","dt","idtrs","idcli","idtkt","netttc","mntavg","items"]},paid:{request:["idm","dt","idtrs","idtkt","netttc","payments"],response:["retour"]},cancel:{request:["idm","dt","idtrs","idcli","idtkt"],response:["retour"]}}};if(!_.has(b.rules,a))return this.logger.error(["[ YoctoOrika.OrkaisseSchema.get ] - cannot find schema rules for ",a||'"an empty name"',"please provide a valid name"].join("")),!1;var c={request:_.pick(b.request,b.rules[a].request),response:_.pick(b.response,b.rules[a].response)};return c},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.OrkaisseSchema.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new OrkaisseSchema(a)};