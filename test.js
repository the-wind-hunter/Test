 function(require, module, exports, window, document, frames, self, location, navigator, localStorage, history, Caches, screen, alert, confirm, prompt, XMLHttpRequest, WebSocket, Reporter, webkit, WeixinJSCore) {
     "use strict";
     var t = require("../../@babel/runtime/helpers/interopRequireDefault");
     require("../../@babel/runtime/helpers/Arrayincludes");
     var a = require("../../@babel/runtime/helpers/objectSpread2"),
         e = t(require("../../@babel/runtime/regenerator")),
         o = require("../../@babel/runtime/helpers/asyncToGenerator"),
         s = require("../../@babel/runtime/helpers/defineProperty"),
         i = require("../../api/auditor"),
         n = require("../../utils/formData/formData"),
         l = getApp();
     Page({
         data: {
             secChNameList: [],
             showSecNameList: !1,
             showLoading: !1,
             showOveOrlayLoading: !1,
             phone: null,
             healthDocStatus: null,
             docOneStatus: null,
             tempFilePath: null,
             isPhysicalExamination: "true",
             candidateHealthDoc: {
                 healDocUrl: "",
                 city: "",
                 healDocFiles: []
             },
             isShowFileType: !1,
             columns1: [{
                 name: "文件"
             }, {
                 name: "图片"
             }],
             eduInfos: [],
             hasViolationBehavior: !1,
             antiMoney: null,
             idNumber: null,
             idPhotoFront: [],
             idPhotoBack: [],
             salaryInfos: {
                 monthSalaryList: [{
                     month: null,
                     salary: null
                 }, {
                     month: null,
                     salary: null
                 }, {
                     month: null,
                     salary: null
                 }],
                 hasStock: !1,
                 yearBonusList: [{
                     year: null,
                     salary: null
                 }, {
                     year: null,
                     salary: null
                 }],
                 hasBonus: !1,
                 salaryFile: null,
                 bonusFile: null,
                 stockFile: null,
                 salaryBonusSpecification: null
             },
             hasRelativesInHT: !1,
             relativesInHT: [{
                 department: null,
                 job: null,
                 name: null,
                 relationship: null
             }],
             secRoles: {
                 fitSecRoles: !0,
                 violationSecRolesReason: null
             },
             showOveOrlay: !1,
             healthyImageBase64: "",
             hasSecWorkExp: !1,
             secWorkExp: ""
         },
         showPupopNameList: function() {
             this.setData({
                 showSecNameList: !0
             })
         },
         onClose: function() {
             this.setData({
                 showSecNameList: !1
             })
         },
         healthyRadio: function(t) {
             var a;
             (console.log(t.detail), "false" != t.detail && this.setData(s({}, "candidateHealthDoc.city", null)), "true" != t.detail) && this.setData((s(a = {}, "candidateHealthDoc.healDocUrl", null), s(a, "candidateHealthDoc.healDocFiles", []), a));
             this.setData({
                 isPhysicalExamination: t.detail
             })
         },
         viewImage: function(t) {
             var a = this,
                 e = t.target.dataset.fileid;
             (0, i.selectByFileId)(e).then((function(t) {
                 ["jpg", "png"].includes(t.data.fileExt) && (a.setData({
                     showOveOrlay: !0,
                     showLoading: !0
                 }), (0, i.selectBase64ByFileId)(e).then((function(t) {
                     a.setData({
                         healthyImageBase64: t.resultData,
                         showLoading: !1
                     })
                 })).catch((function(t) {
                     console.log(t), a.setData({
                         showLoading: !1
                     })
                 })))
             }))
         },
         onClickHide: function() {
             this.setData({
                 showOveOrlay: !1,
                 healthyImageBase64: null
             })
         },
         getHealthyUrl: function(t) {
             var a = t.detail.value,
                 e = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
             (a.match(e) || "" == a.trim() && "" !== a) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "").replace(/\s+/g, "")), this.setData(s({}, "candidateHealthDoc.healDocUrl", a))
         },
         chooseMessageFile: function() {
             var t = this;
             return new Promise((function(a, e) {
                 wx.chooseMessageFile({
                     count: 1,
                     type: "file",
                     success: function(e) {
                         t.setData({
                             showOveOrlayLoading: !0
                         }), console.log(e);
                         var o = e.tempFiles[0],
                             s = e.tempFiles[0].name; - 1 == s.indexOf(".pdf") && -1 == s.indexOf(".doc") && -1 == s.indexOf(".docx") ? (t.setData({
                             showOveOrlayLoading: !1
                         }), wx.showToast({
                             title: "仅支持.pdf.doc.docx格式文件",
                             icon: "error",
                             duration: 2e3
                         })) : t.upload(o).then((function(t) {
                             console.log(t, 166), a(t)
                         }))
                     },
                     fail: function(e) {
                         t.setData({
                             showOveOrlayLoading: !1
                         }), console.log("选择文件错误 =====>", e), a(!1)
                     }
                 })
             }))
         },
         upload: function(t) {
             console.log(t, 141);
             var a = new n;
             a.appendFile("file", t.path, t.name);
             var e = a.getData(),
                 o = this;
             return console.log(e), new Promise((function(t, a) {
                 wx.request({
                     url: "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/uploadFile",
                     method: "POST",
                     header: {
                         Accept: "application/json",
                         "content-type": e.contentType,
                         token: wx.getStorageSync("token")
                     },
                     data: e.buffer,
                     success: function(a) {
                         console.log(a, 193), a.data.fileId ? wx.showToast({
                             title: "上传成功！",
                             icon: "success",
                             duration: 1500
                         }) : wx.showToast({
                             title: "上传失败！",
                             icon: "error",
                             duration: 1500
                         }), t(a)
                     },
                     fail: function(t) {
                         o.setData({
                             showOveOrlayLoading: !1
                         }), wx.showToast({
                             title: "上传失败！",
                             icon: "error",
                             duration: 1500
                         })
                     }
                 })
             }))
         },
         chooseImg: function() {
             var t = this;
             return new Promise((function(a, e) {
                 wx.chooseImage({
                     count: 1,
                     sizeType: ["original", "compressed"],
                     sourceType: ["album", "camera"],
                     success: function(e) {
                         t.setData({
                             showOveOrlayLoading: !0
                         }), console.log(e);
                         var o = e.tempFiles[0];
                         o.name = e.tempFiles[0].path;
                         var s = e.tempFiles[0].path;
                         if (-1 == s.indexOf(".png") && -1 == s.indexOf(".jpg")) t.setData({
                             showOveOrlayLoading: !1
                         }), wx.showToast({
                             title: "请上传png或jpg格式图片",
                             icon: "error",
                             duration: 2e3
                         });
                         else {
                             var i = o.name.lastIndexOf("."),
                                 n = o.name.substring(i, o.name.length);
                             o.name = "体检报告图片_" + (new Date).getTime() + n, console.log(o), t.upload(o).then((function(t) {
                                 console.log(t, 198), a(t)
                             }))
                         }
                     },
                     fail: function(e) {
                         console.error("选取照片失败", e), t.setData({
                             showOveOrlayLoading: !1
                         }), a(!1)
                     }
                 })
             }))
         },
         uploadFileTap: function() {
             l.globalData.nonetwork ? this.setData({
                 isShowFileType: !0
             }) : wx.showToast({
                 title: "当前网络不可用，请检查你的网络设置",
                 icon: "none"
             })
         },
         onSelectCity: function(t) {
             console.log(t.detail), this.setData(s({}, "candidateHealthDoc.city", t.detail)), console.log(this.data.candidateHealthDoc)
         },
         onCloseFileType: function() {
             this.setData({
                 isShowFileType: !1
             })
         },
         onSelectFileType: function(t) {
             var a = this;
             return o(e.default.mark((function o() {
                 var i, n, l, c;
                 return e.default.wrap((function(e) {
                     for (;;) switch (e.prev = e.next) {
                         case 0:
                             if (console.log(t.detail.name), "文件" != t.detail.name) {
                                 e.next = 10;
                                 break
                             }
                             return console.log("上传文件"), e.next = 5, a.chooseMessageFile();
                         case 5:
                             i = e.sent, console.log(i, 230), !1 !== i && (console.log(a.data.candidateHealthDoc.healDocFiles), (l = a.data.candidateHealthDoc.healDocFiles).push({
                                 fileName: i.data.fileName,
                                 fileEntityUuid: i.data.fileId
                             }), console.log(l), a.setData((s(n = {}, "candidateHealthDoc.healDocFiles", l), s(n, "showOveOrlayLoading", !1), n))), e.next = 17;
                             break;
                         case 10:
                             return console.log("上传图片"), e.next = 13, a.chooseImg();
                         case 13:
                             i = e.sent, console.log(i, 234), console.log(a.data.candidateHealthDoc.healDocFiles), !1 !== i && ((l = a.data.candidateHealthDoc.healDocFiles).push({
                                 fileName: i.data.fileName,
                                 fileEntityUuid: i.data.fileId
                             }), console.log(l), a.setData((s(c = {}, "candidateHealthDoc.healDocFiles", l), s(c, "showOveOrlayLoading", !1), c)));
                         case 17:
                         case "end":
                             return e.stop()
                     }
                 }), o)
             })))()
         },
         getIdNumber: function(t) {
             var a = t.detail.value,
                 e = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
             (a.match(e) || "" == a.trim() && "" !== a) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "").replace(/\s+/g, "")), this.setData({
                 idNumber: a
             })
         },
         isOutlandsEdu: function(t) {
             var a = t.target.dataset.index,
                 e = t.detail;
             this.setData(s({}, "eduInfos[".concat(a, "].outlandsEdu"), e))
         },
         getSchoolInfo: function(t) {
             var a = t.target.dataset.index,
                 e = t.target.dataset.key,
                 o = t.detail,
                 i = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
             (o.match(i) || "" == o.trim() && "" !== o) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), o = t.detail.replace(i, "").replace(/\s+/g, "")), this.setData(s({}, "eduInfos[".concat(a, "].").concat(e), o))
         },
         selectStartDate: function(t) {
             console.log(t);
             var a = t.target.dataset.index,
                 e = t.detail.value;
             this.setData(s({}, "eduInfos[".concat(a, "].startDate"), e))
         },
         selectEndDate: function(t) {
             console.log(t);
             var a = t.target.dataset.index,
                 e = t.detail.value;
             this.setData(s({}, "eduInfos[".concat(a, "].endDate"), e))
         },
         selectHasBonus: function(t) {
             this.setData(s({}, "salaryInfos.hasBonus", t.detail))
         },
         selectMonth: function(t) {
             var a = t.target.dataset.index,
                 e = t.detail.value;
             this.setData(s({}, "salaryInfos.monthSalaryList[".concat(a, "].month"), e))
         },
         getMonthSalary: function(t) {
             console.log(t);
             var a = t.target.dataset.index,
                 e = t.detail,
                 o = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
             (e.match(o) || "" == e.trim() && "" !== e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), e = t.detail.replace(o, "").replace(/\s+/g, "")), this.setData(s({}, "salaryInfos.monthSalaryList[".concat(a, "].salary"), e))
         },
         selectYear: function(t) {
             var a = t.target.dataset.index,
                 e = t.detail.value;
             this.setData(s({}, "salaryInfos.yearBonusList[".concat(a, "].year"), e))
         },
         getYearSalary: function(t) {
             var a = t.target.dataset.index,
                 e = t.detail,
                 o = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
             (e.match(o) || "" == e.trim() && "" !== e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), e = t.detail.replace(o, "").replace(/\s+/g, "")), this.setData(s({}, "salaryInfos.yearBonusList[".concat(a, "].salary"), e))
         },
         getSalaryBonusSpecification: function(t) {
             var a = t.detail.value,
                 e = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             a.match(e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "")), this.setData(s({}, "salaryInfos.salaryBonusSpecification", a))
         },
         crimeRadio: function(t) {
             console.log(t.detail), this.setData({
                 isCrime: t.detail
             })
         },
         deleteFile: function(t) {
             console.log(t.target.dataset.index);
             var a = t.target.dataset.index,
                 e = this.data.candidateHealthDoc.healDocFiles;
             e.splice(a, 1), console.log(a, e), this.setData(s({}, "candidateHealthDoc.healDocFiles", e))
         },
         selectInHT: function(t) {
             console.log(t), this.setData({
                 hasRelativesInHT: t.detail
             }), t.detail ? this.setData({
                 relativesInHT: [{
                     department: null,
                     job: null,
                     name: null,
                     relationship: null
                 }]
             }) : this.setData({
                 relativesInHT: []
             })
         },
         addRelativeInfo: function() {
             this.setData({
                 relativesInHT: this.data.relativesInHT.concat([{
                     department: null,
                     job: null,
                     name: null,
                     relationship: null
                 }])
             })
         },
         deleteRelativeInfo: function(t) {
             var a = t.target.dataset.index,
                 e = this.data.relativesInHT;
             e.splice(a, 1), console.log(a, e), this.setData({
                 relativesInHT: e
             })
         },
         getRelativeInfo: function(t) {
             var a = t.target.dataset.index,
                 e = t.target.dataset.key,
                 o = t.detail,
                 i = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             o.match(i) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), o = t.detail.replace(i, "")), this.setData(s({}, "relativesInHT[".concat(a, "].").concat(e), o))
         },
         selectAntiMoney: function(t) {
             console.log(t), this.setData({
                 hasViolationBehavior: t.detail
             }), t.detail || this.setData({
                 antiMoney: ""
             })
         },
         selectSecWorkExp: function(t) {
             this.setData({
                 hasSecWorkExp: t.detail
             }), t.detail || this.setData({
                 secWorkExp: ""
             })
         },
         getAntiMoney: function(t) {
             console.log(t.detail.value);
             var a = t.detail.value,
                 e = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             a.match(e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "")), this.setData({
                 antiMoney: a
             })
         },
         getSecWorkExp: function(t) {
             console.log(t.detail.value);
             var a = t.detail.value,
                 e = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             a.match(e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "")), this.setData({
                 secWorkExp: a
             })
         },
         selectCompliance: function(t) {
             var a = t.detail;
             this.setData(s({}, "secRoles.fitSecRoles", a)), a && this.setData(s({}, "secRoles.violationSecRolesReason", null))
         },
         getViolationSecRolesReason: function(t) {
             var a = t.detail.value,
                 e = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             a.match(e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "")), this.setData(s({}, "secRoles.violationSecRolesReason", a))
         },
         onChangeStock: function(t) {
             var a;
             (console.log(t), this.setData(s({}, "salaryInfos.hasStock", t.detail)), t.detail) ? this.scrollTo("#bottom"): this.setData((s(a = {}, "salaryInfos.stockSpecification", null), s(a, "salaryInfos.stockFile", null), a))
         },
         getStockSpecification: function(t) {
             var a = t.detail.value,
                 e = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
             a.match(e) && (wx.showToast({
                 title: "请正确填写",
                 icon: "none"
             }), a = t.detail.value.replace(e, "")), this.setData(s({}, "salaryInfos.stockSpecification", a))
         },
         scrollTo: function(t) {
             wx.pageScrollTo({
                 selector: t,
                 success: function(t) {
                     console.log("scroll success", t)
                 },
                 fail: function(t) {
                     console.log("scroll fail", t)
                 }
             })
         },
         deleteSalaryFile: function(t) {
             console.log(t);
             var a = t.target.dataset.type;
             this.setData(s({}, "salaryInfos.".concat(a), null)), console.log(this.data.salaryInfos[a])
         },
         submitOrSave: function(t) {
             if (console.log(t.target.dataset.type), l.globalData.nonetwork) {
                 var e = t.target.dataset.type,
                     o = this.data.candidateHealthDoc;
                 delete o.class, o.healDocFiles.forEach((function(t) {
                     delete t.class
                 })), console.log(o, 508), o = a(a({}, o), {}, {
                     wx: "true",
                     oversears: "other" === this.data.isPhysicalExamination ? "true" : "false",
                     noHealthDoc: "false" === this.data.isPhysicalExamination ? "true" : "false",
                     state: "other" === this.data.isPhysicalExamination ? 0 : "false" === this.data.isPhysicalExamination ? 1 : 2
                 }), console.log(o, 516);
                 var s = this.data.hasRelativesInHT ? this.data.relativesInHT : [];
                 s.forEach((function(t) {
                     delete t.class
                 })), this.data.relativesInHT.forEach((function(t) {
                     delete t.class
                 }));
                 var n = this.data.idPhotoFront;
                 n.forEach((function(t) {
                     delete t.class
                 }));
                 var c = this.data.idPhotoBack;
                 c.forEach((function(t) {
                     delete t.class
                 }));
                 var r = [];
                 this.data.eduInfos.forEach((function(t) {
                     delete t.class, t.diplomaPhoto && t.diplomaPhoto.class && delete t.diplomaPhoto.class, t.degreePhoto && t.degreePhoto.class && delete t.degreePhoto.class, console.log(t), r.push(a(a({}, t), {}, {
                         diplomaPhoto: t.diplomaPhoto && 0 !== Object.keys(t.diplomaPhoto).length ? t.diplomaPhoto : null,
                         degreePhoto: t.degreePhoto && 0 !== Object.keys(t.degreePhoto).length ? t.degreePhoto : null,
                         diplomaNum: t.diplomaNum ? t.diplomaNum : null,
                         degreeNum: t.degreeNum ? t.degreeNum : null
                     }))
                 })), this.setData({
                     eduInfos: r
                 });
                 var u = this.data.salaryInfos;
                 console.log(u, 540), u.class && delete u.class, u.bonusFile && u.bonusFile.class && delete u.bonusFile.class, u.salaryFile && u.salaryFile.class && delete u.salaryFile.class, u.stockFile && u.stockFile.class && delete u.stockFile.class, u.monthSalaryList.forEach((function(t) {
                     t.class && delete t.class
                 })), u.yearBonusList.forEach((function(t) {
                     t.class && delete t.class
                 }));
                 var h = {
                     mobileOrEmail: this.data.phone,
                     data: {
                         stash: e + "",
                         candidateHealthDoc: o,
                         hasViolationBehavior: this.data.hasViolationBehavior,
                         violationReason: {
                             antiMoney: this.data.antiMoney
                         },
                         relativesInHT: s,
                         hasRelativesInHT: this.data.hasRelativesInHT,
                         idNumber: this.data.idNumber,
                         idType: "I",
                         idPhotoBack: 0 === c.length ? {} : c[0],
                         idPhotoFront: 0 === n.length ? {} : n[0],
                         eduInfos: r,
                         salaryInfos: [u],
                         fitSecRoles: this.data.secRoles.fitSecRoles,
                         violationSecRolesReason: this.data.secRoles.violationSecRolesReason ? this.data.secRoles.violationSecRolesReason : "",
                         secWorkExp: this.data.secWorkExp,
                         hasSecWorkExp: this.data.hasSecWorkExp
                     }
                 };
                 console.log(h), e ? (wx.showLoading({
                     title: "加载中",
                     mask: !0
                 }), console.log("暂存"), (0, i.saveInfoOne)(h).then((function(t) {
                     wx.hideLoading(), "0" === t.code ? wx.showToast({
                         title: "保存成功",
                         icon: "success",
                         duration: 1500
                     }) : wx.showToast({
                         title: "保存失败",
                         icon: "error",
                         duration: 1500
                     })
                 }))) : (console.log("提交"), this.submit(h))
             } else wx.showToast({
                 title: "当前网络不可用，请检查你的网络设置",
                 icon: "none"
             })
         },
         submit: function(t) {
             var a = !0;
             if ("true" == this.data.isPhysicalExamination && (!this.data.candidateHealthDoc.healDocUrl || 0 === this.data.candidateHealthDoc.healDocUrl.replace(/\s*/g, "").length) && this.data.candidateHealthDoc.healDocFiles.length < 1) return wx.hideLoading(), wx.showToast({
                 title: "请填写体检报告链接或上传附件",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#TJ"), !1;
             if ("false" == this.data.isPhysicalExamination && !this.data.candidateHealthDoc.city) return wx.hideLoading(), wx.showToast({
                 title: "请选择体检城市",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#TJ"), !1;
             if (this.data.candidateHealthDoc.healDocUrl && 0 !== this.data.candidateHealthDoc.healDocUrl.replace(/\s*/g, "").length && (console.log(this.data.candidateHealthDoc.healDocUrl), !/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(this.data.candidateHealthDoc.healDocUrl))) return wx.hideLoading(), wx.showToast({
                 title: "体检报告链接格式有误",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#TJ"), !1;
             if (this.data.hasRelativesInHT) try {
                 this.data.relativesInHT.forEach((function(t, e) {
                     if (4 !== Object.keys(t).length) throw a = !1, Error();
                     Object.keys(t).forEach((function(e) {
                         if (null == t[e] || "" == t[e] || 0 === t[e].replace(/\s*/g, "").length) throw a = !1, Error()
                     }))
                 }))
             } catch (t) {
                 return wx.hideLoading(), wx.showToast({
                     title: "请填写完整亲属信息",
                     icon: "none",
                     duration: 1500
                 }), this.scrollTo("#QS"), !1
             }
             if (this.data.hasViolationBehavior && (!this.data.antiMoney || 0 === this.data.antiMoney.replace(/\s*/g, "").length)) return wx.hideLoading(), wx.showToast({
                 title: "请填写诚信反洗钱情况说明",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#CX"), !1;
             if (this.data.hasSecWorkExp && (!this.data.secWorkExp || 0 === this.data.secWorkExp.replace(/\s*/g, "").length)) return wx.hideLoading(), wx.showToast({
                 title: "请填写信息确认情况说明",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#XXQR"), !1;
             if (!(this.data.secRoles.fitSecRoles || this.data.secRoles.violationSecRolesReason && 0 !== this.data.secRoles.violationSecRolesReason.replace(/\s*/g, "").length)) return wx.hideLoading(), wx.showToast({
                 title: "请填写证券从业情况说明",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#ZC"), !1;
             if (!this.data.idNumber || 0 === this.data.idNumber.replace(/\s*/g, "").length) return wx.hideLoading(), wx.showToast({
                 title: "请填写身份证号",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#SF"), !1;
             try {
                 this.data.eduInfos.forEach((function(t, e) {
                     console.log(t, "学历信息"), Object.keys(t).forEach((function(e) {
                         if (null == t[e] || "" == t[e]) throw a = !1, Error();
                         if (!t.degreeNum || 0 === t.degreeNum.replace(/\s*/g, "").length || !t.diplomaNum || 0 === t.diplomaNum.replace(/\s*/g, "").length) throw a = !1, Error()
                     }))
                 }))
             } catch (t) {
                 return wx.hideLoading(), wx.showToast({
                     title: "请填写完整学历信息",
                     icon: "none",
                     duration: 1500
                 }), this.scrollTo("#XL"), !1
             }
             if (!this.data.salaryInfos.companyName) return wx.hideLoading(), wx.showToast({
                 title: "请填写当前雇主名称",
                 icon: "none",
                 duration: 1500
             }), a = !1, this.scrollTo("#XC"), !1;
             try {
                 if (!(this.data.salaryInfos.monthSalaryList.length > 0)) throw Error("请填写完整近三月工资信息");
                 var e = JSON.stringify(this.data.salaryInfos.monthSalaryList);
                 console.log(e);
                 var o = this.data.salaryInfos.monthSalaryList;
                 o.forEach((function(t, s) {
                     if (!t.month || !t.salary || 0 === t.salary.replace(/\s*/g, "").length) throw a = !1, Error("请填写完整近三月工资信息");
                     if ("0" === t.salary) throw Error("薪资不能为0");
                     if (e.replace(JSON.stringify(o[s]), "").indexOf('"month":"'.concat(o[s].month, '"')) > -1) throw Error("请不要填写重复月份工资信息")
                 }))
             } catch (t) {
                 return console.log(t.message), wx.hideLoading(), wx.showToast({
                     title: t.message,
                     icon: "none",
                     duration: 1500
                 }), this.scrollTo("#XC"), !1
             }
             if (console.log(this.data.salaryInfos.salaryFile), !this.data.salaryInfos.salaryFile || "{}" === JSON.stringify(this.data.salaryInfos.salaryFile)) return wx.hideLoading(), wx.showToast({
                 title: "请上传工资证明材料",
                 icon: "none",
                 duration: 1500
             }), this.scrollTo("#GZZMCL"), !1;
             try {
                 if (!(this.data.salaryInfos.yearBonusList.length > 0)) throw Error("请填写完整近两年奖金信息,如无则填0。");
                 var s = JSON.stringify(this.data.salaryInfos.yearBonusList),
                     i = this.data.salaryInfos.yearBonusList;
                 i.forEach((function(t, e) {
                     if (!t.year || !t.salary || 0 === t.salary.replace(/\s*/g, "").length) throw a = !1, Error("请填写完整近两年奖金信息,如无则填0。");
                     if (s.replace(JSON.stringify(i[e]), "").indexOf('"year":"'.concat(i[e].year, '"')) > -1) throw Error("请不要填写重复年份奖金信息")
                 }))
             } catch (t) {
                 return wx.hideLoading(), wx.showToast({
                     title: t.message,
                     icon: "none",
                     duration: 1500
                 }), this.scrollTo("#JG"), !1
             }
             return this.data.salaryInfos.bonusFile && "{}" !== JSON.stringify(this.data.salaryInfos.bonusFile) ? this.data.salaryInfos.salaryBonusSpecification && 0 !== this.data.salaryInfos.salaryBonusSpecification.replace(/\s*/g, "").length ? !this.data.salaryInfos.hasStock || this.data.salaryInfos.stockSpecification && 0 !== this.data.salaryInfos.stockSpecification.replace(/\s*/g, "").length ? void(a && (wx.showLoading({
                 title: "加载中",
                 mask: !0
             }), this.saveOrSubmitInfoOne(t))) : (wx.hideLoading(), wx.showToast({
                 title: "请填写股权期权情况说明",
                 icon: "none",
                 duration: 1500
             }), this.scrollTo("#GQ"), !1) : (wx.hideLoading(), wx.showToast({
                 title: "请填写工资奖金说明",
                 icon: "none",
                 duration: 1500
             }), this.scrollTo("#GZJJSM"), !1) : (wx.hideLoading(), wx.showToast({
                 title: "请上传奖金证明材料",
                 icon: "none",
                 duration: 1500
             }), this.scrollTo("#JJZMCL"), !1)
         },
         saveOrSubmitInfoOne: function(t) {
             console.log(t), (0, i.saveInfoOne)(t).then((function(t) {
                 wx.hideLoading(), console.log(t), "0" === t.code ? (wx.showToast({
                     title: "提交成功",
                     icon: "success",
                     duration: 1500
                 }), setTimeout((function() {
                     wx.navigateBack({
                         delta: 1
                     })
                 }), 1500)) : wx.showToast({
                     title: "提交失败",
                     icon: "error",
                     duration: 1500
                 })
             }))
         },
         uploadRarOrZip: function(t) {
             if (l.globalData.nonetwork) {
                 this.setData({
                     showOveOrlayLoading: !0
                 });
                 var a = t.target.dataset.type,
                     e = this;
                 return new Promise((function(t, o) {
                     wx.chooseMessageFile({
                         count: 1,
                         type: "file",
                         success: function(t) {
                             console.log(t);
                             var o = t.tempFiles[0],
                                 i = t.tempFiles[0].name; - 1 == i.indexOf(".rar") && -1 == i.indexOf(".zip") ? (e.setData({
                                 showOveOrlayLoading: !1
                             }), wx.showToast({
                                 title: "请上传rar或zip压缩文件",
                                 icon: "error",
                                 duration: 2e3
                             })) : e.upload(o).then((function(t) {
                                 console.log(t, 166), t.data.fileId && e.setData(s({}, "salaryInfos.".concat(a), {
                                     fileName: t.data.fileName,
                                     fileEntityUuid: t.data.fileId
                                 })), e.setData({
                                     showOveOrlayLoading: !1
                                 })
                             }))
                         },
                         fail: function(a) {
                             console.log("选择文件错误 =====>", a), e.setData({
                                 showOveOrlayLoading: !1
                             }), t(!1)
                         }
                     })
                 }))
             }
             wx.showToast({
                 title: "当前网络不可用，请检查你的网络设置",
                 icon: "none"
             })
         },
         beforeRead: function(t) {
             var a = t.detail,
                 e = a.file,
                 o = a.callback;
             if (l.globalData.nonetwork) {
                 this.setData({
                     showOveOrlayLoading: !0
                 });
                 var s = e.url.slice(e.url.lastIndexOf(".") + 1);
                 console.log(s), ["jpg", "jpeg", "png", "bmp"].includes(s) || (this.setData({
                     showOveOrlayLoading: !1
                 }), wx.showToast({
                     title: "仅支持jpg jpeg png bmp格式",
                     icon: "none",
                     duration: 1500
                 }), o(!1)), o(!0)
             } else o(!1), wx.showToast({
                 title: "当前网络不可用，请检查你的网络设置",
                 icon: "none"
             })
         },
         uploadIDImage: function(t) {
             var a = this;
             return o(e.default.mark((function o() {
                 var i, n, l;
                 return e.default.wrap((function(e) {
                     for (;;) switch (e.prev = e.next) {
                         case 0:
                             return console.log(11111111), i = t.detail.file, e.next = 4, a.uploadPhoto(i);
                         case 4:
                             n = e.sent, l = t.target.dataset.type, console.log(n), i = {
                                 fileName: n.fileName,
                                 fileEntityUuid: n.fileId,
                                 url: "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(n.fileId, "&fileName=").concat(n.fileName)
                             }, "idPhotoFront" == l ? a.setData(s({}, "idPhotoFront[0]", i)) : a.setData(s({}, "idPhotoBack[0]", i)), a.setData({
                                 showOveOrlayLoading: !1
                             });
                         case 10:
                         case "end":
                             return e.stop()
                     }
                 }), o)
             })))()
         },
         deleteIDImage: function(t) {
             "idPhotoFront" == t.target.dataset.type ? this.setData({
                 idPhotoFront: []
             }) : this.setData({
                 idPhotoBack: []
             })
         },
         uploadEduImage: function(t) {
             var a = this;
             return o(e.default.mark((function o() {
                 var i, n, l, c;
                 return e.default.wrap((function(e) {
                     for (;;) switch (e.prev = e.next) {
                         case 0:
                             return i = t.target.dataset.index, n = t.target.dataset.type, l = t.detail.file, e.next = 5, a.uploadPhoto(l);
                         case 5:
                             c = e.sent, l = {
                                 fileName: c.fileName,
                                 fileEntityUuid: c.fileId,
                                 url: "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(c.fileId, "&fileName=").concat(c.fileName)
                             }, "degreePhoto" == n ? a.setData(s({}, "eduInfos[".concat(i, "].degreePhoto"), l)) : a.setData(s({}, "eduInfos[".concat(i, "].diplomaPhoto"), l)), a.setData({
                                 showOveOrlayLoading: !1
                             });
                         case 9:
                         case "end":
                             return e.stop()
                     }
                 }), o)
             })))()
         },
         deleteEduImage: function(t) {
             console.log(t);
             var a = t.target.dataset.index;
             "degreePhoto" == t.target.dataset.type ? this.setData(s({}, "eduInfos[".concat(a, "].degreePhoto"), null)) : this.setData(s({}, "eduInfos[".concat(a, "].diplomaPhoto"), null))
         },
         uploadPhoto: function(t) {
             var a = this;
             return new Promise((function(e, o) {
                 var s = new n;
                 s.appendFile("file", t.url);
                 var i = s.getData(),
                     l = a;
                 console.log(i), wx.request({
                     url: "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/uploadFile",
                     method: "POST",
                     header: {
                         Accept: "application/json",
                         "content-type": i.contentType,
                         token: wx.getStorageSync("token")
                     },
                     data: i.buffer,
                     success: function(t) {
                         console.log(t.data), t.data.fileId ? wx.showToast({
                             title: "上传成功！",
                             icon: "success",
                             duration: 1500
                         }) : wx.showToast({
                             title: "上传失败！",
                             icon: "error",
                             duration: 1500
                         }), e(t.data)
                     },
                     fail: function(t) {
                         l.setData({
                             showOveOrlayLoading: !1
                         }), wx.showToast({
                             title: "上传失败！",
                             icon: "error",
                             duration: 1500
                         })
                     }
                 })
             }))
         },
         onLoad: function(t) {
             var a = this;
             wx.showLoading({
                 title: "加载中",
                 mask: !0
             }), console.log(t), l.setWatcher(this);
             var e = wx.getStorageSync("phoneNumber");
             this.setData({
                 docOneStatus: t.docOneStatus,
                 healthDocStatus: t.healthDocStatus,
                 phone: e
             }), (0, i.getPerInfoByPhoneNum)({
                 phone: e
             }).then((function(t) {
                 var e;
                 console.log(t, "个人信息"), (t.resultData.salaryInfos[0].monthSalaryList.length < 1 || !t.resultData.salaryInfos[0].monthSalaryList) && (t.resultData.salaryInfos[0].monthSalaryList = a.data.salaryInfos.monthSalaryList), (t.resultData.salaryInfos[0].yearBonusList.length < 1 || !t.resultData.salaryInfos[0].yearBonusList) && (t.resultData.salaryInfos[0].yearBonusList = a.data.salaryInfos.yearBonusList);
                 var o = [],
                     i = [];
                 t.resultData.idPhotoFront && t.resultData.idPhotoFront.fileEntityUuid && o.push(t.resultData.idPhotoFront), t.resultData.idPhotoBack && t.resultData.idPhotoBack.fileEntityUuid && i.push(t.resultData.idPhotoBack), a.setData((e = {
                     candidateHealthDoc: t.resultData.candidateHealthDoc,
                     eduInfos: t.resultData.eduInfos,
                     idNumber: t.resultData.idNumber,
                     salaryInfos: t.resultData.salaryInfos[0],
                     hasRelativesInHT: void 0 === t.resultData.hasRelativesInHT ? a.data.hasRelativesInHT : t.resultData.hasRelativesInHT,
                     hasViolationBehavior: void 0 === t.resultData.hasViolationBehavior ? a.data.hasViolationBehavior : t.resultData.hasViolationBehavior,
                     antiMoney: void 0 === t.resultData.violationReason.antiMoney ? null : t.resultData.violationReason.antiMoney,
                     idPhotoFront: o,
                     idPhotoBack: i,
                     hasSecWorkExp: t.resultData.hasSecWorkExp,
                     secWorkExp: t.resultData.secWorkExp ? t.resultData.secWorkExp : "",
                     secChNameList: t.resultData.secChNameList
                 }, s(e, "secRoles.fitSecRoles", void 0 === t.resultData.fitSecRoles || t.resultData.fitSecRoles), s(e, "secRoles.violationSecRolesReason", t.resultData.violationSecRolesReason), e)), o && 0 !== o.length && a.setData(s({}, "idPhotoFront[0].url", a.data.idPhotoFront[0].fileEntityUuid ? "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(a.data.idPhotoFront[0].fileEntityUuid, "&fileName=").concat(a.data.idPhotoFront[0].fileName, ".").concat(a.data.idPhotoFront[0].ext) : null)), i && 0 !== i.length && a.setData(s({}, "idPhotoBack[0].url", a.data.idPhotoBack[0].fileEntityUuid ? "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(a.data.idPhotoBack[0].fileEntityUuid, "&fileName=").concat(a.data.idPhotoBack[0].fileName, ".").concat(a.data.idPhotoBack[0].ext) : null)), console.log(a.data.idPhotoFront, a.data.idPhotoBack, 917), a.data.eduInfos.forEach((function(t, e) {
                     t.diplomaPhoto && a.setData(s({}, "eduInfos[".concat(e, "].diplomaPhoto.url"), "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(t.diplomaPhoto.fileEntityUuid, "&fileName=").concat(t.diplomaPhoto.fileName, ".").concat(t.diplomaPhoto.ext))), t.degreePhoto && a.setData(s({}, "eduInfos[".concat(e, "].degreePhoto.url"), "https://hr.htsc.com.cn:8443/htsc-hr/rest/FileResource/downloadFile?fileId=".concat(t.degreePhoto.fileEntityUuid, "&fileName=").concat(t.degreePhoto.fileName, ".").concat(t.degreePhoto.ext)))
                 })), t.resultData.relativesInHT && a.setData({
                     relativesInHT: t.resultData.relativesInHT
                 }), 0 === t.resultData.candidateHealthDoc.state ? a.setData({
                     isPhysicalExamination: "other"
                 }) : 1 === t.resultData.candidateHealthDoc.state ? a.setData({
                     isPhysicalExamination: "false"
                 }) : a.setData({
                     isPhysicalExamination: "true"
                 })
             })), console.log(this.data.isPhysicalExamination)
         },
         watch: {
             candidateHealthDoc: {
                 handler: function(t) {
                     console.log(t)
                 },
                 deep: !0
             },
             isPhysicalExamination: function(t, a) {
                 console.log(t, a)
             }
         },
         onReady: function() {
             wx.hideLoading(), console.log("页面渲染完成")
         },
         onShow: function() {
             console.log("监听页面显示")
         },
         onHide: function() {
             console.log("页面隐藏")
         },
         onUnload: function() {
             console.log("页面卸载")
         }
     });
 }
