!function e(t,n,r){function o(i,s){if(!n[i]){if(!t[i]){var c="function"==typeof require&&require;if(!s&&c)return c(i,!0);if(a)return a(i,!0);throw new Error("Cannot find module '"+i+"'")}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n||e)},l,l.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600}},{}],2:[function(e,t,n){"use strict";var r=e("./speakerDetails"),o=r.validateUserName,a=r.testUserName,i=r.setSpeakerDetails,s=r.resetSpeakerDetails,c=r.setUserNameTooltip,l=r.setStartRecordBtnToolTipContent,u=e("./constants").DEFAULT_CON_LANGUAGE;$(document).ready(function(){var e,t=$("#proceed-box"),n=t.parent(),r=document.querySelectorAll('input[name = "gender"]'),d=document.getElementById("age"),g=document.getElementById("mother-tongue"),m=$("#username"),p=m.next(),f=$("#tnc"),v=u;f.prop("checked",!1),n.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"}),i("speakerDetails",d,g,m),r.forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})}),$("#languageTop").on("change",function(t){e=t.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){v=e}),l(m.val().trim(),n),f.change(function(){var e=m.val().trim();this.checked&&!a(e)?(t.removeAttr("disabled").removeClass("point-none"),n.tooltip("disable")):(l(e,n),t.prop("disabled","true").addClass("point-none"),n.tooltip("enable"))}),m.on("input focus",function(){o(m,p,f),c(m)}),t.on("click",function(){if(f.prop("checked")){var e=Array.from(r).filter(function(e){return e.checked}),t=e.length?e[0].value:"",n=m.val().trim().substring(0,12);if("English"===v&&(v=u),a(n))return;var o={gender:t,age:d.value,motherTongue:g.value,userName:n,language:v};localStorage.setItem("speakerDetails",JSON.stringify(o)),location.href="/record"}}),$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",s),m.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),c(m)})})},{"./constants":1,"./speakerDetails":3}],3:[function(e,t,n){"use strict";function r(e,t,n){var r=e.val().trim();o(r)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none")),n.trigger("change")}var o=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};t.exports={testUserName:o,validateUserName:r,setSpeakerDetails:function(e,t,n,o){var a=localStorage.getItem(e);if(a){var i=JSON.parse(a),s=document.querySelector('input[name = "gender"][value="'+i.gender+'"]');s&&(s.checked=!0,s.previous=!0),t.value=i.age,n.value=i.motherTongue,o.val(i.userName?i.userName.trim().substring(0,12):""),r(o,o.next(),$("#tnc"))}},resetSpeakerDetails:function(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),n=document.getElementById("username"),r=document.querySelector('input[name = "gender"]:checked');r&&(r.checked=!1),e.selectedIndex=0,t.selectedIndex=0,n.value=""},setUserNameTooltip:function(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))},setStartRecordBtnToolTipContent:function(e,t){o(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")}}},{}]},{},[2]);