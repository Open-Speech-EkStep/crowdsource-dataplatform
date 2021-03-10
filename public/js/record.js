!function e(t,n,o){function a(s,d){if(!n[s]){if(!t[s]){var i="function"==typeof require&&require;if(!d&&i)return i(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return a(n||e)},c,c.exports,e,t,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)a(o[s]);return a}({1:[function(e,t,n){"use strict";var o=e("./utils"),a=o.setPageContentHeight,r=o.toggleFooterPosition,s=o.fetchLocationInfo,d=o.updateLocaleLanguagesDropdown,i="speakerDetails",c="currentIndex",l="skipCount";function u(e,t){return e<0?0:e>t?t:e}function g(e){return u(Number(localStorage.getItem(c)),e)}function m(e){return u(Number(localStorage.getItem(l)),e)}var h=function(e){document.getElementById("currentSentenceLbl").innerText=e},f=function(e){document.getElementById("totalSentencesLbl").innerText=e},p=function(){var e=crowdSource.sentences,t=$("#startRecord"),n=$("#startRecordRow"),o=$("#stopRecord"),a=$("#reRecord"),s=$("#visualizer"),d=$("#player"),u=$("#nextBtn"),p=u.parent(),v=$("#get-started"),w=$("#skipBtn"),C=$("#recording-row"),x=$("#recording-sign"),S=$(".progress-bar"),y=$("#page-content"),L=$("#audio-small-error"),T=document.getElementById("count-down"),b=e.length,I=g(b-1),k=m(b-1),N=($("footer"),["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"]);4==e.length?N=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Yay! Done & Dusted!"]:3==e.length?N=["Let’s get started","We know you can do more! ","Just few more steps to go!","Yay! Done & Dusted!"]:2==e.length?N=["Let’s get started","Just few more steps to go!","Yay! Done & Dusted!"]:1==e.length&&(N=["Let’s get started","Yay! Done & Dusted!"]),p.tooltip({container:"body",placement:screen.availWidth>900?"right":"bottom"});var D,B,O,J,E,A,P=function(e,t,n){e.addClass("animated ".concat(t)),e.on("animationend",function(){e.removeClass("animated ".concat(t)),e.off("animationend"),"function"==typeof n&&n()})},R=function(e){S.width(20*e+"%"),S.prop("aria-valuenow",e)},j=function(t){var n=$("#sentenceLbl");n[0].innerText=e[t].sentence,P(n,"lightSpeedIn"),I&&R(I)},H=new Notyf({position:{x:"center",y:"top"},types:[{type:"success",className:"fnt-1-5"},{type:"error",duration:3500,className:"fnt-1-5"}]});j(I),h(I+1),f(b),t.add(a).on("click",function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(e){v.hide(),n.addClass("d-none"),o.removeClass("d-none"),C.removeClass("d-none"),x.removeClass("d-none"),a.addClass("d-none"),u.addClass("d-none"),d.addClass("d-none"),d.trigger("pause"),s.removeClass("d-none"),p.tooltip("disable"),L.addClass("d-none"),D=e;var t=window.AudioContext||window.webkitAudioContext;A&&A.close();var r=(A=new t).createAnalyser();(O=A.createMediaStreamSource(e)).connect(r),function(e,t){var n=e.getContext("2d"),o=t.frequencyBinCount,a=new Uint8Array(o),r=e.width,s=e.height;!function d(){requestAnimationFrame(d);t.getByteTimeDomainData(a);n.fillStyle="rgb(255, 255, 255, 0.8)";n.fillRect(0,0,r,s);n.lineWidth=2;n.strokeStyle="rgb(0,123,255)";n.beginPath();var i=1*r/o;var c=0;for(var l=0;l<o;l++){var u=a[l]/128,g=u*s/2;0===l?n.moveTo(c,g):n.lineTo(c,g),c+=i}n.lineTo(e.width,e.height/2);n.stroke()}()}(visualizer,r),(B=new Recorder(O,{numChannels:2})).record(),E=setTimeout(function(){T.classList.remove("d-none"),function(e,t){var n=document.getElementById("counter");n.innerHTML="0".concat(e),t.classList.remove("d-none");var o=setInterval(function(){n.innerText="0".concat(e),--e<0&&(clearInterval(o),t.classList.add("d-none"))},1e3)}(5,T)},15e3),J=setTimeout(function(){o.click()},21e3)}).catch(function(e){console.log(e),H.error("Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission"),n.removeClass("d-none"),o.addClass("d-none"),u.addClass("d-none"),a.addClass("d-none"),x.addClass("d-none"),C.addClass("d-none"),d.addClass("d-none"),d.trigger("pause"),s.addClass("d-none"),L.addClass("d-none")})}),o.on("click",function(){clearTimeout(J),clearTimeout(E),T.classList.add("d-none"),n.addClass("d-none"),o.addClass("d-none"),u.removeClass("d-none"),a.removeClass("d-none"),x.addClass("d-none"),C.addClass("d-none"),n.addClass("d-none"),d.removeClass("d-none"),s.addClass("d-none"),B.stop(),D.getAudioTracks()[0].stop(),B.exportWAV(function(e){var t=(window.URL||window.webkitURL).createObjectURL(e);crowdSource.audioBlob=e,d.prop("src",t),d.on("loadedmetadata",function(){var e=d[0].duration;e<2?(p.tooltip("enable"),u.prop("disabled",!0).addClass("point-none"),L.removeClass("d-none")):(p.tooltip("disable"),u.removeAttr("disabled").removeClass("point-none"),L.addClass("d-none"))})}),I===b-1&&v.text(N[b]).show()});var M=function(){location.href="/thank-you"};function W(e){var t=new FormData,n=JSON.parse(localStorage.getItem(i)),o=JSON.stringify({userName:n.userName,language:n.language});t.append("audio_data",crowdSource.audioBlob),t.append("speakerDetails",o),t.append("sentenceId",crowdSource.sentences[I].sentenceId),t.append("state",localStorage.getItem("state_region")||""),t.append("country",localStorage.getItem("country")||""),fetch("/upload",{method:"POST",body:t}).then(function(e){return e.json()}).then(function(e){}).catch(function(e){console.log(e)}).then(function(t){e&&"function"==typeof e&&e()})}u.add(w).on("click",function(e){if("nextBtn"===e.target.id&&I<b-1?W():"skipBtn"===e.target.id&&(k++,localStorage.setItem(l,k),w.addClass("d-none")),I===b-1){"nextBtn"===e.target.id?W(M):setTimeout(M,2500),w.addClass("d-none"),r(),I++,P(y,"zoomOut",function(){return y.addClass("d-none")}),R(I);var t=JSON.parse(localStorage.getItem("sentences"));Object.assign(t,{sentences:[]}),localStorage.setItem("sentences",JSON.stringify(t)),localStorage.setItem(c,I),H.success("Congratulations!!! You have completed this batch of sentences"),$("#loader").show()}else I<b-1&&(j(++I),h(I+1),v.text(N[I]),localStorage.setItem(c,I),w.removeClass("d-none"));d.addClass("d-none"),d.trigger("pause"),u.addClass("d-none"),a.addClass("d-none"),n.removeClass("d-none")})};$(document).ready(function(){window.crowdSource={};var e=$("#instructionsModal"),t=$("#errorModal"),n=$("#loader"),o=$("#page-content"),u=$("#nav-user"),g=u.find("#nav-username"),m=localStorage.getItem("contributionLanguage");d(m),s().then(function(e){return e.json()}).then(function(e){localStorage.setItem("state_region",e.regionName),localStorage.setItem("country",e.country)}).catch(console.log);try{var h=localStorage.getItem(i),f=JSON.parse(h),v=localStorage.getItem("sentences"),w=JSON.parse(v),C=Number(localStorage.getItem("count"));if(a(),e.on("hidden.bs.modal",function(){o.removeClass("d-none"),r()}),t.on("show.bs.modal",function(){e.modal("hide")}),t.on("hidden.bs.modal",function(){location.href="/#speaker-details"}),!f)return void(location.href="/#speaker-details");u.removeClass("d-none"),$("#nav-login").addClass("d-none"),g.text(f.userName);var x=w&&w.userName===f.userName&&w.language===f.language;x&&0!=w.sentences.length?(crowdSource.sentences=w.sentences,crowdSource.count=C,n.hide(),o.removeClass("d-none"),p()):(localStorage.removeItem(c),localStorage.removeItem(l),fetch("/sentences",{method:"POST",body:JSON.stringify({userName:f.userName,age:f.age,language:f.language,motherTongue:f.motherTongue,gender:f.gender}),headers:{"Content-Type":"application/json"}}).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(t){x?(o.removeClass("d-none"),r()):e.modal("show"),crowdSource.sentences=t.data,crowdSource.count=Number(t.count),n.hide(),localStorage.setItem("sentences",JSON.stringify({userName:f.userName,sentences:t.data,language:f.language})),localStorage.setItem("count",t.count),p()}).catch(function(e){console.log(e),t.modal("show")}).then(function(){n.hide()}))}catch(e){console.log(e),t.modal("show")}}),t.exports={getCurrentIndex:g,getSkipCount:m,getValue:u,setCurrentSentenceIndex:h,setTotalSentenceIndex:f}},{"./utils":2}],2:[function(e,t,n){"use strict";var o=[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0},{value:"Odia",id:"or",text:"ଘୃଣା",hasLocaleText:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!1},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!1}];t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),n=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),n="";for(var o in t)if(t[o].startsWith("ip=")){n=t[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),n=o.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===n.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))}}},{}]},{},[1]);