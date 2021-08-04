const { CONTRIBUTION_LANGUAGE, ALL_MODULES, LOCALE_STRINGS } = require('./constants');
const { context_root } = require('./env-api');

function getCurrentModule() {
    const splitValues = location.href.split('/');
    return splitValues.filter(value => ALL_MODULES.includes(value))[0] || '';
}

function redirectToHomePage() {
    const locale = sessionStorage.getItem('i18n');
    const module = getCurrentModule();
    location.href = `${context_root}/${locale}/${module}/home.html`;
}

function handleContributionLanguageChange() {
    window.addEventListener('storage', (event) => {
        const module = getCurrentModule();
        if (event.key === CONTRIBUTION_LANGUAGE && event.oldValue  !== event.newValue && module !== '') {
            const localeString = JSON.parse(localStorage.getItem(LOCALE_STRINGS));
            $('#from_language').html(localeString[event.oldValue]);
            $('#to_language').html(localeString[event.newValue]);
            const $dialog = $('#contributionLangChange');
            $dialog.modal('show');
        }
    });
}

$(document).ready(function () {
    const proceedBtn = $("#proceed_btn");
    if (proceedBtn) {
        proceedBtn.on("click", redirectToHomePage);
    }
    handleContributionLanguageChange();
});
