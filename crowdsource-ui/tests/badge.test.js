const fetchMock = require("fetch-mock");
const {getRowWithBadge , getCard } = require("../src/assets/js/badges");
const { readFileSync } = require("fs");
const { stringToHTML, flushPromises, mockLocalStorage } = require("./utils");

document.body = stringToHTML(
  readFileSync(`${__dirname}/../src/views/badges.ejs`, "UTF-8")
);

describe('Test badge page Info', () => {
    test("should exist the initiative dropdown", () => {

    });

    // test("shpuld select by default Bolo India", () => {
    //     const selectedValue = $('#initiative option:first-child').val();

    //     expect(selectedValue).toEqual("text");
    // });
});


describe("getRowWithBadge for selected module and contribution type",()=>{
    test("should get row of bronze badge for contribution in bolo India with sentence count , level, badgeName",()=>{
        const localeString = {Level:'Level', bronze:'bronze',Sentences:'Sentences'}
        const badgeDescription = `<p class="text-left mb-0 ml-3">Recording: 400 Sentences</p>`;
        const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 3</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/bronze_medal.svg class="table-img" height="76" width="63" alt=bronze id="bronze_contribute" rel="popover"></div><span>bronze</span></td></tr>`
        const rowWithBadge = getRowWithBadge(3, 400, 'bronze', localeString, 'text', 'contribute');
        expect(rowWithBadge).toEqual(row)
    })

    test("should get row of silver badge for contribution in suno India with sentence count , level, badgeName",()=>{
        const localeString = {Level:'Level', silver:'silver',Sentences:'Sentences'}
        const badgeDescription = `<p class="text-left mb-0 ml-3">Transcribing: 800 Sentences</p>`;
        const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 4</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/suno_silver_medal.svg class="table-img" height="76" width="63" alt=silver id="silver_contribute" rel="popover"></div><span>silver</span></td></tr>`
        const rowWithBadge = getRowWithBadge(4, 800, 'silver', localeString, 'asr', 'contribute');
        expect(rowWithBadge).toEqual(row)
    }) 

    test("should get row of gold badge for contribution in likho India with sentence count , level, badgeName",()=>{
        const localeString = {Level:'Level', gold:'gold',Sentences:'Sentences'}
        const badgeDescription = `<p class="text-left mb-0 ml-3">Translating: 900 Sentences</p>`;
        const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 2</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/likho_gold_medal.svg class="table-img" height="76" width="63" alt=gold id="gold_contribute" rel="popover"></div><span>gold</span></td></tr>`
        const rowWithBadge = getRowWithBadge(2, 900, 'gold', localeString, 'parallel', 'contribute');
        expect(rowWithBadge).toEqual(row)
    })

    test("should get row of platinum badge for contribution in dekho India with sentence count , level, badgeName",()=>{
        const localeString = {Level:'Level', platinum:'platinum',Sentences:'Sentences'}
        const badgeDescription = `<p class="text-left mb-0 ml-3">Labelling: 200 Images</p>`;
        const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 1</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/dekho_platinum_medal.svg class="table-img" height="76" width="63" alt=platinum id="platinum_contribute" rel="popover"></div><span>platinum</span></td></tr>`
        const rowWithBadge = getRowWithBadge(1, 200, 'platinum', localeString, 'ocr', 'contribute');
        expect(rowWithBadge).toEqual(row)
    })
})

describe("getCard for selected module, badge and contribution type",()=> {
    test("should give card of bronze badge for contribution in bolo India", () => {
        const localeString = {bronze: 'bronze'}
        const bronzeCard = `<div class="text-center">
                <div class="py-2">
                    <img src=../img/bronze_medal.svg alt="bronze_badge" class="img-fluid">
                </div>
                <h3>bronze</h3>
            </div>`
        const card = getCard('bronze', localeString, 'text','contribute');
        expect(card).toEqual(bronzeCard)
    })

    test("should give card of gold badge for contribution in suno India", () => {
        const localeString = {gold: 'gold'}
        const goldCard = `<div class="text-center">
                <div class="py-2">
                    <img src=../img/suno_gold_medal.svg alt="gold_badge" class="img-fluid">
                </div>
                <h3>gold</h3>
            </div>`
        const card = getCard('gold', localeString, 'asr', 'contribute');
        expect(card).toEqual(goldCard)
    })

    test("should give card of platinum badge for contribution in dekho India", () => {
        const localeString = {platinum: 'platinum'}
        const platinumCard = `<div class="text-center">
                <div class="py-2">
                    <img src=../img/dekho_platinum_medal.svg alt="platinum_badge" class="img-fluid">
                </div>
                <h3>platinum</h3>
            </div>`
        const card = getCard('platinum', localeString, 'ocr', 'contribute');
        expect(card).toEqual(platinumCard)
    })

    test("should give card of silver badge for contribution in likho India", () => {
        const localeString = {silver: 'silver'}
        const platinumCard = `<div class="text-center">
                <div class="py-2">
                    <img src=../img/likho_silver_medal.svg alt="silver_badge" class="img-fluid">
                </div>
                <h3>silver</h3>
            </div>`
        const card = getCard('silver', localeString, 'parallel', 'contribute');
        expect(card).toEqual(platinumCard)
    })
})

