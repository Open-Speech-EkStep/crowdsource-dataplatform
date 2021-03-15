!function e(t,a,r){function n(o,s){if(!a[o]){if(!t[o]){var l="function"==typeof require&&require;if(!s&&l)return l(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var d=a[o]={exports:{}};t[o][0].call(d.exports,function(e){var a=t[o][1][e];return n(a||e)},d,d.exports,e,t,a,r)}return a[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)n(r[o]);return n}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0},{value:"Dogri",id:"doi",text:"Dogri",hasLocaleText:!1,data:!0},{value:"Maithili",id:"mai",text:"Maithili",hasLocaleText:!1,data:!0},{value:"Urdu",id:"ur",text:"Urdu",hasLocaleText:!0,data:!1},{value:"Konkani Roman",id:"kr",text:"Konkani Roman",hasLocaleText:!0,data:!1},{value:"Konkani DV",id:"kd",text:"Konkani DV",hasLocaleText:!1,data:!1},{value:"Manipuri BN",id:"mnibn",text:"Manipuri BN",hasLocaleText:!1,data:!1},{value:"Manipuri MM",id:"mnimm",text:"Manipuri MM",hasLocaleText:!1,data:!1},{value:"Santali OL",id:"satol",text:"Santali OL",hasLocaleText:!1,data:!1},{value:"Santali DV",id:"satdv",text:"Santali DV",hasLocaleText:!1,data:!1},{value:"Sanskrit",id:"sa",text:"Sanskrit",hasLocaleText:!0,data:!1}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach(function(t){i(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var o=e("./home-page-charts").generateIndiaMap,s=e("./utils"),l=s.calculateTime,d=s.formatTime,c=$(".chart-row"),u=c.find(".loader"),h=c.find(".chart"),m=$("#timeline-loader"),p=$("#timeline-chart"),g={};function f(e,t){var a=[];return e.forEach(function(e){var r=e[t]?e:n(n({},e),{},i({},t,"Anonymous")),o=a.findIndex(function(e){return r[t].toLowerCase()===e[t].toLowerCase()});o>=0?(a[o].contributions+=r.contributions,a[o].speakers+=r.speakers):a.push(r)}),a}var v=function(e){var t=[];return["male","female","anonymous","others"].forEach(function(a){e.data.forEach(function(e){e.gender||(e.gender="anonymous"),a===e.gender&&t.push(n(n({},e),{},{gender:e.gender.charAt(0).toUpperCase()+e.gender.slice(1)}))})}),t};var b=function(e){g[e]&&(g[e].dispose(),delete g[e])},_=function(e,t){fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){m.hide().removeClass("d-flex"),p.removeClass("d-none"),y(e)}).catch(function(e){console.log(e)})};function x(e,t){Promise.all([fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)),fetch("/contributions/gender?language=".concat(e)),fetch("/contributions/age?language=".concat(e))]).then(function(e){return Promise.all(e.map(function(e){return e.json()}))}).then(function(t){try{u.hide().removeClass("d-flex"),h.removeClass("d-none");var a=v(t[1]),r=f(t[2].data,"age_group").sort(function(e,t){return Number(e.speakers)-Number(t.speakers)});y(t[0]),L(a),o(e),k(r),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),u.show().addClass("d-flex"),h.addClass("d-none")}}).catch(function(e){console.log(e)})}var k=function(e){var t=["#85A8F9","#B7D0FE","#6C85CE","#316AFF","#294691"],a=am4core.create("age-group-chart",am4charts.PieChart3D);a.data=e,a.paddingBottom=50,a.innerRadius=am4core.percent(40),a.depth=50,a.legend=new am4charts.Legend,a.legend.labels.template.fill=am4core.color("#000"),a.legend.valueLabels.template.fill=am4core.color("#000"),a.legend.labels.template.textDecoration="none",a.legend.valueLabels.template.textDecoration="none",a.legend.itemContainers.template.paddingTop=5,a.legend.itemContainers.template.paddingBottom=5,a.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",a.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",a.legend.valueLabels.template.align="right",a.legend.valueLabels.template.textAlign="start",a.legend.itemContainers.template.paddingLeft=20,a.legend.itemContainers.template.paddingRight=20;var r=a.series.push(new am4charts.PieSeries3D);r.labels.template.disabled=!0,r.ticks.template.disabled=!0,r.calculatePercent=!0,r.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",r.dataFields.value="speakers",r.dataFields.depthValue="speakers",r.dataFields.category="age_group",r.slices.template.adapter.add("fill",function(e,a){return t[a.dataItem.index]}),g["age-group-chart"]=a},L=function(e){var t=["#85A8F9","#B7D0FE","#316AFF","#294691"];am4core.ready(function(){var a=am4core.create("gender-chart",am4charts.XYChart);e.forEach(function(e){var t=l(60*Number(e.hours_contributed)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.contributedHours=d(a,r,n)}),a.data=e;var r=a.xAxes.push(new am4charts.CategoryAxis);r.dataFields.category="gender",r.renderer.minGridDistance=20,r.renderer.labels.template.fill="#000",r.renderer.grid.template.disabled=!0,r.renderer.labels.template.fontSize=12,r.renderer.grid.template.location=0;var n=a.yAxes.push(new am4charts.ValueAxis);n.min=0,n.renderer.labels.template.fill="#000",n.renderer.grid.template.strokeDasharray="3,3",n.renderer.labels.template.fontSize=12,n.title.text="Number of hours",n.title.fontSize=12;var i=a.series.push(new am4charts.ColumnSeries);i.dataFields.valueY="hours_contributed",i.dataFields.categoryX="gender";var o=i.columns.template;o.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{gender}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left;">Speakers: <label>{speakers}</label></div>\n            </div>',o.adapter.add("fill",function(e,a){return t[t.length-1-a.dataItem.index]}),o.adapter.add("stroke",function(e,a){return t[t.length-1-a.dataItem.index]}),g["gender-chart"]=a})},y=function(e){am4core.ready(function(){am4core.useTheme(am4themes_animated);for(var t=am4core.create("timeline-chart",am4charts.XYChart),a=e.data,r=0;r<a.length;r++){a[r].month||(a[r].month=3*a[r].quarter),a[r].duration=new Date(a[r].year,a[r].month-1,1),a[r].year=String(a[r].year);var n=l(60*Number(a[r].cumulative_contributions)*60,!0),i=n.hours,o=n.minutes,s=n.seconds,d=l(60*Number(a[r].cumulative_validations)*60,!0),c=d.hours,u=d.minutes,h=d.seconds;a[r].contributedHours="".concat(i,"hrs ").concat(o,"mins ").concat(s,"secs"),a[r].validatedHours="".concat(c,"hrs ").concat(u,"mins ").concat(h,"secs")}t.data=a;var m=t.xAxes.push(new am4charts.DateAxis);m.renderer.minGridDistance=10,m.renderer.grid.template.disabled=!0,m.renderer.baseGrid.disabled=!1,m.renderer.labels.template.fill="#000",m.title.text="Time",m.renderer.labels.template.fontSize=12,m.title.fontSize=12;var p=t.yAxes.push(new am4charts.ValueAxis);p.min=0,p.renderer.minGridDistance=50,p.renderer.grid.template.strokeDasharray="3,3",p.renderer.labels.template.fill="#000",p.title.text="Number of hours",p.renderer.labels.template.fontSize=12,p.title.fontSize=12;var f=t.series.push(new am4charts.LineSeries);f.dataFields.dateX="duration",f.dataFields.valueY="cumulative_contributions",f.strokeWidth=3,f.tensionX=.8,f.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>\n            </div>',f.tooltip.getFillFromObject=!1,f.tooltip.autoTextColor=!1,f.tooltip.background.fill=am4core.color("#F1F1F2"),f.tooltip.label.fill=am4core.color("#000000"),f.sequencedInterpolation=!0,f.stroke=am4core.color("#FCC232"),f.name="Recorded";var v=t.series.push(new am4charts.LineSeries);(v.dataFields.dateX="duration",v.dataFields.valueY="cumulative_validations",v.sequencedInterpolation=!0,v.tensionX=.8,v.strokeWidth=3,v.stroke=am4core.color("#83E661"),v.name="Validated",1===a.length)&&(f.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#FCC232"),v.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#83E661"));t.legend=new am4charts.Legend,t.legend.labels.template.fontSize=12,t.cursor=new am4charts.XYCursor,t.cursor.xAxis=m,g["timeline-chart"]=t})};t.exports={updateGraph:function(e,t,a){a?(b("timeline-chart"),m.show().addClass("d-flex"),p.addClass("d-none"),_(e,t)):(am4core.disposeAllCharts(),u.show().addClass("d-flex"),h.addClass("d-none"),m.addClass("d-none"),x(e,t))},buildGraphs:x,getOrderedGenderData:function(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(a){e.forEach(function(e){if(a.toLowerCase()===e.gender.toLowerCase()){var r=t.findIndex(function(e){return a.toLowerCase()===e.gender.toLowerCase()});-1===r?t.push(e):t[r].count+=e.count}})}),t},getGenderData:v,getAgeGroupData:f}},{"./home-page-charts":3,"./utils":4}],3:[function(e,t,a){"use strict";function r(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return n(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return n(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}var i="topLanguagesByHours",o="topLanguagesBySpeakers",s=e("./utils"),l=s.calculateTime,d=s.formatTime,c=s.performAPIRequest,u=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}],h=void 0,m=function(e){var t,a=[].concat(u),r=$("#legendDiv"),n=Math.max.apply(Math,e.data.map(function(e){return Number(e.total_contributions)}));t=n>1?n/4:.25,a.forEach(function(t){var a=e.data.find(function(e){return t.state===e.state});if(a){var r=l(60*Number(a.total_contributions)*60,!0),n=r.hours,i=r.minutes,o=r.seconds,s=l(60*Number(a.total_validations)*60,!0),d=s.hours,c=s.minutes,u=s.seconds;t.contributed_time="".concat(n,"hrs ").concat(i,"mins ").concat(o,"sec"),t.validated_time="".concat(d,"hrs ").concat(c,"mins ").concat(u,"sec"),t.value=Number(a.total_contributions),t.total_speakers=a.total_speakers,t.id=t.id}else t.id=t.id,t.contributed_time="0 hrs",t.validated_time="0 hrs",t.value=0,t.total_speakers=0});var i=am4core.create("indiaMapChart",am4maps.MapChart),o=i.series.indexOf(h);o>-1&&i.series.removeIndex(o),i.geodataSource.url="https://cdn.amcharts.com/lib/4/geodata/json/india2020Low.json",i.projection=new am4maps.projections.Miller,h=new am4maps.MapPolygonSeries,i.seriesContainer.draggable=!1,i.seriesContainer.resizable=!1,i.chartContainer.wheelable=!1,i.maxZoomLevel=1,h.useGeodata=!0,h.data=a;var s=h.mapPolygons.template;s.tooltipHTML='<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',s.nonScalingStroke=!0,s.strokeWidth=.5,s.stroke=am4core.color("#929292"),s.fill=am4core.color("#fff"),s.states.create("hover").properties.fill=i.colors.getIndex(1).brighten(-.5),h.mapPolygons.template.adapter.add("fill",function(e,a){return a.dataItem?a.dataItem.value>=3*t?am4core.color("#4061BF"):a.dataItem.value>=2*t?am4core.color("#6B85CE"):a.dataItem.value>=t?am4core.color("#92A8E8"):a.dataItem.value>0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):e}),i.series.push(h);var c=$("#quarter .legend-val"),m=$("#half .legend-val"),p=$("#threeQuarter .legend-val"),g=$("#full .legend-val"),f=l(60*t*60,!1),v=f.hours,b=f.minutes,_=l(2*t*60*60,!1),x=_.hours,k=_.minutes,L=l(3*t*60*60,!1),y=L.hours,C=L.minutes;c.text("0 - ".concat(d(v,b))),m.text("".concat(d(v,b)," - ").concat(d(x,k))),p.text("".concat(d(x,k)," - ").concat(d(y,C))),g.text("> ".concat(d(y,C))),r.removeClass("d-none").addClass("d-flex")};function p(e,t,a){var n=am4core.create("speakers_hours_chart",am4charts.XYChart);g.chart=n;var i=r(e);i="total_speakers"===t?i.sort(function(e,t){return Number(e.total_speakers)<Number(t.total_speakers)?-1:1}):i.sort(function(e,t){return Number(e.total_contributions)<Number(t.total_contributions)?-1:1}),"total_speakers"!==t&&i.forEach(function(e){var t=l(60*Number(e.total_contributions)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.total_contributions_text=d(a,r,n)}),n.data=i;var o=n.yAxes.push(new am4charts.CategoryAxis);o.dataFields.category=a,o.renderer.grid.template.location=0,o.renderer.cellStartLocation=.2,o.renderer.cellEndLocation=.8,o.renderer.grid.template.strokeWidth=0;var s=n.xAxes.push(new am4charts.ValueAxis);s.renderer.grid.template.strokeWidth=0,s.renderer.labels.template.disabled=!0,o.renderer.minGridDistance=25;var c=n.series.push(new am4charts.ColumnSeries);c.dataFields.valueX=t,c.dataFields.categoryY=a;var u=c.bullets.push(new am4charts.LabelBullet);u.label.text="total_speakers"===t?"{total_speakers}":"{total_contributions_text}",u.label.fontSize=14,u.label.horizontalCenter="left",u.label.dx=10,u.label.truncate=!1,u.label.hideOversized=!1;n.events.on("datavalidated",function(e){var t=e.target,a=t.yAxes.getIndex(0),r=35*t.data.length-a.pixelHeight,n=t.pixelHeight+r;t.svgContainer.htmlElement.style.height=n+"px"})}var g={};t.exports={generateIndiaMap:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";c(""!==e?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(t){var a=""!==e?function(e,t){var a={data:[]};return e.data.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&""!==e.state&&"anonymous"!==e.state.toLowerCase()&&a.data.push(e)}),a}(t,e):t;m(a)}).catch(function(e){console.log(e)})},showByHoursChart:function(){g.chart&&g.chart.dispose();var e=localStorage.getItem(i);p(JSON.parse(e),"total_contributions","language")},showBySpeakersChart:function(){g.chart&&g.chart.dispose();var e=localStorage.getItem(o);p(JSON.parse(e),"total_speakers","language")},getStatistics:function(e){var t=$("#speaker-data").find("#loader1, #loader2, #loader3"),a=$("#speakers-wrapper"),r=$("#speaker-value"),n=$("#hours-wrapper"),i=$("#hour-value"),o=$("#languages-wrapper"),s=$("#languages-value");t.removeClass("d-none"),n.addClass("d-none"),a.addClass("d-none"),o.addClass("d-none");var d=l(60*Number(e.total_contributions)*60),c=d.hours,u=d.minutes,h=d.seconds;i.text("".concat(c,"h ").concat(u,"m ").concat(h,"s")),r.text(e.total_speakers),s.text(e.total_languages),t.addClass("d-none"),n.removeClass("d-none"),a.removeClass("d-none"),o.removeClass("d-none")},drawMap:m}},{"./utils":4}],4:[function(e,t,a){"use strict";var r=e("./constants"),n=r.HOUR_IN_SECONDS,i=r.SIXTY,o=r.ALL_LANGUAGES;var s=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var r in t)if(t[r].startsWith("ip=")){a=t[r].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),a=o.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===a.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(e/n),r=e%n,o=Math.floor(r/i),s=Math.round(r%i);return t?{hours:a,minutes:o,seconds:s}:{hours:a,minutes:o}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return e>0&&(r+="".concat(e," hrs ")),t>0&&(r+="".concat(t," min ")),0===e&&0===t&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)},getLocaleString:function(){s("/get-locale-strings").then(function(e){localStorage.setItem("localeString",JSON.stringify(e))})},performAPIRequest:s,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")}}},{"./constants":1}]},{},[2]);
