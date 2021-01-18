const stringToHTML = function (str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

const localStorageMock = (function () {
    const store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
    };
})();

function mockLocalStorage() {
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});
}

const flushPromises = () => new Promise(setImmediate);

module.exports = {stringToHTML, mockLocalStorage, flushPromises};