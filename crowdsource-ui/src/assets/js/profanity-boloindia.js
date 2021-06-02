const fetch = require('./fetch')
const { setPageContentHeight, fetchLocationInfo, updateLocaleLanguagesDropdown, getLocaleString, hideElement, showElement } = require('./utils');
const { LOCALE_STRINGS } = require('./constants');

const speakerDetailsKey = 'profanityUserDetails';
const sentencesKey = 'sentences';
const currentIndexKey = 'currentIndex';
const skipCountKey = 'skipCount';
const countKey = 'count';

let currentIndex;
let localeStrings;

function getValue(number, maxValue) {
    return number < 0
        ? 0
        : number > maxValue
            ? maxValue
            : number;
}

function showNoSentencesMessage() {
    $('#spn-validation-language').html(localStorage.getItem('contributionLanguage'));
    hideElement($('#progress-row'))
    hideElement($('#validation-buttons-row'))
    showElement($('#no-sentences-row'))
    hideElement($('#skip_btn_row'));
    hideElement($("#test-mic-speakers"));
    hideElement($('#instructive-msg'));
    hideElement($('#thankyou-text'));
  }

function getCurrentIndex(lastIndex) {
    const currentIndexInStorage = Number(localStorage.getItem(currentIndexKey));
    return getValue(currentIndexInStorage, lastIndex);
}

function getSkipCount(totalItems) {
    const skipCountInStorage = Number(localStorage.getItem(skipCountKey));
    return getValue(skipCountInStorage, totalItems)
}

const setCurrentSentenceIndex = (index) => {
    const currentSentenceLbl = document.getElementById('currentSentenceLbl');
    currentSentenceLbl.innerText = index;
}

const setTotalSentenceIndex = (index) => {
    const totalSentencesLbl = document.getElementById('totalSentencesLbl');
    totalSentencesLbl.innerText = index;
}

function updateProfanityState(userName, sentenceId, language, state) {
    const fd = new FormData();
    // fd.append('language', language);
    fd.append('sentenceId', sentenceId);
    fd.append('profanityStatus', state);
    fd.append('userName', userName);
    return fetch(`/profanity-status/text`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: userName,
            profanityStatus: state,
            sentenceId: sentenceId
        })
    });
}

function invokeProfanityStateUpdate(state) {
    const localSpeakerDataParsed = JSON.parse(localStorage.getItem('profanityUserDetails'));
    updateProfanityState(localSpeakerDataParsed.userName, crowdSource.sentences[currentIndex].dataset_row_id, localSpeakerDataParsed.language, state)
        .then(res => {
        }).catch(err => {
            console.log(err);
        })
}

function updateSkipAction(){
    const sentenceId = crowdSource.sentences[currentIndex].dataset_row_id;
    fetch(`/profanity-skip/text`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentenceId: sentenceId
      })
    }).then(res=>{}).catch(err=>{
      console.log(err)
    });
  }

const initialize = () => {
    const sentences = crowdSource.sentences;
    const $notProfaneBtn = $('#startRecord');
    const $profaneBtn = $('#nextBtn');
    const $skipBtn = $('#skipBtn');
    const $progressBar = $('.progress-bar');
    const $pageContent = $('#page-content');
    const totalItems = sentences.length;
    currentIndex = getCurrentIndex(totalItems - 1);
    let skipCount = getSkipCount(totalItems - 1);


    const animateCSS = ($element, animationName, callback) => {
        $element.addClass(`animated ${animationName}`);

        function handleAnimationEnd() {
            $element.removeClass(`animated ${animationName}`);
            $element.off('animationend');
            if (typeof callback === 'function') callback();
        }

        $element.on('animationend', handleAnimationEnd);
    };

    const setProgressBar = (currentIndex) => {
        $progressBar.width((currentIndex + 1) * 20 + '%');
        $progressBar.prop('aria-valuenow', currentIndex + 1);
    };

    const setSentenceText = (index) => {
        const $sentenceLbl = $('#sentenceLbl');
        $sentenceLbl[0].innerText = sentences[index].media;
        animateCSS($sentenceLbl, 'lightSpeedIn');
        setProgressBar(currentIndex);
    };

    const notyf = new Notyf({
        position: { x: 'center', y: 'top' },
        types: [
            {
                type: 'success',
                className: 'fnt-1-5',
            },
            {
                type: 'error',
                duration: 3500,
                className: 'fnt-1-5',
            },
        ],
    });

    setSentenceText(currentIndex);
    setCurrentSentenceIndex(currentIndex + 1);
    setTotalSentenceIndex(totalItems);

    $notProfaneBtn.on('click', () => {
        invokeProfanityStateUpdate(false)
        incrementCurrentIndex();
    });

    const goToThankYouPage = () => {
        $("#profanityThankYouModal").modal('show');
    };

    $skipBtn.hover(() => {
        $skipBtn.css('border-color', '#bfddf5');
    }, () => {
        $skipBtn.css('border-color', 'transparent');
    })

    $skipBtn.mousedown(() => {
        $skipBtn.css('background-color', 'white')
    })

    const onHover = function (btn) {
        btn.css('background-color', 'rgba(0, 123, 255, 0.3)');
    }

    const afterHover = function (btn) {
        btn.css('background-color', 'white');
    }

    $notProfaneBtn.hover(() => { 
        onHover($notProfaneBtn);
    },
        () => {
            afterHover($notProfaneBtn)
        });

    $profaneBtn.add($skipBtn).on('click', (event) => {
        if (event.target.id === 'nextBtn' && currentIndex < totalItems - 1) {
            invokeProfanityStateUpdate(true)
        } else if (event.target.id === 'skipBtn') {
            // markContributionSkipped();
            incrementSkipCount();
            updateSkipAction();
            // $skipBtn.addClass('d-none');
        }
        if (currentIndex === totalItems - 1) {
            if (event.target.id === 'nextBtn') {
                invokeProfanityStateUpdate(true)
                goToThankYouPage()
            } else {
                updateSkipAction();
                goToThankYouPage()
            }
            currentIndex++;
            animateCSS($pageContent, 'zoomOut', () => {
                $pageContent.addClass('d-none');
            });
            setProgressBar(currentIndex);
            const sentencesObj = JSON.parse(localStorage.getItem(sentencesKey));
            Object.assign(sentencesObj, { sentences: [] });
            localStorage.setItem(sentencesKey, JSON.stringify(sentencesObj));
            localStorage.setItem(currentIndexKey, currentIndex);
            const msg = localeStrings['Congratulations!!! You have completed this batch of sentences'];
            notyf.success(msg);
            $('#loader').show();
        } else if (currentIndex < totalItems - 1) {
            incrementCurrentIndex();
        }
    });

    function incrementCurrentIndex() {
        currentIndex++;
        setSentenceText(currentIndex);
        setCurrentSentenceIndex(currentIndex + 1);
        localStorage.setItem(currentIndexKey, currentIndex);
        // $skipBtn.removeClass('d-none');
    }

    function incrementSkipCount() {
        skipCount++;
        localStorage.setItem(skipCountKey, skipCount);
    }
};


