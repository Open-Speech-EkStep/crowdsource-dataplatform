const { CONTRIBUTION_LANGUAGE } = require('./constants');
const { context_root } = require('./env-api');

function redirectToHomePage() {
    const locale = sessionStorage.getItem('i18n');
    const addresses = location.href.split("/");
    const module = addresses[addresses.length-2];
    location.href = `${context_root}/${locale}/${module}/home.html`;
}

function handleContributionLanguageChange() {
    window.addEventListener('storage', (event) => {
        if (event.key === CONTRIBUTION_LANGUAGE && event.oldValue  !== event.newValue) {
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
