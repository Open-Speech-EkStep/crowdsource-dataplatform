!function t(e,n,o){function a(i,c){if(!n[i]){if(!e[i]){var s="function"==typeof require&&require;if(!c&&s)return s(i,!0);if(r)return r(i,!0);throw new Error("Cannot find module '"+i+"'")}var u=n[i]={exports:{}};e[i][0].call(u.exports,function(t){var n=e[i][1][t];return a(n||t)},u,u.exports,t,e,n,o)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<o.length;i++)a(o[i]);return a}({1:[function(t,e,n){"use strict";e.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!1,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!1,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(t,e,n){"use strict";var o=t("./constants"),a=(o.AUDIO_DURATION,o.SIXTY),r=o.HOUR_IN_SECONDS,i=o.LOCALE_STRINGS,c=t("./utils"),s=c.setPageContentHeight,u=c.toggleFooterPosition,l=c.updateLocaleLanguagesDropdown,g=c.getLocaleString,h="currentIndex",d="speakerDetails",f="skipCount",m="count",v="speakersData",p=5,L=function(t){$("#user-contribution").html(t)};function _(){var t=Number(localStorage.getItem(f));return Number(localStorage.getItem(m))+Number(localStorage.getItem(h))-t}var x=function(t){var e,n,o,a,i=$("#total-progress"),c=(a=11,innerWidth<576?(n=70.5-1.333*(e=576-innerWidth)/100,o=75.2-.4*e/100):innerWidth<1200?(n=70.5-.5*(e=1200-innerWidth)/100,o=75.75-.25*e/100):innerWidth<2e3?(n=71.5-.1*(e=2e3-innerWidth)/100,a=12-.1*e/100,o=innerWidth<1500?75.2:75.5-.003*e/100):(n=71.5+.1*(e=innerWidth-2e3)/100,a=12,o=75.8),{totalProgressBarWidth:n,totalProgressBarBulbWidth:a,totalProgressBarBulbLeft:o}),s=t/(100*r)*100;s>=100?(i.next().css({width:c.totalProgressBarBulbWidth+"%",left:c.totalProgressBarBulbLeft+"%"}),i.width(100*c.totalProgressBarWidth/100+"%"),$("#total-progress").one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",function(){var t=0,e=setInterval(function(){t>=100&&clearInterval(e),i.next().css("background","linear-gradient(to right, #007bff 0%, #007bff ".concat(t,"%, transparent 0%)")),t+=5},30)})):i.width(s*c.totalProgressBarWidth/100+"%")},T=function(t){try{var e=$("#hour-value"),n=Number(t.find(function(t){return 1===t.index}).duration),o=Math.floor(n/r),i=n%r,c=Math.floor(i/a),s=Math.ceil(i%a);e.text("".concat(o,"h ").concat(c,"m ").concat(s,"s")),x(n)}catch(t){console.log(t)}},b=function(t){var e=Math.floor(t/r),n=t%r;return{hours:e,minutes:Math.floor(n/a),seconds:Math.ceil(n%a)}},S=function(t,e){var n=JSON.parse(localStorage.getItem(i)),o="";o=0===e?n["social sharing text without rank"]:(o=(o=n["social sharing text with rank"]).replace("%language",t)).replace("%rank",e),$("#whatsapp_share").attr("href","https://api.whatsapp.com/send?text=".concat(o)),$("#twitter_share").attr("href","https://twitter.com/intent/tweet?text=".concat(o)),$("#linkedin_share").attr("href","https://www.linkedin.com/shareArticle?mini=true&url=https://boloindia.nplt.in&title=I've contributed towards building open language repository for India on https://boloindia.nplt.in&summary=".concat(o))},N=function(){fetch("/stats/summary?aggregateDataByLanguage=true").then(function(t){return t.json()}).then(function(t){if(t.aggregate_data_by_language.length>0){$("#did_you_know_section").show();var e=t.aggregate_data_by_language.sort(function(t,e){return Number(t.total_contributions)>Number(e.total_contributions)?-1:1}),n=b(3600*Number(e[0].total_contributions)),o=n.hours,a=n.minutes,r=n.seconds;$("#highest_language_time").text("".concat(o,"hrs ").concat(a,"min ").concat(r,"sec"));var i=$("#highest_language_progress"),c=3600*Number(e[0].total_contributions)/36e4*100;i.css("width","".concat(c,"%"));var s=localStorage.getItem("contributionLanguage"),u=e.findIndex(function(t){return t.language.toLowerCase()===s.toLowerCase()}),l=$("#contribute_language_time"),g=$("#contribute_language_progress");if(u>-1){var h=e[u].total_contributions,d=b(3600*Number(h)),f=d.hours,m=d.minutes,v=d.seconds;l.text("".concat(f,"hrs ").concat(m,"min ").concat(v,"sec"));var p=3600*Number(h)/36e4*100;g.css("width","".concat(p,"%"))}else l.text("0 hrs"),l.css("right",0),g.css("width","0%");$("#languageId").text(e[0].language),$("#languageChoiceId").text(s),S(s,u>-1?u+1:e.length+1)}else S("",0),$("#did_you_know_section").hide()})};function w(){var t=Number(localStorage.getItem(h)),e=JSON.parse(localStorage.getItem(d));if(e)if(t<p)location.href="/#start-record";else{$("#nav-user").removeClass("d-none"),$("#nav-login").addClass("d-none"),$("#nav-username").text(e.userName);var n=$("#hour-value");s();var o=_();L(o),fetch("/getDetails/".concat(e.language)).then(function(t){if(t.ok)return t.json();throw Error(t.statusText||"HTTP error")}).then(function(t){localStorage.setItem(v,JSON.stringify(t)),T(t)}).catch(function(t){console.log(t)}).then(function(){n.next().addClass("d-none")})}else location.href="/#start-record";u();var a=localStorage.getItem("contributionLanguage");a&&l(a),N()}$(document).ready(function(){g().then(function(t){w()}).catch(function(t){w()})}),e.exports={setUserContribution:L,getTotalSentencesContributed:_}},{"./constants":1,"./utils":4}],3:[function(t,e,n){"use strict";var o=t("./utils").updateLocaleLanguagesDropdown,a=t("./constants").ALL_LANGUAGES,r=function(t){var e=location.href.split("/"),n=e[e.length-1];i("i18n",t,1),location.href="/".concat(t,"/").concat(n)};function i(t,e,n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);var a="expires="+o.toGMTString();document.cookie=t+"="+e+";"+a+";path=/"}function c(t){for(var e=t+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(e))return a.substring(e.length,a.length)}return""}e.exports={checkCookie:function(){return""!=c("i18n")},getCookie:c,setCookie:i,changeLocale:r,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var t=c("i18n"),e=location.href.split("/"),n=e[e.length-2];if($("#home-page").attr("default-lang",t),n!=t)r(t);else{var i=a.find(function(e){return e.id===t});i&&o(i.value)}}}},{"./constants":1,"./utils":4}],4:[function(t,e,n){"use strict";var o=t("./constants"),a=o.HOUR_IN_SECONDS,r=o.SIXTY,i=o.ALL_LANGUAGES,c=t("./locale").getCookie;var s=function(t){return fetch(t).then(function(t){if(t.ok)return Promise.resolve(t.json());throw Error(t.statusText||"HTTP error")})};e.exports={setPageContentHeight:function(){var t=$("footer"),e=$(".navbar"),n=100-(t.outerHeight()+e.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var t=$("footer");t.toggleClass("fixed-bottom"),t.toggleClass("bottom")},fetchLocationInfo:function(){var t=localStorage.getItem("state_region")||"NOT_PRESENT",e=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==t&&"NOT_PRESENT"!==e&&t.length>0&&e.length>0?new Promise(function(n){n({regionName:t,country:e})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(t){return t.text()}).then(function(t){var e=t.split("\n"),n="";for(var o in e)if(e[o].startsWith("ip=")){n=e[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(t,e){e("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(t){var e=$("#localisation_dropdown"),n=i.find(function(e){return e.value===t});"english"===t.toLowerCase()||!1===n.hasLocaleText?e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(t/a),o=t%a,i=Math.floor(o/r),c=Math.round(o%r);return e?{hours:n,minutes:i,seconds:c}:{hours:n,minutes:i}},formatTime:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o="";return t>0&&(o+="".concat(t," hrs ")),e>0&&(o+="".concat(e," min ")),0===t&&0===e&&n>0&&(o+="".concat(n," sec ")),o.substr(0,o.length-1)},getLocaleString:function(){return new Promise(function(t,e){var n=c("i18n");s("/get-locale-strings/".concat(n)).then(function(e){localStorage.setItem("localeString",JSON.stringify(e)),t(e)})})},performAPIRequest:s,showElement:function(t){t.removeClass("d-none")},hideElement:function(t){t.addClass("d-none")},setFooterPosition:function(){var t=$("#page-content").outerHeight();$("body").outerHeight()<=t+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")}}},{"./constants":1,"./locale":3}]},{},[2]);