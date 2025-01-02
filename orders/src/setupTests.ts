import "@testing-library/jest-dom";

// Add TextEncoder/TextDecoder to global scope
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
