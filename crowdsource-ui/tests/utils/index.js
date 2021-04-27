const stringToHTML = function (str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {}
        },
        removeItem : function (key) {
            delete(store[key]);
        },
    };
})();

function mockLocalStorage() {
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});
}


function mockLocation(url=""){
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
        }
    });
}

const flushPromises = () => new Promise(setImmediate);

module.exports = {stringToHTML, mockLocalStorage, flushPromises,mockLocation};
