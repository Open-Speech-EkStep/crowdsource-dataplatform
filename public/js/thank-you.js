const currentIndexKey = "currentIndex";
const speakerDetailsKey = "speakerDetails";
const totalSentence = 10;
const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
const localSpeakerData = localStorage.getItem(speakerDetailsKey);
const localSpeakerDataParsed = JSON.parse(localSpeakerData);
if (!(localSpeakerDataParsed && localSpeakerDataParsed.userName)) {
    location.href = "/";
}
else if (currentIndexInStorage < totalSentence) {
    location.href = "/";
}
else {
    const $navUser = $("#nav-user");
    const $navUserName = $navUser.find("#nav-username");
    $navUserName.text(localSpeakerDataParsed.userName);
    $navUser.removeClass('d-none');

    const countKey = "count";
    const skipCountKey = "skipCount";
    const skipCountInStorage = Number(localStorage.getItem(skipCountKey));
    const localCount = Number(localStorage.getItem(countKey));
    const $timeGraphBar = $("#graphbar");
    const $progressPercentWrapper = $('#progress-percent-wrapper');
    const $progressPercent = $progressPercentWrapper.find("#progress-percent");
    const $footer = $("footer");
    const $userContribution = $("#user-contribution");
    const $speakersDataHoursValue = $("#hour-value");
    const speakersDataKey = "speakersData";
    const speakerDetailsValue = JSON.parse(localStorage.getItem(speakersDataKey));

    const setUserContribution = (index) => {
        const totalSecondsContributed = (localCount + index - skipCountInStorage) * 6;
        const minutes = Math.floor(totalSecondsContributed / 60);
        const seconds = totalSecondsContributed % 60;
        const finalText = (minutes > 0 ? `${minutes} minute ` : '') + (seconds > 0 ? `${seconds} seconds ` : minutes > 0 ? '' : '0 second');
        $userContribution.text(finalText);
    }
    setUserContribution(currentIndexInStorage);

    const setProgressPercent = (index) => {
        //42em is graphforeground height in css
        const graphforegroundHeight = 42;
        // assuming a sentence is of 6 second
        const totalSecondsContributed = (localCount + index - skipCountInStorage) * 6;
        const totalSecondsToContribute = 30 * 60;
        const contributionPercent = (totalSecondsContributed / totalSecondsToContribute) * 100;
        $progressPercent.text(Number(contributionPercent.toFixed(1)));
        const currentTimeGraphHeight = (totalSecondsContributed / totalSecondsToContribute) * graphforegroundHeight;
        $timeGraphBar.height(currentTimeGraphHeight + "em");
    };
    setProgressPercent(currentIndexInStorage)

    const showSpeakersHoursData = (index) => {
        try{
            const totalSentence = Number(speakerDetailsValue.find(t=>t.index===1).count);
            const totalSeconds = (totalSentence + index - skipCountInStorage) * 6;
            const hours = Math.floor(totalSeconds / 3600);
            const remainingAfterHours = totalSeconds % 3600;
            const minutes = Math.floor(remainingAfterHours / 60);
            const seconds = remainingAfterHours % 60;
            $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
        }
        catch(err){
            console.log(err);
        }
    }
    showSpeakersHoursData(currentIndexInStorage);

    const adjustTimeProgressBarHeight = () => {
        const footerHeight = $footer.outerHeight();
        const progressBottomInPx = $progressPercentWrapper.css('bottom');
        const progressBottomInNumber = Number(progressBottomInPx.substring(0, progressBottomInPx.length - 2));
        if (progressBottomInNumber) {
            $progressPercentWrapper.css('bottom', footerHeight + "px")
        }
    };
    adjustTimeProgressBarHeight();
    $(window).resize(adjustTimeProgressBarHeight);
}
