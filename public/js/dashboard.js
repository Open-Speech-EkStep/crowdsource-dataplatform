!function e(t,a,r){function n(s,i){if(!a[s]){if(!t[s]){var l="function"==typeof require&&require;if(!i&&l)return l(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var d=a[s]={exports:{}};t[s][0].call(d.exports,function(e){var a=t[s][1][e];return n(a||e)},d,d.exports,e,t,a,r)}return a[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)n(r[s]);return n}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach(function(t){o(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var s=e("./home-page-charts").generateIndiaMap,i=e("./utils"),l=i.calculateTime,d=i.formatTime,c=$(".chart-row"),u=c.find(".loader"),m=c.find(".chart"),h=$("#timeline-loader"),g=$("#timeline-chart"),p={};function f(e,t){var a=[];return e.forEach(function(e){var r=e[t]?e:n(n({},e),{},o({},t,"Anonymous")),s=a.findIndex(function(e){return r[t].toLowerCase()===e[t].toLowerCase()});s>=0?(a[s].contributions+=r.contributions,a[s].speakers+=r.speakers):a.push(r)}),a}var v=function(e){var t=[];return["male","female","anonymous","others"].forEach(function(a){e.data.forEach(function(e){e.gender||(e.gender="anonymous"),a===e.gender&&t.push(n(n({},e),{},{gender:e.gender.charAt(0).toUpperCase()+e.gender.slice(1)}))})}),t};var b=function(e){p[e]&&(p[e].dispose(),delete p[e])},_=function(e,t){fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){h.hide().removeClass("d-flex"),g.removeClass("d-none"),y(e)}).catch(function(e){console.log(e)})};function k(e,t){Promise.all([fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)),fetch("/contributions/gender?language=".concat(e)),fetch("/contributions/age?language=".concat(e))]).then(function(e){return Promise.all(e.map(function(e){return e.json()}))}).then(function(t){try{u.hide().removeClass("d-flex"),m.removeClass("d-none");var a=v(t[1]),r=f(t[2].data,"age_group").sort(function(e,t){return Number(e.speakers)-Number(t.speakers)});y(t[0]),N(a),s(e),x(r),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),u.show().addClass("d-flex"),m.addClass("d-none")}}).catch(function(e){console.log(e)})}var C=["#85A8F9","#B7D0FE","#316AFF","#294691"],x=function(e){var t=am4core.create("age-group-chart",am4charts.PieChart3D);t.data=e.slice(0,3).concat({age_group:"Others",speakers:e.slice(3).reduce(function(e,t){return e+Number(t.speakers)},0)}),t.paddingBottom=50,t.innerRadius=am4core.percent(40),t.depth=50,t.legend=new am4charts.Legend,t.legend.labels.template.fill=am4core.color("#000"),t.legend.valueLabels.template.fill=am4core.color("#000"),t.legend.labels.template.textDecoration="none",t.legend.valueLabels.template.textDecoration="none",t.legend.itemContainers.template.paddingTop=5,t.legend.itemContainers.template.paddingBottom=5,t.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.align="right",t.legend.valueLabels.template.textAlign="start",t.legend.itemContainers.template.paddingLeft=20,t.legend.itemContainers.template.paddingRight=20;var a=t.series.push(new am4charts.PieSeries3D);a.labels.template.disabled=!0,a.ticks.template.disabled=!0,a.calculatePercent=!0,a.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",a.dataFields.value="speakers",a.dataFields.depthValue="speakers",a.dataFields.category="age_group",a.slices.template.adapter.add("fill",function(e,t){return C[t.dataItem.index]}),p["age-group-chart"]=t},N=function(e){am4core.ready(function(){var t=am4core.create("gender-chart",am4charts.XYChart);e.forEach(function(e){var t=l(60*Number(e.hours_contributed)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.contributedHours=d(a,r,n)}),t.data=e;var a=t.xAxes.push(new am4charts.CategoryAxis);a.dataFields.category="gender",a.renderer.minGridDistance=20,a.renderer.labels.template.fill="#000",a.renderer.grid.template.disabled=!0,a.renderer.labels.template.fontSize=12,a.renderer.grid.template.location=0;var r=t.yAxes.push(new am4charts.ValueAxis);r.min=0,r.renderer.labels.template.fill="#000",r.renderer.grid.template.strokeDasharray="3,3",r.renderer.labels.template.fontSize=12,r.title.text="Number of hours",r.title.fontSize=12;var n=t.series.push(new am4charts.ColumnSeries);n.dataFields.valueY="hours_contributed",n.dataFields.categoryX="gender";var o=n.columns.template;o.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{gender}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left;">Speakers: <label>{speakers}</label></div>\n            </div>',o.adapter.add("fill",function(e,t){return C[C.length-1-t.dataItem.index]}),o.adapter.add("stroke",function(e,t){return C[C.length-1-t.dataItem.index]}),p["gender-chart"]=t})},y=function(e){am4core.ready(function(){am4core.useTheme(am4themes_animated);for(var t=am4core.create("timeline-chart",am4charts.XYChart),a=e.data,r=0;r<a.length;r++){a[r].month||(a[r].month=3*a[r].quarter),a[r].duration=new Date(a[r].year,a[r].month-1,1),a[r].year=String(a[r].year);var n=l(60*Number(a[r].cumulative_contributions)*60,!0),o=n.hours,s=n.minutes,i=n.seconds,d=l(60*Number(a[r].cumulative_validations)*60,!0),c=d.hours,u=d.minutes,m=d.seconds;a[r].contributedHours="".concat(o,"hrs ").concat(s,"mins ").concat(i,"secs"),a[r].validatedHours="".concat(c,"hrs ").concat(u,"mins ").concat(m,"secs")}t.data=a;var h=t.xAxes.push(new am4charts.DateAxis);h.renderer.minGridDistance=10,h.renderer.grid.template.disabled=!0,h.renderer.baseGrid.disabled=!1,h.renderer.labels.template.fill="#000",h.title.text="Time",h.renderer.labels.template.fontSize=12,h.title.fontSize=12;var g=t.yAxes.push(new am4charts.ValueAxis);g.min=0,g.renderer.minGridDistance=50,g.renderer.grid.template.strokeDasharray="3,3",g.renderer.labels.template.fill="#000",g.title.text="Number of hours",g.renderer.labels.template.fontSize=12,g.title.fontSize=12;var f=t.series.push(new am4charts.LineSeries);f.dataFields.dateX="duration",f.dataFields.valueY="cumulative_contributions",f.strokeWidth=3,f.tensionX=.8,f.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>\n            </div>',f.tooltip.getFillFromObject=!1,f.tooltip.autoTextColor=!1,f.tooltip.background.fill=am4core.color("#F1F1F2"),f.tooltip.label.fill=am4core.color("#000000"),f.sequencedInterpolation=!0,f.stroke=am4core.color("#FCC232"),f.name="Recorded";var v=t.series.push(new am4charts.LineSeries);(v.dataFields.dateX="duration",v.dataFields.valueY="cumulative_validations",v.sequencedInterpolation=!0,v.tensionX=.8,v.strokeWidth=3,v.stroke=am4core.color("#83E661"),v.name="Validated",1===a.length)&&(f.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#FCC232"),v.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#83E661"));t.legend=new am4charts.Legend,t.legend.labels.template.fontSize=12,t.cursor=new am4charts.XYCursor,t.cursor.xAxis=h,p["timeline-chart"]=t})};t.exports={updateGraph:function(e,t,a){a?(b("timeline-chart"),h.show().addClass("d-flex"),g.addClass("d-none"),_(e,t)):(am4core.disposeAllCharts(),u.show().addClass("d-flex"),m.addClass("d-none"),h.addClass("d-none"),k(e,t))},buildGraphs:k,getOrderedGenderData:function(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(a){e.forEach(function(e){if(a.toLowerCase()===e.gender.toLowerCase()){var r=t.findIndex(function(e){return a.toLowerCase()===e.gender.toLowerCase()});-1===r?t.push(e):t[r].count+=e.count}})}),t},getGenderData:v,getAgeGroupData:f}},{"./home-page-charts":4,"./utils":6}],3:[function(e,t,a){"use strict";var r,n=e("./draw-chart").updateGraph,o=e("./speakerDetails"),s=o.testUserName,i=o.setStartRecordBtnToolTipContent,l=o.setSpeakerDetails,d=e("./utils"),c=d.toggleFooterPosition,u=d.updateLocaleLanguagesDropdown,m=d.calculateTime,h=d.getLocaleString,g=e("./constants").DEFAULT_CON_LANGUAGE,p="",f=function(e){return fetch(e?"/aggregate-data-count?byLanguage=true":"/aggregate-data-count").then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})},v=function(e,t){localStorage.setItem("previousLanguage",t);var a={languages:0,speakers:0,contributions:0,validations:0};if(t){var r=e.filter(function(e){return e.language.toLowerCase()===t.toLowerCase()});a.speakers=parseInt(r[0].total_speakers),a.contributions=parseFloat(r[0].total_contributions),a.validations=parseFloat(r[0].total_validations)}else a.languages=parseInt(e[0].total_languages),a.speakers=parseInt(e[0].total_speakers),a.contributions=parseFloat(e[0].total_contributions),a.validations=parseFloat(e[0].total_validations);return a};function b(e){var t=$("#speaker-data"),a=t.find("#loader1"),o=t.find("#contribution-details"),s=t.find(".contribution-data"),i=$("#languages-wrapper"),l=$("#languages-value"),d=$("#speaker-value"),c=$("#contributed-value"),u=$("#validated-value"),h=$("#duration").find(".active")[0].dataset.value;f(e).then(function(t){try{var g=function(e,t){var a=!1;return!t||(e.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&(a=!0)}),a)}(t.data,e);if(t.last_updated_at?($("#data-updated").text(" ".concat(t.last_updated_at)),$("#data-updated").removeClass("d-none")):$("#data-updated").addClass("d-none"),g){a.removeClass("d-none"),i.addClass("d-none"),o.addClass("d-none"),n(e,h);var f=v(t.data,e),b=m(60*f.contributions.toFixed(3)*60),_=b.hours,k=b.minutes,C=b.seconds,x=m(60*f.validations.toFixed(3)*60),N=x.hours,y=x.minutes,I=x.seconds;f.languages?(l.text(f.languages),i.removeClass("d-none"),s.removeClass("col-12 col-md-4 col-lg-4 col-xl-4"),s.addClass("col-12 col-md-3 col-lg-3 col-xl-3")):(i.addClass("d-none"),s.removeClass("col-12 col-md-3 col-lg-3 col-xl-3"),s.addClass("col-12 col-md-4 col-lg-4 col-xl-4")),c.text("".concat(_,"h ").concat(k,"m ").concat(C,"s")),u.text("".concat(N,"h ").concat(y,"m ").concat(I,"s")),d.text(f.speakers),a.addClass("d-none"),o.removeClass("d-none")}else{var S=localStorage.getItem("previousLanguage");p=e,$("#language").val(S),$("#languageSelected").text(" ".concat(e,", ")),$("#no-data-found").removeClass("d-none"),r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}}catch(e){console.log(e)}}).catch(function(e){console.log(e)})}$(document).ready(function(){localStorage.removeItem("previousLanguage"),localStorage.getItem("localeString")||h();var e=$("#proceed-box"),t=e.parent(),a=$("#tnc"),o=document.querySelectorAll('input[name = "gender"]'),d=$("#username"),m=document.getElementById("mother-tongue"),f=document.getElementById("age");b("");var v=localStorage.getItem("contributionLanguage");v&&u(v),$("#language").on("change",function(e){b(e.target.value)}),$("#duration").on("click",function(e){var t=$("#duration").find("li.inactive"),a=$("#duration").find("li.active");t.removeClass("inactive").addClass("active"),a.removeClass("active").addClass("inactive");var r=e.target.dataset.value,o=$("#language option:selected").val();n(o,r,!0)}),$("#no-data-found").on("mouseenter touchstart",function(e){clearTimeout(r)}),$("#no-data-found").on("mouseleave touchend",function(e){r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}),$("#contribute-now").on("click",function(e){localStorage.setItem("contributionLanguage",p)}),a.change(function(){var a=d.val().trim();this.checked&&!s(a)?(e.removeAttr("disabled").removeClass("point-none"),t.tooltip("disable")):(i(a,t),e.prop("disabled","true").addClass("point-none"),t.tooltip("enable"))}),l("speakerDetails",f,m,d),e.on("click",function(){if(a.prop("checked")){var e=Array.from(o).filter(function(e){return e.checked}),t=e.length?e[0].value:"",r=d.val().trim().substring(0,12);if("English"===p&&(p=g),s(r))return;var n={gender:t,age:f.value,motherTongue:m.value,userName:r,language:p||localStorage.getItem("contributionLanguage")};localStorage.setItem("speakerDetails",JSON.stringify(n)),location.href="/record"}}),c()})},{"./constants":1,"./draw-chart":2,"./speakerDetails":5,"./utils":6}],4:[function(e,t,a){"use strict";function r(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return n(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return n(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}var o="topLanguagesByHours",s="topLanguagesBySpeakers",i=e("./utils"),l=i.calculateTime,d=i.formatTime,c=i.performAPIRequest,u=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}],m=void 0,h=function(e){var t,a=[].concat(u),r=$("#legendDiv"),n=Math.max.apply(Math,e.data.map(function(e){return Number(e.total_contributions)}));t=n>1?n/4:.25,a.forEach(function(t){var a=e.data.find(function(e){return t.state===e.state});if(a){var r=l(60*Number(a.total_contributions)*60,!0),n=r.hours,o=r.minutes,s=r.seconds,i=l(60*Number(a.total_validations)*60,!0),d=i.hours,c=i.minutes,u=i.seconds;t.contributed_time="".concat(n,"hrs ").concat(o,"mins ").concat(s,"sec"),t.validated_time="".concat(d,"hrs ").concat(c,"mins ").concat(u,"sec"),t.value=Number(a.total_contributions),t.total_speakers=a.total_speakers,t.id=t.id}else t.id=t.id,t.contributed_time="0 hrs",t.validated_time="0 hrs",t.value=0,t.total_speakers=0});var o=am4core.create("indiaMapChart",am4maps.MapChart),s=o.series.indexOf(m);s>-1&&o.series.removeIndex(s),o.geodataSource.url="https://cdn.amcharts.com/lib/4/geodata/json/india2020Low.json",o.projection=new am4maps.projections.Miller,m=new am4maps.MapPolygonSeries,o.seriesContainer.draggable=!1,o.seriesContainer.resizable=!1,o.chartContainer.wheelable=!1,o.maxZoomLevel=1,m.useGeodata=!0,m.data=a;var i=m.mapPolygons.template;i.tooltipHTML='<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',i.nonScalingStroke=!0,i.strokeWidth=.5,i.fill=am4core.color("#fff"),i.states.create("hover").properties.fill=o.colors.getIndex(1).brighten(-.5),m.mapPolygons.template.adapter.add("fill",function(e,a){return a.dataItem?a.dataItem.value>=3*t?am4core.color("#4061BF"):a.dataItem.value>=2*t?am4core.color("#6B85CE"):a.dataItem.value>=t?am4core.color("#92A8E8"):a.dataItem.value>0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):e}),o.series.push(m);var c=$("#quarter .legend-val"),h=$("#half .legend-val"),g=$("#threeQuarter .legend-val"),p=$("#full .legend-val"),f=l(60*t*60,!1),v=f.hours,b=f.minutes,_=l(2*t*60*60,!1),k=_.hours,C=_.minutes,x=l(3*t*60*60,!1),N=x.hours,y=x.minutes;c.text("0 - ".concat(d(v,b))),h.text("".concat(d(v,b)," - ").concat(d(k,C))),g.text("".concat(d(k,C)," - ").concat(d(N,y))),p.text("> ".concat(d(N,y))),r.removeClass("d-none").addClass("d-flex")};function g(e,t,a){var n=am4core.create("speakers_hours_chart",am4charts.XYChart);p.chart=n;var o=r(e);o="total_speakers"===t?o.sort(function(e,t){return Number(e.total_speakers)<Number(t.total_speakers)?-1:1}):o.sort(function(e,t){return Number(e.total_contributions)<Number(t.total_contributions)?-1:1}),"total_speakers"!==t&&o.forEach(function(e){var t=l(60*Number(e.total_contributions)*60,!0),a=t.hours,r=t.minutes,n=t.seconds;e.total_contributions_text=d(a,r,n)}),n.data=o;var s=n.yAxes.push(new am4charts.CategoryAxis);s.dataFields.category=a,s.renderer.grid.template.location=0,s.renderer.cellStartLocation=.2,s.renderer.cellEndLocation=.8,s.renderer.grid.template.strokeWidth=0;var i=n.xAxes.push(new am4charts.ValueAxis);i.renderer.grid.template.strokeWidth=0,i.renderer.labels.template.disabled=!0,s.renderer.minGridDistance=25;var c=n.series.push(new am4charts.ColumnSeries);c.dataFields.valueX=t,c.dataFields.categoryY=a;var u=c.bullets.push(new am4charts.LabelBullet);u.label.text="total_speakers"===t?"{total_speakers}":"{total_contributions_text}",u.label.fontSize=14,u.label.horizontalCenter="left",u.label.dx=10,u.label.truncate=!1,u.label.hideOversized=!1;n.events.on("datavalidated",function(e){var t=e.target,a=t.yAxes.getIndex(0),r=35*t.data.length-a.pixelHeight,n=t.pixelHeight+r;t.svgContainer.htmlElement.style.height=n+"px"})}var p={};t.exports={generateIndiaMap:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";c(""!==e?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(t){var a=""!==e?function(e,t){var a={data:[]};return e.data.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&""!==e.state&&"anonymous"!==e.state.toLowerCase()&&a.data.push(e)}),a}(t,e):t;h(a)}).catch(function(e){console.log(e)})},showByHoursChart:function(){p.chart&&p.chart.dispose();var e=localStorage.getItem(o);g(JSON.parse(e),"total_contributions","language")},showBySpeakersChart:function(){p.chart&&p.chart.dispose();var e=localStorage.getItem(s);g(JSON.parse(e),"total_speakers","language")},getStatistics:function(e){var t=$("#speaker-data").find("#loader1, #loader2, #loader3"),a=$("#speakers-wrapper"),r=$("#speaker-value"),n=$("#hours-wrapper"),o=$("#hour-value"),s=$("#languages-wrapper"),i=$("#languages-value");t.removeClass("d-none"),n.addClass("d-none"),a.addClass("d-none"),s.addClass("d-none");var d=l(60*Number(e.total_contributions)*60),c=d.hours,u=d.minutes,m=d.seconds;o.text("".concat(c,"h ").concat(u,"m ").concat(m,"s")),r.text(e.total_speakers),i.text(e.total_languages),t.addClass("d-none"),n.removeClass("d-none"),a.removeClass("d-none"),s.removeClass("d-none")},drawMap:h}},{"./utils":6}],5:[function(e,t,a){"use strict";var r=e("./constants"),n=r.DEFAULT_CON_LANGUAGE,o=r.CONTRIBUTION_LANGUAGE;function s(e,t,a){var r=e.val().trim();l(r)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none")),a.trigger("change")}function i(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),r=document.querySelector('input[name = "gender"]:checked');r&&(r.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""}var l=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function d(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}var c=function(e,t){l(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")};t.exports={testUserName:l,validateUserName:s,setSpeakerDetails:function(e,t,a,r){var n=localStorage.getItem(e);if(n){var o=JSON.parse(n),i=document.querySelector('input[name = "gender"][value="'+o.gender+'"]');i&&(i.checked=!0,i.previous=!0),t.value=o.age,a.value=o.motherTongue,r.val(o.userName?o.userName.trim().substring(0,12):""),s(r,r.next(),$("#tnc"))}},resetSpeakerDetails:i,setUserNameTooltip:d,setStartRecordBtnToolTipContent:c,setTNCOnChange:function(e,t){var a=$("#tnc"),r=$("#proceed-box");a.change(function(){var a=e.val().trim();this.checked&&!l(a)?(r.removeAttr("disabled").removeClass("point-none"),t.tooltip("disable")):(c(a,t),r.prop("disabled","true").addClass("point-none"),t.tooltip("enable"))})},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",i),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),d(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next(),a=$("#tnc");e.on("input focus",function(){s(e,t,a),d(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(e){var t=$("#proceed-box"),a=$("#tnc"),r=document.querySelectorAll('input[name = "gender"]'),s=$("#username"),i=document.getElementById("age"),d=document.getElementById("mother-tongue");t.on("click",function(){if(a.prop("checked")){var t=Array.from(r).filter(function(e){return e.checked}),c=t.length?t[0].value:"",u=s.val().trim().substring(0,12);if("English"===e&&(e=n),l(u))return;var m={gender:c,age:i.value,motherTongue:d.value,userName:u,language:e||localStorage.getItem(o)};localStorage.setItem("speakerDetails",JSON.stringify(m)),location.href="/record"}})}}},{"./constants":1}],6:[function(e,t,a){"use strict";var r=e("./constants"),n=r.HOUR_IN_SECONDS,o=r.SIXTY,s=r.ALL_LANGUAGES;var i=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(a,r){a({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var r in t)if(t[r].startsWith("ip=")){a=t[r].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),a=s.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===a.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(e/n),r=e%n,s=Math.floor(r/o),i=Math.round(r%o);return t?{hours:a,minutes:s,seconds:i}:{hours:a,minutes:s}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return e>0&&(r+="".concat(e," hrs ")),t>0&&(r+="".concat(t," min ")),0===e&&0===t&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)},getLocaleString:function(){i("/get-locale-strings").then(function(e){localStorage.setItem("localeString",JSON.stringify(e))})},performAPIRequest:i,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")}}},{"./constants":1}]},{},[3]);
