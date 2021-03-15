const { api_url } = require('./env-api')
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
    const breakPointForSmallScreen = 576;
    const breakPointForLargeScreen = 1200;
    const breakPointForExtraLargeScreen = 2000;
    const secondsInHundredHours = 100 * HOUR_IN_SECONDS;
    $('#nav-user').removeClass('d-none');

    $('#nav-login').addClass('d-none');
    $('#nav-username').text(localSpeakerDataParsed.userName);
    const $totalProgress = $('#total-progress');

    const $speakersDataHoursValue = $('#hour-value');
    const speakersDataKey = 'speakersData';

    setPageContentHeight();

    setUserContribution(getTotalSentencesContributed());

    const getTotalProgressSize = () => {
        //magic calculation for every screen size
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

    fetch(`${api_url}/getDetails/${localSpeakerDataParsed.language}`)
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

    const isScreenRotated = () => {
        const orientation =
            (screen.orientation || {}).type ||
            screen.mozOrientation ||
            screen.msOrientation;
        const screenWidth = innerWidth;
        const screenHeight = innerHeight;
        if (
            (orientation === 'landscape-primary' ||
                orientation === 'landscape-secondary') &&
            screenHeight < 600 &&
            screenHeight < screenWidth
        ) {
            return true;
        } else if (orientation === undefined) {
            const screenAngle = (screen.orientation || {}).angle;
            if (screenAngle === 90 || screenAngle === -90) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
}

$(document).ready(function () {
    toggleFooterPosition();
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    if(contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }
});

module.exports = { setUserContribution, getTotalSentencesContributed };
