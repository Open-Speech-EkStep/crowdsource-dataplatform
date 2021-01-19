!function e(t,r,n){function a(i,l){if(!r[i]){if(!t[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var d=r[i]={exports:{}};t[i][0].call(d.exports,function(e){var r=t[i][1][e];return a(r||e)},d,d.exports,e,t,r,n)}return r[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)a(n[i]);return a}({1:[function(e,t,r){"use strict";function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach(function(t){o(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var i=$("#chart-row"),l=i.find(".loader"),c=i.find(".chart"),d=i.find('[data-toggle="popover"]'),s=$("body");function u(e){var t=[];return["Female","Male","Others","Anonymous"].forEach(function(r){e.forEach(function(e){r===e.gender&&t.push(e)})}),t}function p(e,t){return'<div class="'.concat(t,'">')+'<table class="table table-sm table-borderless mb-0"><tbody>'+e.join("")+"</tbody></table></div>"}function m(e,t){var r=e.length,n=Math.ceil(r/2),a=f(e.slice(0,n),t),o=f(e.slice(n,r),t);return'<div class="row">'+p(a,"col-6")+p(o,"col-6")+"</div>"}function f(e,t){return e.map(function(e){return"<tr><td>".concat(e[t],"</td><td>").concat(e.count,"</td></tr>")})}function g(e,t){var r=f(e,t);return'<div class="row">'.concat(p(r,"col"),"</div>")}function h(e,t){return e.map(function(e){var r;return e[t]?e:(o(r={},t,"Anonymous"),o(r,"count",e.count),r)})}function v(e){$.fn.popover.Constructor.Default.whiteList.table=[],$.fn.popover.Constructor.Default.whiteList.tbody=[],$.fn.popover.Constructor.Default.whiteList.tr=[],$.fn.popover.Constructor.Default.whiteList.td=[],fetch("/getAllInfo/".concat(e)).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(e){try{l.hide().removeClass("d-flex"),c.removeClass("d-none");var t=h(e.ageGroups,"ageGroup").sort(function(e,t){return Number(e.count)-Number(t.count)});x(t);var r=e.motherTongues.reduce(function(e,t){return e+Number(t.count)},0),n=h(e.motherTongues,"motherTongue").sort(function(e,t){return Number(t.count)-Number(e.count)});C(n.slice(0,4),r,"mother-tongue-chart",!0),C(n,r,"modal-chart");var o=e.genderData.map(function(e){return e.gender?a(a({},e),{},{gender:e.gender.charAt(0).toUpperCase()+e.gender.slice(1)}):{gender:"Anonymous",count:e.count}}),i=u(o);w(i),b(d.eq(0),m(n,"motherTongue")),b(d.eq(1),m(t,"ageGroup")),b(d.eq(2),g(o,"gender")),innerWidth<992&&$("#modal-chart-wrapper").find(".modal-dialog").addClass("w-90"),setTimeout(function(){fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"),fetch("https://fonts.googleapis.com/icon?family=Material+Icons"),fetch("css/notyf.min.css"),fetch("css/record.css")},2e3)}catch(e){console.log(e),l.show().addClass("d-flex"),c.addClass("d-none")}}).catch(function(e){console.log(e)})}var b=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"<div></div>";e.on("mouseenter focus",function(){e.attr("data-content",t),e.popover("show"),s.children(".popover").on("mouseleave blur",function(){setTimeout(function(){s.children(".popover").find(":hover").length||e.is(":hover")||e.popover("hide")},300)})}).on("mouseleave blur",function(){setTimeout(function(){s.children(".popover").find(":hover").length||e.is(":hover")||e.popover("hide")},300)}),e.on("shown.bs.popover",function(){var e=s.children(".popover")[0];setTimeout(function(){var t=e.getBoundingClientRect();t.height+t.y>innerHeight&&e.scrollIntoView(!1)},0)})},y=["#3f80ff","#4D55A5","#735dc6","#68b7dc"],x=function(e){var t=am4core.create("age-group-chart",am4charts.PieChart3D);t.data=e.slice(0,3).concat({ageGroup:"Others",count:e.slice(3).reduce(function(e,t){return e+Number(t.count)},0)}),t.paddingBottom=50,t.innerRadius=am4core.percent(40),t.depth=50,t.legend=new am4charts.Legend,t.legend.labels.template.fill=am4core.color("#74798c"),t.legend.valueLabels.template.fill=am4core.color("#74798c"),t.legend.labels.template.textDecoration="none",t.legend.valueLabels.template.textDecoration="none",t.legend.itemContainers.template.paddingTop=5,t.legend.itemContainers.template.paddingBottom=5,t.legend.labels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.states.getKey("active").properties.textDecoration="line-through",t.legend.valueLabels.template.align="right",t.legend.valueLabels.template.textAlign="start";var r=t.series.push(new am4charts.PieSeries3D);r.labels.template.disabled=!0,r.ticks.template.disabled=!0,r.calculatePercent=!0,r.slices.template.tooltipText="{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]",r.dataFields.value="count",r.dataFields.depthValue="count",r.dataFields.category="ageGroup",r.slices.template.adapter.add("fill",function(e,t){return y[t.dataItem.index]})},C=function(e,t,r,n){var a=am4core.create(r,am4charts.XYChart3D);a.data=e;var o=a.xAxes.push(new am4charts.CategoryAxis);o.dataFields.category="motherTongue",o.renderer.labels.template.rotation=270,o.renderer.labels.template.hideOversized=!1,o.renderer.minGridDistance=10,o.renderer.labels.template.horizontalCenter="right",o.renderer.labels.template.verticalCenter="middle",o.renderer.labels.template.fill="#74798c",o.renderer.grid.template.disabled=!0;var i=a.yAxes.push(new am4charts.ValueAxis);i.renderer.labels.template.fill="#74798c",i.renderer.grid.template.disabled=!1,i.renderer.baseGrid.disabled=!0;var l=a.series.push(new am4charts.ColumnSeries3D);l.dataFields.valueY="count",l.dataFields.categoryX="motherTongue",l.calculatePercent=!0;var c=l.columns.template;c.tooltipText="{categoryX} : [bold]@@@% ({valueY.value})[/]",l.tooltip.label.adapter.add("text",function(e,r){return r.dataItem&&e?e.replace("@@@",(100*r.dataItem.valueY/t).toFixed(1)):""}),c.adapter.add("fill",function(e,t){return n?y[t.dataItem.index]:a.colors.getIndex(t.dataItem.index)})},w=function(e){am4core.ready(function(){var t=am4core.create("gender-chart",am4charts.XYChart3D);t.paddingBottom=30,t.paddingTop=5,t.data=e;var r=t.xAxes.push(new am4charts.CategoryAxis);r.dataFields.category="gender",r.renderer.minGridDistance=20,r.renderer.inside=!1,r.renderer.labels.template.fill="#74798c",r.renderer.grid.template.disabled=!0;var n=r.renderer.labels.template;n.rotation=-90,n.horizontalCenter="left",n.verticalCenter="middle",n.dy=10,n.inside=!1;var a=t.yAxes.push(new am4charts.ValueAxis);a.renderer.grid.template.disabled=!1,a.renderer.labels.template.fill="#74798c",a.renderer.baseGrid.disabled=!0;var o=t.series.push(new am4charts.ConeSeries);o.calculatePercent=!0,o.dataFields.valueY="count",o.dataFields.categoryX="gender",o.columns.template.tooltipText="{categoryX} : [bold]{valueY.percent.formatNumber('#.0')}% ({valueY.value})[/]";var i=o.columns.template;i.adapter.add("fill",function(e,t){return y[y.length-1-t.dataItem.index]}),i.adapter.add("stroke",function(e,t){return y[y.length-1-t.dataItem.index]})})};t.exports={createColumn:p,createTableRows:f,createTableWithOneColumn:g,createTableWithTwoColumns:m,updateGraph:function(e){am4core.disposeAllCharts(),l.show().addClass("d-flex"),c.addClass("d-none"),v(e)},buildGraphs:v,getOrderedGenderData:u,getFormattedData:h}},{}],2:[function(e,t,r){"use strict";var n=e("./draw-chart"),a=n.updateGraph,o=n.buildGraphs;$(document).ready(function(){var e=$("#proceed-box"),t=e.parent(),r=document.querySelectorAll('input[name = "gender"]'),n=document.getElementById("age"),d=document.getElementById("mother-tongue"),s=$("#username"),p=s.next(),m=$("#tnc"),f="Odia",g=function(e){i(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")},h=function(){var e=s.val().trim();i(e)?(s.addClass("is-invalid"),p.removeClass("d-none")):(s.removeClass("is-invalid"),p.addClass("d-none")),m.trigger("change"),l(s)};m.prop("checked",!1),t.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"});var v;!function(){var e=localStorage.getItem("speakerDetails");if(e){var t=JSON.parse(e),r=document.querySelector('input[name = "gender"][value="'+t.gender+'"]');r&&(r.checked=!0,r.previous=!0),n.value=t.age,d.value=t.motherTongue,s.val(t.userName?t.userName.trim().substring(0,12):""),h()}}(),r.forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})}),$("#languageTop").on("change",function(e){v=e.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){f=v});var b="Odia";$("#language").on("change",function(e){u(b=e.target.value),c(b),a(b)}),$("#start-record").on("click",function(){f=b}),g(s.val().trim()),m.change(function(){var r=s.val().trim();this.checked&&!i(r)?(e.removeAttr("disabled").removeClass("point-none"),t.tooltip("disable")):(g(r),e.prop("disabled","true").addClass("point-none"),t.tooltip("enable"))}),s.on("input focus",h),e.on("click",function(){if(m.prop("checked")){var e=Array.from(r).filter(function(e){return e.checked}),t=e.length?e[0].value:"",a=s.val().trim().substring(0,12);if(i(a))return;var o={gender:t,age:n.value,motherTongue:d.value,userName:a,language:f};localStorage.setItem("speakerDetails",JSON.stringify(o)),location.href="/record"}}),$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",function(){var e=document.querySelector('input[name = "gender"]:checked');e&&(e.checked=!1),n.selectedIndex=0,d.selectedIndex=0,s[0].value=""}),s.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),l(s)}),c("Odia"),u("Odia"),o("Odia")});var i=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function l(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}function c(e){document.getElementById("start-record").innerText="START RECORDING IN ".concat(e.toUpperCase())}function d(e){var t=6*e,r=t%3600;return{hours:Math.floor(t/3600),minutes:Math.floor(r/60),seconds:r%60}}var s=function(e){return fetch("/getDetails/".concat(e)).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};function u(e){var t=$("#speaker-data").find("#loader1,#loader2"),r=$("#speakers-wrapper"),n=$("#speaker-value"),a=$("#hours-wrapper"),o=$("#hour-value");t.removeClass("d-none"),a.addClass("d-none"),r.addClass("d-none"),s(e).then(function(e){try{var i=d(e.find(function(e){return 1===e.index}).count),l=i.hours,c=i.minutes,s=i.seconds;o.text("".concat(l,"h ").concat(c,"m ").concat(s,"s")),n.text(e.find(function(e){return 0===e.index}).count),t.addClass("d-none"),a.removeClass("d-none"),r.removeClass("d-none"),localStorage.setItem("speakersData",JSON.stringify(e))}catch(e){console.log(e)}}).catch(function(e){console.log(e)})}t.exports={updateLanguageInButton:c,updateLanguage:u,calculateTime:d,testUserName:i,fetchDetail:s}},{"./draw-chart":1}]},{},[2]);