function executeOnLoad() {
    setPageContentHeight();
    window.crowdSource = {};
    const $loader = $('#loader');
    const $pageContent = $('#page-content');
    const $navUser = $('#nav-user');
    const $navUserName = $navUser.find('#nav-username');
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    localeStrings = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
    if (contributionLanguage) {
        updateLocaleLanguagesDropdown(contributionLanguage);
    }

    fetchLocationInfo().then(res => {
        return res.json()
    }).then(response => {
        localStorage.setItem("state_region", response.regionName);
        localStorage.setItem("country", response.country);
    }).catch(console.log);
    try {
        const localSpeakerData = localStorage.getItem(speakerDetailsKey);
        const localSpeakerDataParsed = JSON.parse(localSpeakerData);
        const localSentences = localStorage.getItem(sentencesKey);
        const localSentencesParsed = JSON.parse(localSentences);
        const localCount = Number(localStorage.getItem(countKey));

        setPageContentHeight();

        if (!localSpeakerDataParsed) {
            location.href = '/en/profanity-home.html?type=boloindia';
            return;
        }

        if (localSpeakerDataParsed.userName && localSpeakerDataParsed.userName.length > 0) {
            $navUser.removeClass('d-none');
            $('#nav-login').addClass('d-none');
            $navUserName.text(localSpeakerDataParsed.userName);
        }
        const isExistingUser = localSentencesParsed &&
            localSentencesParsed.userName === localSpeakerDataParsed.userName
            &&
            localSentencesParsed.language === localSpeakerDataParsed.language;

        if (isExistingUser && localSentencesParsed.sentences.length != 0 && localSentencesParsed.language === contributionLanguage) {
            crowdSource.sentences = localSentencesParsed.sentences;
            crowdSource.count = localCount;
            $loader.hide();
            $pageContent.removeClass('d-none');
            initialize();
        } else {
            localStorage.removeItem(currentIndexKey);
            localStorage.removeItem(skipCountKey);
            const type = 'text';
            fetch(`/sentences-for-profanity-check/${type}?username=${localSpeakerDataParsed.userName}&language=${localSpeakerDataParsed.language}`, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((data) => {
                    if (!data.ok) {
                        showNoSentencesMessage();
                        throw Error(data.statusText || 'HTTP error');
                    } else {
                        return data.json();
                    }
                })
                .then((sentenceData) => {
                    if(sentenceData.data.length === 0){
                        showNoSentencesMessage();
                    }
                    $pageContent.removeClass('d-none');
                    // toggleFooterPosition();
                    console.log(sentenceData);
                    crowdSource.sentences = sentenceData.data;
                    crowdSource.count = Number(sentenceData.count);
                    $loader.hide();
                    localStorage.setItem(
                        sentencesKey,
                        JSON.stringify({
                            userName: localSpeakerDataParsed.userName,
                            sentences: sentenceData.data,
                            language: localSpeakerDataParsed.language,
                        })
                    );
                    localStorage.setItem(countKey, sentenceData.count);
                    initialize();
                })
                .catch((err) => {
                    console.log(err);
                })
                .then(() => {
                    $loader.hide();
                });
        }
    } catch (err) {
        console.log(err);
    }
}

$(document).ready(() => {
    localStorage.setItem('module', 'bolo');
    getLocaleString().then(() => {
        executeOnLoad();
    }).catch(() => {
        executeOnLoad();
    });
});


module.exports = { getCurrentIndex, getSkipCount, getValue, setCurrentSentenceIndex, setTotalSentenceIndex }
