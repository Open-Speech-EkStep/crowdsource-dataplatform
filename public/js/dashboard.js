!function e(t,a,r){function n(i,s){if(!a[i]){if(!t[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var d=a[i]={exports:{}};t[i][0].call(d.exports,function(e){var a=t[i][1][e];return n(a||e)},d,d.exports,e,t,a,r)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)n(r[i]);return n}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach(function(t){o(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i=e("./home-page-charts").generateIndiaMap,s=e("./utils"),l=s.calculateTime,d=s.formatTime,c=$(".chart-row"),u=c.find(".loader"),m=c.find(".chart"),h=$("#timeline-loader"),g=$("#timeline-chart"),p={};function f(e,t){var a=[];return e.forEach(function(e){var r=e[t]?e:n(n({},e),{},o({},t,"Anonymous")),i=a.findIndex(function(e){return r[t].toLowerCase()===e[t].toLowerCase()});i>=0?(a[i].contributions+=r.contributions,a[i].speakers+=r.speakers):a.push(r)}),a}var v=function(e){var t=[];return["male","female","anonymous","transgender"].forEach(function(a){e.data.forEach(function(e){var r=e.gender;if(""===e.gender&&(e.gender="anonymous"),(e.gender.toLowerCase().indexOf("transgender")>-1||e.gender.toLowerCase().indexOf("rather")>-1)&&(r="transgender"),a===r){var o=r.charAt(0).toUpperCase()+r.slice(1),i=l(60*Number(e.hours_contributed)*60,!0),s=i.hours,c=i.minutes,u=i.seconds,m=d(s,c,u);"transgender"===r?t.push(n(n({},e),{},{gender:"Others",tooltipText:'\n                                <div>\n                                    <h6 style="text-align: left; font-weight: bold">'.concat(e.gender,"</h6>\n                                    <div>Contributed: <label>").concat(m,'</label></div>\n                                    <div style="text-align: left;">Speakers: <label>').concat(e.speakers,"</label></div>\n                                </div>")})):t.push(n(n({},e),{},{gender:o,tooltipText:'\n                                <div>\n                                    <h6 style="text-align: left; font-weight: bold">'.concat(o,"</h6>\n                                    <div>Contributed: <label>").concat(m,'</label></div>\n                                    <div style="text-align: left;">Speakers: <label>').concat(e.speakers,"</label></div>\n                                </div>")}))}})}),t};var b=function(e){p[e]&&(p[e].dispose(),delete p[e])},_=function(e,t){fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){h.hide().removeClass("d-flex"),g.removeClass("d-none"),y(e)}).catch(function(e){console.log(e)})};function k(e,t){Promise.all([fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)),fetch("/contributions/gender?language=".concat(e)),fetch("/contributions/age?language=".concat(e))]).then(function(e){return Promise.all(e.map(function(e){return e.json()}))}).then(function(t){try{u.hide().removeClass("d-flex"),m.removeClass("d-none");var a=v(t[1]),r=f(t[2].data,"age_group").sort(function(e,t){return Number(e.speakers)-Number(t.speakers)});y(t[0]),C(a),i(e),x(r),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),u.show().addClass("d-flex"),m.addClass("d-none")}}).catch(function(e){console.log(e)})}var x=function(e){var t=["#85A8F9","#B7D0FE","#6C85CE","#316AFF","#294691"],a=am4core.create("age-group-chart",am4charts.PieChart3D);a.data=e,a.paddingBottom=50,a.innerRadius=am4core.percent(40),a.depth=50,a.legend=new am4charts.Legend,a.legend.labels.template.fill=am4core.color("#000"),a.legend.valueLabels.template.fill=am4core.color("#000"),a.legend.labels.template.textDecoration="none",a.legend.valueLabels.template.textDecoration="none",a.legend.itemContainers.template.paddingTop=5,a.legend.itemContainers.template.paddingBottom=5,a.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",a.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",a.legend.valueLabels.template.align="right",a.legend.valueLabels.template.textAlign="start",a.legend.itemContainers.template.paddingLeft=20,a.legend.itemContainers.template.paddingRight=20;var r=a.series.push(new am4charts.PieSeries3D);r.labels.template.disabled=!0,r.ticks.template.disabled=!0,r.calculatePercent=!0,r.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",r.dataFields.value="speakers",r.dataFields.depthValue="speakers",r.dataFields.category="age_group",r.slices.template.adapter.add("fill",function(e,a){return t[a.dataItem.index]}),p["age-group-chart"]=a},C=function(e){var t=["#5d6d9a","#85A8F9","#B7D0FE","#6C85CE","#316AFF","#294691"];am4core.ready(function(){var a=am4core.create("gender-chart",am4charts.XYChart);e.forEach(function(e){var t=l(60*Number(e.hours_contributed)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.contributedHours=d(a,r,n)}),a.data=e;var r=a.xAxes.push(new am4charts.CategoryAxis);r.dataFields.category="gender",r.renderer.minGridDistance=20,r.renderer.labels.template.fill="#000",r.renderer.grid.template.disabled=!0,r.renderer.labels.template.fontSize=12,r.renderer.grid.template.location=0;var n=a.yAxes.push(new am4charts.ValueAxis);n.min=0,n.renderer.labels.template.fill="#000",n.renderer.grid.template.strokeDasharray="3,3",n.renderer.labels.template.fontSize=12,n.title.text="Number of hours",n.title.fontSize=12;var o=a.series.push(new am4charts.ColumnSeries);o.dataFields.valueY="hours_contributed",o.dataFields.categoryX="gender";var i=o.columns.template;i.tooltipHTML="<div> {tooltipText}</div>",i.tooltipX=am4core.percent(50),i.tooltipY=am4core.percent(0),i.adapter.add("fill",function(e,a){return t[t.length-1-a.dataItem.index]}),i.adapter.add("stroke",function(e,a){return t[t.length-1-a.dataItem.index]}),p["gender-chart"]=a})},y=function(e){am4core.ready(function(){am4core.useTheme(am4themes_animated);for(var t=am4core.create("timeline-chart",am4charts.XYChart),a=e.data,r=0;r<a.length;r++){a[r].month||(a[r].month=3*a[r].quarter),a[r].duration=new Date(a[r].year,a[r].month-1,1),a[r].year=String(a[r].year);var n=l(60*Number(a[r].cumulative_contributions)*60,!0),o=n.hours,i=n.minutes,s=n.seconds,d=l(60*Number(a[r].cumulative_validations)*60,!0),c=d.hours,u=d.minutes,m=d.seconds;a[r].contributedHours="".concat(o,"hrs ").concat(i,"mins ").concat(s,"secs"),a[r].validatedHours="".concat(c,"hrs ").concat(u,"mins ").concat(m,"secs")}t.data=a;var h=t.xAxes.push(new am4charts.DateAxis);h.renderer.minGridDistance=10,h.renderer.grid.template.disabled=!0,h.renderer.baseGrid.disabled=!1,h.renderer.labels.template.fill="#000",h.title.text="Time",h.renderer.labels.template.fontSize=12,h.title.fontSize=12;var g=t.yAxes.push(new am4charts.ValueAxis);g.min=0,g.renderer.minGridDistance=50,g.renderer.grid.template.strokeDasharray="3,3",g.renderer.labels.template.fill="#000",g.title.text="Number of hours",g.renderer.labels.template.fontSize=12,g.title.fontSize=12;var f=t.series.push(new am4charts.LineSeries);f.dataFields.dateX="duration",f.dataFields.valueY="cumulative_contributions",f.strokeWidth=3,f.tensionX=.8,f.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>\n            </div>',f.tooltip.getFillFromObject=!1,f.tooltip.autoTextColor=!1,f.tooltip.background.fill=am4core.color("#F1F1F2"),f.tooltip.label.fill=am4core.color("#000000"),f.sequencedInterpolation=!0,f.stroke=am4core.color("#FCC232"),f.name="Recorded";var v=t.series.push(new am4charts.LineSeries);(v.dataFields.dateX="duration",v.dataFields.valueY="cumulative_validations",v.sequencedInterpolation=!0,v.tensionX=.8,v.strokeWidth=3,v.stroke=am4core.color("#83E661"),v.name="Validated",1===a.length)&&(f.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#FCC232"),v.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#83E661"));t.legend=new am4charts.Legend,t.legend.labels.template.fontSize=12,t.cursor=new am4charts.XYCursor,t.cursor.xAxis=h,p["timeline-chart"]=t})};t.exports={updateGraph:function(e,t,a){a?(b("timeline-chart"),h.show().addClass("d-flex"),g.addClass("d-none"),_(e,t)):(am4core.disposeAllCharts(),u.show().addClass("d-flex"),m.addClass("d-none"),h.addClass("d-none"),k(e,t))},buildGraphs:k,getOrderedGenderData:function(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(a){e.forEach(function(e){if(a.toLowerCase()===e.gender.toLowerCase()){var r=t.findIndex(function(e){return a.toLowerCase()===e.gender.toLowerCase()});-1===r?t.push(e):t[r].count+=e.count}})}),t},getGenderData:v,getAgeGroupData:f}},{"./home-page-charts":4,"./utils":7}],3:[function(e,t,a){"use strict";var r,n=e("./draw-chart").updateGraph,o=e("./speakerDetails"),i=o.testUserName,s=o.setStartRecordBtnToolTipContent,l=o.setSpeakerDetails,d=o.setUserNameOnInputFocus,c=o.setGenderRadioButtonOnClick,u=o.setUserModalOnShown,m=e("./utils"),h=m.toggleFooterPosition,g=m.updateLocaleLanguagesDropdown,p=m.calculateTime,f=m.getLocaleString,v=e("./constants"),b=v.DEFAULT_CON_LANGUAGE,_=v.ALL_LANGUAGES,k="",x=function(e){return fetch(e?"/aggregate-data-count?byLanguage=true":"/aggregate-data-count").then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})},C=function(e,t){localStorage.setItem("previousLanguage",t);var a={languages:0,speakers:0,contributions:0,validations:0};if(t){var r=e.filter(function(e){return e.language.toLowerCase()===t.toLowerCase()});a.speakers=parseInt(r[0].total_speakers),a.contributions=parseFloat(r[0].total_contributions),a.validations=parseFloat(r[0].total_validations)}else a.languages=parseInt(e[0].total_languages),a.speakers=parseInt(e[0].total_speakers),a.contributions=parseFloat(e[0].total_contributions),a.validations=parseFloat(e[0].total_validations);return a};function y(e){var t=$("#speaker-data"),a=t.find("#loader1"),o=t.find("#contribution-details"),i=t.find(".contribution-data"),s=$("#languages-wrapper"),l=$("#languages-value"),d=$("#speaker-value"),c=$("#contributed-value"),u=$("#validated-value"),m=$("#duration").find(".active")[0].dataset.value;x(e).then(function(t){try{var h=function(e,t){var a=!1;return!t||(e.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&(a=!0)}),a)}(t.data,e);if(t.last_updated_at?($("#data-updated").text(" ".concat(t.last_updated_at)),$("#data-updated").removeClass("d-none")):$("#data-updated").addClass("d-none"),h){a.removeClass("d-none"),s.addClass("d-none"),o.addClass("d-none"),n(e,m);var g=C(t.data,e),f=p(60*g.contributions.toFixed(3)*60),v=f.hours,b=f.minutes,_=f.seconds,x=p(60*g.validations.toFixed(3)*60),y=x.hours,N=x.minutes,S=x.seconds;g.languages?(l.text(g.languages),s.removeClass("d-none"),i.removeClass("col-12 col-md-4 col-lg-4 col-xl-4"),i.addClass("col-12 col-md-3 col-lg-3 col-xl-3")):(s.addClass("d-none"),i.removeClass("col-12 col-md-3 col-lg-3 col-xl-3"),i.addClass("col-12 col-md-4 col-lg-4 col-xl-4")),c.text("".concat(v,"h ").concat(b,"m ").concat(_,"s")),u.text("".concat(y,"h ").concat(N,"m ").concat(S,"s")),d.text(g.speakers),a.addClass("d-none"),o.removeClass("d-none")}else{var L=localStorage.getItem("previousLanguage");k=e,$("#language").val(L),$("#languageSelected").text(" ".concat(e,", ")),$("#no-data-found").removeClass("d-none"),r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}}catch(e){console.log(e)}}).catch(function(e){console.log(e)})}$(document).ready(function(){localStorage.removeItem("previousLanguage");localStorage.getItem("localeString")||f();var e=$("#proceed-box"),t=e.parent(),a=b,o=document.querySelectorAll('input[name = "gender"]'),m=$("#username"),p=document.getElementById("mother-tongue"),v=document.getElementById("age");y("");var x=localStorage.getItem("contributionLanguage");x&&g(x),$("#language").on("change",function(e){var t=e.target.value;$("#no-data-found").addClass("d-none"),y(t)}),$("#duration").on("click",function(e){var t=$("#duration").find("li.inactive"),a=$("#duration").find("li.active");t.removeClass("inactive").addClass("active"),a.removeClass("active").addClass("inactive");var r=e.target.dataset.value,o=$("#language option:selected").val();n(o,r,!0)}),$("#no-data-found").on("mouseenter touchstart",function(e){clearTimeout(r)}),$("#no-data-found").on("mouseleave touchend",function(e){r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}),$("#contribute-now").on("click",function(e){document.cookie="i18n=en",a=k}),l("speakerDetails",v,p,m),c(),s(m.val().trim(),t),d(),u(m),e.on("click",function(){var e=Array.from(o).filter(function(e){return e.checked}),t=e.length?e[0].value:"",r=m.val().trim().substring(0,12);if(_.find(function(e){return e.value===a}).data||(a=b),!i(r)){var n=document.querySelectorAll('input[name = "trans_gender"]');if("others"===t){var s=Array.from(n).filter(function(e){return e.checked});t=s.length?s[0].value:""}var l={gender:t,age:v.value,motherTongue:p.value,userName:r,language:a||localStorage.getItem("contributionLanguage")};localStorage.setItem("speakerDetails",JSON.stringify(l)),localStorage.setItem("contributionLanguage",a),location.href="/record"}}),$('input[name = "gender"]').on("change",function(){var e=document.querySelector('input[name = "gender"]:checked'),t=$("#transgender_options");"others"===e.value?(console.log(t),t.removeClass("d-none")):(console.log(t),t.addClass("d-none"))}),h()})},{"./constants":1,"./draw-chart":2,"./speakerDetails":6,"./utils":7}],4:[function(e,t,a){"use strict";function r(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return n(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return n(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}var o="topLanguagesByHours",i="topLanguagesBySpeakers",s=e("./utils"),l=s.calculateTime,d=s.formatTime,c=s.performAPIRequest,u=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}],m=void 0,h=function(e){var t,a=[].concat(u),r=$("#legendDiv"),n=Math.max.apply(Math,e.data.map(function(e){return Number(e.total_contributions)}));t=n>1?n/4:.25,a.forEach(function(t){var a=e.data.find(function(e){return t.state===e.state});if(a){var r=l(60*Number(a.total_contributions)*60,!0),n=r.hours,o=r.minutes,i=r.seconds,s=l(60*Number(a.total_validations)*60,!0),d=s.hours,c=s.minutes,u=s.seconds;t.contributed_time="".concat(n,"hrs ").concat(o,"mins ").concat(i,"sec"),t.validated_time="".concat(d,"hrs ").concat(c,"mins ").concat(u,"sec"),t.value=Number(a.total_contributions),t.total_speakers=a.total_speakers,t.id=t.id}else t.id=t.id,t.contributed_time="0 hrs",t.validated_time="0 hrs",t.value=0,t.total_speakers=0});var o=am4core.create("indiaMapChart",am4maps.MapChart),i=o.series.indexOf(m);i>-1&&o.series.removeIndex(i),o.geodataSource.url="https://vakyansh-json-data.s3.ap-south-1.amazonaws.com/india2020Low.json",o.projection=new am4maps.projections.Miller,m=new am4maps.MapPolygonSeries,o.seriesContainer.draggable=!1,o.seriesContainer.resizable=!1,o.chartContainer.wheelable=!1,o.maxZoomLevel=1,m.useGeodata=!0,m.data=a;var s=m.mapPolygons.template;s.tooltipHTML='<div style="text-align: left;"><h6>{state}</h6> <div style="text-align: left;">{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div style="text-align: left;">Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',s.nonScalingStroke=!0,s.strokeWidth=.5,s.stroke=am4core.color("#929292"),s.fill=am4core.color("#fff"),s.states.create("hover").properties.fill=o.colors.getIndex(1).brighten(-.5),m.mapPolygons.template.adapter.add("fill",function(e,a){return a.dataItem?a.dataItem.value>=3*t?am4core.color("#4061BF"):a.dataItem.value>=2*t?am4core.color("#6B85CE"):a.dataItem.value>=t?am4core.color("#92A8E8"):a.dataItem.value>0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):e}),o.series.push(m);var c=$("#quarter .legend-val"),h=$("#half .legend-val"),g=$("#threeQuarter .legend-val"),p=$("#full .legend-val"),f=l(60*t*60,!1),v=f.hours,b=f.minutes,_=l(2*t*60*60,!1),k=_.hours,x=_.minutes,C=l(3*t*60*60,!1),y=C.hours,N=C.minutes;c.text("0 - ".concat(d(v,b))),h.text("".concat(d(v,b)," - ").concat(d(k,x))),g.text("".concat(d(k,x)," - ").concat(d(y,N))),p.text("> ".concat(d(y,N))),r.removeClass("d-none").addClass("d-flex")};function g(e,t,a){var n=am4core.create("speakers_hours_chart",am4charts.XYChart);p.chart=n;var o=r(e);o="total_speakers"===t?o.sort(function(e,t){return Number(e.total_speakers)<Number(t.total_speakers)?-1:1}):o.sort(function(e,t){return Number(e.total_contributions)<Number(t.total_contributions)?-1:1}),"total_speakers"!==t&&o.forEach(function(e){var t=l(60*Number(e.total_contributions)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.total_contributions_text=d(a,r,n)}),n.data=o;var i=n.yAxes.push(new am4charts.CategoryAxis);i.dataFields.category=a,i.renderer.grid.template.location=0,i.renderer.cellStartLocation=.2,i.renderer.cellEndLocation=.8,i.renderer.grid.template.strokeWidth=0;var s=n.xAxes.push(new am4charts.ValueAxis);s.renderer.grid.template.strokeWidth=0,s.renderer.labels.template.disabled=!0,i.renderer.minGridDistance=25;var c=n.series.push(new am4charts.ColumnSeries);c.dataFields.valueX=t,c.dataFields.categoryY=a;var u=c.bullets.push(new am4charts.LabelBullet);u.label.text="total_speakers"===t?"{total_speakers}":"{total_contributions_text}",u.label.fontSize=14,u.label.horizontalCenter="left",u.label.dx=10,u.label.truncate=!1,u.label.hideOversized=!1;n.events.on("datavalidated",function(e){var t=e.target,a=t.yAxes.getIndex(0),r=35*t.data.length-a.pixelHeight,n=t.pixelHeight+r;t.svgContainer.htmlElement.style.height=n+"px"})}var p={};t.exports={generateIndiaMap:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";c(""!==e?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(t){var a=""!==e?function(e,t){var a={data:[]};return e.data.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&""!==e.state&&"anonymous"!==e.state.toLowerCase()&&a.data.push(e)}),a}(t,e):t;h(a)}).catch(function(e){console.log(e)})},showByHoursChart:function(){p.chart&&p.chart.dispose();var e=localStorage.getItem(o);g(JSON.parse(e),"total_contributions","language")},showBySpeakersChart:function(){p.chart&&p.chart.dispose();var e=localStorage.getItem(i);g(JSON.parse(e),"total_speakers","language")},getStatistics:function(e){var t=$("#speaker-data").find("#loader1, #loader2, #loader3"),a=$("#speakers-wrapper"),r=$("#speaker-value"),n=$("#hours-wrapper"),o=$("#hour-value"),i=$("#languages-wrapper"),s=$("#languages-value");t.removeClass("d-none"),n.addClass("d-none"),a.addClass("d-none"),i.addClass("d-none");var d=l(60*Number(e.total_contributions)*60),c=d.hours,u=d.minutes,m=d.seconds;o.text("".concat(c,"h ").concat(u,"m ").concat(m,"s")),r.text(e.total_speakers),s.text(e.total_languages),t.addClass("d-none"),n.removeClass("d-none"),a.removeClass("d-none"),i.removeClass("d-none")},drawMap:h}},{"./utils":7}],5:[function(e,t,a){"use strict";var r=e("./utils").updateLocaleLanguagesDropdown,n=e("./constants").ALL_LANGUAGES,o=function(e){var t=location.href.split("/"),a=t[t.length-1];i("i18n",e,1),location.href="/".concat(e,"/").concat(a)};function i(e,t,a){var r=new Date;r.setTime(r.getTime()+24*a*60*60*1e3);var n="expires="+r.toGMTString();document.cookie=e+"="+t+";"+n+";path=/"}function s(e){for(var t=e+"=",a=decodeURIComponent(document.cookie).split(";"),r=0;r<a.length;r++){for(var n=a[r];" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(t))return n.substring(t.length,n.length)}return""}t.exports={checkCookie:function(){return""!=s("i18n")},getCookie:s,setCookie:i,changeLocale:o,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var e=s("i18n"),t=location.href.split("/"),a=t[t.length-2];if($("#home-page").attr("default-lang",e),a!=e)o(e);else{var i=n.find(function(t){return t.id===e});i&&r(i.value)}}}},{"./constants":1,"./utils":7}],6:[function(e,t,a){"use strict";var r=e("./constants"),n=r.DEFAULT_CON_LANGUAGE,o=r.CONTRIBUTION_LANGUAGE,i=r.ALL_LANGUAGES;function s(e,t){var a=e.val().trim();d(a)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none"))}function l(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),r=document.querySelector('input[name = "gender"]:checked'),n=document.querySelector('input[name = "trans_gender"]:checked');r&&(r.checked=!1),n&&(n.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""}var d=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function c(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}t.exports={testUserName:d,validateUserName:s,setSpeakerDetails:function(e,t,a,r){var n=localStorage.getItem(e);if(n){var o=JSON.parse(n),i=document.querySelector('input[name = "gender"][value="'+o.gender+'"]');if(["male","female"].indexOf(o.gender)>-1)i&&(i.checked=!0,i.previous=!0);else if(""!==o.gender){var l=document.querySelector('input[name = "gender"][value="others"]');l&&(l.checked=!0,l.previous=!0);var d=document.querySelector('input[name = "trans_gender"][value="'+o.gender+'"]');d&&($("#transgender_options").removeClass("d-none"),d.checked=!0,d.previous=!0)}t.value=o.age,a.value=o.motherTongue,r.val(o.userName?o.userName.trim().substring(0,12):""),s(r,r.next())}},resetSpeakerDetails:l,setUserNameTooltip:c,setStartRecordBtnToolTipContent:function(e,t){d(e)&&t.attr("data-original-title","Please validate any error message before proceeding")},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",l),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),c(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next();e.on("input focus",function(){s(e,t),c(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(){var e=$("#proceed-box"),t=document.querySelectorAll('input[name = "gender"]'),a=document.querySelectorAll('input[name = "trans_gender"]'),r=$("#username"),s=document.getElementById("age"),l=document.getElementById("mother-tongue");e.on("click",function(){var e=Array.from(t).filter(function(e){return e.checked}),c=e.length?e[0].value:"";if("others"===c){var u=Array.from(a).filter(function(e){return e.checked});c=u.length?u[0].value:""}var m=r.val().trim().substring(0,12),h=localStorage.getItem(o);if(i.find(function(e){return e.value===h}).data||(h=n),!d(m)){var g={gender:c,age:s.value,motherTongue:l.value,userName:m,language:h};localStorage.setItem("speakerDetails",JSON.stringify(g)),localStorage.setItem(o,h),location.href="/record"}})}}},{"./constants":1}],7:[function(e,t,a){"use strict";var r=e("./constants"),n=r.HOUR_IN_SECONDS,o=r.SIXTY,i=r.ALL_LANGUAGES,s=e("./locale").getCookie;var l=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(a){a({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var r in t)if(t[r].startsWith("ip=")){a=t[r].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),a=i.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===a.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(e/n),r=e%n,i=Math.floor(r/o),s=Math.round(r%o);return t?{hours:a,minutes:i,seconds:s}:{hours:a,minutes:i}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return e>0&&(r+="".concat(e," hrs ")),t>0&&(r+="".concat(t," min ")),0===e&&0===t&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)},getLocaleString:function(){return new Promise(function(e,t){var a=s("i18n");l("/get-locale-strings/".concat(a)).then(function(t){localStorage.setItem("localeString",JSON.stringify(t)),e(t)})})},performAPIRequest:l,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")},setFooterPosition:function(){var e=$("#page-content").outerHeight();$("body").outerHeight()<=e+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")},reportSentenceOrRecording:function(e){return new Promise(function(t,a){try{fetch("/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(e){return e.json()}).then(function(e){t(e)})}catch(e){a(e)}})}}},{"./constants":1,"./locale":5}]},{},[3]);