const fetchMock = require("fetch-mock");
const { readFileSync } = require("fs");
const {getBadgesForUser } = require("../src/assets/js/my-badges");
const { stringToHTML, flushPromises, mockLocalStorage } = require("./utils");

document.body = stringToHTML(
    readFileSync(`${__dirname}/../src/views/my-badges.ejs`, "UTF-8")
);

describe('fetch user badge', () => {
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

        getBadgesForUser().then((an) => {
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
    })
});