!function e(t,a,r){function n(i,s){if(!a[i]){if(!t[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var d=a[i]={exports:{}};t[i][0].call(d.exports,function(e){var a=t[i][1][e];return n(a||e)},d,d.exports,e,t,a,r)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)n(r[i]);return n}({1:[function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach(function(t){o(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i=$(".chart-row"),s=i.find(".loader"),l=i.find(".chart"),d=(i.find('[data-toggle="popover"]'),$("body"),$("#timeline-loader")),c=$("#timeline-chart"),u={},m=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}];function h(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return e>0&&(r+="".concat(e," hrs ")),t>0&&(r+="".concat(t," min ")),0===e&&0===t&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)}function p(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=3600*e,r=Math.floor(a/3600),n=a%3600,o=Math.floor(n/60),i=parseInt(n%60);return t?{hours:r,minutes:o,seconds:i}:{hours:r,minutes:o}}function g(e,t){var a=[];return e.forEach(function(e){var r=e[t]?e:n(n({},e),{},o({},t,"Anonymous")),i=a.findIndex(function(e){return r[t].toLowerCase()===e[t].toLowerCase()});i>=0?(a[i].contributions+=r.contributions,a[i].speakers+=r.speakers):a.push(r)}),a}var f=function(e){var t=[];return["male","female","anonymous","others"].forEach(function(a){e.data.forEach(function(e){e.gender||(e.gender="anonymous"),a===e.gender&&t.push(n(n({},e),{},{gender:e.gender.charAt(0).toUpperCase()+e.gender.slice(1)}))})}),t};var v=function(e){u[e]&&(u[e].dispose(),delete u[e])},b=function(e,t){fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){d.hide().removeClass("d-flex"),c.removeClass("d-none"),I(e)}).catch(function(e){console.log(e)})},_=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};function k(e,t){Promise.all([fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)),fetch("/contributions/gender?language=".concat(e)),fetch("/contributions/age?language=".concat(e))]).then(function(e){return Promise.all(e.map(function(e){return e.json()}))}).then(function(t){try{s.hide().removeClass("d-flex"),l.removeClass("d-none");var a=f(t[1]),r=g(t[2].data,"age_group").sort(function(e,t){return Number(e.speakers)-Number(t.speakers)});I(t[0]),y(a),N(e),x(r),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),s.show().addClass("d-flex"),l.addClass("d-none")}}).catch(function(e){console.log(e)})}var C=["#85A8F9","#B7D0FE","#316AFF","#294691"],x=function(e){var t=am4core.create("age-group-chart",am4charts.PieChart3D);t.data=e.slice(0,3).concat({age_group:"Others",speakers:e.slice(3).reduce(function(e,t){return e+Number(t.speakers)},0)}),t.paddingBottom=50,t.innerRadius=am4core.percent(40),t.depth=50,t.legend=new am4charts.Legend,t.legend.labels.template.fill=am4core.color("#000"),t.legend.valueLabels.template.fill=am4core.color("#000"),t.legend.labels.template.textDecoration="none",t.legend.valueLabels.template.textDecoration="none",t.legend.itemContainers.template.paddingTop=5,t.legend.itemContainers.template.paddingBottom=5,t.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.align="right",t.legend.valueLabels.template.textAlign="start",t.legend.itemContainers.template.paddingLeft=20,t.legend.itemContainers.template.paddingRight=20;var a=t.series.push(new am4charts.PieSeries3D);a.labels.template.disabled=!0,a.ticks.template.disabled=!0,a.calculatePercent=!0,a.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",a.dataFields.value="speakers",a.dataFields.depthValue="speakers",a.dataFields.category="age_group",a.slices.template.adapter.add("fill",function(e,t){return C[t.dataItem.index]}),u["age-group-chart"]=t},y=function(e){am4core.ready(function(){var t=am4core.create("gender-chart",am4charts.XYChart);e.forEach(function(e){var t=p(Number(e.hours_contributed),!0),a=t.hours,r=t.minutes,n=t.seconds;e.contributedHours=h(a,r,n)}),t.data=e;var a=t.xAxes.push(new am4charts.CategoryAxis);a.dataFields.category="gender",a.renderer.minGridDistance=20,a.renderer.labels.template.fill="#000",a.renderer.grid.template.disabled=!0,a.renderer.labels.template.fontSize=12,a.renderer.grid.template.location=0;var r=t.yAxes.push(new am4charts.ValueAxis);r.min=0,r.renderer.labels.template.fill="#000",r.renderer.grid.template.strokeDasharray="3,3",r.renderer.labels.template.fontSize=12,r.title.text="Number of hours",r.title.fontSize=12;var n=t.series.push(new am4charts.ColumnSeries);n.dataFields.valueY="hours_contributed",n.dataFields.categoryX="gender";var o=n.columns.template;o.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{gender}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left;">Speakers: <label>{speakers}</label></div>\n            </div>',o.adapter.add("fill",function(e,t){return C[C.length-1-t.dataItem.index]}),o.adapter.add("stroke",function(e,t){return C[C.length-1-t.dataItem.index]}),u["gender-chart"]=t})},I=function(e){am4core.ready(function(){am4core.useTheme(am4themes_animated);for(var t=am4core.create("timeline-chart",am4charts.XYChart),a=e.data,r=0;r<a.length;r++){a[r].month||(a[r].month=3*a[r].quarter),a[r].duration=new Date(a[r].year,a[r].month-1,1),a[r].year=String(a[r].year);var n=p(Number(a[r].cumulative_contributions),!0),o=n.hours,i=n.minutes,s=n.seconds,l=p(Number(a[r].cumulative_validations),!0),d=l.hours,c=l.minutes,m=l.seconds;a[r].contributedHours="".concat(o,"hrs ").concat(i,"mins ").concat(s,"secs"),a[r].validatedHours="".concat(d,"hrs ").concat(c,"mins ").concat(m,"secs")}t.data=a;var h=t.xAxes.push(new am4charts.DateAxis);h.renderer.minGridDistance=10,h.renderer.grid.template.disabled=!0,h.renderer.baseGrid.disabled=!1,h.renderer.labels.template.fill="#000",h.title.text="Time",h.renderer.labels.template.fontSize=12,h.title.fontSize=12;var g=t.yAxes.push(new am4charts.ValueAxis);g.min=0,g.renderer.minGridDistance=50,g.renderer.grid.template.strokeDasharray="3,3",g.renderer.labels.template.fill="#000",g.title.text="Number of hours",g.renderer.labels.template.fontSize=12,g.title.fontSize=12;var f=t.series.push(new am4charts.LineSeries);f.dataFields.dateX="duration",f.dataFields.valueY="cumulative_contributions",f.strokeWidth=3,f.tensionX=.8,f.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>\n            </div>',f.tooltip.getFillFromObject=!1,f.tooltip.autoTextColor=!1,f.tooltip.background.fill=am4core.color("#F1F1F2"),f.tooltip.label.fill=am4core.color("#000000"),f.sequencedInterpolation=!0,f.stroke=am4core.color("#FCC232"),f.name="Recorded";var v=t.series.push(new am4charts.LineSeries);(v.dataFields.dateX="duration",v.dataFields.valueY="cumulative_validations",v.sequencedInterpolation=!0,v.tensionX=.8,v.strokeWidth=3,v.stroke=am4core.color("#83E661"),v.name="Validated",1===a.length)&&(f.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#FCC232"),v.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#83E661"));t.legend=new am4charts.Legend,t.legend.labels.template.fontSize=12,t.cursor=new am4charts.XYCursor,t.cursor.xAxis=h,u["timeline-chart"]=t})};function N(e){var t=!!e;_(e?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(a){!function(e){var t,a=$("#legendDiv"),r=Math.max.apply(Math,e.data.map(function(e){return Number(e.total_contributions)}));t=r>1?r/4:.25,m.forEach(function(t){var a=e.data.find(function(e){return t.state===e.state});if(a){var r=p(Number(a.total_contributions),!0),n=r.hours,o=r.minutes,i=r.seconds,s=p(Number(a.total_validations),!0),l=s.hours,d=s.minutes,c=s.seconds;t.contributed_time="".concat(n,"hrs ").concat(o,"mins ").concat(i,"sec"),t.validated_time="".concat(l,"hrs ").concat(d,"mins ").concat(c,"sec"),t.value=Number(a.total_contributions),t.total_speakers=a.total_speakers,t.id=t.id}else t.id=t.id});var n=am4core.create("indiaMapChart",am4maps.MapChart);n.geodataSource.url="https://cdn.amcharts.com/lib/4/geodata/json/india2020Low.json",n.projection=new am4maps.projections.Miller;var o=new am4maps.MapPolygonSeries;n.seriesContainer.draggable=!1,n.seriesContainer.resizable=!1,n.chartContainer.wheelable=!1,n.maxZoomLevel=1,o.useGeodata=!0,o.data=m;var i=o.mapPolygons.template;i.tooltipHTML='<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',i.nonScalingStroke=!0,i.strokeWidth=.5,i.fill=am4core.color("#fff"),i.states.create("hover").properties.fill=n.colors.getIndex(1).brighten(-.5),o.mapPolygons.template.adapter.add("fill",function(e,a){return a.dataItem?a.dataItem.value>=3*t?am4core.color("#4061BF"):a.dataItem.value>=2*t?am4core.color("#6B85CE"):a.dataItem.value>=t?am4core.color("#92A8E8"):a.dataItem.value>=0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):e}),n.series.push(o);var s=$("#quarter .legend-val"),l=$("#half .legend-val"),d=$("#threeQuarter .legend-val"),c=$("#full .legend-val"),u=p(t,!0),g=u.hours,f=u.minutes,v=u.seconds,b=p(2*t,!0),_=b.hours,k=b.minutes,C=b.seconds,x=p(3*t,!0),y=x.hours,I=x.minutes,N=x.seconds;s.text("0 - ".concat(h(g,f,v))),l.text("".concat(h(g,f,v)," - ").concat(h(_,k,C))),d.text("".concat(h(_,k,C)," - ").concat(h(y,I,N))),c.text("> ".concat(h(y,I,N))),a.removeClass("d-none").addClass("d-flex")}(t?function(e,t){var a={data:[]};return e.data.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&""!==e.state&&"anonymous"!==e.state.toLowerCase()&&a.data.push(e)}),a}(a,e):a)}).catch(function(e){console.log(e)})}t.exports={updateGraph:function(e,t,a){a?(v("timeline-chart"),d.show().addClass("d-flex"),c.addClass("d-none"),b(e,t)):(am4core.disposeAllCharts(),s.show().addClass("d-flex"),l.addClass("d-none"),d.addClass("d-none"),k(e,t))},buildGraphs:k,getOrderedGenderData:function(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(a){e.forEach(function(e){if(a.toLowerCase()===e.gender.toLowerCase()){var r=t.findIndex(function(e){return a.toLowerCase()===e.gender.toLowerCase()});-1===r?t.push(e):t[r].count+=e.count}})}),t},getGenderData:f,getAgeGroupData:g,calculateTime:p,generateIndiaMap:N}},{}],2:[function(e,t,a){"use strict";var r,n=e("./draw-chart"),o=n.updateGraph,i=n.calculateTime,s=e("./speakerDetails"),l=s.testUserName,d=s.setStartRecordBtnToolTipContent,c=e("./utils").toggleFooterPosition,u="",m=function(e){return fetch(e?"/aggregate-data-count?byLanguage=true":"/aggregate-data-count").then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})},h=function(e,t){localStorage.setItem("previousLanguage",t);var a={languages:0,speakers:0,contributions:0,validations:0};if(t){var r=e.filter(function(e){return e.language.toLowerCase()===t.toLowerCase()});a.speakers=parseInt(r[0].total_speakers),a.contributions=parseFloat(r[0].total_contributions),a.validations=parseFloat(r[0].total_validations)}else console.log(e),a.languages=parseInt(e[0].total_languages),a.speakers=parseInt(e[0].total_speakers),a.contributions=parseFloat(e[0].total_contributions),a.validations=parseFloat(e[0].total_validations);return a};function p(e){var t=$("#speaker-data"),a=t.find("#loader1"),n=t.find("#contribution-details"),s=t.find(".contribution-data"),l=$("#languages-wrapper"),d=$("#languages-value"),c=$("#speaker-value"),p=$("#contributed-value"),g=$("#validated-value"),f=$("#duration").find(".active")[0].dataset.value;m(e).then(function(t){try{var m=function(e,t){var a=!1;return!t||(e.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&(a=!0)}),a)}(t.data,e);if(t.last_updated_at?($("#data-updated").text(" ".concat(t.last_updated_at)),$("#data-updated").removeClass("d-none")):$("#data-updated").addClass("d-none"),m){a.removeClass("d-none"),l.addClass("d-none"),n.addClass("d-none"),o(e,f);var v=h(t.data,e),b=i(v.contributions.toFixed(3)),_=b.hours,k=b.minutes,C=b.seconds,x=i(v.validations.toFixed(3)),y=x.hours,I=x.minutes,N=x.seconds;v.languages?(d.text(v.languages),l.removeClass("d-none"),s.removeClass("col-12 col-md-4 col-lg-4 col-xl-4"),s.addClass("col-12 col-md-3 col-lg-3 col-xl-3")):(l.addClass("d-none"),s.removeClass("col-12 col-md-3 col-lg-3 col-xl-3"),s.addClass("col-12 col-md-4 col-lg-4 col-xl-4")),p.text("".concat(_,"h ").concat(k,"m ").concat(C,"s")),g.text("".concat(y,"h ").concat(I,"m ").concat(N,"s")),c.text(v.speakers),a.addClass("d-none"),n.removeClass("d-none")}else{var w=localStorage.getItem("previousLanguage");u=e,$("#language").val(w),$("#languageSelected").text(" ".concat(e,", ")),$("#no-data-found").removeClass("d-none"),r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}}catch(e){console.log(e)}}).catch(function(e){console.log(e)})}$(document).ready(function(){localStorage.removeItem("previousLanguage");var e=$("#proceed-box"),t=e.parent(),a=$("#tnc"),n=document.querySelectorAll('input[name = "gender"]'),i=$("#username"),s=document.getElementById("mother-tongue"),m=document.getElementById("age");p(""),$("#language").on("change",function(e){p(e.target.value)}),$("#duration").on("click",function(e){var t=$("#duration").find("li.inactive"),a=$("#duration").find("li.active");t.removeClass("inactive").addClass("active"),a.removeClass("active").addClass("inactive");var r=e.target.dataset.value,n=$("#language option:selected").val();o(n,r,!0)}),$("#no-data-found").on("mouseenter touchstart",function(e){clearTimeout(r)}),$("#no-data-found").on("mouseleave touchend",function(e){r=setTimeout(function(){$("#no-data-found").addClass("d-none")},5e3)}),$("#contribute-now").on("click",function(e){localStorage.setItem("contributionLanguage",u)}),a.change(function(){var a=i.val().trim();this.checked&&!l(a)?(e.removeAttr("disabled").removeClass("point-none"),t.tooltip("disable")):(d(a,t),e.prop("disabled","true").addClass("point-none"),t.tooltip("enable"))}),e.on("click",function(){if(a.prop("checked")){var e=Array.from(n).filter(function(e){return e.checked}),t=e.length?e[0].value:"",r=i.val().trim().substring(0,12);if("English"===u&&(u="Odia"),l(r))return;var o={gender:t,age:m.value,motherTongue:s.value,userName:r,language:u};localStorage.setItem("speakerDetails",JSON.stringify(o)),location.href="/record"}}),c()})},{"./draw-chart":1,"./speakerDetails":3,"./utils":4}],3:[function(e,t,a){"use strict";function r(e,t,a){var r=e.val().trim();n(r)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none")),a.trigger("change")}var n=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};t.exports={testUserName:n,validateUserName:r,setSpeakerDetails:function(e,t,a,n){var o=localStorage.getItem(e);if(o){var i=JSON.parse(o),s=document.querySelector('input[name = "gender"][value="'+i.gender+'"]');s&&(s.checked=!0,s.previous=!0),t.value=i.age,a.value=i.motherTongue,n.val(i.userName?i.userName.trim().substring(0,12):""),r(n,n.next(),$("#tnc"))}},resetSpeakerDetails:function(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),r=document.querySelector('input[name = "gender"]:checked');r&&(r.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""},setUserNameTooltip:function(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))},setStartRecordBtnToolTipContent:function(e,t){n(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")}}},{}],4:[function(e,t,a){"use strict";t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var r in t)if(t[r].startsWith("ip=")){a=t[r].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})}}},{}]},{},[2]);