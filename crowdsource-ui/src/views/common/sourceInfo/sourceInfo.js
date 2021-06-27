const { show_data_source } = require('./env-api');

$(() => {
    $("#datasource_close_btn").click(() => {
        $("#data_source_modal").modal("hide");
        $(".modal-backdrop").removeClass("show").removeClass("modal-backdrop");
    });
    $("#data_source_modal .email").click((event) => {
        const cb = navigator.clipboard;
        cb.writeText(event.target.innerText).then(() => {
            var tooltip = document.getElementById("myDataSourceTooltip");
            tooltip.innerHTML = "Copied";
            setTimeout(()=>{
                tooltip.innerHTML = "Copy to clipboard";
            }, 3000);
        });
    });
});

const hideDataSourceButton = () => {
    $('#show_source_button').addClass('d-none');
}
const showDataSourceButton = () => {
    $('#show_source_button').removeClass('d-none');
}
const setSourceInfo = (sourceInfo) => {
    if (sourceInfo) {
        $('#div-ds-source-name').removeClass('d-none');
        $('#div-ds-source-name a.spn-source-info').text(sourceInfo);
    }
    else {
        $('#div-ds-source-name').addClass('d-none');
        $('#div-ds-source-name a.spn-source-info').text('');
    }
}
const setSourceUrl = (sourceUrl) => {
    if (sourceUrl) {
        $('#div-ds-source-name a.spn-source-info').attr('href', sourceUrl);
        $('#div-ds-source-name a.spn-source-info').attr('title', sourceUrl);
        $('#div-ds-source-name a.spn-source-info').attr('target', 'blank');
    }
    else {
        $('#div-ds-source-name a.spn-source-info').removeAttr('href');
        $('#div-ds-source-name a.spn-source-info').removeAttr('target');
    }
}
const setDataSource = (dataSourceInfo) => {
    if (show_data_source === 'false') {
        return;
    }
    const tooltip = document.getElementById("myDataSourceTooltip");
    tooltip.innerHTML = "Copy to clipboard";
    if (dataSourceInfo && dataSourceInfo.length > 0 && dataSourceInfo != "[]") {
        const parsedInfo = JSON.parse(dataSourceInfo);
        if (parsedInfo.length == 0) {
            hideDataSourceButton();
        }
        setSourceInfo(parsedInfo[0]);
        setSourceUrl(parsedInfo[1]);
        showDataSourceButton();
    }
    else {
        hideDataSourceButton();
    }
}

module.exports = {
    setDataSource
}