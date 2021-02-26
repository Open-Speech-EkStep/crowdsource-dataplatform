!function t(e,n,o){function i(r,s){if(!n[r]){if(!e[r]){var c="function"==typeof require&&require;if(!s&&c)return c(r,!0);if(a)return a(r,!0);throw new Error("Cannot find module '"+r+"'")}var u=n[r]={exports:{}};e[r][0].call(u.exports,function(t){var n=e[r][1][t];return i(n||t)},u,u.exports,t,e,n,o)}return n[r].exports}for(var a="function"==typeof require&&require,r=0;r<o.length;r++)i(o[r]);return i}({1:[function(t,e,n){"use strict";var o,i,a=t("./validator-instructions").showInstructions,r=t("./visualizer"),s=t("./utils"),c=s.setPageContentHeight,u=s.toggleFooterPosition,l=new r,d=function(){$("#validator-page-content").addClass("d-none"),u(),a()},f=function(){var t=document.getElementById("nav-username").innerText;localStorage.setItem("currentUser",JSON.stringify(t));var e=localStorage.getItem("validatorDetails");if(!e)return localStorage.setItem("validatorDetails",JSON.stringify([t])),void d();var n=JSON.parse(e);n.includes(t)||(n.push(t),localStorage.setItem("validatorDetails",JSON.stringify(n)),d())},v=window.AudioContext||window.webkitAudioContext;function h(){var t=document.getElementById("myCanvas"),e=document.querySelector("audio");o=o||new v,i=i||o.createMediaElementSource(e);var n=o.createAnalyser();i.connect(n),n.connect(o.destination),l.visualize(t,n)}var m=function(){var t=document.getElementById("my-audio"),e=$("#play"),n=$("#pause"),o=$("#replay"),i=$("#audioplayer-text");function a(t){t.children().removeAttr("opacity"),t.removeAttr("disabled")}function r(){var t=$("#like_button"),e=$("#dislike_button"),n=$("#skip_button");a(t),a(e),a(n)}t.addEventListener("ended",function(){r(),n.addClass("d-none"),o.removeClass("d-none"),i.text("Replay")}),e.on("click",function(){$("#default_line").addClass("d-none"),t.load(),e.addClass("d-none"),n.removeClass("d-none"),i.text("Pause"),t.play(),h()}),n.on("click",function(){n.addClass("d-none"),o.removeClass("d-none"),i.text("Replay"),r(),t.pause()}),o.on("click",function(){t.load(),o.addClass("d-none"),n.removeClass("d-none"),i.text("Pause"),t.play(),h()})},p=0,g=0,y=function(t,e,n){t.addClass("animated ".concat(e)),t.on("animationend",function(){t.removeClass("animated ".concat(e)),t.off("animationend"),"function"==typeof n&&n()})};function b(t){var e=$("#sentenceLabel");e[0].innerText=A[t].sentence,y(e,"lightSpeedIn")}function w(){p<A.length-1&&(I(A[++p].audio_path),T(),b(p))}var C=function(t,e){var n=t.children().children();n[0].setAttribute("fill",e[0]),n[1].setAttribute("fill",e[1]),n[2].setAttribute("fill",e[2])},x=function(){document.getElementById("currentSentenceLbl").innerText=g,document.getElementById("totalSentencesLbl").innerText=A.length},k=function(){var t=$("#get-started"),e=$("#progress_bar");g++,t.text(["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"][g]).show();var n=10/A.length*10;e.width(g*n+"%"),e.prop("aria-valuenow",g),x()};function F(t){t.children().attr("opacity","50%"),t.attr("disabled","disabled")}function T(){var t=$("#dislike_button"),e=$("#like_button"),n=$("#skip_button"),o=$("#audioplayer-text");C(t,["white","#007BFF","#343A40"]),C(e,["white","#007BFF","#343A40"]),n.removeAttr("style"),o.text("Play"),F(e),F(t),F(n),$("#replay").addClass("d-none"),$("#play").removeClass("d-none"),$("#default_line").removeClass("d-none")}function S(t){var e=A[p].sentenceId;fetch("/validation/action",{method:"POST",body:JSON.stringify({validatorId:123,sentenceId:e,action:t}),headers:{"Content-Type":"application/json"}}).then(function(t){if(!t.ok)throw Error(t.statusText||"HTTP error")})}function B(){$("#instructions-link").on("click",function(){d()}),$("#validator-instructions-modal").on("hidden.bs.modal",function(){$("#validator-page-content").removeClass("d-none"),u()});var t=$("#like_button"),e=$("#dislike_button"),n=$("#skip_button");t.hover(function(){C(t,["#bfddf5","#007BFF","#007BFF"])},function(){C(t,["white","#007BFF","#343A40"])}),e.hover(function(){C(e,["#bfddf5","#007BFF","#007BFF"])},function(){C(e,["white","#007BFF","#343A40"])}),e.mousedown(function(){C(e,["#007BFF","white","white"])}),t.mousedown(function(){C(t,["#007BFF","white","white"])}),e.on("click",function(){S("reject"),k(),w()}),t.on("click",function(){S("accept"),k(),w()}),n.on("click",function(){S("skip"),k(),w()}),n.hover(function(){n.css("border-color","#bfddf5")},function(){n.removeAttr("style")}),n.mousedown(function(){n.css("background-color","#bfddf5")})}var A=[{sentence:""}],I=function(t){fetch("/audioClip",{method:"POST",body:JSON.stringify({file:t}),headers:{"Content-Type":"application/json"}}).then(function(t){t.arrayBuffer().then(function(t){var e,n=new Blob([t],{type:"audio/wav"});e=URL.createObjectURL(n),$("#my-audio").attr("src",e)})})};$(document).ready(function(){u(),c(),f();fetch("/validation/sentences/".concat("Odia")).then(function(t){if(t.ok)return t.json();throw Error(t.statusText||"HTTP error")}).then(function(t){var e=(A=t.data)[p];if(e&&e.audio_path){I(e.audio_path),b(p),x(),T(),B(),m();var n=document.getElementById("myCanvas");l.drawCanvasLine(n)}})}),e.exports={decideToShowPopUp:f,setSentenceLabel:b,setAudioPlayer:m,addListeners:B}},{"./utils":2,"./validator-instructions":3,"./visualizer":4}],2:[function(t,e,n){"use strict";e.exports={setPageContentHeight:function(){var t=$("footer"),e=$(".navbar"),n=100-(t.outerHeight()+e.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var t=$("footer");t.toggleClass("fixed-bottom"),t.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("http://ip-api.com/json/?fields=country,regionName")}}},{}],3:[function(t,e,n){"use strict";e.exports={showInstructions:function(){(arguments.length>0&&void 0!==arguments[0]?arguments[0]:$("#validator-instructions-modal")).modal("show")}}},{}],4:[function(t,e,n){"use strict";function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,i;return e=t,(n=[{key:"setCanvasCtx",value:function(t){var e=t.getContext("2d"),n=t.width,o=t.height;return e.fillStyle="rgb(255, 255, 255, 0.8)",e.fillRect(0,0,n,o),e.lineWidth=2,e.strokeStyle="rgb(0,123,255)",{canvasCtx:e,canvasWidth:n,canvasHeight:o}}},{key:"visualize",value:function(t,e){var n=e.frequencyBinCount,o=new Uint8Array(n),i=this.setCanvasCtx;!function a(){requestAnimationFrame(a),e.getByteTimeDomainData(o);var r=i(t),s=r.canvasCtx,c=r.canvasWidth,u=r.canvasHeight;s.beginPath();for(var l=1*c/n,d=0,f=0;f<n;f++){var v=o[f]/128*u/2;0===f?s.moveTo(d,v):s.lineTo(d,v),d+=l}var h=u/2;s.lineTo(c,h),s.stroke()}()}},{key:"drawCanvasLine",value:function(t){var e=this.setCanvasCtx(t),n=e.canvasCtx,o=e.canvasWidth,i=e.canvasHeight/2;n.moveTo(0,i),n.lineTo(o,i),n.stroke()}}])&&o(e.prototype,n),i&&o(e,i),t}();e.exports=i},{}]},{},[1]);