// describe("getRowWithBadge for selected module and validating type",()=>{
//     test("should get row of bronze badge for validation in bolo India with sentence count , level, badgeName",()=>{
//         const localeString = {Level:'Level', bronze:'bronze',Sentences:'Sentences'}
//         const badgeDescription = `<p class="text-left mb-0 ml-3">Validating: 400 Sentences</p>`;
//         const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 3</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/bolo_bronze_badge_val.png class="table-img" height="76" width="63" alt=bronze id="bronze_validate" rel="popover"></div><span>bronze</span></td></tr>`
//         const rowWithBadge = getRowWithBadge(3, 400, 'bronze', localeString, 'text', 'validate');
//         expect(rowWithBadge).toEqual(row)
//     })

//     test("should get row of silver badge for validation in suno India with sentence count , level, badgeName",()=>{
//         const localeString = {Level:'Level', silver:'silver',Sentences:'Sentences'}
//         const badgeDescription = `<p class="text-left mb-0 ml-3">Validating: 800 Sentences</p>`;
//         const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 4</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/suno_silver_badge_val.png class="table-img" height="76" width="63" alt=silver id="silver_validate" rel="popover"></div><span>silver</span></td></tr>`
//         const rowWithBadge = getRowWithBadge(4, 800, 'silver', localeString, 'asr', 'validate');
//         expect(rowWithBadge).toEqual(row)
//     }) 

//     test("should get row of gold badge for validation in likho India with sentence count , level, badgeName",()=>{
//         const localeString = {Level:'Level', gold:'gold',Sentences:'Sentences'}
//         const badgeDescription = `<p class="text-left mb-0 ml-3">Validating: 900 Sentences</p>`;
//         const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 2</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/likho_gold_badge_val.png class="table-img" height="76" width="63" alt=gold id="gold_validate" rel="popover"></div><span>gold</span></td></tr>`
//         const rowWithBadge = getRowWithBadge(2, 900, 'gold', localeString, 'parallel', 'validate');
//         expect(rowWithBadge).toEqual(row)
//     })

//     test("should get row of platinum badge for validation in dekho India with sentence count , level, badgeName",()=>{
//         const localeString = {Level:'Level', platinum:'platinum',Sentences:'Sentences'}
//         const badgeDescription = `<p class="text-left mb-0 ml-3">Validating: 200 Images</p>`;
//         const row = `<tr id="level"><td class="pl-lg-5 pl-md-4 pl-3">Level 1</td><td>${badgeDescription}</td><td class="text-center"><div><img src=../img/dekho_platinum_badge_val.png class="table-img" height="76" width="63" alt=platinum id="platinum_validate" rel="popover"></div><span>platinum</span></td></tr>`
//         const rowWithBadge = getRowWithBadge(1, 200, 'platinum', localeString, 'ocr', 'validate');
//         expect(rowWithBadge).toEqual(row)
//     })
// })

// describe("getCard for selected module, badge and validation type",()=> {
//     test("should give card of bronze badge for validation in bolo India", () => {
//         const localeString = {bronze: 'bronze'}
//         const bronzeCard = `<div class="text-center">
//                 <div class="py-2">
//                     <img src=../img/bolo_bronze_badge_val.png alt="bronze_badge" class="img-fluid">
//                 </div>
//                 <h3>bronze</h3>
//             </div>`
//         const card = getCard('bronze', localeString, 'text','validate');
//         expect(card).toEqual(bronzeCard)
//     })

//     test("should give card of gold badge for validation in suno India", () => {
//         const localeString = {gold: 'gold'}
//         const goldCard = `<div class="text-center">
//                 <div class="py-2">
//                     <img src=../img/suno_gold_badge_val.png alt="gold_badge" class="img-fluid">
//                 </div>
//                 <h3>gold</h3>
//             </div>`
//         const card = getCard('gold', localeString, 'asr', 'validate');
//         expect(card).toEqual(goldCard)
//     })

//     test("should give card of platinum badge for validation in dekho India", () => {
//         const localeString = {platinum: 'platinum'}
//         const platinumCard = `<div class="text-center">
//                 <div class="py-2">
//                     <img src=../img/dekho_platinum_badge_val.png alt="platinum_badge" class="img-fluid">
//                 </div>
//                 <h3>platinum</h3>
//             </div>`
//         const card = getCard('platinum', localeString, 'ocr', 'validate');
//         expect(card).toEqual(platinumCard)
//     })

//     test("should give card of silver badge for validation in likho India", () => {
//         const localeString = {silver: 'silver'}
//         const platinumCard = `<div class="text-center">
//                 <div class="py-2">
//                     <img src=../img/likho_silver_badge_val.png alt="silver_badge" class="img-fluid">
//                 </div>
//                 <h3>silver</h3>
//             </div>`
//         const card = getCard('silver', localeString, 'parallel', 'validate');
//         expect(card).toEqual(platinumCard)
//     })
// })