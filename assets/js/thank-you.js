const { AUDIO_DURATION, SIXTY, HOUR_IN_SECONDS } = require('./constants');
const { setPageContentHeight, toggleFooterPosition, updateLocaleLanguagesDropdown } = require('./utils')

const currentIndexKey = 'currentIndex';
const speakerDetailsKey = 'speakerDetails';
const totalSentence = 5;
const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
const localSpeakerData = localStorage.getItem(speakerDetailsKey);
const localSpeakerDataParsed = JSON.parse(localSpeakerData);
const $footer = $('footer');

const setUserContribution = (totalSentencesContributed) => {
    const $userContribution = $('#user-contribution');
    $userContribution.html(totalSentencesContributed);
};

function getTotalSentencesContributed() {
    const skipCountInStorage = Number(localStorage.getItem('skipCount'));
    const localCount = Number(localStorage.getItem('count'));
    const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
    return (localCount + currentIndexInStorage - skipCountInStorage);
}

if (!(localSpeakerDataParsed)) {
    location.href = '/#start-record';
} else if (currentIndexInStorage < totalSentence) {
    location.href = '/#start-record';
} else {
    $('#nav-user').removeClass('d-none');
   $('#nav-login').addClass('d-none');
    $('#nav-username').text(localSpeakerDataParsed.userName);

    const $speakersDataHoursValue = $('#hour-value');
    const speakersDataKey = 'speakersData';

    setPageContentHeight();

    setUserContribution(getTotalSentencesContributed());

    fetch(`/getDetails/${localSpeakerDataParsed.language}`)
        .then((data) => {
            if (!data.ok) {
                throw Error(data.statusText || 'HTTP error');
            } else {
                return data.json();
            }
        })
        .then((data) => {
            localStorage.setItem(speakersDataKey, JSON.stringify(data));
            showSpeakersHoursData(data);
        })
        .catch((err) => {
            console.log(err);
        })
        .then(() => {
            $speakersDataHoursValue.next().addClass('d-none');
        });
}

const getTotalProgressSize = () => {
    //magic calculation for every screen size
    const breakPointForSmallScreen = 576;
    const breakPointForLargeScreen = 1200;
    const breakPointForExtraLargeScreen = 2000;
    let screenSizeDiff;
    let totalProgressBarWidth;
    let totalProgressBarBulbWidth = 11;
    let totalProgressBarBulbLeft;
    if (innerWidth < breakPointForSmallScreen) {
        screenSizeDiff = breakPointForSmallScreen - innerWidth;
        totalProgressBarWidth = 70.5 - (1.333 * screenSizeDiff) / 100;
        totalProgressBarBulbLeft = 75.2 - (0.4 * screenSizeDiff) / 100;
    } else if (innerWidth < breakPointForLargeScreen) {
        screenSizeDiff = breakPointForLargeScreen - innerWidth;
        totalProgressBarWidth = 70.5 - (0.5 * screenSizeDiff) / 100;
        totalProgressBarBulbLeft = 75.75 - (0.25 * screenSizeDiff) / 100;
    } else if (innerWidth < breakPointForExtraLargeScreen) {
        screenSizeDiff = breakPointForExtraLargeScreen - innerWidth;
        totalProgressBarWidth = 71.5 - (0.1 * screenSizeDiff) / 100;
        totalProgressBarBulbWidth = 12 - (0.1 * screenSizeDiff) / 100;
        totalProgressBarBulbLeft =
            innerWidth < 1500 ? 75.2 : 75.5 - (0.003 * screenSizeDiff) / 100;
    } else {
        screenSizeDiff = innerWidth - breakPointForExtraLargeScreen;
        totalProgressBarWidth = 71.5 + (0.1 * screenSizeDiff) / 100;
        totalProgressBarBulbWidth = 12;
        totalProgressBarBulbLeft = 75.8;
    }
    return {
        totalProgressBarWidth,
        totalProgressBarBulbWidth,
        totalProgressBarBulbLeft,
    };
};

