!function e(t,n,o){function a(s,i){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!i&&c)return c(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var d=n[s]={exports:{}};t[s][0].call(d.exports,function(e){var n=t[s][1][e];return a(n||e)},d,d.exports,e,t,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)a(o[s]);return a}({1:[function(e,t,n){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,n){"use strict";var o,a,r,s,i=e("./utils"),c=i.setPageContentHeight,d=(i.toggleFooterPosition,i.fetchLocationInfo),l=i.updateLocaleLanguagesDropdown,u=i.setFooterPosition,g=i.getLocaleString,m=e("./constants").LOCALE_STRINGS,f="speakerDetails",h="sentences",p="currentIndex",v="skipCount",C="count",w=$("#test-mic-button"),S=$("#play-speaker"),y=44100,x=!1;function b(e,t){return e<0?0:e>t?t:e}function T(e){return b(Number(localStorage.getItem(p)),e)}function L(e){return b(Number(localStorage.getItem(v)),e)}var I=function(e){document.getElementById("currentSentenceLbl").innerText=e},k=function(e){document.getElementById("totalSentencesLbl").innerText=e};function N(e,t,n){for(var o=0;o<n.length;o++)e.setUint8(t+o,n.charCodeAt(o))}var _,A,E,O,R,D,U,P,B,G=function(){var e=$("#test-mic-text");_&&(_.close(),_=void 0),e.text(s["Test Mic"]),$("#mic-svg").removeClass("d-none"),w.attr("data-value","test-mic"),r.clearRect(0,0,a.width,a.height),J=5,clearInterval(E)},M=[],H=0,J=5,F=function(){$("#test-mic-text").text(s["Recording for ".concat(J," seconds")]),0===--J&&(clearInterval(E),w.attr("data-value","stop-recording"),q("stop-recording"))},j=function(e){var t=new FormData;t.append("audio_data",e),fetch("/audio/snr",{method:"POST",body:t}).then(function(e){return e.json()}).then(function(e){var t,n,o;t=e,n=$("#no-noise"),o=$("#noise"),$("#mic-msg").addClass("d-none"),t.ambient_noise?o.removeClass("d-none"):n.removeClass("d-none")}).catch(function(e){console.log(e)})},Y=function(){var e=null,t=null,n=0,o=0;return{start:function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(i){x&&$("#mic-msg").removeClass("invisible"),$("#mic-svg").addClass("d-none"),$("#test-mic-text").text(s["Recording for ".concat(J," seconds")]),w.attr("data-value","recording"),J--,E=setInterval(function(){F()},1e3);var c=window.AudioContext||window.webkitAudioContext;_=new c,y=_.sampleRate,e=_.createMediaStreamSource(i),t=_.createScriptProcessor(1024,1,1),e.connect(t),t.connect(_.destination),t.onaudioprocess=function(e){var t=e.inputBuffer.getChannelData(0);H+=1024,M.push(new Float32Array(t));for(var s=0,i=0,c=0;c<t.length;++c)i+=t[c]*t[c];s=Math.sqrt(i/t.length),n=Math.max(n,s),s=Math.max(s,o-.008),o=s,r.clearRect(0,0,a.width,a.height),r.fillStyle="#83E561",r.fillRect(0,0,a.width*(s/n),a.height)}}).catch(function(e){console.log(e),G()})},stop:function(){null!==e&&e.disconnect(),null!==t&&t.disconnect();var n=function(e,t){var n=new ArrayBuffer(44+2*e.length),o=new DataView(n);N(o,0,"RIFF"),o.setUint32(4,44+2*e.length,!0),N(o,8,"WAVE"),N(o,12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,t,!0),o.setUint32(28,2*t,!0),o.setUint16(32,4,!0),o.setUint16(34,16,!0),N(o,36,"data"),o.setUint32(40,2*e.length,!0);for(var a=44,r=0;r<e.length;r++)o.setInt16(a,32767*e[r],!0),a+=2;return new Blob([o],{type:"audio/wav"})}(function(e,t){for(var n=new Float32Array(t),o=0,a=0;a<e.length;a++){var r=e[a];n.set(r,o),o+=r.length}return n}(M,H),y);if(null!==n){x&&j(n);var o=URL.createObjectURL(n);return(A=new Audio(o)).onloadedmetadata=function(){var e=Math.ceil(1e3*A.duration);setTimeout(function(){G()},e)},{audioBlob:n,audioUrl:o,play:function(){A.play()}}}return console.log("No blob present"),null}}},q=function(e){$("#mic-msg").addClass("invisible").removeClass("d-none"),$("#no-noise").addClass("d-none"),$("#noise").addClass("d-none");var t=$("#test-mic-text"),n=Y();if("test-mic"===e)M=[],H=0,n.start();else if("stop-recording"===e){n.stop().play(),w.attr("data-value","playing"),t.text(s["Playingback Audio"])}},W=function(){var e=crowdSource.sentences,t=$("#startRecord"),n=$("#startRecordRow"),a=$("#stopRecord"),r=$("#reRecord"),i=$("#visualizer"),c=$("#player"),d=$("#nextBtn"),l=d.parent(),u=$("#get-started"),g=$("#skipBtn"),m=$("#recording-row"),C=$("#recording-sign"),y=$(".progress-bar"),x=$("#page-content"),b=$("#audio-small-error"),N=document.getElementById("count-down"),_=$("#test-mic-speakers"),E=$("#test-mic-speakers-button"),J=$("#test-mic-speakers-details"),F=$("#test-mic-close"),j=$("#no-noise"),Y=$("#noise"),W=e.length;o=T(W-1);var V=L(W-1);$("footer");E.on("click",function(e){_.addClass("d-none"),J.removeClass("d-none")}),F.on("click",function(e){_.removeClass("d-none"),J.addClass("d-none"),$("#mic-msg").addClass("invisible").removeClass("d-none"),j.addClass("d-none"),Y.addClass("d-none"),M=[],H=0,A&&(A.pause(),A.currentTime=0),U&&(U.pause(),U.currentTime=0),G(),z()}),w.on("click",function(e){var t=$("#test-mic-button").attr("data-value");q(t)}),S.on("click",function(e){S.attr("data-value","playing"),$("#test-speaker-text").text(s.Playing),$("#speaker-svg").addClass("d-none"),function(){if((U=document.getElementById("test-speaker-hidden")).play(),!O){var e=window.AudioContext||window.webkitAudioContext;O=new e,D=O.createMediaElementSource(U),R=O.createAnalyser(),D.connect(R),R.connect(O.destination),R.fftSize=256}P=document.getElementById("speaker-canvas"),B=P.getContext("2d");var t=R.frequencyBinCount,n=50,o=new Uint8Array(t);(function e(){K=requestAnimationFrame(e);R.getByteFrequencyData(o);var t=0;var a=0;for(var r=0;r<o.length;++r)a+=o[r]*o[r];t=Math.sqrt(a/o.length);n=Math.max(n,t);B.clearRect(0,0,P.width,P.height);B.fillStyle="#83E561";B.fillRect(0,0,P.width*(t/n),P.height)})(),U.onended=function(){z()}}()});var X=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Four dead, one more to go!","Yay! Done & Dusted!"];4==e.length?X=["Let’s get started","We know you can do more! ","You are halfway there. Keep going!","Just few more steps to go!","Yay! Done & Dusted!"]:3==e.length?X=["Let’s get started","We know you can do more! ","Just few more steps to go!","Yay! Done & Dusted!"]:2==e.length?X=["Let’s get started","Just few more steps to go!","Yay! Done & Dusted!"]:1==e.length&&(X=["Let’s get started","Yay! Done & Dusted!"]),l.tooltip({container:"body",placement:screen.availWidth>900?"right":"bottom"});var Q,Z,ee,te,ne,oe,ae=function(e,t,n){e.addClass("animated ".concat(t)),e.on("animationend",function(){e.removeClass("animated ".concat(t)),e.off("animationend"),"function"==typeof n&&n()})},re=function(e){y.width(20*e+"%"),y.prop("aria-valuenow",e)},se=function(t){var n=$("#sentenceLbl");n[0].innerText=e[t].sentence,ae(n,"lightSpeedIn"),o&&re(o)},ie=new Notyf({position:{x:"center",y:"top"},types:[{type:"success",className:"fnt-1-5"},{type:"error",duration:3500,className:"fnt-1-5"}]});se(o),I(o+1),k(W),t.add(r).on("click",function(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(e){u.hide(),t.addClass("d-none"),g.prop("disabled",!0),n.removeClass("d-none"),a.removeClass("d-none"),m.removeClass("d-none"),C.removeClass("d-none"),r.addClass("d-none"),d.addClass("d-none"),c.addClass("d-none"),c.trigger("pause"),i.removeClass("d-none"),l.tooltip("disable"),b.addClass("d-none"),Q=e;var o=window.AudioContext||window.webkitAudioContext;oe&&oe.close();var s=(oe=new o).createAnalyser();(ee=oe.createMediaStreamSource(e)).connect(s),function(e,t){var n=e.getContext("2d"),o=t.frequencyBinCount,a=new Uint8Array(o),r=e.width,s=e.height;!function i(){requestAnimationFrame(i);t.getByteTimeDomainData(a);n.fillStyle="rgb(255, 255, 255, 0.8)";n.fillRect(0,0,r,s);n.lineWidth=2;n.strokeStyle="rgb(0,123,255)";n.beginPath();var c=1*r/o;var d=0;for(var l=0;l<o;l++){var u=a[l]/128,g=u*s/2;0===l?n.moveTo(d,g):n.lineTo(d,g),d+=c}n.lineTo(e.width,e.height/2);n.stroke()}()}(visualizer,s),(Z=new Recorder(ee,{numChannels:2})).record(),ne=setTimeout(function(){N.classList.remove("d-none"),function(e,t){var n=document.getElementById("counter");n.innerHTML="0".concat(e),t.classList.remove("d-none");var o=setInterval(function(){n.innerText="0".concat(e),--e<0&&(clearInterval(o),t.classList.add("d-none"))},1e3)}(5,N)},15e3),te=setTimeout(function(){a.click()},21e3)}).catch(function(e){console.log(e),ie.error("Sorry !!! We could not get access to your audio input device. Make sure you have given microphone access permission"),a.addClass("d-none"),d.addClass("d-none"),r.addClass("d-none"),C.addClass("d-none"),m.addClass("d-none"),c.addClass("d-none"),c.trigger("pause"),i.addClass("d-none"),b.addClass("d-none")})}),a.on("click",function(){var e=$("#startRecordRow");clearTimeout(te),clearTimeout(ne),N.classList.add("d-none"),e.addClass("d-none"),a.addClass("d-none"),d.removeClass("d-none"),g.prop("disabled",!1),r.removeClass("d-none"),C.addClass("d-none"),m.addClass("d-none"),c.removeClass("d-none"),i.addClass("d-none"),Z.stop(),Q.getAudioTracks()[0].stop(),Z.exportWAV(function(e){var t=(window.URL||window.webkitURL).createObjectURL(e);crowdSource.audioBlob=e,c.prop("src",t),c.on("loadedmetadata",function(){var e=c[0].duration;(function(e){return e<2?(l.tooltip("enable"),d.prop("disabled",!0).addClass("point-none"),b.removeClass("d-none"),!1):(l.tooltip("disable"),d.removeAttr("disabled").removeClass("point-none"),b.addClass("d-none"),!0)})(e)&&(crowdSource.audioDuration=e)})}),o===W-1&&u.text(X[W]).show()});var ce=function(){location.href="/thank-you"};function de(e){var t=new FormData,n=JSON.parse(localStorage.getItem(f)),a=JSON.stringify({userName:n.userName,language:n.language});t.append("audio_data",crowdSource.audioBlob),t.append("speakerDetails",a),t.append("sentenceId",crowdSource.sentences[o].sentenceId),t.append("state",localStorage.getItem("state_region")||""),t.append("country",localStorage.getItem("country")||""),t.append("audioDuration",crowdSource.audioDuration),fetch("/upload",{method:"POST",body:t}).then(function(e){return e.json()}).then(function(e){}).catch(function(e){console.log(e)}).then(function(t){e&&"function"==typeof e&&e()})}d.add(g).on("click",function(e){var a,i;if("nextBtn"===e.target.id&&o<W-1?de():"skipBtn"===e.target.id&&(a=JSON.parse(localStorage.getItem(f)),i={sentenceId:crowdSource.sentences[o].sentenceId,userName:a.userName},fetch("/skip",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(function(e){return e.json()}).then(function(e){}).catch(function(e){console.log(e)}).then(function(e){cb&&"function"==typeof cb&&cb()}),V++,localStorage.setItem(v,V),g.addClass("d-none")),o===W-1){"nextBtn"===e.target.id?de(ce):setTimeout(ce,2500),g.addClass("d-none"),o++,ae(x,"zoomOut",function(){x.addClass("d-none"),$("footer").removeClass("bottom").addClass("fixed-bottom")}),re(o);var l=JSON.parse(localStorage.getItem(h));Object.assign(l,{sentences:[]}),localStorage.setItem(h,JSON.stringify(l)),localStorage.setItem(p,o);var m=s["Congratulations!!! You have completed this batch of sentences"];ie.success(m),$("#loader").show()}else o<W-1&&(se(++o),I(o+1),u.text(X[o]),localStorage.setItem(p,o),g.removeClass("d-none"));c.addClass("d-none"),c.trigger("pause"),d.addClass("d-none"),r.addClass("d-none"),n.removeClass("d-none"),t.removeClass("d-none")})},z=function(){cancelAnimationFrame(K),B&&B.clearRect(0,0,P.width,P.height),S.attr("data-value","test-speaker"),$("#test-speaker-text").text(s["Test Speakers"]),$("#speaker-svg").removeClass("d-none")},K=null;var V=function(){var e=localStorage.getItem("contributionLanguage"),t=$("#other_text").val(),n=JSON.parse(localStorage.getItem(f)),a={sentenceId:crowdSource.sentences[o].sentenceId,reportText:""!==t&&void 0!==t?"".concat(X," - ").concat(t):X,language:e,userName:n.userName};fetch("/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(function(e){return e.json()}).then(function(e){200===e.statusCode&&($("#report_sentence_modal").modal("hide"),$("#report_sentence_thanks_modal").modal("show"),$("#report_submit_id").attr("disabled",!0),$("input[type=radio][name=reportRadio]").each(function(){$(this).prop("checked",!1)}),$("#other_text").val(""))})},X="";function Q(){$("footer").removeClass("bottom").addClass("fixed-bottom"),c(),window.crowdSource={},-1===window.location.origin.indexOf("localhost")&&-1===window.location.origin.indexOf("dev")&&-1===window.location.origin.indexOf("test")||(x=!0);var e=$("#validation-instruction-modal"),t=$("#errorModal"),n=$("#report_sentence_modal"),o=$("#loader"),i=$("#page-content"),g=$("#nav-user"),w=g.find("#nav-username"),S=localStorage.getItem("contributionLanguage");a=document.getElementById("mic-canvas"),r=a.getContext("2d"),s=JSON.parse(localStorage.getItem(m)),S&&l(S),$("#report_submit_id").on("click",V),$("#report_btn").on("click",function(){n.modal("show")}),$("#report_close_btn").on("click",function(){n.modal("hide")}),$("#report_sentence_thanks_close_id").on("click",function(){$("#report_sentence_thanks_modal").modal("hide")}),$("input[type=radio][name=reportRadio]").on("change",function(){X=this.value,$("#report_submit_id").attr("disabled",!1)}),d().then(function(e){return e.json()}).then(function(e){localStorage.setItem("state_region",e.regionName),localStorage.setItem("country",e.country)}).catch(console.log);try{var y=localStorage.getItem(f),b=JSON.parse(y),T=localStorage.getItem(h),L=JSON.parse(T),I=Number(localStorage.getItem(C));if(c(),$("#instructions_close_btn").on("click",function(){e.addClass("d-none"),u()}),t.on("show.bs.modal",function(){e.addClass("d-none"),u()}),t.on("hidden.bs.modal",function(){location.href="/#speaker-details"}),!b)return void(location.href="/#speaker-details");g.removeClass("d-none"),$("#nav-login").addClass("d-none"),w.text(b.userName);var k=L&&L.userName===b.userName&&L.language===b.language;k&&0!=L.sentences.length&&L.language===S?(crowdSource.sentences=L.sentences,crowdSource.count=I,o.hide(),i.removeClass("d-none"),u(),W()):(localStorage.removeItem(p),localStorage.removeItem(v),fetch("/sentences",{method:"POST",body:JSON.stringify({userName:b.userName,age:b.age,language:b.language,motherTongue:b.motherTongue,gender:b.gender}),headers:{"Content-Type":"application/json"}}).then(function(e){if(e.ok)return e.json();throw Error(e.statusText||"HTTP error")}).then(function(t){k||(e.removeClass("d-none"),u()),i.removeClass("d-none"),crowdSource.sentences=t.data,crowdSource.count=Number(t.count),o.hide(),localStorage.setItem(h,JSON.stringify({userName:b.userName,sentences:t.data,language:b.language})),localStorage.setItem(C,t.count),u(),W()}).catch(function(e){console.log(e),t.modal("show")}).then(function(){o.hide()}))}catch(e){console.log(e),t.modal("show")}}$(document).ready(function(){g().then(function(e){Q()}).catch(function(e){Q()})}),$(window).resize(function(){u()}),t.exports={getCurrentIndex:T,getSkipCount:L,getValue:b,setCurrentSentenceIndex:I,setTotalSentenceIndex:k}},{"./constants":1,"./utils":4}],3:[function(e,t,n){"use strict";var o=e("./utils").updateLocaleLanguagesDropdown,a=e("./constants").ALL_LANGUAGES,r=function(e){var t=location.href.split("/"),n=t[t.length-1];s("i18n",e,1),location.href="/".concat(e,"/").concat(n)};function s(e,t,n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);var a="expires="+o.toGMTString();document.cookie=e+"="+t+";"+a+";path=/"}function i(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(t))return a.substring(t.length,a.length)}return""}t.exports={checkCookie:function(){return""!=i("i18n")},getCookie:i,setCookie:s,changeLocale:r,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var e=i("i18n"),t=location.href.split("/"),n=t[t.length-2];if($("#home-page").attr("default-lang",e),n!=e)r(e);else{var s=a.find(function(t){return t.id===e});s&&o(s.value)}}}},{"./constants":1,"./utils":4}],4:[function(e,t,n){"use strict";var o=e("./constants"),a=o.HOUR_IN_SECONDS,r=o.SIXTY,s=o.ALL_LANGUAGES,i=e("./locale").getCookie;var c=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),n=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(n){n({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),n="";for(var o in t)if(t[o].startsWith("ip=")){n=t[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),n=s.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===n.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(e/a),o=e%a,s=Math.floor(o/r),i=Math.round(o%r);return t?{hours:n,minutes:s,seconds:i}:{hours:n,minutes:s}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o="";return e>0&&(o+="".concat(e," hrs ")),t>0&&(o+="".concat(t," min ")),0===e&&0===t&&n>0&&(o+="".concat(n," sec ")),o.substr(0,o.length-1)},getLocaleString:function(){return new Promise(function(e,t){var n=i("i18n");c("/get-locale-strings/".concat(n)).then(function(t){localStorage.setItem("localeString",JSON.stringify(t)),e(t)})})},performAPIRequest:c,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")},setFooterPosition:function(){var e=$("#page-content").outerHeight();$("body").outerHeight()<=e+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")}}},{"./constants":1,"./locale":3}]},{},[2]);
