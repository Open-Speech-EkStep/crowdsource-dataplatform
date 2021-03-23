!function t(e,a,r){function o(n,s){if(!a[n]){if(!e[n]){var l="function"==typeof require&&require;if(!s&&l)return l(n,!0);if(i)return i(n,!0);throw new Error("Cannot find module '"+n+"'")}var d=a[n]={exports:{}};e[n][0].call(d.exports,function(t){var a=e[n][1][t];return o(a||t)},d,d.exports,t,e,a,r)}return a[n].exports}for(var i="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e,a){"use strict";e.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!1,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!1,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!1,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!1,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!1,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!1,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(t,e,a){"use strict";function r(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);"Object"===a&&t.constructor&&(a=t.constructor.name);if("Map"===a||"Set"===a)return Array.from(t);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=new Array(e);a<e;a++)r[a]=t[a];return r}var i="topLanguagesByHours",n="topLanguagesBySpeakers",s=t("./utils"),l=s.calculateTime,d=s.formatTime,c=s.performAPIRequest,u=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}],h=void 0,m=function(t){var e,a=[].concat(u),r=$("#legendDiv"),o=Math.max.apply(Math,t.data.map(function(t){return Number(t.total_contributions)}));e=o>1?o/4:.25,a.forEach(function(e){var a=t.data.find(function(t){return e.state===t.state});if(a){var r=l(60*Number(a.total_contributions)*60,!0),o=r.hours,i=r.minutes,n=r.seconds,s=l(60*Number(a.total_validations)*60,!0),d=s.hours,c=s.minutes,u=s.seconds;e.contributed_time="".concat(o,"hrs ").concat(i,"mins ").concat(n,"sec"),e.validated_time="".concat(d,"hrs ").concat(c,"mins ").concat(u,"sec"),e.value=Number(a.total_contributions),e.total_speakers=a.total_speakers,e.id=e.id}else e.id=e.id,e.contributed_time="0 hrs",e.validated_time="0 hrs",e.value=0,e.total_speakers=0});var i=am4core.create("indiaMapChart",am4maps.MapChart),n=i.series.indexOf(h);n>-1&&i.series.removeIndex(n),i.geodataSource.url="https://vakyansh-json-data.s3.ap-south-1.amazonaws.com/india2020Low.json",i.projection=new am4maps.projections.Miller,h=new am4maps.MapPolygonSeries,i.seriesContainer.draggable=!1,i.seriesContainer.resizable=!1,i.chartContainer.wheelable=!1,i.maxZoomLevel=1,h.useGeodata=!0,h.data=a;var s=h.mapPolygons.template;s.tooltipHTML='<div style="text-align: left;"><h6>{state}</h6> <div style="text-align: left;">{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div style="text-align: left;">Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',s.nonScalingStroke=!0,s.strokeWidth=.5,s.stroke=am4core.color("#929292"),s.fill=am4core.color("#fff"),s.states.create("hover").properties.fill=i.colors.getIndex(1).brighten(-.5),h.mapPolygons.template.adapter.add("fill",function(t,a){return a.dataItem?a.dataItem.value>=3*e?am4core.color("#4061BF"):a.dataItem.value>=2*e?am4core.color("#6B85CE"):a.dataItem.value>=e?am4core.color("#92A8E8"):a.dataItem.value>0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):t}),i.series.push(h);var c=$("#quarter .legend-val"),m=$("#half .legend-val"),_=$("#threeQuarter .legend-val"),g=$("#full .legend-val"),p=l(60*e*60,!1),v=p.hours,f=p.minutes,b=l(2*e*60*60,!1),N=b.hours,k=b.minutes,x=l(3*e*60*60,!1),I=x.hours,L=x.minutes;c.text("0 - ".concat(d(v,f))),m.text("".concat(d(v,f)," - ").concat(d(N,k))),_.text("".concat(d(N,k)," - ").concat(d(I,L))),g.text("> ".concat(d(I,L))),r.removeClass("d-none").addClass("d-flex")};function _(t,e,a){var o=am4core.create("speakers_hours_chart",am4charts.XYChart);g.chart=o;var i=r(t);i="total_speakers"===e?i.sort(function(t,e){return Number(t.total_speakers)<Number(e.total_speakers)?-1:1}):i.sort(function(t,e){return Number(t.total_contributions)<Number(e.total_contributions)?-1:1}),"total_speakers"!==e&&i.forEach(function(t){var e=l(60*Number(t.total_contributions)*60,!0),a=e.hours,r=e.minutes,o=e.seconds;t.total_contributions_text=d(a,r,o)}),o.data=i;var n=o.yAxes.push(new am4charts.CategoryAxis);n.dataFields.category=a,n.renderer.grid.template.location=0,n.renderer.cellStartLocation=.2,n.renderer.cellEndLocation=.8,n.renderer.grid.template.strokeWidth=0;var s=o.xAxes.push(new am4charts.ValueAxis);s.renderer.grid.template.strokeWidth=0,s.renderer.labels.template.disabled=!0,n.renderer.minGridDistance=25;var c=o.series.push(new am4charts.ColumnSeries);c.dataFields.valueX=e,c.dataFields.categoryY=a;var u=c.bullets.push(new am4charts.LabelBullet);u.label.text="total_speakers"===e?"{total_speakers}":"{total_contributions_text}",u.label.fontSize=14,u.label.horizontalCenter="left",u.label.dx=10,u.label.truncate=!1,u.label.hideOversized=!1;o.events.on("datavalidated",function(t){var e=t.target,a=e.yAxes.getIndex(0),r=35*e.data.length-a.pixelHeight,o=e.pixelHeight+r;e.svgContainer.htmlElement.style.height=o+"px"})}var g={};e.exports={generateIndiaMap:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";c(""!==t?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(e){var a=""!==t?function(t,e){var a={data:[]};return t.data.forEach(function(t){t.language.toLowerCase()===e.toLowerCase()&&""!==t.state&&"anonymous"!==t.state.toLowerCase()&&a.data.push(t)}),a}(e,t):e;m(a)}).catch(function(t){console.log(t)})},showByHoursChart:function(){g.chart&&g.chart.dispose();var t=localStorage.getItem(i);_(JSON.parse(t),"total_contributions","language")},showBySpeakersChart:function(){g.chart&&g.chart.dispose();var t=localStorage.getItem(n);_(JSON.parse(t),"total_speakers","language")},getStatistics:function(t){var e=$("#speaker-data").find("#loader1, #loader2, #loader3"),a=$("#speakers-wrapper"),r=$("#speaker-value"),o=$("#hours-wrapper"),i=$("#hour-value"),n=$("#languages-wrapper"),s=$("#languages-value");e.removeClass("d-none"),o.addClass("d-none"),a.addClass("d-none"),n.addClass("d-none");var d=l(60*Number(t.total_contributions)*60),c=d.hours,u=d.minutes,h=d.seconds;i.text("".concat(c,"h ").concat(u,"m ").concat(h,"s")),r.text(t.total_speakers),s.text(t.total_languages),e.addClass("d-none"),o.removeClass("d-none"),a.removeClass("d-none"),n.removeClass("d-none")},drawMap:m}},{"./utils":4}],3:[function(t,e,a){"use strict";var r=t("./utils").updateLocaleLanguagesDropdown,o=t("./constants").ALL_LANGUAGES,i=function(t){var e=location.href.split("/"),a=e[e.length-1];n("i18n",t,1),location.href="/".concat(t,"/").concat(a)};function n(t,e,a){var r=new Date;r.setTime(r.getTime()+24*a*60*60*1e3);var o="expires="+r.toGMTString();document.cookie=t+"="+e+";"+o+";path=/"}function s(t){for(var e=t+"=",a=decodeURIComponent(document.cookie).split(";"),r=0;r<a.length;r++){for(var o=a[r];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(e))return o.substring(e.length,o.length)}return""}e.exports={checkCookie:function(){return""!=s("i18n")},getCookie:s,setCookie:n,changeLocale:i,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var t=s("i18n"),e=location.href.split("/"),a=e[e.length-2];if($("#home-page").attr("default-lang",t),a!=t)i(t);else{var n=o.find(function(e){return e.id===t});n&&r(n.value)}}}},{"./constants":1,"./utils":4}],4:[function(t,e,a){"use strict";var r=t("./constants"),o=r.HOUR_IN_SECONDS,i=r.SIXTY,n=r.ALL_LANGUAGES,s=t("./locale").getCookie;var l=function(t){return fetch(t).then(function(t){if(t.ok)return Promise.resolve(t.json());throw Error(t.statusText||"HTTP error")})};e.exports={setPageContentHeight:function(){var t=$("footer"),e=$(".navbar"),a=100-(t.outerHeight()+e.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var t=$("footer");t.toggleClass("fixed-bottom"),t.toggleClass("bottom")},fetchLocationInfo:function(){var t=localStorage.getItem("state_region")||"NOT_PRESENT",e=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==t&&"NOT_PRESENT"!==e&&t.length>0&&e.length>0?new Promise(function(a){a({regionName:t,country:e})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(t){return t.text()}).then(function(t){var e=t.split("\n"),a="";for(var r in e)if(e[r].startsWith("ip=")){a=e[r].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(t,e){e("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(t){var e=$("#localisation_dropdown"),a=n.find(function(e){return e.value===t});"english"===t.toLowerCase()||!1===a.hasLocaleText?e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))},calculateTime:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(t/o),r=t%o,n=Math.floor(r/i),s=Math.round(r%i);return e?{hours:a,minutes:n,seconds:s}:{hours:a,minutes:n}},formatTime:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return t>0&&(r+="".concat(t," hrs ")),e>0&&(r+="".concat(e," min ")),0===t&&0===e&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)},getLocaleString:function(){return new Promise(function(t,e){var a=s("i18n");l("/get-locale-strings/".concat(a)).then(function(e){localStorage.setItem("localeString",JSON.stringify(e)),t(e)})})},performAPIRequest:l,showElement:function(t){t.removeClass("d-none")},hideElement:function(t){t.addClass("d-none")},setFooterPosition:function(){var t=$("#page-content").outerHeight();$("body").outerHeight()<=t+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")}}},{"./constants":1,"./locale":3}]},{},[2]);
