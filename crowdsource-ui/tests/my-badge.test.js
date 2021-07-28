const fetchMock = require("fetch-mock");
const { readFileSync } = require("fs");
const { getBadgesForUser, getBadgeRow } = require("../src/assets/js/my-badges");
const { stringToHTML, mockLocalStorage } = require("./utils");
const {LOCALE_STRINGS} = require("../src/assets/js/constants")

document.body = stringToHTML(
    readFileSync(`${__dirname}/../src/views/my-badges.ejs`, "UTF-8")
);

describe('fetch user badge', () => {
    let $tableRows = $(`#suno-badge`);
    let $boloTableRows = $(`#bolo-badge`);
    test("should fetch user rewards", () => {
        mockLocalStorage();
        localStorage.setItem("speakerDetails", "{'userName' : 'myUser'}");
        fetchMock.get(`/user-rewards/myUser`, [{
            category: "validate",
            contributor_id: 6660,
            generated_at: "2021-07-01T13:03:34.522Z",
            generated_badge_id: "e0e058b0-7d1f-42bb-8a2e-d255c6001ffa",
            grade: "Bronze",
            language: "Hindi",
            milestone: 5,
            type: "text"
        }, {
            category: "contribute",
            contributor_id: 6660,
            generated_at: "2021-07-05T06:33:58.359Z",
            generated_badge_id: "758d6cac-cb92-4e87-a4f9-291b6d4dc8da",
            grade: "Bronze",
            language: "Odia",
            milestone: 5,
            type: "parallel"
        }]
        );

        getBadgesForUser('myUser').then((an) => {
            expect(an).toEqual([{
                category: "validate",
                contributor_id: 6660,
                generated_at: "2021-07-01T13:03:34.522Z",
                generated_badge_id: "e0e058b0-7d1f-42bb-8a2e-d255c6001ffa",
                grade: "Bronze",
                language: "Hindi",
                milestone: 5,
                type: "text"
            }, {
                category: "contribute",
                contributor_id: 6660,
                generated_at: "2021-07-05T06:33:58.359Z",
                generated_badge_id: "758d6cac-cb92-4e87-a4f9-291b6d4dc8da",
                grade: "Bronze",
                language: "Odia",
                milestone: 5,
                type: "parallel"
            }]);
            fetchMock.reset();
        });
    });


    test("validate suno badge data", () => {
        mockLocalStorage();
        localStorage.setItem(LOCALE_STRINGS, "{'Kannada' : 'Kannada','Validation': 'Validation', 'Contribution': 'Contribution'}");
        let sunoItem = {
            initiativeType: "asr",
            language: [
                {
                    name: "Kannada",
                    contribute: [
                        {
                            category: "contribute",
                            contributor_id: 6660,
                            generated_at: "2021-07-05T06:44:29.846Z",
                            generated_badge_id: "6cf85e2f-b4b0-4d61-bb98-ba2232a7766b",
                            grade: "Bronze",
                            language: "Kannada",
                            milestone: 5,
                            type: "asr"
                        }
                    ],
                    validate: []
                }
            ]
        }

        const sunoRow = `<div class="col-12 p-0">
        <div class="row m-0">
          <div class="col-lg-2 col-md-3 col-12 m-auto">
            <h4 class="font-family-Rowdies my-4 my-lg-0 my-md-0">Kannada</h4> 
           </div>
            <div class="col-lg-5 col-md-5 col-12">
           <div class="row mx-0 mb-2 d-lg-none">
             <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> Contribution </h6>
             </div>
           <div class="row m-0">
             <div class="col-3 pl-0">
             
<div class="badge-widget text-center" rel="popover" id="Bronze_contribution_suno_badge">
<img src="/img/en_suno_bronze_contribute.svg" class="my-badge-image" height="74" width="60">
<h6 class="mt-2 font-family-Rowdies">Bronze</h6>
</div>
             </div>
             <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Silver_contribution_placeholder">
           <p>Silver</p>
</div>
             </div>
             <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Gold_contribution_placeholder">
           <p>Gold</p>
</div>
             </div>
             <div class="col-3 pl-0">
              <div class="badge-widget-placeholder m-auto text-center" id="Platinum_contribution_placeholder">
           <p>Platinum</p>
</div>
             </div>
           </div>
         </div>
          <div class="col-5"></div>
        </div>
      </div>`;
      const localString = localStorage.getItem(LOCALE_STRINGS);
      console.log("localStorage + Ayush",localString);
        getBadgeRow(sunoItem, 'suno-badge', 'suno', localString, "English");

        setTimeout(() => {
            $tableRows.append(sunoRow);
            expect($tableRows.innerHtml).toEqual(sunoRow);
            localStorage.clear();
        }, 1000);
      
    });


    test("validate bolo badge data", () => {
        mockLocalStorage();
        localStorage.setItem(LOCALE_STRINGS, "{'Hindi' : 'Hindi', 'Validation': 'Validation', 'Contribution': 'Contribution'}");
        let boloItem = {
            initiativeType: "text",
            language: [
                {
                    name: "Hindi",
                    contribute: [
                        {
                            category: "contribute",
                            contributor_id: 6660,
                            generated_at: "2021-07-05T06:38:08.574Z",
                            generated_badge_id: "295238f2-5f49-4ef7-9ce1-0221f7220cdc",
                            grade: "Bronze",
                            language: "Hindi",
                            milestone: 5,
                            type: "text"
                        }
                    ],
                    validate: [
                        {
                            category: "validate",
                            contributor_id: 6660,
                            generated_at: "2021-07-01T13:03:34.522Z",
                            generated_badge_id: "e0e058b0-7d1f-42bb-8a2e-d255c6001ffa",
                            grade: "Bronze",
                            language: "Hindi",
                            milestone: 5,
                            type: "text"
                        }
                    ]
                }
            ]
        }

        const boloRow = `<div class="col-12 p-0">
        <div class="row m-0">
          <div class="col-lg-2 col-md-3 col-12 m-auto">
            <h4 class="font-family-Rowdies my-4 my-lg-0 my-md-0">Hindi</h4> 
           </div>
            <div class="col-lg-5 col-md-5 col-12">
           <div class="row mx-0 mb-2 d-lg-none">
             <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> Contribution </h6>
             </div>
           <div class="row m-0">
             <div class="col-3 pl-0">
             
<div class="badge-widget text-center" rel="popover" id="Bronze_contribution_bolo_badge">
<img src="/img/en_bolo_bronze_contribute.svg" class="my-badge-image" height="74" width="60">
<h6 class="mt-2 font-family-Rowdies">Bronze</h6>
</div>
             </div>
             <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Silver_contribution_placeholder">
           <p>Silver</p>
</div>
             </div>
             <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Gold_contribution_placeholder">
           <p>Gold</p>
</div>
             </div>
             <div class="col-3 pl-0">
              <div class="badge-widget-placeholder m-auto text-center" id="Platinum_contribution_placeholder">
           <p>Platinum</p>
</div>
             </div>
           </div>
         </div>
           <div class="col-lg-5 col-md-5 col-12 mt-3 mt-lg-0 mt-md-0">
         <div class="row mx-0 mb-2 d-lg-none">
         <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> Validation </h6>
         </div>
         <div class="row m-0">
           <div class="col-3 pl-0">
           
<div class="badge-widget text-center" rel="popover" id="Bronze_validation_bolo_badge">
<img src="/img/en_bolo_bronze_validate.svg" class="my-badge-image" height="74" width="60">
<h6 class="mt-2 font-family-Rowdies">Bronze</h6>
</div>
           </div>
           <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Silver_validation_placeholder">
           <p>Silver</p>
</div>
             </div>
             <div class="col-3 pl-0">
                <div class="badge-widget-placeholder m-auto text-center" id="Gold_validation_placeholder">
           <p>Gold</p>
</div>
             </div>
             <div class="col-3 pl-0">
              <div class="badge-widget-placeholder m-auto text-center" id="Platinum_validation_placeholder">
           <p>Platinum</p>
</div>
             </div>
         </div>
       </div>
        </div>
      </div>`;
      const localString = localStorage.getItem(LOCALE_STRINGS);
        getBadgeRow(boloItem, 'bolo-badge', 'bolo', localString, "English");

        setTimeout(() => {
            $boloTableRows.append(boloRow);
            expect($boloTableRows.innerHtml).toEqual(boloRow);
        }, 1000);

    });
});