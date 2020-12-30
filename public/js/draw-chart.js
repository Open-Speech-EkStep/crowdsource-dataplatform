const $chartRow = $("#chart-row"), $chartLoaders = $chartRow.find(".loader"), $charts = $chartRow.find(".chart"),
    $popovers = $chartRow.find('[data-toggle="popover"]'), $body = $("body");
fetch("/getAllInfo").then(e => {
    if (e.ok) return e.json();
    throw Error(e.statusText || "HTTP error")
}).then(e => {
    try {
        $chartLoaders.hide().removeClass("d-flex"), $charts.removeClass("d-none");
        const t = e.ageGroups.map(e => e.ageGroup ? e : {
            ageGroup: "Anonymous",
            count: e.count
        }).sort((e, t) => Number(t.count) - Number(e.count));
        drawAgeGroupChart(t);
        const a = e.motherTongues.reduce((e, t) => e + Number(t.count), 0),
            r = e.motherTongues.map(e => e.motherTongue ? e : {
                motherTongue: "Anonymous",
                count: e.count
            }).sort((e, t) => Number(t.count) - Number(e.count));
        drawMotherTongueChart(r.slice(0, 4), a, "mother-tongue-chart", !0), drawMotherTongueChart(r, a, "modal-chart");
        const o = e.genderData.map(e => e.gender ? {
            ...e,
            gender: e.gender.charAt(0).toUpperCase() + e.gender.slice(1)
        } : {gender: "Anonymous", count: e.count}).sort((e, t) => Number(e.count) - Number(t.count));
        drawGenderChart(o), setPopOverContent($popovers.eq(0), r, "motherTongue", !0), setPopOverContent($popovers.eq(1), t, "ageGroup", !0), setPopOverContent($popovers.eq(2), o, "gender"), innerWidth < 992 && $("#modal-chart-wrapper").find(".modal-dialog").addClass("w-90"), setTimeout(() => {
            fetch("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"), fetch("https://fonts.googleapis.com/icon?family=Material+Icons"), fetch("css/notyf.min.css"), fetch("css/record.css")
        }, 2e3)
    } catch (e) {
        console.log(e), $chartLoaders.show().addClass("d-flex"), $charts.addClass("d-none")
    }
}).catch(e => {
    console.log(e)
}), $.fn.popover.Constructor.Default.whiteList.table = [], $.fn.popover.Constructor.Default.whiteList.tbody = [], $.fn.popover.Constructor.Default.whiteList.tr = [], $.fn.popover.Constructor.Default.whiteList.td = [];
const setPopOverContent = (e, t, a, r) => {
    let o = "";
    if (r) {
        const e = Math.ceil(t.length / 2), r = t.slice(0, e).map(e => `<tr><td>${e[a]}</td><td>${e.count}</td></tr>`),
            n = t.slice(-e).map(e => `<tr><td>${e[a]}</td><td>${e.count}</td></tr>`);
        o = `<div class="row">\n            <div class="col-6"><table class="table table-sm table-borderless mb-0"><tbody>${r.join("")}</tbody></table></div>\n            <div class="col-6"><table class="table table-sm table-borderless mb-0"><tbody>${n.join("")}</tbody></table></div>\n        </div>`
    } else {
        o = `<div class="row"><div class="col"><table class="table table-sm table-borderless mb-0"><tbody>${t.map(e => `<tr><td>${e[a]}</td><td>${e.count}</td></tr>`).join("")}</tbody></table></div></div>`
    }
    e.popover({content: o, fallbackPlacement: ["bottom"], animation: !1}).on("mouseenter focus", function () {
        e.popover("show"), $body.children(".popover").on("mouseleave blur", function () {
            setTimeout(function () {
                $body.children(".popover").find(":hover").length || e.is(":hover") || e.popover("hide")
            }, 300)
        })
    }).on("mouseleave blur", function () {
        setTimeout(function () {
            $body.children(".popover").find(":hover").length || e.is(":hover") || e.popover("hide")
        }, 300)
    }), e.on("shown.bs.popover", function () {
        const e = $body.children(".popover")[0];
        setTimeout(() => {
            const t = e.getBoundingClientRect();
            t.height + t.y > innerHeight && e.scrollIntoView(!1)
        }, 0)
    })
}, chartColors = ["#3f80ff", "#4D55A5", "#735dc6", "#68b7dc"], drawAgeGroupChart = e => {
    const t = am4core.create("age-group-chart", am4charts.PieChart3D);
    t.data = e.slice(0, 3).concat({
        ageGroup: "Others",
        count: e.slice(3).reduce((e, t) => e + Number(t.count), 0)
    }), t.paddingBottom = 50, t.innerRadius = am4core.percent(40), t.depth = 50, t.legend = new am4charts.Legend, t.legend.labels.template.fill = am4core.color("#74798c"), t.legend.valueLabels.template.fill = am4core.color("#74798c"), t.legend.labels.template.textDecoration = "none", t.legend.valueLabels.template.textDecoration = "none", t.legend.itemContainers.template.paddingTop = 5, t.legend.itemContainers.template.paddingBottom = 5, t.legend.labels.template.states.getKey("active").properties.textDecoration = "line-through", t.legend.valueLabels.template.states.getKey("active").properties.textDecoration = "line-through", t.legend.valueLabels.template.align = "right", t.legend.valueLabels.template.textAlign = "start";
    const a = t.series.push(new am4charts.PieSeries3D);
    a.labels.template.disabled = !0, a.ticks.template.disabled = !0, a.calculatePercent = !0, a.slices.template.tooltipText = "{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]", a.dataFields.value = "count", a.dataFields.depthValue = "count", a.dataFields.category = "ageGroup", a.slices.template.adapter.add("fill", function (e, t) {
        return chartColors[t.dataItem.index]
    })
}, drawMotherTongueChart = (e, t, a, r) => {
    const o = am4core.create(a, am4charts.XYChart3D);
    o.data = e;
    let n = o.xAxes.push(new am4charts.CategoryAxis);
    n.dataFields.category = "motherTongue", n.renderer.labels.template.rotation = 270, n.renderer.labels.template.hideOversized = !1, n.renderer.minGridDistance = 10, n.renderer.labels.template.horizontalCenter = "right", n.renderer.labels.template.verticalCenter = "middle", n.renderer.labels.template.fill = "#74798c", n.renderer.grid.template.disabled = !0;
    const l = o.yAxes.push(new am4charts.ValueAxis);
    l.renderer.labels.template.fill = "#74798c", l.renderer.grid.template.disabled = !1, l.renderer.baseGrid.disabled = !0;
    const s = o.series.push(new am4charts.ColumnSeries3D);
    s.dataFields.valueY = "count", s.dataFields.categoryX = "motherTongue", s.calculatePercent = !0;
    const d = s.columns.template;
    d.tooltipText = "{categoryX} : [bold]@@@% ({valueY.value})[/]", s.tooltip.label.adapter.add("text", function (e, a) {
        return a.dataItem && e ? e.replace("@@@", (100 * a.dataItem.valueY / t).toFixed(1)) : ""
    }), d.adapter.add("fill", function (e, t) {
        return r ? chartColors[t.dataItem.index] : o.colors.getIndex(t.dataItem.index)
    })
}, drawGenderChart = e => {
    am4core.ready(function () {
        const t = am4core.create("gender-chart", am4charts.XYChart3D);
        t.paddingBottom = 30, t.paddingTop = 5, t.data = e;
        const a = t.xAxes.push(new am4charts.CategoryAxis);
        a.dataFields.category = "gender", a.renderer.minGridDistance = 20, a.renderer.inside = !1, a.renderer.labels.template.fill = "#74798c", a.renderer.grid.template.disabled = !0;
        const r = a.renderer.labels.template;
        r.rotation = -90, r.horizontalCenter = "left", r.verticalCenter = "middle", r.dy = 10, r.inside = !1;
        const o = t.yAxes.push(new am4charts.ValueAxis);
        o.renderer.grid.template.disabled = !1, o.renderer.labels.template.fill = "#74798c", o.renderer.baseGrid.disabled = !0;
        const n = t.series.push(new am4charts.ConeSeries);
        n.calculatePercent = !0, n.dataFields.valueY = "count", n.dataFields.categoryX = "gender", n.columns.template.tooltipText = "{categoryX} : [bold]{valueY.percent.formatNumber('#.0')}% ({valueY.value})[/]";
        const l = n.columns.template;
        l.adapter.add("fill", function (e, t) {
            return chartColors[chartColors.length - 1 - t.dataItem.index]
        }), l.adapter.add("stroke", function (e, t) {
            return chartColors[chartColors.length - 1 - t.dataItem.index]
        })
    })
};