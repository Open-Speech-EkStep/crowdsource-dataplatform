!function t(e,a,r){function s(i,n){if(!a[i]){if(!e[i]){var l="function"==typeof require&&require;if(!n&&l)return l(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var d=a[i]={exports:{}};e[i][0].call(d.exports,function(t){var a=e[i][1][t];return s(a||t)},d,d.exports,t,e,a,r)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)s(r[i]);return s}({1:[function(t,e,a){"use strict";function r(t){return function(t){if(Array.isArray(t))return s(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return s(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);"Object"===a&&t.constructor&&(a=t.constructor.name);if("Map"===a||"Set"===a)return Array.from(t);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return s(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=new Array(e);a<e;a++)r[a]=t[a];return r}var o="topLanguagesByHours",i="topLanguagesBySpeakers",n=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r="";return t>0&&(r+="".concat(t," hrs ")),e>0&&(r+="".concat(e," min ")),0===t&&0===e&&a>0&&(r+="".concat(a," sec ")),r.substr(0,r.length-1)},l=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(t/3600),r=t%3600,s=Math.floor(r/60),o=Math.round(r%60);return e?{hours:a,minutes:s,seconds:o}:{hours:a,minutes:s}},d=function(t){return fetch(t).then(function(t){if(t.ok)return Promise.resolve(t.json());throw Error(t.statusText||"HTTP error")})},c=[{state:"Telangana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Andaman and Nicobar Islands",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Andhra Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Arunanchal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Assam",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Bihar",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Chhattisgarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Daman & Diu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Goa",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Gujarat",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Haryana",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Himachal Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Jammu & Kashmir",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Jharkhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Karnataka",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Kerala",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Lakshadweep",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Madhya Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Maharashtra",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Manipur",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Chandigarh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Puducherry",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Punjab",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Rajasthan",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Sikkim",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Tamil Nadu",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Tripura",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Uttar Pradesh",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Uttarakhand",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"West Bengal",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Odisha",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Dadara & Nagar Havelli",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Meghalaya",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Mizoram",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"Nagaland",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0},{state:"National Capital Territory of Delhi",contributed_time:"0 hrs",validated_time:"0 hrs",total_speakers:0}];function u(t,e,a){var s=am4core.create("speakers_hours_chart",am4charts.XYChart);h.chart=s;var o=r(t);o="total_speakers"===e?o.sort(function(t,e){return Number(t.total_speakers)<Number(e.total_speakers)?-1:1}):o.sort(function(t,e){return Number(t.total_contributions)<Number(e.total_contributions)?-1:1}),"total_speakers"!==e&&o.forEach(function(t){var e=l(60*Number(t.total_contributions)*60,!0),a=e.hours,r=e.minutes,s=e.seconds;t.total_contributions_text=n(a,r,s)}),s.data=o;var i=s.yAxes.push(new am4charts.CategoryAxis);i.dataFields.category=a,i.renderer.grid.template.location=0,i.renderer.cellStartLocation=.2,i.renderer.cellEndLocation=.8,i.renderer.grid.template.strokeWidth=0;var d=s.xAxes.push(new am4charts.ValueAxis);d.renderer.grid.template.strokeWidth=0,d.renderer.labels.template.disabled=!0,i.renderer.minGridDistance=25;var c=s.series.push(new am4charts.ColumnSeries);c.dataFields.valueX=e,c.dataFields.categoryY=a;var u=c.bullets.push(new am4charts.LabelBullet);u.label.text="total_speakers"===e?"{total_speakers}":"{total_contributions_text}",u.label.fontSize=14,u.label.horizontalCenter="left",u.label.dx=10,u.label.truncate=!1,u.label.hideOversized=!1;s.events.on("datavalidated",function(t){var e=t.target,a=e.yAxes.getIndex(0),r=35*e.data.length-a.pixelHeight,s=e.pixelHeight+r;e.svgContainer.htmlElement.style.height=s+"px"})}var h={};e.exports={generateIndiaMap:function(){d("/aggregate-data-count?byState=true").then(function(t){!function(t){var e,a=$("#legendDiv"),r=Math.max.apply(Math,t.data.map(function(t){return Number(t.total_contributions)}));e=r>1?r/4:.25,c.forEach(function(e){var a=t.data.find(function(t){return e.state===t.state});if(a){var r=l(60*Number(a.total_contributions)*60,!0),s=r.hours,o=r.minutes,i=r.seconds,n=l(60*Number(a.total_validations)*60,!0),d=n.hours,c=n.minutes,u=n.seconds;e.contributed_time="".concat(s,"hrs ").concat(o,"mins ").concat(i,"sec"),e.validated_time="".concat(d,"hrs ").concat(c,"mins ").concat(u,"sec"),e.value=Number(a.total_contributions),e.total_speakers=a.total_speakers,e.id=e.state}else e.id=e.state});var s=am4core.create("indiaMapChart",am4maps.MapChart);s.geodataSource.url="./js/states_india_geo.json",s.projection=new am4maps.projections.Miller;var o=new am4maps.MapPolygonSeries;s.seriesContainer.draggable=!1,s.seriesContainer.resizable=!1,s.chartContainer.wheelable=!1,s.maxZoomLevel=1,o.useGeodata=!0,o.data=c;var i=o.mapPolygons.template;i.tooltipHTML='<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>',i.nonScalingStroke=!0,i.strokeWidth=.5,i.fill=am4core.color("#fff"),i.states.create("hover").properties.fill=s.colors.getIndex(1).brighten(-.5),o.mapPolygons.template.adapter.add("fill",function(t,a){return a.dataItem?a.dataItem.value>=3*e?am4core.color("#4061BF"):a.dataItem.value>=2*e?am4core.color("#6B85CE"):a.dataItem.value>=e?am4core.color("#92A8E8"):a.dataItem.value>=0?am4core.color("#CDD8F6"):am4core.color("#E9E9E9"):t}),s.series.push(o);var d=$("#quarter .legend-val"),u=$("#half .legend-val"),h=$("#threeQuarter .legend-val"),m=$("#full .legend-val"),_=l(60*e*60,!1),p=_.hours,v=_.minutes,b=l(2*e*60*60,!1),g=b.hours,f=b.minutes,k=l(3*e*60*60,!1),y=k.hours,x=k.minutes;d.text("0 - ".concat(n(p,v))),u.text("".concat(n(p,v)," - ").concat(n(g,f))),h.text("".concat(n(g,f)," - ").concat(n(y,x))),m.text("> ".concat(n(y,x))),a.removeClass("d-none").addClass("d-flex")}(t)}).catch(function(t){console.log(t)})},showByHoursChart:function(){h.chart&&h.chart.dispose();var t=localStorage.getItem(o);t?u(JSON.parse(t).data,"total_contributions","language"):d("/top-languages-by-hours").then(function(t){localStorage.setItem(o,JSON.stringify(t)),u(t.data,"total_contributions","language")})},showBySpeakersChart:function(){h.chart&&h.chart.dispose();var t=localStorage.getItem(i);t?u(JSON.parse(t).data,"total_speakers","language"):d("/top-languages-by-speakers").then(function(t){localStorage.setItem(i,JSON.stringify(t)),u(t.data,"total_speakers","language")})},getStatistics:function(){var t=$("#speaker-data").find("#loader1, #loader2, #loader3"),e=$("#speakers-wrapper"),a=$("#speaker-value"),r=$("#hours-wrapper"),s=$("#hour-value"),o=$("#languages-wrapper"),i=$("#languages-value");t.removeClass("d-none"),r.addClass("d-none"),e.addClass("d-none"),o.addClass("d-none"),d("/aggregate-data-count").then(function(n){try{var d=l(60*Number(n.data[0].total_contributions)*60),c=d.hours,u=d.minutes,h=d.seconds;s.text("".concat(c,"h ").concat(u,"m ").concat(h,"s")),a.text(n.data[0].total_speakers),i.text(n.data[0].total_languages),t.addClass("d-none"),r.removeClass("d-none"),e.removeClass("d-none"),o.removeClass("d-none")}catch(t){console.log(t)}}).catch(function(t){console.log(t)})},calculateTime:l,formatTime:n}},{}]},{},[1]);