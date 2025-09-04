// Dirty browser window shim

const mockDocument = {
    createElement: (x) => ({
        ownerDocument: document,
        style: {},
        nodeName: "",
        childNodes: [],
        setAttribute: () => {},
        appendChild: () => {},
        lastChild: {},
        toString: () => " ",
        removeChild: () => {},
        contentWindow: {
            document: {
                open: () => {},
                close: () => {},
                write: () => {}
            }
        }
    }),
    createTextNode: (x) => ({
        nodeValue: "",
        nodeName: "",
        childNodes: [],
        setAttribute: () => {},
        appendChild: () => {},
        lastChild: {},
        toString: () => " "
    }),
    createElementNS: (x) => [],
    addEventListener: () => {},
    createRange: () => {
        return {
            createContextualFragment: () => {
                return {
                    firstChild: {
                        querySelectorAll: (x) => []
                    }
                };
            },
            selectNode: () => {}
        };
    },
    body: {
        appendChild: () => {},
        addEventListener: () => {}
    },
    location: {},
    documentElement: {
        appendChild: () => {},
        removeChild: () => {}
    }
};

const mockWindow = {
    screen: { width: 800, height: 600 },
    addEventListener: () => {},
    location: {},
    Image: Function,
    document: mockDocument,
    navigator: {
        platform: "",
        userAgent: ""
    },
    NodeList: Array,
    WebSocket: Object,
    localStorage: {
        getItem() {
            return null;
        }
    },
    sessionStorage: {
        getItem() {
            return null;
        },
        setItem() {}
    },
    MutationObserver: class MutationObserver {}
};

// Create a copy for globals
const globalWindow = { ...mockWindow };
globalWindow.document = mockDocument;

// Assign to globals in a way that doesn't modify read-only globals
Object.assign(global, globalWindow);

// Required globals

DOM = require("../src/client/dom");
DOM.get = (x) => [{ addEventListener: () => {}, style: {} }];
DOM.init();
ELECTRON_NOGPU = false;
CANVAS_FRAMERATE = 1;
LANG = "en";
ENV = { id: "" };
IP = "";
