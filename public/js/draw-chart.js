!function e(t,a,r){function i(s,o){if(!a[s]){if(!t[s]){var l="function"==typeof require&&require;if(!o&&l)return l(s,!0);if(n)return n(s,!0);throw new Error("Cannot find module '"+s+"'")}var d=a[s]={exports:{}};t[s][0].call(d.exports,function(e){var a=t[s][1][e];return i(a||e)},d,d.exports,e,t,a,r)}return a[s].exports}for(var n="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach(function(t){n(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var s=$(".chart-row"),o=s.find(".loader"),l=s.find(".chart"),d=(s.find('[data-toggle="popover"]'),$("body"),$("#timeline-loader")),c=$("#timeline-chart"),u={},m=[{id:"IN-TG",state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AN",state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AP",state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AR",state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-AS",state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-BR",state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CT",state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GA",state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-GJ",state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HR",state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-HP",state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JK",state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-JH",state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KA",state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-KL",state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LD",state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MP",state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MH",state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MN",state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-CH",state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PY",state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-PB",state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-RJ",state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-SK",state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TN",state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-TR",state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UP",state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-UT",state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-WB",state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-OR",state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DNDD",state:"Dadra and Nagar Haveli and Daman and Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-ML",state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-MZ",state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-NL",state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-DL",state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{id:"IN-LK",state:"Ladakh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}];function h(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return e>0&&(r+="".concat(e," hrs ")),t>0&&(r+="".concat(t," min ")),0===e&&0===t&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)}function p(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=3600*e,r=Math.floor(a/3600),i=a%3600,n=Math.floor(i/60),s=parseInt(i%60);return t?{hours:r,minutes:n,seconds:s}:{hours:r,minutes:n}}function f(e,t){var a=[];return e.forEach(function(e){var r=e[t]?e:i(i({},e),{},n({},t,"Anonymous")),s=a.findIndex(function(e){return r[t].toLowerCase()===e[t].toLowerCase()});s>=0?(a[s].contributions+=r.contributions,a[s].speakers+=r.speakers):a.push(r)}),a}var b=function(e){var t=[];return["male","female","anonymous","others"].forEach(function(a){e.data.forEach(function(e){e.gender||(e.gender="anonymous"),a===e.gender&&t.push(i(i({},e),{},{gender:e.gender.charAt(0).toUpperCase()+e.gender.slice(1)}))})}),t};var g=function(e){u[e]&&(u[e].dispose(),delete u[e])},v=function(e,t){fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){d.hide().removeClass("d-flex"),c.removeClass("d-none"),x(e)}).catch(function(e){console.log(e)})},_=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};function k(e,t){Promise.all([fetch("/timeline?language=".concat(e,"&timeframe=").concat(t)),fetch("/contributions/gender?language=".concat(e)),fetch("/contributions/age?language=".concat(e))]).then(function(e){return Promise.all(e.map(function(e){return e.json()}))}).then(function(t){try{o.hide().removeClass("d-flex"),l.removeClass("d-none");var a=b(t[1]),r=f(t[2].data,"age_group").sort(function(e,t){return Number(e.speakers)-Number(t.speakers)});x(t[0]),C(a),I(e),N(r),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),o.show().addClass("d-flex"),l.addClass("d-none")}}).catch(function(e){console.log(e)})}var y=["#85A8F9","#B7D0FE","#316AFF","#294691"],N=function(e){var t=am4core.create("age-group-chart",am4charts.PieChart3D);t.data=e.slice(0,3).concat({age_group:"Others",speakers:e.slice(3).reduce(function(e,t){return e+Number(t.speakers)},0)}),t.paddingBottom=50,t.innerRadius=am4core.percent(40),t.depth=50,t.legend=new am4charts.Legend,t.legend.labels.template.fill=am4core.color("#000"),t.legend.valueLabels.template.fill=am4core.color("#000"),t.legend.labels.template.textDecoration="none",t.legend.valueLabels.template.textDecoration="none",t.legend.itemContainers.template.paddingTop=5,t.legend.itemContainers.template.paddingBottom=5,t.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.align="right",t.legend.valueLabels.template.textAlign="start",t.legend.itemContainers.template.paddingLeft=20,t.legend.itemContainers.template.paddingRight=20;var a=t.series.push(new am4charts.PieSeries3D);a.labels.template.disabled=!0,a.ticks.template.disabled=!0,a.calculatePercent=!0,a.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",a.dataFields.value="speakers",a.dataFields.depthValue="speakers",a.dataFields.category="age_group",a.slices.template.adapter.add("fill",function(e,t){return y[t.dataItem.index]}),u["age-group-chart"]=t},C=function(e){am4core.ready(function(){var t=am4core.create("gender-chart",am4charts.XYChart);e.forEach(function(e){var t=p(Number(e.hours_contributed),!0),a=t.hours,r=t.minutes,i=t.seconds;e.contributedHours=h(a,r,i)}),t.data=e;var a=t.xAxes.push(new am4charts.CategoryAxis);a.dataFields.category="gender",a.renderer.minGridDistance=20,a.renderer.labels.template.fill="#000",a.renderer.grid.template.disabled=!0,a.renderer.labels.template.fontSize=12,a.renderer.grid.template.location=0;var r=t.yAxes.push(new am4charts.ValueAxis);r.min=0,r.renderer.labels.template.fill="#000",r.renderer.grid.template.strokeDasharray="3,3",r.renderer.labels.template.fontSize=12,r.title.text="Number of hours",r.title.fontSize=12;var i=t.series.push(new am4charts.ColumnSeries);i.dataFields.valueY="hours_contributed",i.dataFields.categoryX="gender";var n=i.columns.template;n.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{gender}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left;">Speakers: <label>{speakers}</label></div>\n            </div>',n.adapter.add("fill",function(e,t){return y[y.length-1-t.dataItem.index]}),n.adapter.add("stroke",function(e,t){return y[y.length-1-t.dataItem.index]}),u["gender-chart"]=t})},x=function(e){am4core.ready(function(){am4core.useTheme(am4themes_animated);for(var t=am4core.create("timeline-chart",am4charts.XYChart),a=e.data,r=0;r<a.length;r++){a[r].month||(a[r].month=3*a[r].quarter),a[r].duration=new Date(a[r].year,a[r].month-1,1),a[r].year=String(a[r].year);var i=p(Number(a[r].cumulative_contributions),!0),n=i.hours,s=i.minutes,o=i.seconds,l=p(Number(a[r].cumulative_validations),!0),d=l.hours,c=l.minutes,m=l.seconds;a[r].contributedHours="".concat(n,"hrs ").concat(s,"mins ").concat(o,"secs"),a[r].validatedHours="".concat(d,"hrs ").concat(c,"mins ").concat(m,"secs")}t.data=a;var h=t.xAxes.push(new am4charts.DateAxis);h.renderer.minGridDistance=10,h.renderer.grid.template.disabled=!0,h.renderer.baseGrid.disabled=!1,h.renderer.labels.template.fill="#000",h.title.text="Time",h.renderer.labels.template.fontSize=12,h.title.fontSize=12;var f=t.yAxes.push(new am4charts.ValueAxis);f.min=0,f.renderer.minGridDistance=50,f.renderer.grid.template.strokeDasharray="3,3",f.renderer.labels.template.fill="#000",f.title.text="Number of hours",f.renderer.labels.template.fontSize=12,f.title.fontSize=12;var b=t.series.push(new am4charts.LineSeries);b.dataFields.dateX="duration",b.dataFields.valueY="cumulative_contributions",b.strokeWidth=3,b.tensionX=.8,b.tooltipHTML='\n            <div>\n                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>\n                <div>Contributed: <label>{contributedHours}</label></div>\n                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>\n            </div>',b.tooltip.getFillFromObject=!1,b.tooltip.autoTextColor=!1,b.tooltip.background.fill=am4core.color("#F1F1F2"),b.tooltip.label.fill=am4core.color("#000000"),b.sequencedInterpolation=!0,b.stroke=am4core.color("#FCC232"),b.name="Recorded";var g=t.series.push(new am4charts.LineSeries);(g.dataFields.dateX="duration",g.dataFields.valueY="cumulative_validations",g.sequencedInterpolation=!0,g.tensionX=.8,g.strokeWidth=3,g.stroke=am4core.color("#83E661"),g.name="Validated",1===a.length)&&(b.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#FCC232"),g.bullets.push(new am4charts.CircleBullet).circle.fill=am4core.color("#83E661"));t.legend=new am4charts.Legend,t.legend.labels.template.fontSize=12,t.cursor=new am4charts.XYCursor,t.cursor.xAxis=h,u["timeline-chart"]=t})};function I(e){var t=!!e;_(e?"/aggregate-data-count?byState=true&byLanguage=true":"/aggregate-data-count?byState=true").then(function(a){!function(e){var t,a=$("#legendDiv"),r=Math.max.apply(Math,e.data.map(function(e){return Number(e.total_contributions)}));t=r>1?r/4:.25,m.forEach(function(t){var a=e.data.find(function(e){return t.state===e.state});if(a){var r=p(Number(a.total_contributions),!0),i=r.hours,n=r.minutes,s=r.seconds,o=p(Number(a.total_validations),!0),l=o.hours,d=o.minutes,c=o.seconds;t.contributed_time="".concat(i,"hrs ").concat(n,"mins ").concat(s,"sec"),t.validated_time="".concat(l,"hrs ").concat(d,"mins ").concat(c,"sec"),t.value=Number(a.total_contributions),t.total_speakers=a.total_speakers,t.id=t.id}else t.id=t.id});var i=am4core.create("indiaMapChart",am4maps.MapChart);i.geodataSource.url="https://cdn.amcharts.com/lib/4/geodata/json/india2020Low.json",i.projection=new am4maps.projections.Miller;var n=new am4maps.MapPolygonSeries;i.seriesContainer.draggable=!1,i.seriesContainer.resizable=!1,i.chartContainer.wheelable=!1,i.maxZoomLevel=1,n.useGeodata=!0,n.data=m;var s=n.mapPolygons.template;s.tooltipHTML='<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',s.nonScalingStroke=!0,s.strokeWidth=.5,s.fill=am4core.color("#fff"),s.states.create("hover").properties.fill=i.colors.getIndex(1).brighten(-.5),n.mapPolygons.template.adapter.add("fill",function(e,a){return a.dataItem?a.dataItem.value>=3*t?am4core.color("#4061BF"):a.dataItem.value>=2*t?am4core.color("#6B85CE"):a.dataItem.value>=t?am4core.color("#92A8E8"):a.dataItem.value>=0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):e}),i.series.push(n);var o=$("#quarter .legend-val"),l=$("#half .legend-val"),d=$("#threeQuarter .legend-val"),c=$("#full .legend-val"),u=p(t,!0),f=u.hours,b=u.minutes,g=u.seconds,v=p(2*t,!0),_=v.hours,k=v.minutes,y=v.seconds,N=p(3*t,!0),C=N.hours,x=N.minutes,I=N.seconds;o.text("0 - ".concat(h(f,b,g))),l.text("".concat(h(f,b,g)," - ").concat(h(_,k,y))),d.text("".concat(h(_,k,y)," - ").concat(h(C,x,I))),c.text("> ".concat(h(C,x,I))),a.removeClass("d-none").addClass("d-flex")}(t?function(e,t){var a={data:[]};return e.data.forEach(function(e){e.language.toLowerCase()===t.toLowerCase()&&""!==e.state&&"anonymous"!==e.state.toLowerCase()&&a.data.push(e)}),a}(a,e):a)}).catch(function(e){console.log(e)})}t.exports={updateGraph:function(e,t,a){a?(g("timeline-chart"),d.show().addClass("d-flex"),c.addClass("d-none"),v(e,t)):(am4core.disposeAllCharts(),o.show().addClass("d-flex"),l.addClass("d-none"),d.addClass("d-none"),k(e,t))},buildGraphs:k,getOrderedGenderData:function(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(a){e.forEach(function(e){if(a.toLowerCase()===e.gender.toLowerCase()){var r=t.findIndex(function(e){return a.toLowerCase()===e.gender.toLowerCase()});-1===r?t.push(e):t[r].count+=e.count}})}),t},getGenderData:b,getAgeGroupData:f,calculateTime:p,generateIndiaMap:I}},{}]},{},[1]);