const setTotalProgressBar = (totalSeconds) => {
    const $totalProgress = $('#total-progress');
    const secondsInHundredHours = 100 * HOUR_IN_SECONDS;
    const barWidth = getTotalProgressSize();
    const targetPercentCompleted =
        (totalSeconds / secondsInHundredHours) * 100;
    if (targetPercentCompleted >= 100) {
        $totalProgress.next().css({
            width: barWidth.totalProgressBarBulbWidth + '%',
            left: barWidth.totalProgressBarBulbLeft + '%',
        });
        $totalProgress.width((100 * barWidth.totalProgressBarWidth) / 100 + '%');
        $('#total-progress').one(
            'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
            () => {
                let progressWidth = 0;
                let timerKey = setInterval(() => {
                    if (progressWidth >= 100) {
                        clearInterval(timerKey);
                    }
                    $totalProgress
                        .next()
                        .css(
                            'background',
                            `linear-gradient(to right, #007bff 0%, #007bff ${progressWidth}%, transparent 0%)`
                        );
                    progressWidth = progressWidth + 5;
                }, 30);
            }
        );
    } else {
        $totalProgress.width(
            (targetPercentCompleted * barWidth.totalProgressBarWidth) / 100 + '%'
        );
    }
};

const showSpeakersHoursData = (speakerDetailsValue) => {
    try {
        const $speakersDataHoursValue = $('#hour-value');
        const totalCompleteSentence = Number(
            speakerDetailsValue.find((t) => t.index === 1).count
        );
        const totalSeconds = totalCompleteSentence * AUDIO_DURATION;
        const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
        const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
        const minutes = Math.floor(remainingAfterHours / SIXTY);
        const seconds = remainingAfterHours % SIXTY;
        $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
        setTotalProgressBar(totalSeconds);
    } catch (err) {
        console.log(err);
    }
};

const getFormattedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / HOUR_IN_SECONDS);
    const remainingAfterHours = totalSeconds % HOUR_IN_SECONDS;
    const minutes = Math.floor(remainingAfterHours / SIXTY);
    const seconds = Math.ceil(remainingAfterHours % SIXTY);
    return {hours, minutes, seconds};
}

const updateShareContent = function(language, rank) {
    const text = `I've contributed towards building open language repository for India on http://bhaashadaan.nplt.in You and I can make a difference by donating our voices that can help machines learn our language and interact with us through great lingusitic applications. Our ${language} language ranks ${rank} on Bhaashadaan. Do your bit and empower the language?`;
    const $whatsappShare = $("#whatsapp_share");
    $whatsappShare.attr('href', `https://api.whatsapp.com/send?text=${text}`);
    const $twitterShare = $("#twitter_share");
    $twitterShare.attr('href', `https://twitter.com/intent/tweet?text=${text}`);
    const $linkedinShare = $("#linkedin_share");
    $linkedinShare.attr('href', `https://www.linkedin.com/shareArticle?mini=true&url=https://bhaashadaan.nplt.in&title=I've contributed towards building open language repository for India on http://bhaashadaan.nplt.in&summary=${text}`);
}

const getLanguageStats = function () {
    fetch('/stats/summary?aggregateDataByLanguage=true')
        .then(res => res.json())
        .then(response => {
            const data = response.aggregate_data_by_language.sort((a,b)=> Number(a.total_contributions) > Number(b.total_contributions) ? -1: 1);
            const {hours, minutes, seconds} = getFormattedTime(Number(data[0].total_contributions)*3600);
            const $highestLangTime = $("#highest_language_time");
            $highestLangTime.text(`${hours}hrs ${minutes}min ${seconds}sec`);
            
            const contributionLanguage = localStorage.getItem('contributionLanguage');
            const rank = data.findIndex( x=> x.language.toLowerCase() === contributionLanguage.toLowerCase());
            const $contributedLangTime = $("#contribute_language_time");
            if(rank > -1) {
                const {hours:hr, minutes:min, seconds:sec} = getFormattedTime(Number(data[rank].total_contributions)*3600);
                $contributedLangTime.text(`${hr}hrs ${min}min ${sec}sec`);
            } else {
                $contributedLangTime.text('0 hrs');
            }
            const $languageId = $("#languageId");
            $languageId.text(data[0].language);
            const $languageChoiceId = $("#languageChoiceId");
            $languageChoiceId.text(contributionLanguage);
            if(rank > -1) {
                updateShareContent(contributionLanguage, rank+1);
            } else {
                updateShareContent(contributionLanguage, data.length+1);
            }
    });
}

$(document).ready(function () {
    toggleFooterPosition();
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    if(contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
    getLanguageStats();
});

module.exports = { setUserContribution, getTotalSentencesContributed };
