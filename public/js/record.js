!function e(t,n,o){function a(s,i){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!i&&c)return c(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var d=n[s]={exports:{}};t[s][0].call(d.exports,function(e){var n=t[s][1][e];return a(n||e)},d,d.exports,e,t,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)a(o[s]);return a}({1:[function(e,t,n){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(t,n,o){"use strict";var a,r,s=t("./utils"),i=s.setPageContentHeight,c=s.toggleFooterPosition,d=s.fetchLocationInfo,l=s.updateLocaleLanguagesDropdown,u=s.setFooterPosition,g="speakerDetails",m="currentIndex",h="skipCount",f=$("#test-mic-button"),v=$("#play-speaker");function p(e,t){return e<0?0:e>t?t:e}function w(e){return p(Number(localStorage.getItem(m)),e)}function C(e){return p(Number(localStorage.getItem(h)),e)}var S=function(e){document.getElementById("currentSentenceLbl").innerText=e},y=function(e){document.getElementById("totalSentencesLbl").innerText=e};function x(e,t,n){for(var o=0;o<n.length;o++)e.setUint8(t+o,n.charCodeAt(o))}var T,L,b,I,N=[],k=0,A=function(){var t=null,n=null,o=44100,s=0,i=0;return{start:function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(e){var c=window.AudioContext||window.webkitAudioContext;T=new c,o=T.sampleRate,t=T.createMediaStreamSource(e),n=T.createScriptProcessor(1024,1,1),t.connect(n),n.connect(T.destination),n.onaudioprocess=function(e){var t=e.inputBuffer.getChannelData(0);k+=1024,N.push(new Float32Array(t));for(var n=0,o=0,c=0;c<t.length;++c)o+=t[c]*t[c];n=Math.sqrt(o/t.length),s=Math.max(s,n),n=Math.max(n,i-.008),i=n,r.clearRect(0,0,a.width,a.height),r.fillStyle="#83E561",r.fillRect(0,0,a.width*(n/s),a.height)}}).catch(function(t){console.log(e)})},stop:function(){null!==t&&t.disconnect(),null!==n&&n.disconnect();var e=function(e,t){var n=new ArrayBuffer(44+2*e.length),o=new DataView(n);x(o,0,"RIFF"),o.setUint32(4,44+2*e.length,!0),x(o,8,"WAVE"),x(o,12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,t,!0),o.setUint32(28,2*t,!0),o.setUint16(32,4,!0),o.setUint16(34,16,!0),x(o,36,"data"),o.setUint32(40,2*e.length,!0);for(var a=44,r=0;r<e.length;r++)o.setInt16(a,32767*e[r],!0),a+=2;return new Blob([o],{type:"audio/wav"})}(function(e,t){for(var n=new Float32Array(t),o=0,a=0;a<e.length;a++){var r=e[a];n.set(r,o),o+=r.length}return n}(N,k),o);if(null!==e){var s=URL.createObjectURL(e),i=new Audio(s);return i.onloadedmetadata=function(){var e=Math.ceil(1e3*i.duration);setTimeout(function(){var e;e=$("#test-mic-text"),T&&T.close(),e.text("Test Mic"),$("#mic-svg").removeClass("d-none"),f.attr("data-value","test-mic"),r.clearRect(0,0,a.width,a.height)},e)},{audioBlob:e,audioUrl:s,play:function(){i.play()}}}return console.log("No blob present"),null}}},E=function(){var e=crowdSource.sentences,t=$("#startRecord"),n=$("#startRecordRow"),o=$("#stopRecord"),a=$("#reRecord"),r=$("#visualizer"),s=$("#player"),i=$("#nextBtn"),c=i.parent(),d=$("#get-started"),l=$("#skipBtn"),u=$("#recording-row"),p=$("#recording-sign"),x=$(".progress-bar"),T=$("#page-content"),E=$("#audio-small-error"),R=document.getElementById("count-down"),U=$("#test-mic-speakers"),D=$("#test-mic-speakers-button"),O=$("#test-mic-speakers-details"),B=$("#test-mic-close"),_=e.length,P=w(_-1),M=C(_-1);$("footer");D.on("click",function(e){U.addClass("d-none"),O.removeClass("d-none")}),B.on("click",function(e){A().stop();document.getElementById("test-speaker-hidden").pause(),v.attr("data-value","test-speaker"),$("#test-speaker-text").text("Test Speakers"),$("#speaker-svg").removeClass("d-none"),U.removeClass("d-none"),O.addClass("d-none")}),f.on("click",function(e){!function(e){var t=$("#mic-svg"),n=$("#test-mic-text"),o=A();"test-mic"===e?(N=[],k=0,t.addClass("d-none"),f.attr("data-value","recording"),n.text("Recording"),o.start()):"recording"===e&&(o.stop().play(),f.attr("data-value","playing"),n.text("Playing"))}($("#test-mic-button").attr("data-value"))}),v.on("click",function(e){v.attr("data-value","playing"),$("#test-speaker-text").text("Playing"),$("#speaker-svg").addClass("d-none"),function(){var e=document.getElementById("test-speaker-hidden");if(e.load(),e.play(),!L){var t=window.AudioContext||window.webkitAudioContext;L=new t,I=L.createMediaElementSource(e),b=L.createAnalyser(),I.connect(b),b.connect(L.destination),b.fftSize=256}var n=document.getElementById("speaker-canvas"),o=n.getContext("2d"),a=b.frequencyBinCount,r=50,s=new Uint8Array(a),i=null;(function e(){i=requestAnimationFrame(e);b.getByteFrequencyData(s);var t=0;var a=0;for(var c=0;c<s.length;++c)a+=s[c]*s[c];t=Math.sqrt(a/s.length);r=Math.max(r,t);o.clearRect(0,0,n.width,n.height);o.fillStyle="#83E561";o.fillRect(0,0,n.width*(t/r),n.height)})(),e.onended=function(){cancelAnimationFrame(i),o.clearRect(0,0,n.width,n.height),v.attr("data-value","test-speaker"),$("#test-speaker-text").text("Test Speakers"),$("#speaker-svg").removeClass("d-none")}}()});var G=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"];4==e.length?G=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Yay! Done & Dusted!"]:3==e.length?G=["Let’s get started","We know you can do more! ","Just few more steps to go!","Yay! Done & Dusted!"]:2==e.length?G=["Let’s get started","Just few more steps to go!","Yay! Done & Dusted!"]:1==e.length&&(G=["Let’s get started","Yay! Done & Dusted!"]),c.tooltip({container:"body",placement:screen.availWidth>900?"right":"bottom"});var H,F,J,Y,q,j,W=function(e,t,n){e.addClass("animated ".concat(t)),e.on("animationend",function(){e.removeClass("animated ".concat(t)),e.off("animationend"),"function"==typeof n&&n()})},z=function(e){x.width(20*e+"%"),x.prop("aria-valuenow",e)},K=function(t){var n=$("#sentenceLbl");n[0].innerText=e[t].sentence,W(n,"lightSpeedIn"),P&&z(P)},V=new Notyf({position:{x:"center",y:"top"},types:[{type:"success",className:"fnt-1-5"},{type:"error",duration:3500,className:"fnt-1-5"}]});K(P),S(P+1),y(_),t.add(a).on("click",function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(e){d.hide(),t.addClass("d-none"),l.prop("disabled",!0),n.removeClass("d-none"),o.removeClass("d-none"),u.removeClass("d-none"),p.removeClass("d-none"),a.addClass("d-none"),i.addClass("d-none"),s.addClass("d-none"),s.trigger("pause"),r.removeClass("d-none"),c.tooltip("disable"),E.addClass("d-none"),H=e;var g=window.AudioContext||window.webkitAudioContext;j&&j.close();var m=(j=new g).createAnalyser();(J=j.createMediaStreamSource(e)).connect(m),function(e,t){var n=e.getContext("2d"),o=t.frequencyBinCount,a=new Uint8Array(o),r=e.width,s=e.height;!function i(){requestAnimationFrame(i);t.getByteTimeDomainData(a);n.fillStyle="rgb(255, 255, 255, 0.8)";n.fillRect(0,0,r,s);n.lineWidth=2;n.strokeStyle="rgb(0,123,255)";n.beginPath();var c=1*r/o;var d=0;for(var l=0;l<o;l++){var u=a[l]/128,g=u*s/2;0===l?n.moveTo(d,g):n.lineTo(d,g),d+=c}n.lineTo(e.width,e.height/2);n.stroke()}()}(visualizer,m),(F=new Recorder(J,{numChannels:2})).record(),q=setTimeout(function(){R.classList.remove("d-none"),function(e,t){var n=document.getElementById("counter");n.innerHTML="0".concat(e),t.classList.remove("d-none");var o=setInterval(function(){n.innerText="0".concat(e),--e<0&&(clearInterval(o),t.classList.add("d-none"))},1e3)}(5,R)},15e3),Y=setTimeout(function(){o.click()},21e3)}).catch(function(e){console.log(e),V.error("Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission"),o.addClass("d-none"),i.addClass("d-none"),a.addClass("d-none"),p.addClass("d-none"),u.addClass("d-none"),s.addClass("d-none"),s.trigger("pause"),r.addClass("d-none"),E.addClass("d-none")})}),o.on("click",function(){var e=$("#startRecordRow");clearTimeout(Y),clearTimeout(q),R.classList.add("d-none"),e.addClass("d-none"),o.addClass("d-none"),i.removeClass("d-none"),l.prop("disabled",!1),a.removeClass("d-none"),p.addClass("d-none"),u.addClass("d-none"),s.removeClass("d-none"),r.addClass("d-none"),F.stop(),H.getAudioTracks()[0].stop(),F.exportWAV(function(e){var t=(window.URL||window.webkitURL).createObjectURL(e);crowdSource.audioBlob=e,s.prop("src",t),s.on("loadedmetadata",function(){var e=s[0].duration;(function(e){return e<2?(c.tooltip("enable"),i.prop("disabled",!0).addClass("point-none"),E.removeClass("d-none"),!1):(c.tooltip("disable"),i.removeAttr("disabled").removeClass("point-none"),E.addClass("d-none"),!0)})(e)&&(crowdSource.audioDuration=e)})}),P===_-1&&d.text(G[_]).show()});var X=function(){location.href="/thank-you"};function Q(e){var t=new FormData,n=JSON.parse(localStorage.getItem(g)),o=JSON.stringify({userName:n.userName,language:n.language});t.append("audio_data",crowdSource.audioBlob),t.append("speakerDetails",o),t.append("sentenceId",crowdSource.sentences[P].sentenceId),t.append("state",localStorage.getItem("state_region")||""),t.append("country",localStorage.getItem("country")||""),t.append("audioDuration",crowdSource.audioDuration),fetch("/upload",{method:"POST",body:t}).then(function(e){return e.json()}).then(function(e){}).catch(function(e){console.log(e)}).then(function(t){e&&"function"==typeof e&&e()})}i.add(l).on("click",function(e){if("nextBtn"===e.target.id&&P<_-1?Q():"skipBtn"===e.target.id&&(M++,localStorage.setItem(h,M),l.addClass("d-none")),P===_-1){"nextBtn"===e.target.id?Q(X):setTimeout(X,2500),l.addClass("d-none"),P++,W(T,"zoomOut",function(){return T.addClass("d-none")}),z(P);var o=JSON.parse(localStorage.getItem("sentences"));Object.assign(o,{sentences:[]}),localStorage.setItem("sentences",JSON.stringify(o)),localStorage.setItem(m,P),V.success("Congratulations!!! You have completed this batch of sentences"),$("#loader").show()}else P<_-1&&(K(++P),S(P+1),d.text(G[P]),localStorage.setItem(m,P),l.removeClass("d-none"));s.addClass("d-none"),s.trigger("pause"),i.addClass("d-none"),a.addClass("d-none"),n.removeClass("d-none"),t.removeClass("d-none")})};$(document).ready(function(){c(),i(),window.crowdSource={};var e=$("#validation-instruction-modal"),t=$("#errorModal"),n=$("#loader"),o=$("#page-content"),s=$("#nav-user"),u=s.find("#nav-username"),f=localStorage.getItem("contributionLanguage");a=document.getElementById("mic-canvas"),r=a.getContext("2d"),f&&l(f),d().then(function(e){return e.json()}).then(function(e){localStorage.setItem("state_region",e.regionName),localStorage.setItem("country",e.country)}).catch(console.log);try{var v=localStorage.getItem(g),p=JSON.parse(v),w=localStorage.getItem("sentences"),C=JSON.parse(w),S=Number(localStorage.getItem("count"));if(i(),$("#instructions_close_btn").on("click",function(){e.addClass("d-none")}),t.on("show.bs.modal",function(){e.addClass("d-none")}),t.on("hidden.bs.modal",function(){location.href="/#speaker-details"}),!p)return void(location.href="/#speaker-details");s.removeClass("d-none"),$("#nav-login").addClass("d-none"),u.text(p.userName);var y=C&&C.userName===p.userName&&C.language===p.language;y&&0!=C.sentences.length?(crowdSource.sentences=C.sentences,crowdSource.count=S,n.hide(),o.removeClass("d-none"),E()):(localStorage.removeItem(m),localStorage.removeItem(h),fetch("/sentences",{method:"POST",body:JSON.stringify({userName:p.userName,age:p.age,language:p.language,motherTongue:p.motherTongue,gender:p.gender}),headers:{"Content-Type":"application/json"}}).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(t){y||e.removeClass("d-none"),o.removeClass("d-none"),crowdSource.sentences=t.data,crowdSource.count=Number(t.count),n.hide(),localStorage.setItem("sentences",JSON.stringify({userName:p.userName,sentences:t.data,language:p.language})),localStorage.setItem("count",t.count),E()}).catch(function(e){console.log(e),t.modal("show")}).then(function(){n.hide()}))}catch(e){console.log(e),t.modal("show")}}),$(window).resize(function(){u()}),n.exports={getCurrentIndex:w,getSkipCount:C,getValue:p,setCurrentSentenceIndex:S,setTotalSentenceIndex:y}},{"./utils":3}],3:[function(e,t,n){"use strict";var o=e("./constants"),a=o.HOUR_IN_SECONDS,r=o.SIXTY,s=o.ALL_LANGUAGES;var i=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),n=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(n){n({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),n="";for(var o in t)if(t[o].startsWith("ip=")){n=t[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),n=s.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===n.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(e/a),o=e%a,s=Math.floor(o/r),i=Math.round(o%r);return t?{hours:n,minutes:s,seconds:i}:{hours:n,minutes:s}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o="";return e>0&&(o+="".concat(e," hrs ")),t>0&&(o+="".concat(t," min ")),0===e&&0===t&&n>0&&(o+="".concat(n," sec ")),o.substr(0,o.length-1)},getLocaleString:function(){i("/get-locale-strings").then(function(e){localStorage.setItem("localeString",JSON.stringify(e))})},performAPIRequest:i,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")},setFooterPosition:function(){var e=$("#page-content").outerHeight();$("body").outerHeight()<=e+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")}}},{"./constants":1}]},{},[2]);