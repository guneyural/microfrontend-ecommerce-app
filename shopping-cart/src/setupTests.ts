import "@testing-library/jest-dom";

// Add TextEncoder/TextDecoder polyfills
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
