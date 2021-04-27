(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var DEFAULT_CON_LANGUAGE = "Hindi";
var AUDIO_DURATION = 6;
var SIXTY = 60;
var HOUR_IN_SECONDS = 3600;
var TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
var TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
var AGGREGATED_DATA_BY_LANGUAGE = "aggregateDataCountByLanguage";
var LOCALE_STRINGS = 'localeString';
var CONTRIBUTION_LANGUAGE = "contributionLanguage";
var SPEAKER_DETAILS_KEY = 'speakerDetails';
var ALL_LANGUAGES = [{
  value: "Assamese",
  id: "as",
  text: "অসমীয়া",
  hasLocaleText: true,
  data: true
}, {
  value: "Bengali",
  id: "bn",
  text: "বাংলা",
  hasLocaleText: true,
  data: true
}, {
  value: "English",
  id: "en",
  text: "English",
  hasLocaleText: true,
  data: true
}, {
  value: "Gujarati",
  id: "gu",
  text: "ગુજરાતી",
  hasLocaleText: true,
  data: true
}, {
  value: "Hindi",
  id: "hi",
  text: "हिंदी",
  hasLocaleText: true,
  data: true
}, {
  value: "Kannada",
  id: "kn",
  text: "ಕನ್ನಡ",
  hasLocaleText: true,
  data: true
}, {
  value: "Malayalam",
  id: "ml",
  text: "മലയാളം",
  hasLocaleText: true,
  data: true
}, {
  value: "Marathi",
  id: "mr",
  text: "मराठी",
  hasLocaleText: true,
  data: true
}, {
  value: "Odia",
  id: "or",
  text: "ଓଡିଆ",
  hasLocaleText: true,
  data: true
}, {
  value: "Punjabi",
  id: "pa",
  text: "ਪੰਜਾਬੀ",
  hasLocaleText: true,
  data: true
}, {
  value: "Tamil",
  id: "ta",
  text: "தமிழ்",
  hasLocaleText: true,
  data: true
}, {
  value: "Telugu",
  id: "te",
  text: "తెలుగు",
  hasLocaleText: true,
  data: true
}];
var BADGES = {
  bronze: {
    imgLg: "../img/bronze_badge.svg",
    imgSm: "../img/bronze_contributor.jpeg"
  },
  silver: {
    imgLg: "../img/silver_badge.svg",
    imgSm: "../img/silver_contributor.jpeg"
  },
  gold: {
    imgLg: "../img/gold_badge.svg",
    imgSm: "../img/gold_contributor.jpeg"
  },
  platinum: {
    imgLg: "../img/platinum_badge.svg",
    imgSm: "../img/platinum_contributor.jpeg"
  },
  certificate: {
    imgLg: "../img/certificate.svg",
    imgSm: "../img/certificate.svg"
  }
};
module.exports = {
  DEFAULT_CON_LANGUAGE: DEFAULT_CON_LANGUAGE,
  AUDIO_DURATION: AUDIO_DURATION,
  SIXTY: SIXTY,
  HOUR_IN_SECONDS: HOUR_IN_SECONDS,
  ALL_LANGUAGES: ALL_LANGUAGES,
  TOP_LANGUAGES_BY_HOURS: TOP_LANGUAGES_BY_HOURS,
  TOP_LANGUAGES_BY_SPEAKERS: TOP_LANGUAGES_BY_SPEAKERS,
  AGGREGATED_DATA_BY_LANGUAGE: AGGREGATED_DATA_BY_LANGUAGE,
  LOCALE_STRINGS: LOCALE_STRINGS,
  CONTRIBUTION_LANGUAGE: CONTRIBUTION_LANGUAGE,
  BADGES: BADGES,
  SPEAKER_DETAILS_KEY: SPEAKER_DETAILS_KEY
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0YW50cy5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NPTl9MQU5HVUFHRSIsIkFVRElPX0RVUkFUSU9OIiwiU0lYVFkiLCJIT1VSX0lOX1NFQ09ORFMiLCJUT1BfTEFOR1VBR0VTX0JZX0hPVVJTIiwiVE9QX0xBTkdVQUdFU19CWV9TUEVBS0VSUyIsIkFHR1JFR0FURURfREFUQV9CWV9MQU5HVUFHRSIsIkxPQ0FMRV9TVFJJTkdTIiwiQ09OVFJJQlVUSU9OX0xBTkdVQUdFIiwiU1BFQUtFUl9ERVRBSUxTX0tFWSIsIkFMTF9MQU5HVUFHRVMiLCJ2YWx1ZSIsImlkIiwidGV4dCIsImhhc0xvY2FsZVRleHQiLCJkYXRhIiwiQkFER0VTIiwiYnJvbnplIiwiaW1nTGciLCJpbWdTbSIsInNpbHZlciIsImdvbGQiLCJwbGF0aW51bSIsImNlcnRpZmljYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxvQkFBb0IsR0FBRyxPQUE3QjtBQUNBLElBQU1DLGNBQWMsR0FBRyxDQUF2QjtBQUNBLElBQU1DLEtBQUssR0FBRyxFQUFkO0FBQ0EsSUFBTUMsZUFBZSxHQUFHLElBQXhCO0FBQ0EsSUFBTUMsc0JBQXNCLEdBQUcscUJBQS9CO0FBQ0EsSUFBTUMseUJBQXlCLEdBQUcsd0JBQWxDO0FBQ0EsSUFBTUMsMkJBQTJCLEdBQUksOEJBQXJDO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLGNBQXZCO0FBQ0EsSUFBTUMscUJBQXFCLEdBQUcsc0JBQTlCO0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsZ0JBQTVCO0FBQ0EsSUFBTUMsYUFBYSxHQUFHLENBQ2xCO0FBQUNDLEVBQUFBLEtBQUssRUFBRSxVQUFSO0FBQW1CQyxFQUFBQSxFQUFFLEVBQUUsSUFBdkI7QUFBNkJDLEVBQUFBLElBQUksRUFBRSxTQUFuQztBQUE4Q0MsRUFBQUEsYUFBYSxFQUFFLElBQTdEO0FBQW1FQyxFQUFBQSxJQUFJLEVBQUM7QUFBeEUsQ0FEa0IsRUFFbEI7QUFB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QyxHQURFO0FBRVhDLEVBQUFBLE1BQU0sRUFBRTtBQUFDRixJQUFBQSxLQUFLLEVBQUMseUJBQVA7QUFBaUNDLElBQUFBLEtBQUssRUFBQztBQUF2QyxHQUZHO0FBR1hFLEVBQUFBLElBQUksRUFBRTtBQUFDSCxJQUFBQSxLQUFLLEVBQUMsdUJBQVA7QUFBK0JDLElBQUFBLEtBQUssRUFBQztBQUFyQyxHQUhLO0FBSVhHLEVBQUFBLFFBQVEsRUFBRTtBQUFDSixJQUFBQSxLQUFLLEVBQUMsMkJBQVA7QUFBbUNDLElBQUFBLEtBQUssRUFBQztBQUF6QyxHQUpDO0FBS1hJLEVBQUFBLFdBQVcsRUFBRTtBQUFDTCxJQUFBQSxLQUFLLEVBQUMsd0JBQVA7QUFBZ0NDLElBQUFBLEtBQUssRUFBQztBQUF0QztBQUxGLENBQWY7QUFRQUssTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2J6QixFQUFBQSxvQkFBb0IsRUFBcEJBLG9CQURhO0FBRWJDLEVBQUFBLGNBQWMsRUFBZEEsY0FGYTtBQUdiQyxFQUFBQSxLQUFLLEVBQUxBLEtBSGE7QUFJYkMsRUFBQUEsZUFBZSxFQUFmQSxlQUphO0FBS2JPLEVBQUFBLGFBQWEsRUFBYkEsYUFMYTtBQU1iTixFQUFBQSxzQkFBc0IsRUFBdEJBLHNCQU5hO0FBT2JDLEVBQUFBLHlCQUF5QixFQUF6QkEseUJBUGE7QUFRYkMsRUFBQUEsMkJBQTJCLEVBQTNCQSwyQkFSYTtBQVNiQyxFQUFBQSxjQUFjLEVBQWRBLGNBVGE7QUFVYkMsRUFBQUEscUJBQXFCLEVBQXJCQSxxQkFWYTtBQVdiUSxFQUFBQSxNQUFNLEVBQU5BLE1BWGE7QUFZYlAsRUFBQUEsbUJBQW1CLEVBQW5CQTtBQVphLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgREVGQVVMVF9DT05fTEFOR1VBR0UgPSBcIkhpbmRpXCI7XG5jb25zdCBBVURJT19EVVJBVElPTiA9IDY7XG5jb25zdCBTSVhUWSA9IDYwO1xuY29uc3QgSE9VUl9JTl9TRUNPTkRTID0gMzYwMDtcbmNvbnN0IFRPUF9MQU5HVUFHRVNfQllfSE9VUlMgPSBcInRvcExhbmd1YWdlc0J5SG91cnNcIjtcbmNvbnN0IFRPUF9MQU5HVUFHRVNfQllfU1BFQUtFUlMgPSBcInRvcExhbmd1YWdlc0J5U3BlYWtlcnNcIjtcbmNvbnN0IEFHR1JFR0FURURfREFUQV9CWV9MQU5HVUFHRSA9ICBcImFnZ3JlZ2F0ZURhdGFDb3VudEJ5TGFuZ3VhZ2VcIjtcbmNvbnN0IExPQ0FMRV9TVFJJTkdTID0gJ2xvY2FsZVN0cmluZyc7XG5jb25zdCBDT05UUklCVVRJT05fTEFOR1VBR0UgPSBcImNvbnRyaWJ1dGlvbkxhbmd1YWdlXCI7XG5jb25zdCBTUEVBS0VSX0RFVEFJTFNfS0VZID0gJ3NwZWFrZXJEZXRhaWxzJztcbmNvbnN0IEFMTF9MQU5HVUFHRVMgPSBbXG4gICAge3ZhbHVlOiBcIkFzc2FtZXNlXCIsaWQ6IFwiYXNcIiwgdGV4dDogXCLgpoXgprjgpq7gp4Dgpq/gprzgpr5cIiwgaGFzTG9jYWxlVGV4dDogdHJ1ZSwgZGF0YTp0cnVlfSxcbiAgICB7dmFsdWU6IFwiQmVuZ2FsaVwiLCBpZDogXCJiblwiLCB0ZXh0OiBcIuCmrOCmvuCmguCmsuCmvlwiLCBoYXNMb2NhbGVUZXh0OiB0cnVlLGRhdGE6dHJ1ZX0sXG4gICAge3ZhbHVlOiBcIkVuZ2xpc2hcIiwgaWQ6IFwiZW5cIiwgdGV4dDogXCJFbmdsaXNoXCIsIGhhc0xvY2FsZVRleHQ6IHRydWUsZGF0YTp0cnVlfSxcbiAgICB7dmFsdWU6IFwiR3VqYXJhdGlcIiwgaWQ6IFwiZ3VcIiwgdGV4dDogXCLgqpfgq4HgqpzgqrDgqr7gqqTgq4BcIiwgaGFzTG9jYWxlVGV4dDogdHJ1ZSxkYXRhOnRydWV9LFxuICAgIHt2YWx1ZTogXCJIaW5kaVwiLCBpZDogXCJoaVwiLCB0ZXh0OiBcIuCkueCkv+CkguCkpuClgFwiLCBoYXNMb2NhbGVUZXh0OiB0cnVlLGRhdGE6dHJ1ZX0sXG4gICAge3ZhbHVlOiBcIkthbm5hZGFcIiwgaWQ6IFwia25cIiwgdGV4dDogXCLgspXgsqjgs43gsqjgsqFcIiwgaGFzTG9jYWxlVGV4dDogdHJ1ZSxkYXRhOnRydWV9LFxuICAgIHt2YWx1ZTogXCJNYWxheWFsYW1cIiwgaWQ6IFwibWxcIiwgdGV4dDogXCLgtK7gtLLgtK/gtL7gtLPgtIJcIiwgaGFzTG9jYWxlVGV4dDogdHJ1ZSxkYXRhOnRydWV9LFxuICAgIHt2YWx1ZTogXCJNYXJhdGhpXCIsIGlkOiBcIm1yXCIsIHRleHQ6IFwi4KSu4KSw4KS+4KSg4KWAXCIsIGhhc0xvY2FsZVRleHQ6IHRydWUsZGF0YTp0cnVlfSxcbiAgICB7dmFsdWU6IFwiT2RpYVwiLCBpZDogXCJvclwiLCB0ZXh0OiBcIuCsk+CsoeCsv+CshlwiLCBoYXNMb2NhbGVUZXh0OiB0cnVlLGRhdGE6dHJ1ZX0sXG4gICAge3ZhbHVlOiBcIlB1bmphYmlcIiwgaWQ6IFwicGFcIiwgdGV4dDogXCLgqKrgqbDgqJzgqL7gqKzgqYBcIiwgaGFzTG9jYWxlVGV4dDogdHJ1ZSxkYXRhOnRydWV9LFxuICAgIHt2YWx1ZTogXCJUYW1pbFwiLCBpZDogXCJ0YVwiLCB0ZXh0OiBcIuCupOCuruCuv+CutOCvjVwiLCBoYXNMb2NhbGVUZXh0OiB0cnVlLGRhdGE6dHJ1ZX0sXG4gICAge3ZhbHVlOiBcIlRlbHVndVwiLCBpZDogXCJ0ZVwiLCB0ZXh0OiBcIuCwpOCxhuCwsuCxgeCwl+CxgVwiLCBoYXNMb2NhbGVUZXh0OiB0cnVlLGRhdGE6dHJ1ZX1dO1xuXG5jb25zdCBCQURHRVMgPSB7XG4gICAgYnJvbnplIDoge2ltZ0xnIDogXCIuLi9pbWcvYnJvbnplX2JhZGdlLnN2Z1wiLCBpbWdTbTpcIi4uL2ltZy9icm9uemVfY29udHJpYnV0b3IuanBlZ1wifSxcbiAgICBzaWx2ZXIgOntpbWdMZzpcIi4uL2ltZy9zaWx2ZXJfYmFkZ2Uuc3ZnXCIsaW1nU206XCIuLi9pbWcvc2lsdmVyX2NvbnRyaWJ1dG9yLmpwZWdcIn0sXG4gICAgZ29sZCA6e2ltZ0xnOlwiLi4vaW1nL2dvbGRfYmFkZ2Uuc3ZnXCIsaW1nU206XCIuLi9pbWcvZ29sZF9jb250cmlidXRvci5qcGVnXCJ9LFxuICAgIHBsYXRpbnVtIDp7aW1nTGc6XCIuLi9pbWcvcGxhdGludW1fYmFkZ2Uuc3ZnXCIsaW1nU206XCIuLi9pbWcvcGxhdGludW1fY29udHJpYnV0b3IuanBlZ1wifSxcbiAgICBjZXJ0aWZpY2F0ZSA6e2ltZ0xnOlwiLi4vaW1nL2NlcnRpZmljYXRlLnN2Z1wiLGltZ1NtOlwiLi4vaW1nL2NlcnRpZmljYXRlLnN2Z1wifVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBERUZBVUxUX0NPTl9MQU5HVUFHRSxcbiAgICBBVURJT19EVVJBVElPTixcbiAgICBTSVhUWSxcbiAgICBIT1VSX0lOX1NFQ09ORFMsXG4gICAgQUxMX0xBTkdVQUdFUyxcbiAgICBUT1BfTEFOR1VBR0VTX0JZX0hPVVJTLFxuICAgIFRPUF9MQU5HVUFHRVNfQllfU1BFQUtFUlMsXG4gICAgQUdHUkVHQVRFRF9EQVRBX0JZX0xBTkdVQUdFLFxuICAgIExPQ0FMRV9TVFJJTkdTLFxuICAgIENPTlRSSUJVVElPTl9MQU5HVUFHRSxcbiAgICBCQURHRVMsXG4gICAgU1BFQUtFUl9ERVRBSUxTX0tFWVxufVxuIl19
},{}],2:[function(require,module,exports){
"use strict";

var env_vars = {
  api_url: 'http://localhost:8080'
};
module.exports = env_vars;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudi1hcGkuanMiXSwibmFtZXMiOlsiZW52X3ZhcnMiLCJhcGlfdXJsIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRLEdBQUc7QUFDWkMsRUFBQUEsT0FBTyxFQUFFO0FBREcsQ0FBakI7QUFJQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSCxRQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVudl92YXJzID0ge1xuICAgICBhcGlfdXJsOiAnQEBhcGlVcmwnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVudl92YXJzOyJdfQ==
},{}],3:[function(require,module,exports){
"use strict";

var _require = require('./utils'),
    performAPIRequest = _require.performAPIRequest,
    getLocaleString = _require.getLocaleString,
    updateLocaleLanguagesDropdown = _require.updateLocaleLanguagesDropdown;

var _require2 = require('./constants'),
    CONTRIBUTION_LANGUAGE = _require2.CONTRIBUTION_LANGUAGE,
    BADGES = _require2.BADGES,
    LOCALE_STRINGS = _require2.LOCALE_STRINGS;

var rowWithBadge = function rowWithBadge(levelId, sentenceCount, badgeName, localeString) {
  var badge = BADGES[badgeName.toLowerCase()];
  var badgeDescription = "<p class=\"text-left mb-0 ml-3\">Recording: ".concat(sentenceCount, " ").concat(localeString.Sentences, "<br/>Validation: 80% of recorded ").concat(sentenceCount, " ").concat(localeString.Sentences, " need to be \"correct\"</p>");

  if (badgeName == 'Bronze') {
    badgeDescription = "<p class=\"text-left mb-0 ml-3\">Recording: ".concat(sentenceCount, " ").concat(localeString.Sentences, "</p>");
  }

  return "<tr><td>".concat(localeString.Level, " ").concat(levelId, "</td><td>").concat(badgeDescription, "</td><td><div><img src=").concat(badge.imgLg, " class=\"table-img\" alt=").concat(badgeName, " id=\"").concat(badgeName, "-image-hover\" rel=\"popover\"></div><span>").concat(localeString[badgeName.toLowerCase()], "</span></td></tr>");
};

var rowWithoutBadge = function rowWithoutBadge(levelId, sentenceCount, localeString) {
  return "<tr><td>".concat(localeString.Level, " ").concat(levelId, "</td><td>").concat(sentenceCount, " ").concat(localeString.Sentences, "</td><td>").concat(localeString['N/A'], "</td></tr>");
};

var getCard = function getCard(badgeName, localeString) {
  var badge = BADGES[badgeName.toLowerCase()];
  return "<div class=\"text-center\">\n                <div class=\"py-2\">\n                    <img src=".concat(badge.imgLg, " alt=\"bronze_badge\" class=\"img-fluid\">\n                </div>\n                <h3>").concat(localeString[badgeName.toLowerCase()], "</h3>\n            </div>");
};

var renderBadgeDetails = function renderBadgeDetails(data) {
  var $tableRows = $('#table-rows');
  var localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
  data.forEach(function (element, index) {
    var contributions = element.contributions,
        badge = element.badge;
    var rowId = index + 1;
    var row;

    if (badge) {
      row = rowWithBadge(rowId, contributions, badge, localeString);
    } else {
      row = rowWithoutBadge(rowId, contributions, localeString);
    }

    $tableRows.append(row);
    $("#".concat(badge, "-image-hover[rel=popover]")).popover({
      html: true,
      trigger: 'hover',
      placement: 'left',
      content: function content() {
        return getCard(badge, localeString);
      }
    });
  });
};

$(document).ready(function () {
  var language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
  getLocaleString().then(function () {
    performAPIRequest("/rewards-info?language=".concat(language)).then(renderBadgeDetails)["catch"](function (err) {
      console.log(err);
    });
  })["catch"](function () {
    window.location.href = "/";
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNTRmMzgzZWQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsInBlcmZvcm1BUElSZXF1ZXN0IiwiZ2V0TG9jYWxlU3RyaW5nIiwidXBkYXRlTG9jYWxlTGFuZ3VhZ2VzRHJvcGRvd24iLCJDT05UUklCVVRJT05fTEFOR1VBR0UiLCJCQURHRVMiLCJMT0NBTEVfU1RSSU5HUyIsInJvd1dpdGhCYWRnZSIsImxldmVsSWQiLCJzZW50ZW5jZUNvdW50IiwiYmFkZ2VOYW1lIiwibG9jYWxlU3RyaW5nIiwiYmFkZ2UiLCJ0b0xvd2VyQ2FzZSIsImJhZGdlRGVzY3JpcHRpb24iLCJTZW50ZW5jZXMiLCJMZXZlbCIsImltZ0xnIiwicm93V2l0aG91dEJhZGdlIiwiZ2V0Q2FyZCIsInJlbmRlckJhZGdlRGV0YWlscyIsImRhdGEiLCIkdGFibGVSb3dzIiwiJCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JFYWNoIiwiZWxlbWVudCIsImluZGV4IiwiY29udHJpYnV0aW9ucyIsInJvd0lkIiwicm93IiwiYXBwZW5kIiwicG9wb3ZlciIsImh0bWwiLCJ0cmlnZ2VyIiwicGxhY2VtZW50IiwiY29udGVudCIsImRvY3VtZW50IiwicmVhZHkiLCJsYW5ndWFnZSIsInRoZW4iLCJlcnIiLCJjb25zb2xlIiwibG9nIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIl0sIm1hcHBpbmdzIjoiOztlQUlJQSxPQUFPLENBQUMsU0FBRCxDO0lBSFRDLGlCLFlBQUFBLGlCO0lBQ0FDLGUsWUFBQUEsZTtJQUNBQyw2QixZQUFBQSw2Qjs7Z0JBRXNESCxPQUFPLENBQUMsYUFBRCxDO0lBQXhESSxxQixhQUFBQSxxQjtJQUF1QkMsTSxhQUFBQSxNO0lBQVFDLGMsYUFBQUEsYzs7QUFHdEMsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBVUMsT0FBVixFQUFtQkMsYUFBbkIsRUFBa0NDLFNBQWxDLEVBQTZDQyxZQUE3QyxFQUEyRDtBQUM5RSxN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Q0MsT0FBYixDQUFxQnZCLHFCQUFyQixLQUErQyxTQUFoRTtBQUNBRCxFQUFBQSw2QkFBNkIsQ0FBQ3VDLFFBQUQsQ0FBN0I7QUFDQXhDLEVBQUFBLGVBQWUsR0FBR3lDLElBQWxCLENBQXVCLFlBQU07QUFDM0IxQyxJQUFBQSxpQkFBaUIsa0NBQTJCeUMsUUFBM0IsRUFBakIsQ0FBd0RDLElBQXhELENBQTZEdkIsa0JBQTdELFdBQXVGLFVBQUN3QixHQUFELEVBQVM7QUFDOUZDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0QsS0FGRDtBQUdELEdBSkQsV0FJUyxZQUFNO0FBQ2JHLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUIsR0FBdkI7QUFDRCxHQU5EO0FBT0QsQ0FWRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtcbiAgcGVyZm9ybUFQSVJlcXVlc3QsXG4gIGdldExvY2FsZVN0cmluZyxcbiAgdXBkYXRlTG9jYWxlTGFuZ3VhZ2VzRHJvcGRvd25cbn0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCB7Q09OVFJJQlVUSU9OX0xBTkdVQUdFLCBCQURHRVMsIExPQ0FMRV9TVFJJTkdTfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cblxuY29uc3Qgcm93V2l0aEJhZGdlID0gZnVuY3Rpb24gKGxldmVsSWQsIHNlbnRlbmNlQ291bnQsIGJhZGdlTmFtZSwgbG9jYWxlU3RyaW5nKSB7XG4gIGNvbnN0IGJhZGdlID0gQkFER0VTW2JhZGdlTmFtZS50b0xvd2VyQ2FzZSgpXTtcbiAgbGV0IGJhZGdlRGVzY3JpcHRpb24gPSBgPHAgY2xhc3M9XCJ0ZXh0LWxlZnQgbWItMCBtbC0zXCI+UmVjb3JkaW5nOiAke3NlbnRlbmNlQ291bnR9ICR7bG9jYWxlU3RyaW5nLlNlbnRlbmNlc308YnIvPlZhbGlkYXRpb246IDgwJSBvZiByZWNvcmRlZCAke3NlbnRlbmNlQ291bnR9ICR7bG9jYWxlU3RyaW5nLlNlbnRlbmNlc30gbmVlZCB0byBiZSBcImNvcnJlY3RcIjwvcD5gO1xuICBpZihiYWRnZU5hbWUgPT0gJ0Jyb256ZScpe1xuICAgIGJhZGdlRGVzY3JpcHRpb249IGA8cCBjbGFzcz1cInRleHQtbGVmdCBtYi0wIG1sLTNcIj5SZWNvcmRpbmc6ICR7c2VudGVuY2VDb3VudH0gJHtsb2NhbGVTdHJpbmcuU2VudGVuY2VzfTwvcD5gXG4gIH1cbiAgcmV0dXJuIGA8dHI+PHRkPiR7bG9jYWxlU3RyaW5nLkxldmVsfSAke2xldmVsSWR9PC90ZD48dGQ+JHtiYWRnZURlc2NyaXB0aW9ufTwvdGQ+PHRkPjxkaXY+PGltZyBzcmM9JHtiYWRnZS5pbWdMZ30gY2xhc3M9XCJ0YWJsZS1pbWdcIiBhbHQ9JHtiYWRnZU5hbWV9IGlkPVwiJHtiYWRnZU5hbWV9LWltYWdlLWhvdmVyXCIgcmVsPVwicG9wb3ZlclwiPjwvZGl2PjxzcGFuPiR7bG9jYWxlU3RyaW5nW2JhZGdlTmFtZS50b0xvd2VyQ2FzZSgpXX08L3NwYW4+PC90ZD48L3RyPmBcbn1cblxuY29uc3Qgcm93V2l0aG91dEJhZGdlID0gZnVuY3Rpb24gKGxldmVsSWQsIHNlbnRlbmNlQ291bnQsIGxvY2FsZVN0cmluZykge1xuICByZXR1cm4gYDx0cj48dGQ+JHtsb2NhbGVTdHJpbmcuTGV2ZWx9ICR7bGV2ZWxJZH08L3RkPjx0ZD4ke3NlbnRlbmNlQ291bnR9ICR7bG9jYWxlU3RyaW5nLlNlbnRlbmNlc308L3RkPjx0ZD4ke2xvY2FsZVN0cmluZ1snTi9BJ119PC90ZD48L3RyPmBcbn1cblxuY29uc3QgZ2V0Q2FyZCA9IGZ1bmN0aW9uIChiYWRnZU5hbWUsIGxvY2FsZVN0cmluZykge1xuICBjb25zdCBiYWRnZSA9IEJBREdFU1tiYWRnZU5hbWUudG9Mb3dlckNhc2UoKV07XG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9JHtiYWRnZS5pbWdMZ30gYWx0PVwiYnJvbnplX2JhZGdlXCIgY2xhc3M9XCJpbWctZmx1aWRcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aDM+JHtsb2NhbGVTdHJpbmdbYmFkZ2VOYW1lLnRvTG93ZXJDYXNlKCldfTwvaDM+XG4gICAgICAgICAgICA8L2Rpdj5gXG5cbn1cblxuY29uc3QgcmVuZGVyQmFkZ2VEZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgY29uc3QgJHRhYmxlUm93cyA9ICQoJyN0YWJsZS1yb3dzJyk7XG4gIGNvbnN0IGxvY2FsZVN0cmluZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxFX1NUUklOR1MpKTtcbiAgZGF0YS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHtjb250cmlidXRpb25zLCBiYWRnZX0gPSBlbGVtZW50O1xuICAgIGNvbnN0IHJvd0lkID0gaW5kZXggKyAxO1xuICAgIGxldCByb3c7XG4gICAgaWYgKGJhZGdlKSB7XG4gICAgICByb3cgPSByb3dXaXRoQmFkZ2Uocm93SWQsIGNvbnRyaWJ1dGlvbnMsIGJhZGdlLCBsb2NhbGVTdHJpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3cgPSByb3dXaXRob3V0QmFkZ2Uocm93SWQsIGNvbnRyaWJ1dGlvbnMsIGxvY2FsZVN0cmluZyk7XG4gICAgfVxuICAgICR0YWJsZVJvd3MuYXBwZW5kKHJvdyk7XG4gICAgJChgIyR7YmFkZ2V9LWltYWdlLWhvdmVyW3JlbD1wb3BvdmVyXWApLnBvcG92ZXIoe1xuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHRyaWdnZXI6ICdob3ZlcicsXG4gICAgICBwbGFjZW1lbnQ6ICdsZWZ0JyxcbiAgICAgIGNvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldENhcmQoYmFkZ2UsIGxvY2FsZVN0cmluZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgbGFuZ3VhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShDT05UUklCVVRJT05fTEFOR1VBR0UpIHx8ICdlbmdsaXNoJztcbiAgdXBkYXRlTG9jYWxlTGFuZ3VhZ2VzRHJvcGRvd24obGFuZ3VhZ2UpO1xuICBnZXRMb2NhbGVTdHJpbmcoKS50aGVuKCgpID0+IHtcbiAgICBwZXJmb3JtQVBJUmVxdWVzdChgL3Jld2FyZHMtaW5mbz9sYW5ndWFnZT0ke2xhbmd1YWdlfWApLnRoZW4ocmVuZGVyQmFkZ2VEZXRhaWxzKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pXG4gIH0pLmNhdGNoKCgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL1wiO1xuICB9KVxufSk7Il19
},{"./constants":1,"./utils":5}],4:[function(require,module,exports){
"use strict";

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _require = require('./env-api'),
    api_url = _require.api_url;

var fetch = function fetch(url) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  if (url.startsWith('/')) return _nodeFetch["default"].apply(void 0, [api_url + url].concat(params));else return _nodeFetch["default"].apply(void 0, [url].concat(params));
};

module.exports = fetch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZldGNoLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJhcGlfdXJsIiwiZmV0Y2giLCJ1cmwiLCJwYXJhbXMiLCJzdGFydHNXaXRoIiwib3JpZ0ZldGNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztlQUNvQkEsT0FBTyxDQUFDLFdBQUQsQztJQUFuQkMsTyxZQUFBQSxPOztBQUVSLElBQU1DLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLEdBQUQsRUFBb0I7QUFBQSxvQ0FBWEMsTUFBVztBQUFYQSxJQUFBQSxNQUFXO0FBQUE7O0FBQ2hDLE1BQUlELEdBQUcsQ0FBQ0UsVUFBSixDQUFlLEdBQWYsQ0FBSixFQUF5QixPQUFPQyxxQ0FBVUwsT0FBTyxHQUFHRSxHQUFwQixTQUE0QkMsTUFBNUIsRUFBUCxDQUF6QixLQUNLLE9BQU9FLHFDQUFVSCxHQUFWLFNBQWtCQyxNQUFsQixFQUFQO0FBQ04sQ0FIRDs7QUFLQUcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTixLQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcmlnRmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XG5jb25zdCB7IGFwaV91cmwgfSA9IHJlcXVpcmUoJy4vZW52LWFwaScpXG5cbmNvbnN0IGZldGNoID0gKHVybCwgLi4ucGFyYW1zKSA9PiB7XG4gIGlmICh1cmwuc3RhcnRzV2l0aCgnLycpKSByZXR1cm4gb3JpZ0ZldGNoKGFwaV91cmwgKyB1cmwsIC4uLnBhcmFtcylcbiAgZWxzZSByZXR1cm4gb3JpZ0ZldGNoKHVybCwgLi4ucGFyYW1zKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmZXRjaCJdfQ==
},{"./env-api":2,"node-fetch":6}],5:[function(require,module,exports){
"use strict";

var _require = require("./constants"),
    HOUR_IN_SECONDS = _require.HOUR_IN_SECONDS,
    SIXTY = _require.SIXTY,
    ALL_LANGUAGES = _require.ALL_LANGUAGES;

var fetch = require('./fetch');

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

function showElement(element) {
  element.removeClass('d-none');
}

function hideElement(element) {
  element.addClass('d-none');
}

function convertPXToVH(px) {
  return px * (100 / document.documentElement.clientHeight);
}

function setPageContentHeight() {
  var $footer = $('footer');
  var $nav = $('.navbar');
  var edgeHeightInPixel = $footer.outerHeight() + $nav.outerHeight();
  var contentHeightInVH = 100 - convertPXToVH(edgeHeightInPixel);
  $('#content-wrapper').css('min-height', contentHeightInVH + 'vh');
}

function toggleFooterPosition() {
  var $footer = $('footer');
  $footer.toggleClass('fixed-bottom');
  $footer.toggleClass('bottom');
}

function fetchLocationInfo() {
  //https://api.ipify.org/?format=json
  var regionName = localStorage.getItem("state_region") || "NOT_PRESENT";
  var countryName = localStorage.getItem("country") || "NOT_PRESENT";

  if (regionName !== "NOT_PRESENT" && countryName !== "NOT_PRESENT" && regionName.length > 0 && countryName.length > 0) {
    return new Promise(function (resolve) {
      resolve({
        "regionName": regionName,
        "country": countryName
      });
    });
  }

  return fetch('https://www.cloudflare.com/cdn-cgi/trace').then(function (res) {
    return res.text();
  }).then(function (ipAddressText) {
    var dataArray = ipAddressText.split('\n');
    var ipAddress = "";

    for (var ind in dataArray) {
      if (dataArray[ind].startsWith("ip=")) {
        ipAddress = dataArray[ind].replace('ip=', '');
        break;
      }
    }

    if (ipAddress.length !== 0) {
      return fetch("/location-info?ip=".concat(ipAddress));
    } else {
      return new Promise(function (resolve, reject) {
        reject("Ip Address not available");
      });
    }
  });
}

var performAPIRequest = function performAPIRequest(url) {
  return fetch(url, {
    credentials: 'include',
    mode: 'cors'
  }).then(function (data) {
    if (!data.ok) {
      throw Error(data.statusText || 'HTTP error');
    } else {
      return Promise.resolve(data.json());
    }
  });
};

var performAPIPostRequest = function performAPIPostRequest(url, data) {
  return fetch(url, {
    method: "POST",
    credentials: 'include',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {
      throw Error(res.statusText || 'HTTP error');
    } else {
      return Promise.resolve(res.json());
    }
  });
};

var getLocaleString = function getLocaleString() {
  return new Promise(function (resolve, reject) {
    var _localStorage$getItem;

    var locale = (_localStorage$getItem = localStorage.getItem("i18n")) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : "en";
    performAPIRequest("/get-locale-strings/".concat(locale)).then(function (response) {
      localStorage.setItem('localeString', JSON.stringify(response));
      resolve(response);
    })["catch"](function (err) {
      return reject(err);
    });
  });
};

var updateLocaleLanguagesDropdown = function updateLocaleLanguagesDropdown(language) {
  var dropDown = $('#localisation_dropdown');
  var localeLang = ALL_LANGUAGES.find(function (ele) {
    return ele.value === language;
  });

  if (language.toLowerCase() === "english" || localeLang.hasLocaleText === false) {
    dropDown.html('<a id="english" class="dropdown-item" href="#" locale="en">English</a>');
  } else {
    dropDown.html("<a id=\"english\" class=\"dropdown-item\" href=\"#\" locale=\"en\">English</a>\n        <a id=".concat(localeLang.value, " class=\"dropdown-item\" href=\"#\" locale=\"").concat(localeLang.id, "\">").concat(localeLang.text, "</a>"));
  }
};

var calculateTime = function calculateTime(totalSeconds) {
  var isSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
  var remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
  var minutes = Math.floor(remainingAfterHours / SIXTY);
  var seconds = Math.round(remainingAfterHours % SIXTY);

  if (isSeconds) {
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  } else {
    return {
      hours: hours,
      minutes: minutes
    };
  }
};

var formatTime = function formatTime(hours) {
  var minutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var seconds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var result = "";

  if (hours > 0) {
    result += "".concat(hours, " hrs ");
  }

  if (minutes > 0) {
    result += "".concat(minutes, " min ");
  }

  if (hours === 0 && minutes === 0 && seconds > 0) {
    result += "".concat(seconds, " sec ");
  }

  return result.substr(0, result.length - 1);
};

var setFooterPosition = function setFooterPosition() {
  var contentHeight = $('#page-content').outerHeight();
  var bodyHeight = $('body').outerHeight();
  var navHeight = $('nav').outerHeight();
  var footerHeight = $('footer').outerHeight();
  var totalHeight = contentHeight + navHeight + footerHeight;

  if (bodyHeight <= totalHeight) {
    $('footer').removeClass('fixed-bottom').addClass('bottom');
  }
};

var reportSentenceOrRecording = function reportSentenceOrRecording(reqObj) {
  return new Promise(function (resolve, reject) {
    try {
      fetch('/report', {
        method: "POST",
        credentials: 'include',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqObj)
      }).then(function (res) {
        return res.json();
      }).then(function (resp) {
        resolve(resp);
      });
    } catch (err) {
      reject(err);
    }
  });
};

var getJson = function getJson(path) {
  return new Promise(function (resolve) {
    $.getJSON(path, function (data) {
      resolve(data);
    });
  });
};

module.exports = {
  setPageContentHeight: setPageContentHeight,
  toggleFooterPosition: toggleFooterPosition,
  fetchLocationInfo: fetchLocationInfo,
  updateLocaleLanguagesDropdown: updateLocaleLanguagesDropdown,
  calculateTime: calculateTime,
  formatTime: formatTime,
  getLocaleString: getLocaleString,
  performAPIRequest: performAPIRequest,
  showElement: showElement,
  hideElement: hideElement,
  setFooterPosition: setFooterPosition,
  reportSentenceOrRecording: reportSentenceOrRecording,
  getCookie: getCookie,
  setCookie: setCookie,
  getJson: getJson
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJIT1VSX0lOX1NFQ09ORFMiLCJTSVhUWSIsIkFMTF9MQU5HVUFHRVMiLCJmZXRjaCIsInNldENvb2tpZSIsImNuYW1lIiwiY3ZhbHVlIiwiZXhkYXlzIiwiZCIsIkRhdGUiLCJzZXRUaW1lIiwiZ2V0VGltZSIsImV4cGlyZXMiLCJ0b0dNVFN0cmluZyIsImRvY3VtZW50IiwiY29va2llIiwiZ2V0Q29va2llIiwibmFtZSIsImRlY29kZWRDb29raWUiLCJkZWNvZGVVUklDb21wb25lbnQiLCJjYSIsInNwbGl0IiwiaSIsImxlbmd0aCIsImMiLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwic2hvd0VsZW1lbnQiLCJlbGVtZW50IiwicmVtb3ZlQ2xhc3MiLCJoaWRlRWxlbWVudCIsImFkZENsYXNzIiwiY29udmVydFBYVG9WSCIsInB4IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0Iiwic2V0UGFnZUNvbnRlbnRIZWlnaHQiLCIkZm9vdGVyIiwiJCIsIiRuYXYiLCJlZGdlSGVpZ2h0SW5QaXhlbCIsIm91dGVySGVpZ2h0IiwiY29udGVudEhlaWdodEluVkgiLCJjc3MiLCJ0b2dnbGVGb290ZXJQb3NpdGlvbiIsInRvZ2dsZUNsYXNzIiwiZmV0Y2hMb2NhdGlvbkluZm8iLCJyZWdpb25OYW1lIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImNvdW50cnlOYW1lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwicmVzIiwidGV4dCIsImlwQWRkcmVzc1RleHQiLCJkYXRhQXJyYXkiLCJpcEFkZHJlc3MiLCJpbmQiLCJzdGFydHNXaXRoIiwicmVwbGFjZSIsInJlamVjdCIsInBlcmZvcm1BUElSZXF1ZXN0IiwidXJsIiwiY3JlZGVudGlhbHMiLCJtb2RlIiwiZGF0YSIsIm9rIiwiRXJyb3IiLCJzdGF0dXNUZXh0IiwianNvbiIsInBlcmZvcm1BUElQb3N0UmVxdWVzdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImdldExvY2FsZVN0cmluZyIsImxvY2FsZSIsInJlc3BvbnNlIiwic2V0SXRlbSIsImVyciIsInVwZGF0ZUxvY2FsZUxhbmd1YWdlc0Ryb3Bkb3duIiwibGFuZ3VhZ2UiLCJkcm9wRG93biIsImxvY2FsZUxhbmciLCJmaW5kIiwiZWxlIiwidmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImhhc0xvY2FsZVRleHQiLCJodG1sIiwiaWQiLCJjYWxjdWxhdGVUaW1lIiwidG90YWxTZWNvbmRzIiwiaXNTZWNvbmRzIiwiaG91cnMiLCJNYXRoIiwiZmxvb3IiLCJyZW1haW5pbmdBZnRlckhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJyb3VuZCIsImZvcm1hdFRpbWUiLCJyZXN1bHQiLCJzdWJzdHIiLCJzZXRGb290ZXJQb3NpdGlvbiIsImNvbnRlbnRIZWlnaHQiLCJib2R5SGVpZ2h0IiwibmF2SGVpZ2h0IiwiZm9vdGVySGVpZ2h0IiwidG90YWxIZWlnaHQiLCJyZXBvcnRTZW50ZW5jZU9yUmVjb3JkaW5nIiwicmVxT2JqIiwicmVzcCIsImdldEpzb24iLCJwYXRoIiwiZ2V0SlNPTiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O2VBQWtEQSxPQUFPLENBQUMsYUFBRCxDO0lBQWpEQyxlLFlBQUFBLGU7SUFBaUJDLEssWUFBQUEsSztJQUFPQyxhLFlBQUFBLGE7O0FBQ2hDLElBQU1DLEtBQUssR0FBR0osT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBR0EsU0FBU0ssU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEJDLE1BQTFCLEVBQWtDQyxNQUFsQyxFQUEwQztBQUN0QyxNQUFJQyxDQUFDLEdBQUcsSUFBSUMsSUFBSixFQUFSO0FBQ0FELEVBQUFBLENBQUMsQ0FBQ0UsT0FBRixDQUFVRixDQUFDLENBQUNHLE9BQUYsS0FBZUosTUFBTSxHQUFHLEVBQVQsR0FBYyxFQUFkLEdBQW1CLEVBQW5CLEdBQXdCLElBQWpEO0FBQ0EsTUFBSUssT0FBTyxHQUFHLGFBQWFKLENBQUMsQ0FBQ0ssV0FBRixFQUEzQjtBQUNBQyxFQUFBQSxRQUFRLENBQUNDLE1BQVQsR0FBa0JWLEtBQUssR0FBRyxHQUFSLEdBQWNDLE1BQWQsR0FBdUIsR0FBdkIsR0FBNkJNLE9BQTdCLEdBQXVDLFNBQXpEO0FBQ0g7O0FBRUQsU0FBU0ksU0FBVCxDQUFtQlgsS0FBbkIsRUFBMEI7QUFDdEIsTUFBSVksSUFBSSxHQUFHWixLQUFLLEdBQUcsR0FBbkI7QUFDQSxNQUFJYSxhQUFhLEdBQUdDLGtCQUFrQixDQUFDTCxRQUFRLENBQUNDLE1BQVYsQ0FBdEM7QUFDQSxNQUFJSyxFQUFFLEdBQUdGLGFBQWEsQ0FBQ0csS0FBZCxDQUFvQixHQUFwQixDQUFUOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsRUFBRSxDQUFDRyxNQUF2QixFQUErQkQsQ0FBQyxFQUFoQyxFQUFvQztBQUNoQyxRQUFJRSxDQUFDLEdBQUdKLEVBQUUsQ0FBQ0UsQ0FBRCxDQUFWOztBQUNBLFdBQU9FLENBQUMsQ0FBQ0MsTUFBRixDQUFTLENBQVQsS0FBZSxHQUF0QixFQUEyQjtBQUN2QkQsTUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNFLFNBQUYsQ0FBWSxDQUFaLENBQUo7QUFDSDs7QUFDRCxRQUFJRixDQUFDLENBQUNHLE9BQUYsQ0FBVVYsSUFBVixLQUFtQixDQUF2QixFQUEwQjtBQUN0QixhQUFPTyxDQUFDLENBQUNFLFNBQUYsQ0FBWVQsSUFBSSxDQUFDTSxNQUFqQixFQUF5QkMsQ0FBQyxDQUFDRCxNQUEzQixDQUFQO0FBQ0g7QUFDSjs7QUFDRCxTQUFPLEVBQVA7QUFDSDs7QUFFRCxTQUFTSyxXQUFULENBQXFCQyxPQUFyQixFQUE4QjtBQUM1QkEsRUFBQUEsT0FBTyxDQUFDQyxXQUFSLENBQW9CLFFBQXBCO0FBQ0Q7O0FBRUQsU0FBU0MsV0FBVCxDQUFxQkYsT0FBckIsRUFBOEI7QUFDNUJBLEVBQUFBLE9BQU8sQ0FBQ0csUUFBUixDQUFpQixRQUFqQjtBQUNEOztBQUVELFNBQVNDLGFBQVQsQ0FBdUJDLEVBQXZCLEVBQTJCO0FBQ3pCLFNBQU9BLEVBQUUsSUFBSSxNQUFNcEIsUUFBUSxDQUFDcUIsZUFBVCxDQUF5QkMsWUFBbkMsQ0FBVDtBQUNEOztBQUVELFNBQVNDLG9CQUFULEdBQWdDO0FBQzlCLE1BQU1DLE9BQU8sR0FBR0MsQ0FBQyxDQUFDLFFBQUQsQ0FBakI7QUFDQSxNQUFNQyxJQUFJLEdBQUdELENBQUMsQ0FBQyxTQUFELENBQWQ7QUFDQSxNQUFNRSxpQkFBaUIsR0FBR0gsT0FBTyxDQUFDSSxXQUFSLEtBQXdCRixJQUFJLENBQUNFLFdBQUwsRUFBbEQ7QUFDQSxNQUFNQyxpQkFBaUIsR0FBRyxNQUFNVixhQUFhLENBQUNRLGlCQUFELENBQTdDO0FBQ0FGLEVBQUFBLENBQUMsQ0FBQyxrQkFBRCxDQUFELENBQXNCSyxHQUF0QixDQUEwQixZQUExQixFQUF3Q0QsaUJBQWlCLEdBQUcsSUFBNUQ7QUFDRDs7QUFFRCxTQUFTRSxvQkFBVCxHQUFnQztBQUM5QixNQUFNUCxPQUFPLEdBQUdDLENBQUMsQ0FBQyxRQUFELENBQWpCO0FBQ0FELEVBQUFBLE9BQU8sQ0FBQ1EsV0FBUixDQUFvQixjQUFwQjtBQUNBUixFQUFBQSxPQUFPLENBQUNRLFdBQVIsQ0FBb0IsUUFBcEI7QUFDRDs7QUFFRCxTQUFTQyxpQkFBVCxHQUE2QjtBQUMzQjtBQUNBLE1BQUlDLFVBQVUsR0FBR0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCLGNBQXJCLEtBQXdDLGFBQXpEO0FBQ0EsTUFBSUMsV0FBVyxHQUFHRixZQUFZLENBQUNDLE9BQWIsQ0FBcUIsU0FBckIsS0FBbUMsYUFBckQ7O0FBQ0EsTUFBSUYsVUFBVSxLQUFLLGFBQWYsSUFBZ0NHLFdBQVcsS0FBSyxhQUFoRCxJQUFpRUgsVUFBVSxDQUFDekIsTUFBWCxHQUFvQixDQUFyRixJQUEwRjRCLFdBQVcsQ0FBQzVCLE1BQVosR0FBcUIsQ0FBbkgsRUFBc0g7QUFDcEgsV0FBTyxJQUFJNkIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM5QkEsTUFBQUEsT0FBTyxDQUFDO0FBQUMsc0JBQWNMLFVBQWY7QUFBMkIsbUJBQVdHO0FBQXRDLE9BQUQsQ0FBUDtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUNELFNBQU9oRCxLQUFLLENBQUMsMENBQUQsQ0FBTCxDQUFrRG1ELElBQWxELENBQXVELFVBQUFDLEdBQUc7QUFBQSxXQUFJQSxHQUFHLENBQUNDLElBQUosRUFBSjtBQUFBLEdBQTFELEVBQTBFRixJQUExRSxDQUErRSxVQUFBRyxhQUFhLEVBQUk7QUFDckcsUUFBTUMsU0FBUyxHQUFHRCxhQUFhLENBQUNwQyxLQUFkLENBQW9CLElBQXBCLENBQWxCO0FBQ0EsUUFBSXNDLFNBQVMsR0FBRyxFQUFoQjs7QUFDQSxTQUFLLElBQUlDLEdBQVQsSUFBZ0JGLFNBQWhCLEVBQTJCO0FBQ3pCLFVBQUlBLFNBQVMsQ0FBQ0UsR0FBRCxDQUFULENBQWVDLFVBQWYsQ0FBMEIsS0FBMUIsQ0FBSixFQUFzQztBQUNwQ0YsUUFBQUEsU0FBUyxHQUFHRCxTQUFTLENBQUNFLEdBQUQsQ0FBVCxDQUFlRSxPQUFmLENBQXVCLEtBQXZCLEVBQThCLEVBQTlCLENBQVo7QUFDQTtBQUNEO0FBQ0Y7O0FBQ0QsUUFBSUgsU0FBUyxDQUFDcEMsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixhQUFPcEIsS0FBSyw2QkFBc0J3RCxTQUF0QixFQUFaO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxJQUFJUCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVVSxNQUFWLEVBQXFCO0FBQ3RDQSxRQUFBQSxNQUFNLENBQUMsMEJBQUQsQ0FBTjtBQUNELE9BRk0sQ0FBUDtBQUdEO0FBQ0YsR0FoQk0sQ0FBUDtBQWlCRDs7QUFFRCxJQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUNDLEdBQUQsRUFBUztBQUNqQyxTQUFPOUQsS0FBSyxDQUFDOEQsR0FBRCxFQUFNO0FBQ2hCQyxJQUFBQSxXQUFXLEVBQUUsU0FERztBQUVoQkMsSUFBQUEsSUFBSSxFQUFFO0FBRlUsR0FBTixDQUFMLENBR0piLElBSEksQ0FHQyxVQUFDYyxJQUFELEVBQVU7QUFDaEIsUUFBSSxDQUFDQSxJQUFJLENBQUNDLEVBQVYsRUFBYztBQUNaLFlBQU1DLEtBQUssQ0FBQ0YsSUFBSSxDQUFDRyxVQUFMLElBQW1CLFlBQXBCLENBQVg7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPbkIsT0FBTyxDQUFDQyxPQUFSLENBQWdCZSxJQUFJLENBQUNJLElBQUwsRUFBaEIsQ0FBUDtBQUNEO0FBQ0YsR0FUTSxDQUFQO0FBVUQsQ0FYRDs7QUFhQSxJQUFNQyxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUNSLEdBQUQsRUFBTUcsSUFBTixFQUFhO0FBQ3pDLFNBQU9qRSxLQUFLLENBQUM4RCxHQUFELEVBQU07QUFDaEJTLElBQUFBLE1BQU0sRUFBRSxNQURRO0FBRWhCUixJQUFBQSxXQUFXLEVBQUUsU0FGRztBQUdoQkMsSUFBQUEsSUFBSSxFQUFFLE1BSFU7QUFJaEJRLElBQUFBLE9BQU8sRUFBRTtBQUNQLHNCQUFnQjtBQURULEtBSk87QUFPaEJDLElBQUFBLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFMLENBQWVWLElBQWY7QUFQVSxHQUFOLENBQUwsQ0FRSmQsSUFSSSxDQVFDLFVBQUNDLEdBQUQsRUFBUztBQUNmLFFBQUksQ0FBQ0EsR0FBRyxDQUFDYyxFQUFULEVBQWE7QUFDWCxZQUFNQyxLQUFLLENBQUNmLEdBQUcsQ0FBQ2dCLFVBQUosSUFBa0IsWUFBbkIsQ0FBWDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU9uQixPQUFPLENBQUNDLE9BQVIsQ0FBZ0JFLEdBQUcsQ0FBQ2lCLElBQUosRUFBaEIsQ0FBUDtBQUNEO0FBQ0YsR0FkTSxDQUFQO0FBZUQsQ0FoQkQ7O0FBa0JBLElBQU1PLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsR0FBVztBQUMvQixTQUFPLElBQUkzQixPQUFKLENBQVksVUFBU0MsT0FBVCxFQUFrQlUsTUFBbEIsRUFBMEI7QUFBQTs7QUFDekMsUUFBTWlCLE1BQU0sNEJBQUcvQixZQUFZLENBQUNDLE9BQWIsQ0FBcUIsTUFBckIsQ0FBSCx5RUFBbUMsSUFBL0M7QUFDQWMsSUFBQUEsaUJBQWlCLCtCQUF3QmdCLE1BQXhCLEVBQWpCLENBQ0MxQixJQURELENBQ00sVUFBQzJCLFFBQUQsRUFBYztBQUNoQmhDLE1BQUFBLFlBQVksQ0FBQ2lDLE9BQWIsQ0FBcUIsY0FBckIsRUFBcUNMLElBQUksQ0FBQ0MsU0FBTCxDQUFlRyxRQUFmLENBQXJDO0FBQ0E1QixNQUFBQSxPQUFPLENBQUM0QixRQUFELENBQVA7QUFDSCxLQUpELFdBSVMsVUFBQ0UsR0FBRDtBQUFBLGFBQU9wQixNQUFNLENBQUNvQixHQUFELENBQWI7QUFBQSxLQUpUO0FBS0gsR0FQTSxDQUFQO0FBUUgsQ0FURDs7QUFXQSxJQUFNQyw2QkFBNkIsR0FBRyxTQUFoQ0EsNkJBQWdDLENBQUNDLFFBQUQsRUFBYztBQUNoRCxNQUFNQyxRQUFRLEdBQUcvQyxDQUFDLENBQUMsd0JBQUQsQ0FBbEI7QUFDQSxNQUFNZ0QsVUFBVSxHQUFHckYsYUFBYSxDQUFDc0YsSUFBZCxDQUFtQixVQUFBQyxHQUFHO0FBQUEsV0FBSUEsR0FBRyxDQUFDQyxLQUFKLEtBQWNMLFFBQWxCO0FBQUEsR0FBdEIsQ0FBbkI7O0FBQ0EsTUFBR0EsUUFBUSxDQUFDTSxXQUFULE9BQTJCLFNBQTNCLElBQXdDSixVQUFVLENBQUNLLGFBQVgsS0FBNkIsS0FBeEUsRUFBK0U7QUFDM0VOLElBQUFBLFFBQVEsQ0FBQ08sSUFBVCxDQUFjLHdFQUFkO0FBQ0gsR0FGRCxNQUVPO0FBQ0hQLElBQUFBLFFBQVEsQ0FBQ08sSUFBVCx5R0FDUU4sVUFBVSxDQUFDRyxLQURuQiwwREFDbUVILFVBQVUsQ0FBQ08sRUFEOUUsZ0JBQ3FGUCxVQUFVLENBQUMvQixJQURoRztBQUVIO0FBQ0osQ0FURDs7QUFXQSxJQUFNdUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFVQyxZQUFWLEVBQTBDO0FBQUEsTUFBbEJDLFNBQWtCLHVFQUFOLElBQU07QUFDOUQsTUFBTUMsS0FBSyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0osWUFBWSxHQUFHaEcsZUFBMUIsQ0FBZDtBQUNBLE1BQU1xRyxtQkFBbUIsR0FBR0wsWUFBWSxHQUFHaEcsZUFBM0M7QUFDQSxNQUFNc0csT0FBTyxHQUFHSCxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsbUJBQW1CLEdBQUdwRyxLQUFqQyxDQUFoQjtBQUNBLE1BQU1zRyxPQUFPLEdBQUdKLElBQUksQ0FBQ0ssS0FBTCxDQUFXSCxtQkFBbUIsR0FBR3BHLEtBQWpDLENBQWhCOztBQUNBLE1BQUlnRyxTQUFKLEVBQWU7QUFDYixXQUFPO0FBQUNDLE1BQUFBLEtBQUssRUFBTEEsS0FBRDtBQUFRSSxNQUFBQSxPQUFPLEVBQVBBLE9BQVI7QUFBaUJDLE1BQUFBLE9BQU8sRUFBUEE7QUFBakIsS0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU87QUFBQ0wsTUFBQUEsS0FBSyxFQUFMQSxLQUFEO0FBQVFJLE1BQUFBLE9BQU8sRUFBUEE7QUFBUixLQUFQO0FBQ0Q7QUFDRixDQVZEOztBQVlBLElBQU1HLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQVVQLEtBQVYsRUFBMkM7QUFBQSxNQUExQkksT0FBMEIsdUVBQWhCLENBQWdCO0FBQUEsTUFBYkMsT0FBYSx1RUFBSCxDQUFHO0FBQzVELE1BQUlHLE1BQU0sR0FBRyxFQUFiOztBQUNBLE1BQUlSLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYlEsSUFBQUEsTUFBTSxjQUFPUixLQUFQLFVBQU47QUFDRDs7QUFDRCxNQUFJSSxPQUFPLEdBQUcsQ0FBZCxFQUFpQjtBQUNmSSxJQUFBQSxNQUFNLGNBQU9KLE9BQVAsVUFBTjtBQUNEOztBQUNELE1BQUlKLEtBQUssS0FBSyxDQUFWLElBQWVJLE9BQU8sS0FBSyxDQUEzQixJQUFnQ0MsT0FBTyxHQUFHLENBQTlDLEVBQWlEO0FBQy9DRyxJQUFBQSxNQUFNLGNBQU9ILE9BQVAsVUFBTjtBQUNEOztBQUNELFNBQU9HLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLENBQWQsRUFBaUJELE1BQU0sQ0FBQ25GLE1BQVAsR0FBZ0IsQ0FBakMsQ0FBUDtBQUNELENBWkQ7O0FBY0EsSUFBTXFGLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsR0FBTTtBQUM5QixNQUFNQyxhQUFhLEdBQUd0RSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CRyxXQUFuQixFQUF0QjtBQUNBLE1BQU1vRSxVQUFVLEdBQUd2RSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVVHLFdBQVYsRUFBbkI7QUFDQSxNQUFNcUUsU0FBUyxHQUFHeEUsQ0FBQyxDQUFDLEtBQUQsQ0FBRCxDQUFTRyxXQUFULEVBQWxCO0FBQ0EsTUFBTXNFLFlBQVksR0FBR3pFLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWUcsV0FBWixFQUFyQjtBQUNBLE1BQU11RSxXQUFXLEdBQUdKLGFBQWEsR0FBR0UsU0FBaEIsR0FBNEJDLFlBQWhEOztBQUNBLE1BQUlGLFVBQVUsSUFBSUcsV0FBbEIsRUFBK0I7QUFDN0IxRSxJQUFBQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVlULFdBQVosQ0FBd0IsY0FBeEIsRUFBd0NFLFFBQXhDLENBQWlELFFBQWpEO0FBQ0Q7QUFDRixDQVREOztBQVdBLElBQU1rRix5QkFBeUIsR0FBRyxTQUE1QkEseUJBQTRCLENBQUNDLE1BQUQsRUFBWTtBQUMxQyxTQUFPLElBQUkvRCxPQUFKLENBQVksVUFBU0MsT0FBVCxFQUFrQlUsTUFBbEIsRUFBMEI7QUFDekMsUUFBSTtBQUNBNUQsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWTtBQUNidUUsUUFBQUEsTUFBTSxFQUFFLE1BREs7QUFFYlIsUUFBQUEsV0FBVyxFQUFFLFNBRkE7QUFHYkMsUUFBQUEsSUFBSSxFQUFFLE1BSE87QUFJYlEsUUFBQUEsT0FBTyxFQUFFO0FBQ0wsMEJBQWdCO0FBRFgsU0FKSTtBQU9iQyxRQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlcUMsTUFBZjtBQVBPLE9BQVosQ0FBTCxDQVNDN0QsSUFURCxDQVNNLFVBQUNDLEdBQUQ7QUFBQSxlQUFTQSxHQUFHLENBQUNpQixJQUFKLEVBQVQ7QUFBQSxPQVROLEVBVUNsQixJQVZELENBVU0sVUFBQzhELElBQUQsRUFBVTtBQUNaL0QsUUFBQUEsT0FBTyxDQUFDK0QsSUFBRCxDQUFQO0FBQ0gsT0FaRDtBQWFILEtBZEQsQ0FjRSxPQUFNakMsR0FBTixFQUFXO0FBQ1RwQixNQUFBQSxNQUFNLENBQUNvQixHQUFELENBQU47QUFDSDtBQUNKLEdBbEJNLENBQVA7QUFtQkgsQ0FwQkQ7O0FBc0JBLElBQU1rQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxJQUFELEVBQVU7QUFDdEIsU0FBTyxJQUFJbEUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM5QmQsSUFBQUEsQ0FBQyxDQUFDZ0YsT0FBRixDQUFVRCxJQUFWLEVBQWdCLFVBQUNsRCxJQUFELEVBQVU7QUFDeEJmLE1BQUFBLE9BQU8sQ0FBQ2UsSUFBRCxDQUFQO0FBQ0QsS0FGRDtBQUdELEdBSk0sQ0FBUDtBQUtILENBTkQ7O0FBUUFvRCxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFBRXBGLEVBQUFBLG9CQUFvQixFQUFwQkEsb0JBQUY7QUFDZlEsRUFBQUEsb0JBQW9CLEVBQXBCQSxvQkFEZTtBQUVmRSxFQUFBQSxpQkFBaUIsRUFBakJBLGlCQUZlO0FBR2ZxQyxFQUFBQSw2QkFBNkIsRUFBN0JBLDZCQUhlO0FBSWZXLEVBQUFBLGFBQWEsRUFBYkEsYUFKZTtBQUtmVSxFQUFBQSxVQUFVLEVBQVZBLFVBTGU7QUFNZjFCLEVBQUFBLGVBQWUsRUFBZkEsZUFOZTtBQU9mZixFQUFBQSxpQkFBaUIsRUFBakJBLGlCQVBlO0FBUWZwQyxFQUFBQSxXQUFXLEVBQVhBLFdBUmU7QUFTZkcsRUFBQUEsV0FBVyxFQUFYQSxXQVRlO0FBVWY2RSxFQUFBQSxpQkFBaUIsRUFBakJBLGlCQVZlO0FBV2ZNLEVBQUFBLHlCQUF5QixFQUF6QkEseUJBWGU7QUFZZmxHLEVBQUFBLFNBQVMsRUFBVEEsU0FaZTtBQWFmWixFQUFBQSxTQUFTLEVBQVRBLFNBYmU7QUFjZmlILEVBQUFBLE9BQU8sRUFBUEE7QUFkZSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgSE9VUl9JTl9TRUNPTkRTLCBTSVhUWSwgQUxMX0xBTkdVQUdFUyB9ID0gcmVxdWlyZShcIi4vY29uc3RhbnRzXCIpO1xuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCcuL2ZldGNoJylcblxuXG5mdW5jdGlvbiBzZXRDb29raWUoY25hbWUsIGN2YWx1ZSwgZXhkYXlzKSB7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvR01UU3RyaW5nKCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyBcIj1cIiArIGN2YWx1ZSArIFwiO1wiICsgZXhwaXJlcyArIFwiO3BhdGg9L1wiO1xufVxuXG5mdW5jdGlvbiBnZXRDb29raWUoY25hbWUpIHtcbiAgICB2YXIgbmFtZSA9IGNuYW1lICsgXCI9XCI7XG4gICAgdmFyIGRlY29kZWRDb29raWUgPSBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llKTtcbiAgICB2YXIgY2EgPSBkZWNvZGVkQ29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSB7XG4gICAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gc2hvd0VsZW1lbnQoZWxlbWVudCkge1xuICBlbGVtZW50LnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcbn1cblxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICBlbGVtZW50LmFkZENsYXNzKCdkLW5vbmUnKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBYVG9WSChweCkge1xuICByZXR1cm4gcHggKiAoMTAwIC8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHNldFBhZ2VDb250ZW50SGVpZ2h0KCkge1xuICBjb25zdCAkZm9vdGVyID0gJCgnZm9vdGVyJyk7XG4gIGNvbnN0ICRuYXYgPSAkKCcubmF2YmFyJyk7XG4gIGNvbnN0IGVkZ2VIZWlnaHRJblBpeGVsID0gJGZvb3Rlci5vdXRlckhlaWdodCgpICsgJG5hdi5vdXRlckhlaWdodCgpXG4gIGNvbnN0IGNvbnRlbnRIZWlnaHRJblZIID0gMTAwIC0gY29udmVydFBYVG9WSChlZGdlSGVpZ2h0SW5QaXhlbClcbiAgJCgnI2NvbnRlbnQtd3JhcHBlcicpLmNzcygnbWluLWhlaWdodCcsIGNvbnRlbnRIZWlnaHRJblZIICsgJ3ZoJyk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUZvb3RlclBvc2l0aW9uKCkge1xuICBjb25zdCAkZm9vdGVyID0gJCgnZm9vdGVyJyk7XG4gICRmb290ZXIudG9nZ2xlQ2xhc3MoJ2ZpeGVkLWJvdHRvbScpXG4gICRmb290ZXIudG9nZ2xlQ2xhc3MoJ2JvdHRvbScpXG59XG5cbmZ1bmN0aW9uIGZldGNoTG9jYXRpb25JbmZvKCkge1xuICAvL2h0dHBzOi8vYXBpLmlwaWZ5Lm9yZy8/Zm9ybWF0PWpzb25cbiAgbGV0IHJlZ2lvbk5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN0YXRlX3JlZ2lvblwiKSB8fCBcIk5PVF9QUkVTRU5UXCI7XG4gIGxldCBjb3VudHJ5TmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY291bnRyeVwiKSB8fCBcIk5PVF9QUkVTRU5UXCI7XG4gIGlmIChyZWdpb25OYW1lICE9PSBcIk5PVF9QUkVTRU5UXCIgJiYgY291bnRyeU5hbWUgIT09IFwiTk9UX1BSRVNFTlRcIiAmJiByZWdpb25OYW1lLmxlbmd0aCA+IDAgJiYgY291bnRyeU5hbWUubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgcmVzb2x2ZSh7XCJyZWdpb25OYW1lXCI6IHJlZ2lvbk5hbWUsIFwiY291bnRyeVwiOiBjb3VudHJ5TmFtZX0pXG4gICAgfSlcbiAgfVxuICByZXR1cm4gZmV0Y2goJ2h0dHBzOi8vd3d3LmNsb3VkZmxhcmUuY29tL2Nkbi1jZ2kvdHJhY2UnKS50aGVuKHJlcyA9PiByZXMudGV4dCgpKS50aGVuKGlwQWRkcmVzc1RleHQgPT4ge1xuICAgIGNvbnN0IGRhdGFBcnJheSA9IGlwQWRkcmVzc1RleHQuc3BsaXQoJ1xcbicpO1xuICAgIGxldCBpcEFkZHJlc3MgPSBcIlwiO1xuICAgIGZvciAobGV0IGluZCBpbiBkYXRhQXJyYXkpIHtcbiAgICAgIGlmIChkYXRhQXJyYXlbaW5kXS5zdGFydHNXaXRoKFwiaXA9XCIpKSB7XG4gICAgICAgIGlwQWRkcmVzcyA9IGRhdGFBcnJheVtpbmRdLnJlcGxhY2UoJ2lwPScsICcnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpcEFkZHJlc3MubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmV0Y2goYC9sb2NhdGlvbi1pbmZvP2lwPSR7aXBBZGRyZXNzfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZWplY3QoXCJJcCBBZGRyZXNzIG5vdCBhdmFpbGFibGVcIilcbiAgICAgIH0pXG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgcGVyZm9ybUFQSVJlcXVlc3QgPSAodXJsKSA9PiB7XG4gIHJldHVybiBmZXRjaCh1cmwsIHtcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgIG1vZGU6ICdjb3JzJ1xuICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgaWYgKCFkYXRhLm9rKSB7XG4gICAgICB0aHJvdyBFcnJvcihkYXRhLnN0YXR1c1RleHQgfHwgJ0hUVFAgZXJyb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhLmpzb24oKSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgcGVyZm9ybUFQSVBvc3RSZXF1ZXN0ID0gKHVybCwgZGF0YSk9PntcbiAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICBtb2RlOiAnY29ycycsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIHRocm93IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdIVFRQIGVycm9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmpzb24oKSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZ2V0TG9jYWxlU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImkxOG5cIikgPz8gXCJlblwiO1xuICAgICAgICBwZXJmb3JtQVBJUmVxdWVzdChgL2dldC1sb2NhbGUtc3RyaW5ncy8ke2xvY2FsZX1gKVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2NhbGVTdHJpbmcnLCBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpPT5yZWplY3QoZXJyKSk7XG4gICAgfSk7XG59XG5cbmNvbnN0IHVwZGF0ZUxvY2FsZUxhbmd1YWdlc0Ryb3Bkb3duID0gKGxhbmd1YWdlKSA9PiB7XG4gICAgY29uc3QgZHJvcERvd24gPSAkKCcjbG9jYWxpc2F0aW9uX2Ryb3Bkb3duJyk7XG4gICAgY29uc3QgbG9jYWxlTGFuZyA9IEFMTF9MQU5HVUFHRVMuZmluZChlbGUgPT4gZWxlLnZhbHVlID09PSBsYW5ndWFnZSk7XG4gICAgaWYobGFuZ3VhZ2UudG9Mb3dlckNhc2UoKSA9PT0gXCJlbmdsaXNoXCIgfHwgbG9jYWxlTGFuZy5oYXNMb2NhbGVUZXh0ID09PSBmYWxzZSkge1xuICAgICAgICBkcm9wRG93bi5odG1sKCc8YSBpZD1cImVuZ2xpc2hcIiBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIGxvY2FsZT1cImVuXCI+RW5nbGlzaDwvYT4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkcm9wRG93bi5odG1sKGA8YSBpZD1cImVuZ2xpc2hcIiBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIGxvY2FsZT1cImVuXCI+RW5nbGlzaDwvYT5cbiAgICAgICAgPGEgaWQ9JHtsb2NhbGVMYW5nLnZhbHVlfSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIGxvY2FsZT1cIiR7bG9jYWxlTGFuZy5pZH1cIj4ke2xvY2FsZUxhbmcudGV4dH08L2E+YCk7XG4gICAgfVxufVxuXG5jb25zdCBjYWxjdWxhdGVUaW1lID0gZnVuY3Rpb24gKHRvdGFsU2Vjb25kcywgaXNTZWNvbmRzID0gdHJ1ZSkge1xuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gSE9VUl9JTl9TRUNPTkRTKTtcbiAgY29uc3QgcmVtYWluaW5nQWZ0ZXJIb3VycyA9IHRvdGFsU2Vjb25kcyAlIEhPVVJfSU5fU0VDT05EUztcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IocmVtYWluaW5nQWZ0ZXJIb3VycyAvIFNJWFRZKTtcbiAgY29uc3Qgc2Vjb25kcyA9IE1hdGgucm91bmQocmVtYWluaW5nQWZ0ZXJIb3VycyAlIFNJWFRZKTtcbiAgaWYgKGlzU2Vjb25kcykge1xuICAgIHJldHVybiB7aG91cnMsIG1pbnV0ZXMsIHNlY29uZHN9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7aG91cnMsIG1pbnV0ZXN9O1xuICB9XG59O1xuXG5jb25zdCBmb3JtYXRUaW1lID0gZnVuY3Rpb24gKGhvdXJzLCBtaW51dGVzID0gMCwgc2Vjb25kcyA9IDApIHtcbiAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gIGlmIChob3VycyA+IDApIHtcbiAgICByZXN1bHQgKz0gYCR7aG91cnN9IGhycyBgO1xuICB9XG4gIGlmIChtaW51dGVzID4gMCkge1xuICAgIHJlc3VsdCArPSBgJHttaW51dGVzfSBtaW4gYDtcbiAgfVxuICBpZiAoaG91cnMgPT09IDAgJiYgbWludXRlcyA9PT0gMCAmJiBzZWNvbmRzID4gMCkge1xuICAgIHJlc3VsdCArPSBgJHtzZWNvbmRzfSBzZWMgYDtcbiAgfVxuICByZXR1cm4gcmVzdWx0LnN1YnN0cigwLCByZXN1bHQubGVuZ3RoIC0gMSk7XG59O1xuXG5jb25zdCBzZXRGb290ZXJQb3NpdGlvbiA9ICgpID0+IHtcbiAgY29uc3QgY29udGVudEhlaWdodCA9ICQoJyNwYWdlLWNvbnRlbnQnKS5vdXRlckhlaWdodCgpO1xuICBjb25zdCBib2R5SGVpZ2h0ID0gJCgnYm9keScpLm91dGVySGVpZ2h0KCk7XG4gIGNvbnN0IG5hdkhlaWdodCA9ICQoJ25hdicpLm91dGVySGVpZ2h0KCk7XG4gIGNvbnN0IGZvb3RlckhlaWdodCA9ICQoJ2Zvb3RlcicpLm91dGVySGVpZ2h0KCk7XG4gIGNvbnN0IHRvdGFsSGVpZ2h0ID0gY29udGVudEhlaWdodCArIG5hdkhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgaWYgKGJvZHlIZWlnaHQgPD0gdG90YWxIZWlnaHQpIHtcbiAgICAkKCdmb290ZXInKS5yZW1vdmVDbGFzcygnZml4ZWQtYm90dG9tJykuYWRkQ2xhc3MoJ2JvdHRvbScpO1xuICB9XG59XG5cbmNvbnN0IHJlcG9ydFNlbnRlbmNlT3JSZWNvcmRpbmcgPSAocmVxT2JqKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmV0Y2goJy9yZXBvcnQnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVxT2JqKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3ApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmNvbnN0IGdldEpzb24gPSAocGF0aCkgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgJC5nZXRKU09OKHBhdGgsIChkYXRhKSA9PiB7XG4gICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgc2V0UGFnZUNvbnRlbnRIZWlnaHQsXG4gIHRvZ2dsZUZvb3RlclBvc2l0aW9uLFxuICBmZXRjaExvY2F0aW9uSW5mbyxcbiAgdXBkYXRlTG9jYWxlTGFuZ3VhZ2VzRHJvcGRvd24sXG4gIGNhbGN1bGF0ZVRpbWUsXG4gIGZvcm1hdFRpbWUsXG4gIGdldExvY2FsZVN0cmluZyxcbiAgcGVyZm9ybUFQSVJlcXVlc3QsXG4gIHNob3dFbGVtZW50LFxuICBoaWRlRWxlbWVudCxcbiAgc2V0Rm9vdGVyUG9zaXRpb24sXG4gIHJlcG9ydFNlbnRlbmNlT3JSZWNvcmRpbmcsIFxuICBnZXRDb29raWUsIFxuICBzZXRDb29raWUsXG4gIGdldEpzb25cbn1cbiJdfQ==
},{"./constants":1,"./fetch":4}],6:[function(require,module,exports){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
},{}]},{},[3])