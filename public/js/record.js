!function e(n,o,t){function a(s,d){if(!o[s]){if(!n[s]){var i="function"==typeof require&&require;if(!d&&i)return i(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var c=o[s]={exports:{}};n[s][0].call(c.exports,function(e){var o=n[s][1][e];return a(o||e)},c,c.exports,e,n,o,t)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<t.length;s++)a(t[s]);return a}({1:[function(e,n,o){"use strict";var t=e("./utils"),a=t.setPageContentHeight,r=t.toggleFooterPosition,s="speakerDetails",d="currentIndex",i="skipCount";function c(e,n){return e<0?0:e>n?n:e}function l(e){return c(Number(localStorage.getItem(d)),e)}function u(e){return c(Number(localStorage.getItem(i)),e)}var g=function(e){document.getElementById("currentSentenceLbl").innerText=e},m=function(e){document.getElementById("totalSentencesLbl").innerText=e},f=function(){var e=crowdSource.sentences,n=$("#startRecord"),o=$("#startRecordRow"),t=$("#stopRecord"),a=$("#reRecord"),c=$("#visualizer"),f=$("#player"),p=$("#nextBtn"),h=p.parent(),v=$("#get-started"),C=$("#skipBtn"),w=$("#recording-row"),S=$("#recording-sign"),b=$(".progress-bar"),y=$("#page-content"),x=$("#audio-small-error"),I=e.length,N=l(I-1),k=u(I-1),T=$("footer"),B=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"];h.tooltip({container:"body",placement:screen.availWidth>900?"right":"bottom"});var O,R,A,D,P,H=function(e,n,o){e.addClass("animated ".concat(n)),e.on("animationend",function(){e.removeClass("animated ".concat(n)),e.off("animationend"),"function"==typeof o&&o()})},J=function(e){b.width(20*e+"%"),b.prop("aria-valuenow",e)},L=function(n){var o=$("#sentenceLbl");o[0].innerText=e[n].sentence,H(o,"lightSpeedIn"),N&&J(N)},q=function(e){var n=$("#graphbar"),o=$("#time-value"),t=6*(crowdSource.count+e-k),a=t>=1800,r=a?t:1800-t,s=Math.floor(r/60),d=r%60;o.text("".concat(s,"m ").concat(d,"s")),a&&o.siblings("p").text("We are loving it!");var i=42/1800*t;n.height(i+"em")},M=new Notyf({position:{x:"center",y:"top"},types:[{type:"success",className:"fnt-1-5"},{type:"error",duration:3500,className:"fnt-1-5"}]});!function(e){var n=$("#time-progress"),o=e.outerHeight(),t=n.css("bottom");Number(t.substring(0,t.length-2))&&n.css("bottom",o+"px")}(T),L(N),g(N+1),m(I),q(N),n.add(a).on("click",function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(e){v.hide(),o.addClass("d-none"),t.removeClass("d-none"),w.removeClass("d-none"),S.removeClass("d-none"),a.addClass("d-none"),p.addClass("d-none"),f.addClass("d-none"),f.trigger("pause"),c.removeClass("d-none"),h.tooltip("disable"),x.addClass("d-none"),O=e;var n=window.AudioContext||window.webkitAudioContext;P&&P.close();var r=(P=new n).createAnalyser();(A=P.createMediaStreamSource(e)).connect(r),function(e,n){var o=e.getContext("2d"),t=n.frequencyBinCount,a=new Uint8Array(t),r=e.width,s=e.height;!function d(){requestAnimationFrame(d);n.getByteTimeDomainData(a);o.fillStyle="rgb(255, 255, 255, 0.8)";o.fillRect(0,0,r,s);o.lineWidth=2;o.strokeStyle="rgb(0,123,255)";o.beginPath();var i=1*r/t;var c=0;for(var l=0;l<t;l++){var u=a[l]/128,g=u*s/2;0===l?o.moveTo(c,g):o.lineTo(c,g),c+=i}o.lineTo(e.width,e.height/2);o.stroke()}()}(visualizer,r),(R=new Recorder(A,{numChannels:2})).record(),D=setTimeout(function(){t.click()},3e4)}).catch(function(e){console.log(e),M.error("Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission"),o.removeClass("d-none"),t.addClass("d-none"),p.addClass("d-none"),a.addClass("d-none"),S.addClass("d-none"),w.addClass("d-none"),f.addClass("d-none"),f.trigger("pause"),c.addClass("d-none"),x.addClass("d-none")})}),t.on("click",function(){clearTimeout(D),o.addClass("d-none"),t.addClass("d-none"),p.removeClass("d-none"),a.removeClass("d-none"),S.addClass("d-none"),w.addClass("d-none"),o.addClass("d-none"),f.removeClass("d-none"),c.addClass("d-none"),R.stop(),O.getAudioTracks()[0].stop(),R.exportWAV(function(e){var n=(window.URL||window.webkitURL).createObjectURL(e);crowdSource.audioBlob=e,f.prop("src",n),f.on("loadedmetadata",function(){var e=f[0].duration;e<2?(h.tooltip("enable"),p.prop("disabled",!0).addClass("point-none"),x.removeClass("d-none")):(h.tooltip("disable"),p.removeAttr("disabled").removeClass("point-none"),x.addClass("d-none"))})}),N===I-1&&v.text(B[I]).show()});var W=function(){location.href="/thank-you"};function E(e){var n=new FormData,o=JSON.parse(localStorage.getItem(s)),t=JSON.stringify({userName:o.userName,language:o.language});n.append("audio_data",crowdSource.audioBlob),n.append("speakerDetails",t),n.append("sentenceId",crowdSource.sentences[N].sentenceId),fetch("/upload",{method:"POST",body:n}).then(function(e){return e.json()}).then(function(e){}).catch(function(e){console.log(e)}).then(function(n){e&&"function"==typeof e&&e()})}p.add(C).on("click",function(e){"nextBtn"===e.target.id&&N<I-1?(E(),q(N+1)):"skipBtn"===e.target.id&&(k++,localStorage.setItem(i,k),C.addClass("d-none")),N===I-1?("nextBtn"===e.target.id?E(W):setTimeout(W,2500),C.addClass("d-none"),r(),N++,H(y,"zoomOut",function(){return y.addClass("d-none")}),J(N),localStorage.removeItem("sentences"),localStorage.setItem(d,N),M.success("Congratulations!!! You have completed this batch of sentences"),$("#loader").show()):N<I-1&&(L(++N),g(N+1),v.text(B[N]),localStorage.setItem(d,N),C.removeClass("d-none")),f.addClass("d-none"),f.trigger("pause"),p.addClass("d-none"),a.addClass("d-none"),o.removeClass("d-none")})};$(document).ready(function(){window.crowdSource={};var e=$("#instructionsModal"),n=$("#errorModal"),o=$("#loader"),t=$("#page-content"),c=$("#nav-user"),l=c.find("#nav-username");try{var u=localStorage.getItem(s),g=JSON.parse(u),m=localStorage.getItem("sentences"),p=JSON.parse(m),h=Number(localStorage.getItem("count"));if(a(),e.on("hidden.bs.modal",function(){t.removeClass("d-none"),r()}),n.on("show.bs.modal",function(){e.modal("hide")}),n.on("hidden.bs.modal",function(){location.href="/#speaker-details"}),!g)return void(location.href="/#speaker-details");c.removeClass("d-none"),$("#nav-login").addClass("d-none"),l.text(g.userName),p&&p.userName===g.userName?(crowdSource.sentences=p.sentences,crowdSource.count=h,o.hide(),t.removeClass("d-none"),f()):(localStorage.removeItem(d),localStorage.removeItem(i),fetch("/sentences",{method:"POST",body:JSON.stringify({userName:g.userName,age:g.age,language:g.language,motherTongue:g.motherTongue,gender:g.gender}),headers:{"Content-Type":"application/json"}}).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(n){e.modal("show"),crowdSource.sentences=n.data,crowdSource.count=Number(n.count),o.hide(),f(),localStorage.setItem("sentences",JSON.stringify({userName:g.userName,sentences:n.data})),localStorage.setItem("count",n.count)}).catch(function(e){console.log(e),n.modal("show")}).then(function(){o.hide()}))}catch(e){console.log(e),n.modal("show")}}),n.exports={getCurrentIndex:l,getSkipCount:u,getValue:c,setCurrentSentenceIndex:g,setTotalSentenceIndex:m}},{"./utils":2}],2:[function(e,n,o){"use strict";n.exports={setPageContentHeight:function(){var e=$("footer"),n=$(".navbar"),o=100-(e.outerHeight()+n.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",o+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")}}},{}]},{},[1]);