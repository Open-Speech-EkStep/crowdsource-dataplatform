!function t(e,n,o){function a(r,s){if(!n[r]){if(!e[r]){var d="function"==typeof require&&require;if(!s&&d)return d(r,!0);if(i)return i(r,!0);throw new Error("Cannot find module '"+r+"'")}var u=n[r]={exports:{}};e[r][0].call(u.exports,function(t){var n=e[r][1][t];return a(n||t)},u,u.exports,t,e,n,o)}return n[r].exports}for(var i="function"==typeof require&&require,r=0;r<o.length;r++)a(o[r]);return a}({1:[function(t,e,n){"use strict";var o,a,i=t("./validator-instructions").showInstructions,r=t("./visualizer"),s=t("./utils"),d=s.setPageContentHeight,u=s.toggleFooterPosition,c=new r,l=function(){$("#validator-page-content").addClass("d-none"),u(),i()},f=window.AudioContext||window.webkitAudioContext;function v(){var t=document.getElementById("myCanvas"),e=document.querySelector("audio");o=o||new f,a=a||o.createMediaElementSource(e);var n=o.createAnalyser();a.connect(n),n.connect(o.destination),c.visualize(t,n)}var h=function(){var t=document.getElementById("my-audio"),e=$("#play"),n=$("#pause"),o=$("#replay"),a=$("#audioplayer-text");function i(t){t.children().removeAttr("opacity"),t.removeAttr("disabled")}function r(){var t=$("#like_button"),e=$("#dislike_button"),n=$("#skip_button");i(t),i(e),i(n)}t.addEventListener("ended",function(){r(),n.addClass("d-none"),o.removeClass("d-none"),a.text("Replay")}),e.on("click",function(){$("#default_line").addClass("d-none"),t.load(),e.addClass("d-none"),n.removeClass("d-none"),a.text("Pause"),t.play(),v()}),n.on("click",function(){n.addClass("d-none"),o.removeClass("d-none"),a.text("Replay"),r(),t.pause()}),o.on("click",function(){t.load(),o.addClass("d-none"),n.removeClass("d-none"),a.text("Pause"),t.play(),v()})},g=0,m=0,p=0,y=function(t,e,n){t.addClass("animated ".concat(e)),t.on("animationend",function(){t.removeClass("animated ".concat(e)),t.off("animationend"),"function"==typeof n&&n()})};function w(t){var e=$("#sentenceLabel");e[0].innerText=A[t].sentence,y(e,"lightSpeedIn")}function C(){g<A.length-1?(S(A[++g].audio_path),B(),w(g)):(B(),function(){$("#instructions-row").addClass("d-none"),$("#sentences-row").addClass("d-none"),$("#audio-row").addClass("d-none"),$("#thank-you-row").removeClass("d-none");var t=localStorage.getItem("contributionLanguage"),e=localStorage.getItem("aggregateDataCountByLanguage"),n=JSON.parse(e).find(function(e){return e.language===t});n?($("#spn-total-hr-contributed").html(n.total_contributions),$("#spn-total-hr-validated").html(n.total_validations)):($("#spn-total-hr-contributed").html(0),$("#spn-total-hr-validated").html(0));$("#spn-validation-language-2").html(t),$("#spn-validation-count").html(p),$("#spn-total-contribution-count").html(m)}())}var b=function(t,e){var n=t.children().children();n[0].setAttribute("fill",e[0]),n[1].setAttribute("fill",e[1]),n[2].setAttribute("fill",e[2])},k=function(){document.getElementById("currentSentenceLbl").innerText=m,document.getElementById("totalSentencesLbl").innerText=A.length},x=function(){var t=$("#get-started"),e=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"];4==A.length?e=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Yay! Done & Dusted!"]:3==A.length?e=["Let’s get started","We know you can do more! ","Just few more steps to go!","Yay! Done & Dusted!"]:2==A.length?e=["Let’s get started","Just few more steps to go!","Yay! Done & Dusted!"]:1==A.length&&(e=["Let’s get started","Yay! Done & Dusted!"]);var n=$("#progress_bar");m++,t.text(e[m]).show();var o=10/A.length*10;n.width(m*o+"%"),n.prop("aria-valuenow",m),k()};function F(t){t.children().attr("opacity","50%"),t.attr("disabled","disabled")}function B(){var t=$("#dislike_button"),e=$("#like_button"),n=$("#skip_button"),o=$("#audioplayer-text");b(t,["white","#007BFF","#343A40"]),b(e,["white","#007BFF","#343A40"]),n.removeAttr("style"),o.text("Play"),F(e),F(t),F(n),$("#replay").addClass("d-none"),$("#play").removeClass("d-none"),$("#default_line").removeClass("d-none")}function T(t){"reject"!=t&&"accept"!=t||p++;var e=A[g].sentenceId;fetch("/validation/action",{method:"POST",body:JSON.stringify({sentenceId:e,action:t}),headers:{"Content-Type":"application/json"}}).then(function(t){if(!t.ok)throw Error(t.statusText||"HTTP error")})}function L(){$("#instructions-link").on("click",function(){l()}),$("#validator-instructions-modal").on("hidden.bs.modal",function(){$("#validator-page-content").removeClass("d-none"),u()});var t=$("#like_button"),e=$("#dislike_button"),n=$("#skip_button");t.hover(function(){b(t,["#bfddf5","#007BFF","#007BFF"])},function(){b(t,["white","#007BFF","#343A40"])}),e.hover(function(){b(e,["#bfddf5","#007BFF","#007BFF"])},function(){b(e,["white","#007BFF","#343A40"])}),e.mousedown(function(){b(e,["#007BFF","white","white"])}),t.mousedown(function(){b(t,["#007BFF","white","white"])}),e.on("click",function(){T("reject"),x(),C()}),t.on("click",function(){T("accept"),x(),C()}),n.on("click",function(){T("skip"),x(),C()}),n.hover(function(){n.css("border-color","#bfddf5")},function(){n.removeAttr("style")}),n.mousedown(function(){n.css("background-color","#bfddf5")})}var A=[{sentence:""}],S=function(t){$("#loader-audio-row").removeClass("d-none"),$("#audio-row").addClass("d-none"),fetch("/audioClip",{method:"POST",body:JSON.stringify({file:t}),headers:{"Content-Type":"application/json"}}).then(function(t){t.arrayBuffer().then(function(t){var e=new Blob([t],{type:"audio/wav"}),n=new FileReader;n.onload=function(t){var e;e=t.target.result,$("#my-audio").attr("src",e),_()},n.readAsDataURL(e)})}).catch(function(t){console.log(t),_()})};function _(){$("#loader-audio-row").addClass("d-none"),$("#audio-row").removeClass("d-none")}$(document).ready(function(){u(),d();var t=localStorage.getItem("contributionLanguage");fetch("/validation/sentences/".concat(t)).then(function(t){if(t.ok)return t.json();throw Error(t.statusText||"HTTP error")}).then(function(t){if(0==t.data.length)return $("#spn-validation-language").html(localStorage.getItem("contributionLanguage")),$("#instructions-row").addClass("d-none"),$("#sentences-row").addClass("d-none"),$("#audio-row").addClass("d-none"),void $("#no-sentences-row").removeClass("d-none");var e=(A=t.data)[g];if(e){S(e.audio_path),w(g),k(),B(),L(),h();var n=document.getElementById("myCanvas");c.drawCanvasLine(n)}}).catch(function(t){console.log(t)})}),e.exports={setSentenceLabel:w,setAudioPlayer:h,addListeners:L}},{"./utils":2,"./validator-instructions":3,"./visualizer":4}],2:[function(t,e,n){"use strict";e.exports={setPageContentHeight:function(){var t=$("footer"),e=$(".navbar"),n=100-(t.outerHeight()+e.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var t=$("footer");t.toggleClass("fixed-bottom"),t.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("http://ip-api.com/json/?fields=country,regionName")}}},{}],3:[function(t,e,n){"use strict";e.exports={showInstructions:function(){(arguments.length>0&&void 0!==arguments[0]?arguments[0]:$("#validator-instructions-modal")).modal("show")}}},{}],4:[function(t,e,n){"use strict";function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var a=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,a;return e=t,(n=[{key:"setCanvasCtx",value:function(t){var e=t.getContext("2d"),n=t.width,o=t.height;return e.fillStyle="rgb(255, 255, 255, 0.8)",e.fillRect(0,0,n,o),e.lineWidth=2,e.strokeStyle="rgb(0,123,255)",{canvasCtx:e,canvasWidth:n,canvasHeight:o}}},{key:"visualize",value:function(t,e){var n=e.frequencyBinCount,o=new Uint8Array(n),a=this.setCanvasCtx;!function i(){requestAnimationFrame(i),e.getByteTimeDomainData(o);var r=a(t),s=r.canvasCtx,d=r.canvasWidth,u=r.canvasHeight;s.beginPath();for(var c=1*d/n,l=0,f=0;f<n;f++){var v=o[f]/128*u/2;0===f?s.moveTo(l,v):s.lineTo(l,v),l+=c}var h=u/2;s.lineTo(d,h),s.stroke()}()}},{key:"drawCanvasLine",value:function(t){var e=this.setCanvasCtx(t),n=e.canvasCtx,o=e.canvasWidth,a=e.canvasHeight/2;n.moveTo(0,a),n.lineTo(o,a),n.stroke()}}])&&o(e.prototype,n),a&&o(e,a),t}();e.exports=a},{}]},{},[1]);