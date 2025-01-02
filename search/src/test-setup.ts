import "@testing-library/jest-dom";

// Add missing browser APIs
class TextEncoderPolyfill {
  encode(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }
}

class TextDecoderPolyfill {
  decode(arr: Uint8Array): string {
    return String.fromCharCode.apply(null, Array.from(arr));
  }
}

global.TextEncoder = TextEncoderPolyfill;
global.TextDecoder = TextDecoderPolyfill as any;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
