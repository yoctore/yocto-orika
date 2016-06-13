"use strict";function OrkaisseSchema(a){this.logger=a,this.statusCodes=[{code:0,message:"Ok"},{code:1,message:"Erreur inconnue / interne"},{code:100,message:"Les formats des données reçues en entrée n'est pas celui attendu."},{code:101,message:"Article inconnu"},{code:102,message:"Numéro de client inconnu"},{code:103,message:"Coupon inconnu"},{code:104,message:"Code ticket inconnu"},{code:105,message:["Problème de montant, le montant reçu ne correspond","pas à celui attendu pour le ticket"].join(" ")}]}var logger=require("yocto-logger"),_=require("lodash"),joi=require("joi"),moment=require("moment");OrkaisseSchema.prototype.getStatusCodesMessage=function(a){return _.get(_.find(this.statusCodes,function(b){return b.code===a}),"message")||["Unkown message with given code :",a].join(" ")},OrkaisseSchema.prototype.getStatusCodes=function(a){return a?_.map(this.statusCodes,function(a){return a.code}):this.statusCodes},OrkaisseSchema.prototype.get=function(a){var b={request:{idm:joi.number().required().min(1),dt:joi.date()["default"](moment().format("YYYY-MM-DD")),idtrs:joi.string().required().trim().empty(),idcli:joi.string().optional().trim().empty().min(13).max(13),idtkt:joi.string().required().trim().empty().min(24).max(24),items:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required().min(0),replacement:joi.array().min(1).items(joi.object().optional().keys({ean:joi.string().required().trim().empty().min(13).max(13),puvttc:joi.number().optional().min(0).precision(2),qte:joi.number().required().min(0)})),puvttc:joi.number().optional().min(0).precision(2)})),vouchers:joi.array().optional().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),typ:joi.number().required().valid([0,1])})),netttc:joi.number().required().positive().precision(2),payments:joi.array().required().items(joi.object().required().keys({idreg:joi.number().required().min(1),mntttc:joi.number().required().min(0).precision(2)})),itemscond:joi.array().optional().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required().min(0),cond:joi.string().required().empty(),mntcond:joi.number().optional().min(0).precision(2)}))},response:{status:joi.number().required().valid(this.getStatusCodes(!0)),idm:joi.number().required().min(1),dt:joi.date().required().format("YYYY-MM-DD"),idtrs:joi.string().required().trim().empty(),idcli:joi.string().optional().trim().empty().min(13).max(13),idtkt:joi.string().required().trim().empty().min(24).max(24),netttc:joi.number().required().min(0).precision(2),netht:joi.number().required().min(0).precision(2),mntavg:joi.number().required().min(0).precision(2),items:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required().min(0),puvttc:joi.number().optional().min(0).precision(2),netttc:joi.number().required().min(0).precision(2),netht:joi.number().required().min(0).precision(2),mntavg:joi.number().required().min(0).precision(2),txtva:joi.number().required().min(0).precision(2),mnttva:joi.number().required().min(0).precision(2)})),itemscond:joi.array().optional().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required().min(0),cond:joi.string().required().empty(),mntcond:joi.number().optional().min(0).precision(2)})),lots:joi.array().optional().items(joi.object().required().keys({idlot:joi.string().required().trim().empty(),ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required().min(0)})),tva:joi.array().required().items(joi.object().required().keys({taux:joi.number().required().min(0).precision(2),totalTTC:joi.number().required().min(0).precision(2),totalHT:joi.number().required().min(0).precision(2),montant:joi.number().required().min(0).precision(2)}))},rules:{order:{request:["idm","dt","idtrs","idcli","items","vouchers","itemscond"],response:["status","idm","dt","idtrs","idcli","idtkt","netttc","netht","mntavg","items","lots","vouchers","itemscond","tva"]},prepare:{request:["idm","dt","idtrs","idcli","items","vouchers"],response:["status","idm","dt","idtrs","idcli","idtkt","netttc","netht","mntavg","items","lots","vouchers","tva"]},paid:{request:["idm","dt","idtrs","idtkt","netttc","payments"],response:["status"]},cancel:{request:["idm","dt","idtrs","idcli","idtkt"],response:["status"]}}};if(this.optionnalSchema={response:{prepare:{items:joi.array().required().items(joi.object().required().keys({ean:joi.string().required().trim().empty().min(13).max(13),qte:joi.number().required(),puvttc:joi.number().optional().min(0).precision(2),netttc:joi.number().required().precision(2),netht:joi.number().required().precision(2),mntavg:joi.number().required().min(0).precision(2),txtva:joi.number().required().min(0).precision(2)}))}}},!_.has(b.rules,a))return this.logger.error(["[ YoctoOrika.OrkaisseSchema.get ] - cannot find schema rules for ",a||'"an empty name"',"please provide a valid name"].join("")),!1;var c={data:joi.object().required().keys(_.pick(b.response,_.difference(_.values(b.rules[a].response),["status"])))};if(this.optionnalSchema.response[a]){var d=_.pick(b.response,_.difference(_.values(b.rules[a].response),["status"]));_.merge(d,this.optionnalSchema.response[a]),c.data=joi.object().required().keys(d)}_.extend(c,_.pick(b.response,_.intersection(b.rules[a].response,["status"]))),"cancel"!==a&&"paid"!==a||delete c.data;var e={request:_.pick(b.request,b.rules[a].request),response:joi.object().required().keys(c)};return e},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoOrika.OrkaisseSchema.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new OrkaisseSchema(a)};