import fs from 'https://deno.land/std/node/fs.ts';
import path from 'https://deno.land/std/node/path.ts';
import util from 'https://deno.land/std/node/util.ts';
import events from 'https://deno.land/std/node/events.ts';
import os from 'https://deno.land/std/node/os.ts';
import tty from 'tty';
import crypto from 'crypto';
import stream from 'stream';
import assert from 'assert';
import url from 'url';

var commonjsGlobal =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
    ? self
    : {};

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
    ? x['default']
    : x;
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

function commonjsRequire() {
  throw new Error(
    'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
  );
}

var inherits_browser = createCommonjsModule(function(module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

var inherits = createCommonjsModule(function(module) {
  try {
    var util$1 = util;
    /* istanbul ignore next */
    if (typeof util$1.inherits !== 'function') throw '';
    module.exports = util$1.inherits;
  } catch (e) {
    /* istanbul ignore next */
    module.exports = inherits_browser;
  }
});

var lodash = createCommonjsModule(function(module, exports) {
  (function() {
    /** Used as a safe reference for `undefined` in pre-ES5 environments. */
    var undefined$1;

    /** Used as the semantic version number. */
    var VERSION = '4.17.15';

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Error message constants. */
    var CORE_ERROR_TEXT =
        'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function';

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /** Used as the internal argument placeholder. */
    var PLACEHOLDER = '__lodash_placeholder__';

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

    /** Used to compose bitmasks for function metadata. */
    var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

    /** Used as default options for `_.truncate`. */
    var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

    /** Used to detect hot functions by number of calls within a span of milliseconds. */
    var HOT_COUNT = 800,
      HOT_SPAN = 16;

    /** Used to indicate the type of lazy iteratees. */
    var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e308,
      NAN = 0 / 0;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /** Used to associate wrap methods with their bit flags. */
    var wrapFlags = [
      ['ary', WRAP_ARY_FLAG],
      ['bind', WRAP_BIND_FLAG],
      ['bindKey', WRAP_BIND_KEY_FLAG],
      ['curry', WRAP_CURRY_FLAG],
      ['curryRight', WRAP_CURRY_RIGHT_FLAG],
      ['flip', WRAP_FLIP_FLAG],
      ['partial', WRAP_PARTIAL_FLAG],
      ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
      ['rearg', WRAP_REARG_FLAG],
    ];

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

    var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

    /** Used to match empty string literals in compiled template source. */
    var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

    /** Used to match HTML entities and HTML characters. */
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

    /** Used to match template delimiters. */
    var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

    /** Used to match wrap detail comments. */
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

    /** Used to match words composed of alphanumeric characters. */
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Used to match
     * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
     */
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to match Latin Unicode letters (excluding mathematical operators). */
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

    /** Used to ensure capturing order of template delimiters. */
    var reNoMatch = /($^)/;

    /** Used to match unescaped characters in compiled string literals. */
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

    /** Used to compose unicode character classes. */
    var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange =
        rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange =
        ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange =
        rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

    /** Used to compose unicode capture groups. */
    var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc =
        '[^' +
        rsAstralRange +
        rsBreakRange +
        rsDigits +
        rsDingbatRange +
        rsLowerRange +
        rsUpperRange +
        ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

    /** Used to compose unicode regexes. */
    var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin =
        '(?:' +
        rsZWJ +
        '(?:' +
        [rsNonAstral, rsRegional, rsSurrPair].join('|') +
        ')' +
        rsOptVar +
        reOptMod +
        ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji =
        '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol =
        '(?:' +
        [
          rsNonAstral + rsCombo + '?',
          rsCombo,
          rsRegional,
          rsSurrPair,
          rsAstral,
        ].join('|') +
        ')';

    /** Used to match apostrophes. */
    var reApos = RegExp(rsApos, 'g');

    /**
     * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
     * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
     */
    var reComboMark = RegExp(rsCombo, 'g');

    /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
    var reUnicode = RegExp(
      rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq,
      'g'
    );

    /** Used to match complex or compound words. */
    var reUnicodeWord = RegExp(
      [
        rsUpper +
          '?' +
          rsLower +
          '+' +
          rsOptContrLower +
          '(?=' +
          [rsBreak, rsUpper, '$'].join('|') +
          ')',
        rsMiscUpper +
          '+' +
          rsOptContrUpper +
          '(?=' +
          [rsBreak, rsUpper + rsMiscLower, '$'].join('|') +
          ')',
        rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
        rsUpper + '+' + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji,
      ].join('|'),
      'g'
    );

    /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
    var reHasUnicode = RegExp(
      '[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']'
    );

    /** Used to detect strings that need a more robust regexp to match words. */
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

    /** Used to assign default `context` object properties. */
    var contextProps = [
      'Array',
      'Buffer',
      'DataView',
      'Date',
      'Error',
      'Float32Array',
      'Float64Array',
      'Function',
      'Int8Array',
      'Int16Array',
      'Int32Array',
      'Map',
      'Math',
      'Object',
      'Promise',
      'RegExp',
      'Set',
      'String',
      'Symbol',
      'TypeError',
      'Uint8Array',
      'Uint8ClampedArray',
      'Uint16Array',
      'Uint32Array',
      'WeakMap',
      '_',
      'clearTimeout',
      'isFinite',
      'parseInt',
      'setTimeout',
    ];

    /** Used to make template sourceURLs easier to identify. */
    var templateCounter = -1;

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[
      int8Tag
    ] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[
      uint8Tag
    ] = typedArrayTags[uint8ClampedTag] = typedArrayTags[
      uint16Tag
    ] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[
      arrayBufferTag
    ] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[
      dateTag
    ] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[
      mapTag
    ] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[
      regexpTag
    ] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[
      weakMapTag
    ] = false;

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[
      arrayBufferTag
    ] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[
      dateTag
    ] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[
      int8Tag
    ] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[
      mapTag
    ] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[
      regexpTag
    ] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[
      symbolTag
    ] = cloneableTags[uint8Tag] = cloneableTags[
      uint8ClampedTag
    ] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[
      weakMapTag
    ] = false;

    /** Used to map Latin Unicode letters to basic Latin letters. */
    var deburredLetters = {
      // Latin-1 Supplement block.
      À: 'A',
      Á: 'A',
      Â: 'A',
      Ã: 'A',
      Ä: 'A',
      Å: 'A',
      à: 'a',
      á: 'a',
      â: 'a',
      ã: 'a',
      ä: 'a',
      å: 'a',
      Ç: 'C',
      ç: 'c',
      Ð: 'D',
      ð: 'd',
      È: 'E',
      É: 'E',
      Ê: 'E',
      Ë: 'E',
      è: 'e',
      é: 'e',
      ê: 'e',
      ë: 'e',
      Ì: 'I',
      Í: 'I',
      Î: 'I',
      Ï: 'I',
      ì: 'i',
      í: 'i',
      î: 'i',
      ï: 'i',
      Ñ: 'N',
      ñ: 'n',
      Ò: 'O',
      Ó: 'O',
      Ô: 'O',
      Õ: 'O',
      Ö: 'O',
      Ø: 'O',
      ò: 'o',
      ó: 'o',
      ô: 'o',
      õ: 'o',
      ö: 'o',
      ø: 'o',
      Ù: 'U',
      Ú: 'U',
      Û: 'U',
      Ü: 'U',
      ù: 'u',
      ú: 'u',
      û: 'u',
      ü: 'u',
      Ý: 'Y',
      ý: 'y',
      ÿ: 'y',
      Æ: 'Ae',
      æ: 'ae',
      Þ: 'Th',
      þ: 'th',
      ß: 'ss',
      // Latin Extended-A block.
      Ā: 'A',
      Ă: 'A',
      Ą: 'A',
      ā: 'a',
      ă: 'a',
      ą: 'a',
      Ć: 'C',
      Ĉ: 'C',
      Ċ: 'C',
      Č: 'C',
      ć: 'c',
      ĉ: 'c',
      ċ: 'c',
      č: 'c',
      Ď: 'D',
      Đ: 'D',
      ď: 'd',
      đ: 'd',
      Ē: 'E',
      Ĕ: 'E',
      Ė: 'E',
      Ę: 'E',
      Ě: 'E',
      ē: 'e',
      ĕ: 'e',
      ė: 'e',
      ę: 'e',
      ě: 'e',
      Ĝ: 'G',
      Ğ: 'G',
      Ġ: 'G',
      Ģ: 'G',
      ĝ: 'g',
      ğ: 'g',
      ġ: 'g',
      ģ: 'g',
      Ĥ: 'H',
      Ħ: 'H',
      ĥ: 'h',
      ħ: 'h',
      Ĩ: 'I',
      Ī: 'I',
      Ĭ: 'I',
      Į: 'I',
      İ: 'I',
      ĩ: 'i',
      ī: 'i',
      ĭ: 'i',
      į: 'i',
      ı: 'i',
      Ĵ: 'J',
      ĵ: 'j',
      Ķ: 'K',
      ķ: 'k',
      ĸ: 'k',
      Ĺ: 'L',
      Ļ: 'L',
      Ľ: 'L',
      Ŀ: 'L',
      Ł: 'L',
      ĺ: 'l',
      ļ: 'l',
      ľ: 'l',
      ŀ: 'l',
      ł: 'l',
      Ń: 'N',
      Ņ: 'N',
      Ň: 'N',
      Ŋ: 'N',
      ń: 'n',
      ņ: 'n',
      ň: 'n',
      ŋ: 'n',
      Ō: 'O',
      Ŏ: 'O',
      Ő: 'O',
      ō: 'o',
      ŏ: 'o',
      ő: 'o',
      Ŕ: 'R',
      Ŗ: 'R',
      Ř: 'R',
      ŕ: 'r',
      ŗ: 'r',
      ř: 'r',
      Ś: 'S',
      Ŝ: 'S',
      Ş: 'S',
      Š: 'S',
      ś: 's',
      ŝ: 's',
      ş: 's',
      š: 's',
      Ţ: 'T',
      Ť: 'T',
      Ŧ: 'T',
      ţ: 't',
      ť: 't',
      ŧ: 't',
      Ũ: 'U',
      Ū: 'U',
      Ŭ: 'U',
      Ů: 'U',
      Ű: 'U',
      Ų: 'U',
      ũ: 'u',
      ū: 'u',
      ŭ: 'u',
      ů: 'u',
      ű: 'u',
      ų: 'u',
      Ŵ: 'W',
      ŵ: 'w',
      Ŷ: 'Y',
      ŷ: 'y',
      Ÿ: 'Y',
      Ź: 'Z',
      Ż: 'Z',
      Ž: 'Z',
      ź: 'z',
      ż: 'z',
      ž: 'z',
      Ĳ: 'IJ',
      ĳ: 'ij',
      Œ: 'Oe',
      œ: 'oe',
      ŉ: "'n",
      ſ: 's',
    };

    /** Used to map characters to HTML entities. */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    /** Used to map HTML entities to characters. */
    var htmlUnescapes = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
    };

    /** Used to escape characters for inclusion in compiled string literals. */
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      '\u2028': 'u2028',
      '\u2029': 'u2029',
    };

    /** Built-in method references without a dependency on `root`. */
    var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal =
      typeof commonjsGlobal == 'object' &&
      commonjsGlobal &&
      commonjsGlobal.Object === Object &&
      commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf =
      typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule =
      freeExports &&
      'object' == 'object' &&
      module &&
      !module.nodeType &&
      module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types =
          freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return (
          freeProcess && freeProcess.binding && freeProcess.binding('util')
        );
      } catch (e) {}
    })();

    /* Node.js helper references. */
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /*--------------------------------------------------------------------------*/

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }

    /**
     * A specialized version of `baseAggregator` for arrays.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.includes` for arrays without support for
     * specifying an index to search from.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }

    /**
     * This function is like `arrayIncludes` except that it accepts a comparator.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @param {Function} comparator The comparator invoked per element.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludesWith(array, value, comparator) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
        length = values.length,
        offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
        length = array == null ? 0 : array.length;

      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the last element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Gets the size of an ASCII `string`.
     *
     * @private
     * @param {string} string The string inspect.
     * @returns {number} Returns the string size.
     */
    var asciiSize = baseProperty('length');

    /**
     * Converts an ASCII `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function asciiToArray(string) {
      return string.split('');
    }

    /**
     * Splits an ASCII `string` into an array of its words.
     *
     * @private
     * @param {string} The string to inspect.
     * @returns {Array} Returns the words of `string`.
     */
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }

    /**
     * The base implementation of methods like `_.findKey` and `_.findLastKey`,
     * without support for iteratee shorthands, which iterates over `collection`
     * using `eachFunc`.
     *
     * @private
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      return value === value
        ? strictIndexOf(array, value, fromIndex)
        : baseFindIndex(array, baseIsNaN, fromIndex);
    }

    /**
     * This function is like `baseIndexOf` except that it accepts a comparator.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @param {Function} comparator The comparator invoked per element.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index = fromIndex - 1,
        length = array.length;

      while (++index < length) {
        if (comparator(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }

    /**
     * The base implementation of `_.mean` and `_.meanBy` without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the mean.
     */
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined$1 : object[key];
      };
    }

    /**
     * The base implementation of `_.propertyOf` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined$1 : object[key];
      };
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight`, without support
     * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initAccum Specify using the first or last element of
     *  `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(
      collection,
      iteratee,
      accumulator,
      initAccum,
      eachFunc
    ) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initAccum
          ? ((initAccum = false), value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define the
     * sort order of `array` and replaces criteria objects with their corresponding
     * values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sum` and `_.sumBy` without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(array, iteratee) {
      var result,
        index = -1,
        length = array.length;

      while (++index < length) {
        var current = iteratee(array[index]);
        if (current !== undefined$1) {
          result = result === undefined$1 ? current : result + current;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
        result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
     * of key-value pairs for `object` corresponding to the property names of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the key-value pairs.
     */
    function baseToPairs(object, props) {
      return arrayMap(props, function(key) {
        return [key, object[key]];
      });
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /**
     * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
     * that is not found in the character symbols.
     *
     * @private
     * @param {Array} strSymbols The string symbols to inspect.
     * @param {Array} chrSymbols The character symbols to find.
     * @returns {number} Returns the index of the first unmatched string symbol.
     */
    function charsStartIndex(strSymbols, chrSymbols) {
      var index = -1,
        length = strSymbols.length;

      while (
        ++index < length &&
        baseIndexOf(chrSymbols, strSymbols[index], 0) > -1
      ) {}
      return index;
    }

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
     * that is not found in the character symbols.
     *
     * @private
     * @param {Array} strSymbols The string symbols to inspect.
     * @param {Array} chrSymbols The character symbols to find.
     * @returns {number} Returns the index of the last unmatched string symbol.
     */
    function charsEndIndex(strSymbols, chrSymbols) {
      var index = strSymbols.length;

      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
      return index;
    }

    /**
     * Gets the number of `placeholder` occurrences in `array`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} placeholder The placeholder to search for.
     * @returns {number} Returns the placeholder count.
     */
    function countHolders(array, placeholder) {
      var length = array.length,
        result = 0;

      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }

    /**
     * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
     * letters to basic Latin letters.
     *
     * @private
     * @param {string} letter The matched letter to deburr.
     * @returns {string} Returns the deburred letter.
     */
    var deburrLetter = basePropertyOf(deburredLetters);

    /**
     * Used by `_.escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} chr The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    var escapeHtmlChar = basePropertyOf(htmlEscapes);

    /**
     * Used by `_.template` to escape characters for inclusion in compiled string literals.
     *
     * @private
     * @param {string} chr The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeStringChar(chr) {
      return '\\' + stringEscapes[chr];
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined$1 : object[key];
    }

    /**
     * Checks if `string` contains Unicode symbols.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {boolean} Returns `true` if a symbol is found, else `false`.
     */
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }

    /**
     * Checks if `string` contains a word composed of Unicode symbols.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {boolean} Returns `true` if a word is found, else `false`.
     */
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }

    /**
     * Converts `iterator` to an array.
     *
     * @private
     * @param {Object} iterator The iterator to convert.
     * @returns {Array} Returns the converted array.
     */
    function iteratorToArray(iterator) {
      var data,
        result = [];

      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
        result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /**
     * Replaces all `placeholder` elements in `array` with an internal placeholder
     * and returns an array of their indexes.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {*} placeholder The placeholder to replace.
     * @returns {Array} Returns the new array of placeholder indexes.
     */
    function replaceHolders(array, placeholder) {
      var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (value === placeholder || value === PLACEHOLDER) {
          array[index] = PLACEHOLDER;
          result[resIndex++] = index;
        }
      }
      return result;
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
        result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /**
     * Converts `set` to its value-value pairs.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the value-value pairs.
     */
    function setToPairs(set) {
      var index = -1,
        result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = [value, value];
      });
      return result;
    }

    /**
     * A specialized version of `_.indexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
        length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * A specialized version of `_.lastIndexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function strictLastIndexOf(array, value, fromIndex) {
      var index = fromIndex + 1;
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return index;
    }

    /**
     * Gets the number of symbols in `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the string size.
     */
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }

    /**
     * Converts `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }

    /**
     * Used by `_.unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} chr The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

    /**
     * Gets the size of a Unicode `string`.
     *
     * @private
     * @param {string} string The string inspect.
     * @returns {number} Returns the string size.
     */
    function unicodeSize(string) {
      var result = (reUnicode.lastIndex = 0);
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }

    /**
     * Converts a Unicode `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }

    /**
     * Splits a Unicode `string` into an array of its words.
     *
     * @private
     * @param {string} The string to inspect.
     * @returns {Array} Returns the words of `string`.
     */
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Create a new pristine `lodash` function using the `context` object.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Util
     * @param {Object} [context=root] The context object.
     * @returns {Function} Returns a new `lodash` function.
     * @example
     *
     * _.mixin({ 'foo': _.constant('foo') });
     *
     * var lodash = _.runInContext();
     * lodash.mixin({ 'bar': lodash.constant('bar') });
     *
     * _.isFunction(_.foo);
     * // => true
     * _.isFunction(_.bar);
     * // => false
     *
     * lodash.isFunction(lodash.foo);
     * // => false
     * lodash.isFunction(lodash.bar);
     * // => true
     *
     * // Create a suped-up `defer` in Node.js.
     * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
     */
    var runInContext = function runInContext(context) {
      context =
        context == null
          ? root
          : _.defaults(root.Object(), context, _.pick(root, contextProps));

      /** Built-in constructor references. */
      var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

      /** Used for built-in method references. */
      var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

      /** Used to detect overreaching core-js shims. */
      var coreJsData = context['__core-js_shared__'];

      /** Used to resolve the decompiled source of functions. */
      var funcToString = funcProto.toString;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /** Used to generate unique IDs. */
      var idCounter = 0;

      /** Used to detect methods masquerading as native. */
      var maskSrcKey = (function() {
        var uid = /[^.]+$/.exec(
          (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || ''
        );
        return uid ? 'Symbol(src)_1.' + uid : '';
      })();

      /**
       * Used to resolve the
       * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
       * of values.
       */
      var nativeObjectToString = objectProto.toString;

      /** Used to infer the `Object` constructor. */
      var objectCtorString = funcToString.call(Object);

      /** Used to restore the original `_` reference in `_.noConflict`. */
      var oldDash = root._;

      /** Used to detect if a method is native. */
      var reIsNative = RegExp(
        '^' +
          funcToString
            .call(hasOwnProperty)
            .replace(reRegExpChar, '\\$&')
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              '$1.*?'
            ) +
          '$'
      );

      /** Built-in value references. */
      var Buffer = moduleExports ? context.Buffer : undefined$1,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
        symIterator = Symbol ? Symbol.iterator : undefined$1,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;

      var defineProperty = (function() {
        try {
          var func = getNative(Object, 'defineProperty');
          func({}, '', {});
          return func;
        } catch (e) {}
      })();

      /** Mocked built-ins. */
      var ctxClearTimeout =
          context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout =
          context.setTimeout !== root.setTimeout && context.setTimeout;

      /* Built-in method references for those with the same name as other `lodash` methods. */
      var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

      /* Built-in method references that are verified to be native. */
      var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

      /** Used to store function metadata. */
      var metaMap = WeakMap && new WeakMap();

      /** Used to lookup unminified function names. */
      var realNames = {};

      /** Used to detect maps, sets, and weakmaps. */
      var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

      /** Used to convert symbols to primitives and strings. */
      var symbolProto = Symbol ? Symbol.prototype : undefined$1,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
        symbolToString = symbolProto ? symbolProto.toString : undefined$1;

      /*------------------------------------------------------------------------*/

      /**
       * Creates a `lodash` object which wraps `value` to enable implicit method
       * chain sequences. Methods that operate on and return arrays, collections,
       * and functions can be chained together. Methods that retrieve a single value
       * or may return a primitive value will automatically end the chain sequence
       * and return the unwrapped value. Otherwise, the value must be unwrapped
       * with `_#value`.
       *
       * Explicit chain sequences, which must be unwrapped with `_#value`, may be
       * enabled using `_.chain`.
       *
       * The execution of chained methods is lazy, that is, it's deferred until
       * `_#value` is implicitly or explicitly called.
       *
       * Lazy evaluation allows several methods to support shortcut fusion.
       * Shortcut fusion is an optimization to merge iteratee calls; this avoids
       * the creation of intermediate arrays and can greatly reduce the number of
       * iteratee executions. Sections of a chain sequence qualify for shortcut
       * fusion if the section is applied to an array and iteratees accept only
       * one argument. The heuristic for whether a section qualifies for shortcut
       * fusion is subject to change.
       *
       * Chaining is supported in custom builds as long as the `_#value` method is
       * directly or indirectly included in the build.
       *
       * In addition to lodash methods, wrappers have `Array` and `String` methods.
       *
       * The wrapper `Array` methods are:
       * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
       *
       * The wrapper `String` methods are:
       * `replace` and `split`
       *
       * The wrapper methods that support shortcut fusion are:
       * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
       * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
       * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
       *
       * The chainable wrapper methods are:
       * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
       * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
       * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
       * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
       * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
       * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
       * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
       * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
       * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
       * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
       * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
       * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
       * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
       * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
       * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
       * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
       * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
       * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
       * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
       * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
       * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
       * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
       * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
       * `zipObject`, `zipObjectDeep`, and `zipWith`
       *
       * The wrapper methods that are **not** chainable by default are:
       * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
       * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
       * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
       * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
       * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
       * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
       * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
       * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
       * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
       * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
       * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
       * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
       * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
       * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
       * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
       * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
       * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
       * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
       * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
       * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
       * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
       * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
       * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
       * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
       * `upperFirst`, `value`, and `words`
       *
       * @name _
       * @constructor
       * @category Seq
       * @param {*} value The value to wrap in a `lodash` instance.
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * var wrapped = _([1, 2, 3]);
       *
       * // Returns an unwrapped value.
       * wrapped.reduce(_.add);
       * // => 6
       *
       * // Returns a wrapped value.
       * var squares = wrapped.map(square);
       *
       * _.isArray(squares);
       * // => false
       *
       * _.isArray(squares.value());
       * // => true
       */
      function lodash(value) {
        if (
          isObjectLike(value) &&
          !isArray(value) &&
          !(value instanceof LazyWrapper)
        ) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty.call(value, '__wrapped__')) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }

      /**
       * The base implementation of `_.create` without support for assigning
       * properties to the created object.
       *
       * @private
       * @param {Object} proto The object to inherit from.
       * @returns {Object} Returns the new object.
       */
      var baseCreate = (function() {
        function object() {}
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result = new object();
          object.prototype = undefined$1;
          return result;
        };
      })();

      /**
       * The function whose prototype chain sequence wrappers inherit from.
       *
       * @private
       */
      function baseLodash() {
        // No operation performed.
      }

      /**
       * The base constructor for creating `lodash` wrapper objects.
       *
       * @private
       * @param {*} value The value to wrap.
       * @param {boolean} [chainAll] Enable explicit method chain sequences.
       */
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined$1;
      }

      /**
       * By default, the template delimiters used by lodash are like those in
       * embedded Ruby (ERB) as well as ES2015 template strings. Change the
       * following template settings to use alternative delimiters.
       *
       * @static
       * @memberOf _
       * @type {Object}
       */
      lodash.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: reEscape,

        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: reEvaluate,

        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: reInterpolate,

        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: '',

        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: lodash,
        },
      };

      // Ensure wrappers are instances of `baseLodash`.
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;

      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;

      /*------------------------------------------------------------------------*/

      /**
       * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
       *
       * @private
       * @constructor
       * @param {*} value The value to wrap.
       */
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }

      /**
       * Creates a clone of the lazy wrapper object.
       *
       * @private
       * @name clone
       * @memberOf LazyWrapper
       * @returns {Object} Returns the cloned `LazyWrapper` object.
       */
      function lazyClone() {
        var result = new LazyWrapper(this.__wrapped__);
        result.__actions__ = copyArray(this.__actions__);
        result.__dir__ = this.__dir__;
        result.__filtered__ = this.__filtered__;
        result.__iteratees__ = copyArray(this.__iteratees__);
        result.__takeCount__ = this.__takeCount__;
        result.__views__ = copyArray(this.__views__);
        return result;
      }

      /**
       * Reverses the direction of lazy iteration.
       *
       * @private
       * @name reverse
       * @memberOf LazyWrapper
       * @returns {Object} Returns the new reversed `LazyWrapper` object.
       */
      function lazyReverse() {
        if (this.__filtered__) {
          var result = new LazyWrapper(this);
          result.__dir__ = -1;
          result.__filtered__ = true;
        } else {
          result = this.clone();
          result.__dir__ *= -1;
        }
        return result;
      }

      /**
       * Extracts the unwrapped value from its lazy wrapper.
       *
       * @private
       * @name value
       * @memberOf LazyWrapper
       * @returns {*} Returns the unwrapped value.
       */
      function lazyValue() {
        var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : start - 1,
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

        if (
          !isArr ||
          (!isRight && arrLength == length && takeCount == length)
        ) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result = [];

        outer: while (length-- && resIndex < takeCount) {
          index += dir;

          var iterIndex = -1,
            value = array[index];

          while (++iterIndex < iterLength) {
            var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

            if (type == LAZY_MAP_FLAG) {
              value = computed;
            } else if (!computed) {
              if (type == LAZY_FILTER_FLAG) {
                continue outer;
              } else {
                break outer;
              }
            }
          }
          result[resIndex++] = value;
        }
        return result;
      }

      // Ensure `LazyWrapper` is an instance of `baseLodash`.
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;

      /*------------------------------------------------------------------------*/

      /**
       * Creates a hash object.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */
      function Hash(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      /**
       * Removes all key-value entries from the hash.
       *
       * @private
       * @name clear
       * @memberOf Hash
       */
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }

      /**
       * Removes `key` and its value from the hash.
       *
       * @private
       * @name delete
       * @memberOf Hash
       * @param {Object} hash The hash to modify.
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }

      /**
       * Gets the hash value for `key`.
       *
       * @private
       * @name get
       * @memberOf Hash
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? undefined$1 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
      }

      /**
       * Checks if a hash value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf Hash
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate
          ? data[key] !== undefined$1
          : hasOwnProperty.call(data, key);
      }

      /**
       * Sets the hash `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf Hash
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the hash instance.
       */
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] =
          nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
        return this;
      }

      // Add methods to `Hash`.
      Hash.prototype.clear = hashClear;
      Hash.prototype['delete'] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;

      /*------------------------------------------------------------------------*/

      /**
       * Creates an list cache object.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */
      function ListCache(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      /**
       * Removes all key-value entries from the list cache.
       *
       * @private
       * @name clear
       * @memberOf ListCache
       */
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }

      /**
       * Removes `key` and its value from the list cache.
       *
       * @private
       * @name delete
       * @memberOf ListCache
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */
      function listCacheDelete(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);

        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }

      /**
       * Gets the list cache value for `key`.
       *
       * @private
       * @name get
       * @memberOf ListCache
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */
      function listCacheGet(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);

        return index < 0 ? undefined$1 : data[index][1];
      }

      /**
       * Checks if a list cache value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf ListCache
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }

      /**
       * Sets the list cache `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf ListCache
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the list cache instance.
       */
      function listCacheSet(key, value) {
        var data = this.__data__,
          index = assocIndexOf(data, key);

        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }

      // Add methods to `ListCache`.
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype['delete'] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;

      /*------------------------------------------------------------------------*/

      /**
       * Creates a map cache object to store key-value pairs.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */
      function MapCache(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      /**
       * Removes all key-value entries from the map.
       *
       * @private
       * @name clear
       * @memberOf MapCache
       */
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          hash: new Hash(),
          map: new (Map || ListCache)(),
          string: new Hash(),
        };
      }

      /**
       * Removes `key` and its value from the map.
       *
       * @private
       * @name delete
       * @memberOf MapCache
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */
      function mapCacheDelete(key) {
        var result = getMapData(this, key)['delete'](key);
        this.size -= result ? 1 : 0;
        return result;
      }

      /**
       * Gets the map value for `key`.
       *
       * @private
       * @name get
       * @memberOf MapCache
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }

      /**
       * Checks if a map value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf MapCache
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }

      /**
       * Sets the map `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf MapCache
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the map cache instance.
       */
      function mapCacheSet(key, value) {
        var data = getMapData(this, key),
          size = data.size;

        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }

      // Add methods to `MapCache`.
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype['delete'] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;

      /*------------------------------------------------------------------------*/

      /**
       *
       * Creates an array cache object to store unique values.
       *
       * @private
       * @constructor
       * @param {Array} [values] The values to cache.
       */
      function SetCache(values) {
        var index = -1,
          length = values == null ? 0 : values.length;

        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values[index]);
        }
      }

      /**
       * Adds `value` to the array cache.
       *
       * @private
       * @name add
       * @memberOf SetCache
       * @alias push
       * @param {*} value The value to cache.
       * @returns {Object} Returns the cache instance.
       */
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }

      /**
       * Checks if `value` is in the array cache.
       *
       * @private
       * @name has
       * @memberOf SetCache
       * @param {*} value The value to search for.
       * @returns {number} Returns `true` if `value` is found, else `false`.
       */
      function setCacheHas(value) {
        return this.__data__.has(value);
      }

      // Add methods to `SetCache`.
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;

      /*------------------------------------------------------------------------*/

      /**
       * Creates a stack cache object to store key-value pairs.
       *
       * @private
       * @constructor
       * @param {Array} [entries] The key-value pairs to cache.
       */
      function Stack(entries) {
        var data = (this.__data__ = new ListCache(entries));
        this.size = data.size;
      }

      /**
       * Removes all key-value entries from the stack.
       *
       * @private
       * @name clear
       * @memberOf Stack
       */
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }

      /**
       * Removes `key` and its value from the stack.
       *
       * @private
       * @name delete
       * @memberOf Stack
       * @param {string} key The key of the value to remove.
       * @returns {boolean} Returns `true` if the entry was removed, else `false`.
       */
      function stackDelete(key) {
        var data = this.__data__,
          result = data['delete'](key);

        this.size = data.size;
        return result;
      }

      /**
       * Gets the stack value for `key`.
       *
       * @private
       * @name get
       * @memberOf Stack
       * @param {string} key The key of the value to get.
       * @returns {*} Returns the entry value.
       */
      function stackGet(key) {
        return this.__data__.get(key);
      }

      /**
       * Checks if a stack value for `key` exists.
       *
       * @private
       * @name has
       * @memberOf Stack
       * @param {string} key The key of the entry to check.
       * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
       */
      function stackHas(key) {
        return this.__data__.has(key);
      }

      /**
       * Sets the stack `key` to `value`.
       *
       * @private
       * @name set
       * @memberOf Stack
       * @param {string} key The key of the value to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns the stack cache instance.
       */
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }

      // Add methods to `Stack`.
      Stack.prototype.clear = stackClear;
      Stack.prototype['delete'] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;

      /*------------------------------------------------------------------------*/

      /**
       * Creates an array of the enumerable property names of the array-like `value`.
       *
       * @private
       * @param {*} value The value to query.
       * @param {boolean} inherited Specify returning inherited property names.
       * @returns {Array} Returns the array of property names.
       */
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

        for (var key in value) {
          if (
            (inherited || hasOwnProperty.call(value, key)) &&
            !(
              skipIndexes &&
              // Safari 9 has enumerable `arguments.length` in strict mode.
              (key == 'length' ||
                // Node.js 0.10 has enumerable non-index properties on buffers.
                (isBuff && (key == 'offset' || key == 'parent')) ||
                // PhantomJS 2 has enumerable non-index properties on typed arrays.
                (isType &&
                  (key == 'buffer' ||
                    key == 'byteLength' ||
                    key == 'byteOffset')) ||
                // Skip index properties.
                isIndex(key, length))
            )
          ) {
            result.push(key);
          }
        }
        return result;
      }

      /**
       * A specialized version of `_.sample` for arrays.
       *
       * @private
       * @param {Array} array The array to sample.
       * @returns {*} Returns the random element.
       */
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined$1;
      }

      /**
       * A specialized version of `_.sampleSize` for arrays.
       *
       * @private
       * @param {Array} array The array to sample.
       * @param {number} n The number of elements to sample.
       * @returns {Array} Returns the random elements.
       */
      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }

      /**
       * A specialized version of `_.shuffle` for arrays.
       *
       * @private
       * @param {Array} array The array to shuffle.
       * @returns {Array} Returns the new shuffled array.
       */
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }

      /**
       * This function is like `assignValue` except that it doesn't assign
       * `undefined` values.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {string} key The key of the property to assign.
       * @param {*} value The value to assign.
       */
      function assignMergeValue(object, key, value) {
        if (
          (value !== undefined$1 && !eq(object[key], value)) ||
          (value === undefined$1 && !(key in object))
        ) {
          baseAssignValue(object, key, value);
        }
      }

      /**
       * Assigns `value` to `key` of `object` if the existing value is not equivalent
       * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {string} key The key of the property to assign.
       * @param {*} value The value to assign.
       */
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (
          !(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined$1 && !(key in object))
        ) {
          baseAssignValue(object, key, value);
        }
      }

      /**
       * Gets the index at which the `key` is found in `array` of key-value pairs.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {*} key The key to search for.
       * @returns {number} Returns the index of the matched value, else `-1`.
       */
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }

      /**
       * Aggregates elements of `collection` on `accumulator` with keys transformed
       * by `iteratee` and values set by `setter`.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} setter The function to set `accumulator` values.
       * @param {Function} iteratee The iteratee to transform keys.
       * @param {Object} accumulator The initial aggregated object.
       * @returns {Function} Returns `accumulator`.
       */
      function baseAggregator(collection, setter, iteratee, accumulator) {
        baseEach(collection, function(value, key, collection) {
          setter(accumulator, value, iteratee(value), collection);
        });
        return accumulator;
      }

      /**
       * The base implementation of `_.assign` without support for multiple sources
       * or `customizer` functions.
       *
       * @private
       * @param {Object} object The destination object.
       * @param {Object} source The source object.
       * @returns {Object} Returns `object`.
       */
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }

      /**
       * The base implementation of `_.assignIn` without support for multiple sources
       * or `customizer` functions.
       *
       * @private
       * @param {Object} object The destination object.
       * @param {Object} source The source object.
       * @returns {Object} Returns `object`.
       */
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }

      /**
       * The base implementation of `assignValue` and `assignMergeValue` without
       * value checks.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {string} key The key of the property to assign.
       * @param {*} value The value to assign.
       */
      function baseAssignValue(object, key, value) {
        if (key == '__proto__' && defineProperty) {
          defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value: value,
            writable: true,
          });
        } else {
          object[key] = value;
        }
      }

      /**
       * The base implementation of `_.at` without support for individual paths.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {string[]} paths The property paths to pick.
       * @returns {Array} Returns the picked elements.
       */
      function baseAt(object, paths) {
        var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

        while (++index < length) {
          result[index] = skip ? undefined$1 : get(object, paths[index]);
        }
        return result;
      }

      /**
       * The base implementation of `_.clamp` which doesn't coerce arguments.
       *
       * @private
       * @param {number} number The number to clamp.
       * @param {number} [lower] The lower bound.
       * @param {number} upper The upper bound.
       * @returns {number} Returns the clamped number.
       */
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined$1) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined$1) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }

      /**
       * The base implementation of `_.clone` and `_.cloneDeep` which tracks
       * traversed objects.
       *
       * @private
       * @param {*} value The value to clone.
       * @param {boolean} bitmask The bitmask flags.
       *  1 - Deep clone
       *  2 - Flatten inherited properties
       *  4 - Clone symbols
       * @param {Function} [customizer] The function to customize cloning.
       * @param {string} [key] The key of `value`.
       * @param {Object} [object] The parent object of `value`.
       * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
       * @returns {*} Returns the cloned value.
       */
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

        if (customizer) {
          result = object
            ? customizer(value, key, object, stack)
            : customizer(value);
        }
        if (result !== undefined$1) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            result = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat
                ? copySymbolsIn(value, baseAssignIn(result, value))
                : copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag, isDeep);
          }
        }
        // Check for circular references and return its corresponding clone.
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);

        if (isSet(value)) {
          value.forEach(function(subValue) {
            result.add(
              baseClone(subValue, bitmask, customizer, subValue, value, stack)
            );
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key) {
            result.set(
              key,
              baseClone(subValue, bitmask, customizer, key, value, stack)
            );
          });
        }

        var keysFunc = isFull
          ? isFlat
            ? getAllKeysIn
            : getAllKeys
          : isFlat
          ? keysIn
          : keys;

        var props = isArr ? undefined$1 : keysFunc(value);
        arrayEach(props || value, function(subValue, key) {
          if (props) {
            key = subValue;
            subValue = value[key];
          }
          // Recursively populate clone (susceptible to call stack limits).
          assignValue(
            result,
            key,
            baseClone(subValue, bitmask, customizer, key, value, stack)
          );
        });
        return result;
      }

      /**
       * The base implementation of `_.conforms` which doesn't clone `source`.
       *
       * @private
       * @param {Object} source The object of property predicates to conform to.
       * @returns {Function} Returns the new spec function.
       */
      function baseConforms(source) {
        var props = keys(source);
        return function(object) {
          return baseConformsTo(object, source, props);
        };
      }

      /**
       * The base implementation of `_.conformsTo` which accepts `props` to check.
       *
       * @private
       * @param {Object} object The object to inspect.
       * @param {Object} source The object of property predicates to conform to.
       * @returns {boolean} Returns `true` if `object` conforms, else `false`.
       */
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (length--) {
          var key = props[length],
            predicate = source[key],
            value = object[key];

          if (
            (value === undefined$1 && !(key in object)) ||
            !predicate(value)
          ) {
            return false;
          }
        }
        return true;
      }

      /**
       * The base implementation of `_.delay` and `_.defer` which accepts `args`
       * to provide to `func`.
       *
       * @private
       * @param {Function} func The function to delay.
       * @param {number} wait The number of milliseconds to delay invocation.
       * @param {Array} args The arguments to provide to `func`.
       * @returns {number|Object} Returns the timer id or timeout object.
       */
      function baseDelay(func, wait, args) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return setTimeout(function() {
          func.apply(undefined$1, args);
        }, wait);
      }

      /**
       * The base implementation of methods like `_.difference` without support
       * for excluding multiple arrays or iteratee shorthands.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {Array} values The values to exclude.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of filtered values.
       */
      function baseDifference(array, values, iteratee, comparator) {
        var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

        if (!length) {
          return result;
        }
        if (iteratee) {
          values = arrayMap(values, baseUnary(iteratee));
        }
        if (comparator) {
          includes = arrayIncludesWith;
          isCommon = false;
        } else if (values.length >= LARGE_ARRAY_SIZE) {
          includes = cacheHas;
          isCommon = false;
          values = new SetCache(values);
        }
        outer: while (++index < length) {
          var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.forEach` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Array|Object} Returns `collection`.
       */
      var baseEach = createBaseEach(baseForOwn);

      /**
       * The base implementation of `_.forEachRight` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Array|Object} Returns `collection`.
       */
      var baseEachRight = createBaseEach(baseForOwnRight, true);

      /**
       * The base implementation of `_.every` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} predicate The function invoked per iteration.
       * @returns {boolean} Returns `true` if all elements pass the predicate check,
       *  else `false`
       */
      function baseEvery(collection, predicate) {
        var result = true;
        baseEach(collection, function(value, index, collection) {
          result = !!predicate(value, index, collection);
          return result;
        });
        return result;
      }

      /**
       * The base implementation of methods like `_.max` and `_.min` which accepts a
       * `comparator` to determine the extremum value.
       *
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} iteratee The iteratee invoked per iteration.
       * @param {Function} comparator The comparator used to compare values.
       * @returns {*} Returns the extremum value.
       */
      function baseExtremum(array, iteratee, comparator) {
        var index = -1,
          length = array.length;

        while (++index < length) {
          var value = array[index],
            current = iteratee(value);

          if (
            current != null &&
            (computed === undefined$1
              ? current === current && !isSymbol(current)
              : comparator(current, computed))
          ) {
            var computed = current,
              result = value;
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.fill` without an iteratee call guard.
       *
       * @private
       * @param {Array} array The array to fill.
       * @param {*} value The value to fill `array` with.
       * @param {number} [start=0] The start position.
       * @param {number} [end=array.length] The end position.
       * @returns {Array} Returns `array`.
       */
      function baseFill(array, value, start, end) {
        var length = array.length;

        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === undefined$1 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array[start++] = value;
        }
        return array;
      }

      /**
       * The base implementation of `_.filter` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} predicate The function invoked per iteration.
       * @returns {Array} Returns the new filtered array.
       */
      function baseFilter(collection, predicate) {
        var result = [];
        baseEach(collection, function(value, index, collection) {
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        });
        return result;
      }

      /**
       * The base implementation of `_.flatten` with support for restricting flattening.
       *
       * @private
       * @param {Array} array The array to flatten.
       * @param {number} depth The maximum recursion depth.
       * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
       * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
       * @param {Array} [result=[]] The initial result value.
       * @returns {Array} Returns the new flattened array.
       */
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1,
          length = array.length;

        predicate || (predicate = isFlattenable);
        result || (result = []);

        while (++index < length) {
          var value = array[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              // Recursively flatten arrays (susceptible to call stack limits).
              baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
              arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }
        return result;
      }

      /**
       * The base implementation of `baseForOwn` which iterates over `object`
       * properties returned by `keysFunc` and invokes `iteratee` for each property.
       * Iteratee functions may exit iteration early by explicitly returning `false`.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @param {Function} keysFunc The function to get the keys of `object`.
       * @returns {Object} Returns `object`.
       */
      var baseFor = createBaseFor();

      /**
       * This function is like `baseFor` except that it iterates over properties
       * in the opposite order.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @param {Function} keysFunc The function to get the keys of `object`.
       * @returns {Object} Returns `object`.
       */
      var baseForRight = createBaseFor(true);

      /**
       * The base implementation of `_.forOwn` without support for iteratee shorthands.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Object} Returns `object`.
       */
      function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
      }

      /**
       * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Object} Returns `object`.
       */
      function baseForOwnRight(object, iteratee) {
        return object && baseForRight(object, iteratee, keys);
      }

      /**
       * The base implementation of `_.functions` which creates an array of
       * `object` function property names filtered from `props`.
       *
       * @private
       * @param {Object} object The object to inspect.
       * @param {Array} props The property names to filter.
       * @returns {Array} Returns the function names.
       */
      function baseFunctions(object, props) {
        return arrayFilter(props, function(key) {
          return isFunction(object[key]);
        });
      }

      /**
       * The base implementation of `_.get` without support for default values.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to get.
       * @returns {*} Returns the resolved value.
       */
      function baseGet(object, path) {
        path = castPath(path, object);

        var index = 0,
          length = path.length;

        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : undefined$1;
      }

      /**
       * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
       * `keysFunc` and `symbolsFunc` to get the enumerable property names and
       * symbols of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Function} keysFunc The function to get the keys of `object`.
       * @param {Function} symbolsFunc The function to get the symbols of `object`.
       * @returns {Array} Returns the array of property names and symbols.
       */
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object)
          ? result
          : arrayPush(result, symbolsFunc(object));
      }

      /**
       * The base implementation of `getTag` without fallbacks for buggy environments.
       *
       * @private
       * @param {*} value The value to query.
       * @returns {string} Returns the `toStringTag`.
       */
      function baseGetTag(value) {
        if (value == null) {
          return value === undefined$1 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value)
          ? getRawTag(value)
          : objectToString(value);
      }

      /**
       * The base implementation of `_.gt` which doesn't coerce arguments.
       *
       * @private
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is greater than `other`,
       *  else `false`.
       */
      function baseGt(value, other) {
        return value > other;
      }

      /**
       * The base implementation of `_.has` without support for deep paths.
       *
       * @private
       * @param {Object} [object] The object to query.
       * @param {Array|string} key The key to check.
       * @returns {boolean} Returns `true` if `key` exists, else `false`.
       */
      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }

      /**
       * The base implementation of `_.hasIn` without support for deep paths.
       *
       * @private
       * @param {Object} [object] The object to query.
       * @param {Array|string} key The key to check.
       * @returns {boolean} Returns `true` if `key` exists, else `false`.
       */
      function baseHasIn(object, key) {
        return object != null && key in Object(object);
      }

      /**
       * The base implementation of `_.inRange` which doesn't coerce arguments.
       *
       * @private
       * @param {number} number The number to check.
       * @param {number} start The start of the range.
       * @param {number} end The end of the range.
       * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
       */
      function baseInRange(number, start, end) {
        return (
          number >= nativeMin(start, end) && number < nativeMax(start, end)
        );
      }

      /**
       * The base implementation of methods like `_.intersection`, without support
       * for iteratee shorthands, that accepts an array of arrays to inspect.
       *
       * @private
       * @param {Array} arrays The arrays to inspect.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of shared values.
       */
      function baseIntersection(arrays, iteratee, comparator) {
        var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee) {
            array = arrayMap(array, baseUnary(iteratee));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] =
            !comparator && (iteratee || (length >= 120 && array.length >= 120))
              ? new SetCache(othIndex && array)
              : undefined$1;
        }
        array = arrays[0];

        var index = -1,
          seen = caches[0];

        outer: while (++index < length && result.length < maxLength) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;

          value = comparator || value !== 0 ? value : 0;
          if (
            !(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator))
          ) {
            othIndex = othLength;
            while (--othIndex) {
              var cache = caches[othIndex];
              if (
                !(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
              ) {
                continue outer;
              }
            }
            if (seen) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.invert` and `_.invertBy` which inverts
       * `object` with values transformed by `iteratee` and set by `setter`.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} setter The function to set `accumulator` values.
       * @param {Function} iteratee The iteratee to transform values.
       * @param {Object} accumulator The initial inverted object.
       * @returns {Function} Returns `accumulator`.
       */
      function baseInverter(object, setter, iteratee, accumulator) {
        baseForOwn(object, function(value, key, object) {
          setter(accumulator, iteratee(value), key, object);
        });
        return accumulator;
      }

      /**
       * The base implementation of `_.invoke` without support for individual
       * method arguments.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the method to invoke.
       * @param {Array} args The arguments to invoke the method with.
       * @returns {*} Returns the result of the invoked method.
       */
      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined$1 : apply(func, object, args);
      }

      /**
       * The base implementation of `_.isArguments`.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an `arguments` object,
       */
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }

      /**
       * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
       */
      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }

      /**
       * The base implementation of `_.isDate` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
       */
      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }

      /**
       * The base implementation of `_.isEqual` which supports partial comparisons
       * and tracks traversed objects.
       *
       * @private
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @param {boolean} bitmask The bitmask flags.
       *  1 - Unordered comparison
       *  2 - Partial comparison
       * @param {Function} [customizer] The function to customize comparisons.
       * @param {Object} [stack] Tracks traversed `value` and `other` objects.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       */
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (
          value == null ||
          other == null ||
          (!isObjectLike(value) && !isObjectLike(other))
        ) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(
          value,
          other,
          bitmask,
          customizer,
          baseIsEqual,
          stack
        );
      }

      /**
       * A specialized version of `baseIsEqual` for arrays and objects which performs
       * deep comparisons and tracks traversed objects enabling objects with circular
       * references to be compared.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
       * @param {Function} customizer The function to customize comparisons.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Object} [stack] Tracks traversed `object` and `other` objects.
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function baseIsEqualDeep(
        object,
        other,
        bitmask,
        customizer,
        equalFunc,
        stack
      ) {
        var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;

        var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object)
            ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
            : equalByTag(
                object,
                other,
                objTag,
                bitmask,
                customizer,
                equalFunc,
                stack
              );
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped =
              objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped =
              othIsObj && hasOwnProperty.call(other, '__wrapped__');

          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

            stack || (stack = new Stack());
            return equalFunc(
              objUnwrapped,
              othUnwrapped,
              bitmask,
              customizer,
              stack
            );
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(
          object,
          other,
          bitmask,
          customizer,
          equalFunc,
          stack
        );
      }

      /**
       * The base implementation of `_.isMap` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a map, else `false`.
       */
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag;
      }

      /**
       * The base implementation of `_.isMatch` without support for iteratee shorthands.
       *
       * @private
       * @param {Object} object The object to inspect.
       * @param {Object} source The object of property values to match.
       * @param {Array} matchData The property names, values, and compare flags to match.
       * @param {Function} [customizer] The function to customize comparisons.
       * @returns {boolean} Returns `true` if `object` is a match, else `false`.
       */
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (index--) {
          var data = matchData[index];
          if (
            noCustomizer && data[2]
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
          ) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0],
            objValue = object[key],
            srcValue = data[1];

          if (noCustomizer && data[2]) {
            if (objValue === undefined$1 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result = customizer(
                objValue,
                srcValue,
                key,
                object,
                source,
                stack
              );
            }
            if (
              !(result === undefined$1
                ? baseIsEqual(
                    srcValue,
                    objValue,
                    COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG,
                    customizer,
                    stack
                  )
                : result)
            ) {
              return false;
            }
          }
        }
        return true;
      }

      /**
       * The base implementation of `_.isNative` without bad shim checks.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a native function,
       *  else `false`.
       */
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }

      /**
       * The base implementation of `_.isRegExp` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
       */
      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }

      /**
       * The base implementation of `_.isSet` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a set, else `false`.
       */
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag;
      }

      /**
       * The base implementation of `_.isTypedArray` without Node.js optimizations.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
       */
      function baseIsTypedArray(value) {
        return (
          isObjectLike(value) &&
          isLength(value.length) &&
          !!typedArrayTags[baseGetTag(value)]
        );
      }

      /**
       * The base implementation of `_.iteratee`.
       *
       * @private
       * @param {*} [value=_.identity] The value to convert to an iteratee.
       * @returns {Function} Returns the iteratee.
       */
      function baseIteratee(value) {
        // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
        // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
        if (typeof value == 'function') {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == 'object') {
          return isArray(value)
            ? baseMatchesProperty(value[0], value[1])
            : baseMatches(value);
        }
        return property(value);
      }

      /**
       * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       */
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       */
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object),
          result = [];

        for (var key in object) {
          if (
            !(
              key == 'constructor' &&
              (isProto || !hasOwnProperty.call(object, key))
            )
          ) {
            result.push(key);
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.lt` which doesn't coerce arguments.
       *
       * @private
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is less than `other`,
       *  else `false`.
       */
      function baseLt(value, other) {
        return value < other;
      }

      /**
       * The base implementation of `_.map` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Array} Returns the new mapped array.
       */
      function baseMap(collection, iteratee) {
        var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

        baseEach(collection, function(value, key, collection) {
          result[++index] = iteratee(value, key, collection);
        });
        return result;
      }

      /**
       * The base implementation of `_.matches` which doesn't clone `source`.
       *
       * @private
       * @param {Object} source The object of property values to match.
       * @returns {Function} Returns the new spec function.
       */
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }

      /**
       * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
       *
       * @private
       * @param {string} path The path of the property to get.
       * @param {*} srcValue The value to match.
       * @returns {Function} Returns the new spec function.
       */
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === undefined$1 && objValue === srcValue
            ? hasIn(object, path)
            : baseIsEqual(
                srcValue,
                objValue,
                COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG
              );
        };
      }

      /**
       * The base implementation of `_.merge` without support for multiple sources.
       *
       * @private
       * @param {Object} object The destination object.
       * @param {Object} source The source object.
       * @param {number} srcIndex The index of `source`.
       * @param {Function} [customizer] The function to customize merged values.
       * @param {Object} [stack] Tracks traversed source values and their merged
       *  counterparts.
       */
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(
          source,
          function(srcValue, key) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(
                object,
                source,
                key,
                srcIndex,
                baseMerge,
                customizer,
                stack
              );
            } else {
              var newValue = customizer
                ? customizer(
                    safeGet(object, key),
                    srcValue,
                    key + '',
                    object,
                    source,
                    stack
                  )
                : undefined$1;

              if (newValue === undefined$1) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          },
          keysIn
        );
      }

      /**
       * A specialized version of `baseMerge` for arrays and objects which performs
       * deep merges and tracks traversed objects enabling objects with circular
       * references to be merged.
       *
       * @private
       * @param {Object} object The destination object.
       * @param {Object} source The source object.
       * @param {string} key The key of the value to merge.
       * @param {number} srcIndex The index of `source`.
       * @param {Function} mergeFunc The function to merge values.
       * @param {Function} [customizer] The function to customize assigned values.
       * @param {Object} [stack] Tracks traversed source values and their merged
       *  counterparts.
       */
      function baseMergeDeep(
        object,
        source,
        key,
        srcIndex,
        mergeFunc,
        customizer,
        stack
      ) {
        var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer
          ? customizer(objValue, srcValue, key + '', object, source, stack)
          : undefined$1;

        var isCommon = newValue === undefined$1;

        if (isCommon) {
          var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          // Recursively merge objects and arrays (susceptible to call stack limits).
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack['delete'](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }

      /**
       * The base implementation of `_.nth` which doesn't coerce arguments.
       *
       * @private
       * @param {Array} array The array to query.
       * @param {number} n The index of the element to return.
       * @returns {*} Returns the nth element of `array`.
       */
      function baseNth(array, n) {
        var length = array.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined$1;
      }

      /**
       * The base implementation of `_.orderBy` without param guards.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
       * @param {string[]} orders The sort orders of `iteratees`.
       * @returns {Array} Returns the new sorted array.
       */
      function baseOrderBy(collection, iteratees, orders) {
        var index = -1;
        iteratees = arrayMap(
          iteratees.length ? iteratees : [identity],
          baseUnary(getIteratee())
        );

        var result = baseMap(collection, function(value, key, collection) {
          var criteria = arrayMap(iteratees, function(iteratee) {
            return iteratee(value);
          });
          return { criteria: criteria, index: ++index, value: value };
        });

        return baseSortBy(result, function(object, other) {
          return compareMultiple(object, other, orders);
        });
      }

      /**
       * The base implementation of `_.pick` without support for individual
       * property identifiers.
       *
       * @private
       * @param {Object} object The source object.
       * @param {string[]} paths The property paths to pick.
       * @returns {Object} Returns the new object.
       */
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path) {
          return hasIn(object, path);
        });
      }

      /**
       * The base implementation of  `_.pickBy` without support for iteratee shorthands.
       *
       * @private
       * @param {Object} object The source object.
       * @param {string[]} paths The property paths to pick.
       * @param {Function} predicate The function invoked per property.
       * @returns {Object} Returns the new object.
       */
      function basePickBy(object, paths, predicate) {
        var index = -1,
          length = paths.length,
          result = {};

        while (++index < length) {
          var path = paths[index],
            value = baseGet(object, path);

          if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
          }
        }
        return result;
      }

      /**
       * A specialized version of `baseProperty` which supports deep paths.
       *
       * @private
       * @param {Array|string} path The path of the property to get.
       * @returns {Function} Returns the new accessor function.
       */
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }

      /**
       * The base implementation of `_.pullAllBy` without support for iteratee
       * shorthands.
       *
       * @private
       * @param {Array} array The array to modify.
       * @param {Array} values The values to remove.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns `array`.
       */
      function basePullAll(array, values, iteratee, comparator) {
        var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

        if (array === values) {
          values = copyArray(values);
        }
        if (iteratee) {
          seen = arrayMap(array, baseUnary(iteratee));
        }
        while (++index < length) {
          var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

          while (
            (fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1
          ) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }

      /**
       * The base implementation of `_.pullAt` without support for individual
       * indexes or capturing the removed elements.
       *
       * @private
       * @param {Array} array The array to modify.
       * @param {number[]} indexes The indexes of elements to remove.
       * @returns {Array} Returns `array`.
       */
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0,
          lastIndex = length - 1;

        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (isIndex(index)) {
              splice.call(array, index, 1);
            } else {
              baseUnset(array, index);
            }
          }
        }
        return array;
      }

      /**
       * The base implementation of `_.random` without support for returning
       * floating-point numbers.
       *
       * @private
       * @param {number} lower The lower bound.
       * @param {number} upper The upper bound.
       * @returns {number} Returns the random number.
       */
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }

      /**
       * The base implementation of `_.range` and `_.rangeRight` which doesn't
       * coerce arguments.
       *
       * @private
       * @param {number} start The start of the range.
       * @param {number} end The end of the range.
       * @param {number} step The value to increment or decrement by.
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Array} Returns the range of numbers.
       */
      function baseRange(start, end, step, fromRight) {
        var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

        while (length--) {
          result[fromRight ? length : ++index] = start;
          start += step;
        }
        return result;
      }

      /**
       * The base implementation of `_.repeat` which doesn't coerce arguments.
       *
       * @private
       * @param {string} string The string to repeat.
       * @param {number} n The number of times to repeat the string.
       * @returns {string} Returns the repeated string.
       */
      function baseRepeat(string, n) {
        var result = '';
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result;
        }
        // Leverage the exponentiation by squaring algorithm for a faster repeat.
        // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
        do {
          if (n % 2) {
            result += string;
          }
          n = nativeFloor(n / 2);
          if (n) {
            string += string;
          }
        } while (n);

        return result;
      }

      /**
       * The base implementation of `_.rest` which doesn't validate or coerce arguments.
       *
       * @private
       * @param {Function} func The function to apply a rest parameter to.
       * @param {number} [start=func.length-1] The start position of the rest parameter.
       * @returns {Function} Returns the new function.
       */
      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + '');
      }

      /**
       * The base implementation of `_.sample`.
       *
       * @private
       * @param {Array|Object} collection The collection to sample.
       * @returns {*} Returns the random element.
       */
      function baseSample(collection) {
        return arraySample(values(collection));
      }

      /**
       * The base implementation of `_.sampleSize` without param guards.
       *
       * @private
       * @param {Array|Object} collection The collection to sample.
       * @param {number} n The number of elements to sample.
       * @returns {Array} Returns the random elements.
       */
      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }

      /**
       * The base implementation of `_.set`.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to set.
       * @param {*} value The value to set.
       * @param {Function} [customizer] The function to customize path creation.
       * @returns {Object} Returns `object`.
       */
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);

        var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

        while (nested != null && ++index < length) {
          var key = toKey(path[index]),
            newValue = value;

          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer
              ? customizer(objValue, key, nested)
              : undefined$1;
            if (newValue === undefined$1) {
              newValue = isObject(objValue)
                ? objValue
                : isIndex(path[index + 1])
                ? []
                : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }

      /**
       * The base implementation of `setData` without support for hot loop shorting.
       *
       * @private
       * @param {Function} func The function to associate metadata with.
       * @param {*} data The metadata.
       * @returns {Function} Returns `func`.
       */
      var baseSetData = !metaMap
        ? identity
        : function(func, data) {
            metaMap.set(func, data);
            return func;
          };

      /**
       * The base implementation of `setToString` without support for hot loop shorting.
       *
       * @private
       * @param {Function} func The function to modify.
       * @param {Function} string The `toString` result.
       * @returns {Function} Returns `func`.
       */
      var baseSetToString = !defineProperty
        ? identity
        : function(func, string) {
            return defineProperty(func, 'toString', {
              configurable: true,
              enumerable: false,
              value: constant(string),
              writable: true,
            });
          };

      /**
       * The base implementation of `_.shuffle`.
       *
       * @private
       * @param {Array|Object} collection The collection to shuffle.
       * @returns {Array} Returns the new shuffled array.
       */
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }

      /**
       * The base implementation of `_.slice` without an iteratee call guard.
       *
       * @private
       * @param {Array} array The array to slice.
       * @param {number} [start=0] The start position.
       * @param {number} [end=array.length] The end position.
       * @returns {Array} Returns the slice of `array`.
       */
      function baseSlice(array, start, end) {
        var index = -1,
          length = array.length;

        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : (end - start) >>> 0;
        start >>>= 0;

        var result = Array(length);
        while (++index < length) {
          result[index] = array[index + start];
        }
        return result;
      }

      /**
       * The base implementation of `_.some` without support for iteratee shorthands.
       *
       * @private
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} predicate The function invoked per iteration.
       * @returns {boolean} Returns `true` if any element passes the predicate check,
       *  else `false`.
       */
      function baseSome(collection, predicate) {
        var result;

        baseEach(collection, function(value, index, collection) {
          result = predicate(value, index, collection);
          return !result;
        });
        return !!result;
      }

      /**
       * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
       * performs a binary search of `array` to determine the index at which `value`
       * should be inserted into `array` in order to maintain its sort order.
       *
       * @private
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @param {boolean} [retHighest] Specify returning the highest qualified index.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       */
      function baseSortedIndex(array, value, retHighest) {
        var low = 0,
          high = array == null ? low : array.length;

        if (
          typeof value == 'number' &&
          value === value &&
          high <= HALF_MAX_ARRAY_LENGTH
        ) {
          while (low < high) {
            var mid = (low + high) >>> 1,
              computed = array[mid];

            if (
              computed !== null &&
              !isSymbol(computed) &&
              (retHighest ? computed <= value : computed < value)
            ) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value, identity, retHighest);
      }

      /**
       * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
       * which invokes `iteratee` for `value` and each element of `array` to compute
       * their sort ranking. The iteratee is invoked with one argument; (value).
       *
       * @private
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @param {Function} iteratee The iteratee invoked per element.
       * @param {boolean} [retHighest] Specify returning the highest qualified index.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       */
      function baseSortedIndexBy(array, value, iteratee, retHighest) {
        value = iteratee(value);

        var low = 0,
          high = array == null ? 0 : array.length,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined$1;

        while (low < high) {
          var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined$1,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow =
              othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow =
              othIsReflexive &&
              othIsDefined &&
              !othIsNull &&
              (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }

      /**
       * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
       * support for iteratee shorthands.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @returns {Array} Returns the new duplicate free array.
       */
      function baseSortedUniq(array, iteratee) {
        var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

        while (++index < length) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;

          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.toNumber` which doesn't ensure correct
       * conversions of binary, hexadecimal, or octal string values.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {number} Returns the number.
       */
      function baseToNumber(value) {
        if (typeof value == 'number') {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        return +value;
      }

      /**
       * The base implementation of `_.toString` which doesn't convert nullish
       * values to empty strings.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {string} Returns the string.
       */
      function baseToString(value) {
        // Exit early for strings to avoid a performance hit in some environments.
        if (typeof value == 'string') {
          return value;
        }
        if (isArray(value)) {
          // Recursively convert values (susceptible to call stack limits).
          return arrayMap(value, baseToString) + '';
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : '';
        }
        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

      /**
       * The base implementation of `_.uniqBy` without support for iteratee shorthands.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new duplicate free array.
       */
      function baseUniq(array, iteratee, comparator) {
        var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

        if (comparator) {
          isCommon = false;
          includes = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set = iteratee ? null : createSet(array);
          if (set) {
            return setToArray(set);
          }
          isCommon = false;
          includes = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee ? [] : result;
        }
        outer: while (++index < length) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;

          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        return result;
      }

      /**
       * The base implementation of `_.unset`.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {Array|string} path The property path to unset.
       * @returns {boolean} Returns `true` if the property is deleted, else `false`.
       */
      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last(path))];
      }

      /**
       * The base implementation of `_.update`.
       *
       * @private
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to update.
       * @param {Function} updater The function to produce the updated value.
       * @param {Function} [customizer] The function to customize path creation.
       * @returns {Object} Returns `object`.
       */
      function baseUpdate(object, path, updater, customizer) {
        return baseSet(
          object,
          path,
          updater(baseGet(object, path)),
          customizer
        );
      }

      /**
       * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
       * without support for iteratee shorthands.
       *
       * @private
       * @param {Array} array The array to query.
       * @param {Function} predicate The function invoked per iteration.
       * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Array} Returns the slice of `array`.
       */
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length,
          index = fromRight ? length : -1;

        while (
          (fromRight ? index-- : ++index < length) &&
          predicate(array[index], index, array)
        ) {}

        return isDrop
          ? baseSlice(
              array,
              fromRight ? 0 : index,
              fromRight ? index + 1 : length
            )
          : baseSlice(
              array,
              fromRight ? index + 1 : 0,
              fromRight ? length : index
            );
      }

      /**
       * The base implementation of `wrapperValue` which returns the result of
       * performing a sequence of actions on the unwrapped `value`, where each
       * successive action is supplied the return value of the previous.
       *
       * @private
       * @param {*} value The unwrapped value.
       * @param {Array} actions Actions to perform to resolve the unwrapped value.
       * @returns {*} Returns the resolved value.
       */
      function baseWrapperValue(value, actions) {
        var result = value;
        if (result instanceof LazyWrapper) {
          result = result.value();
        }
        return arrayReduce(
          actions,
          function(result, action) {
            return action.func.apply(
              action.thisArg,
              arrayPush([result], action.args)
            );
          },
          result
        );
      }

      /**
       * The base implementation of methods like `_.xor`, without support for
       * iteratee shorthands, that accepts an array of arrays to inspect.
       *
       * @private
       * @param {Array} arrays The arrays to inspect.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of values.
       */
      function baseXor(arrays, iteratee, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index = -1,
          result = Array(length);

        while (++index < length) {
          var array = arrays[index],
            othIndex = -1;

          while (++othIndex < length) {
            if (othIndex != index) {
              result[index] = baseDifference(
                result[index] || array,
                arrays[othIndex],
                iteratee,
                comparator
              );
            }
          }
        }
        return baseUniq(baseFlatten(result, 1), iteratee, comparator);
      }

      /**
       * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
       *
       * @private
       * @param {Array} props The property identifiers.
       * @param {Array} values The property values.
       * @param {Function} assignFunc The function to assign values.
       * @returns {Object} Returns the new object.
       */
      function baseZipObject(props, values, assignFunc) {
        var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

        while (++index < length) {
          var value = index < valsLength ? values[index] : undefined$1;
          assignFunc(result, props[index], value);
        }
        return result;
      }

      /**
       * Casts `value` to an empty array if it's not an array like object.
       *
       * @private
       * @param {*} value The value to inspect.
       * @returns {Array|Object} Returns the cast array-like object.
       */
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }

      /**
       * Casts `value` to `identity` if it's not a function.
       *
       * @private
       * @param {*} value The value to inspect.
       * @returns {Function} Returns cast function.
       */
      function castFunction(value) {
        return typeof value == 'function' ? value : identity;
      }

      /**
       * Casts `value` to a path array if it's not one.
       *
       * @private
       * @param {*} value The value to inspect.
       * @param {Object} [object] The object to query keys on.
       * @returns {Array} Returns the cast property path array.
       */
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }

      /**
       * A `baseRest` alias which can be replaced with `identity` by module
       * replacement plugins.
       *
       * @private
       * @type {Function}
       * @param {Function} func The function to apply a rest parameter to.
       * @returns {Function} Returns the new function.
       */
      var castRest = baseRest;

      /**
       * Casts `array` to a slice if it's needed.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {number} start The start position.
       * @param {number} [end=array.length] The end position.
       * @returns {Array} Returns the cast slice.
       */
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined$1 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }

      /**
       * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
       *
       * @private
       * @param {number|Object} id The timer id or timeout object of the timer to clear.
       */
      var clearTimeout =
        ctxClearTimeout ||
        function(id) {
          return root.clearTimeout(id);
        };

      /**
       * Creates a clone of  `buffer`.
       *
       * @private
       * @param {Buffer} buffer The buffer to clone.
       * @param {boolean} [isDeep] Specify a deep clone.
       * @returns {Buffer} Returns the cloned buffer.
       */
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length,
          result = allocUnsafe
            ? allocUnsafe(length)
            : new buffer.constructor(length);

        buffer.copy(result);
        return result;
      }

      /**
       * Creates a clone of `arrayBuffer`.
       *
       * @private
       * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
       * @returns {ArrayBuffer} Returns the cloned array buffer.
       */
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array(result).set(new Uint8Array(arrayBuffer));
        return result;
      }

      /**
       * Creates a clone of `dataView`.
       *
       * @private
       * @param {Object} dataView The data view to clone.
       * @param {boolean} [isDeep] Specify a deep clone.
       * @returns {Object} Returns the cloned data view.
       */
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep
          ? cloneArrayBuffer(dataView.buffer)
          : dataView.buffer;
        return new dataView.constructor(
          buffer,
          dataView.byteOffset,
          dataView.byteLength
        );
      }

      /**
       * Creates a clone of `regexp`.
       *
       * @private
       * @param {Object} regexp The regexp to clone.
       * @returns {Object} Returns the cloned regexp.
       */
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(
          regexp.source,
          reFlags.exec(regexp)
        );
        result.lastIndex = regexp.lastIndex;
        return result;
      }

      /**
       * Creates a clone of the `symbol` object.
       *
       * @private
       * @param {Object} symbol The symbol object to clone.
       * @returns {Object} Returns the cloned symbol object.
       */
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }

      /**
       * Creates a clone of `typedArray`.
       *
       * @private
       * @param {Object} typedArray The typed array to clone.
       * @param {boolean} [isDeep] Specify a deep clone.
       * @returns {Object} Returns the cloned typed array.
       */
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep
          ? cloneArrayBuffer(typedArray.buffer)
          : typedArray.buffer;
        return new typedArray.constructor(
          buffer,
          typedArray.byteOffset,
          typedArray.length
        );
      }

      /**
       * Compares values to sort them in ascending order.
       *
       * @private
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {number} Returns the sort order indicator for `value`.
       */
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined$1,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

          var othIsDefined = other !== undefined$1,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

          if (
            (!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol &&
              othIsDefined &&
              othIsReflexive &&
              !othIsNull &&
              !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive
          ) {
            return 1;
          }
          if (
            (!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol &&
              valIsDefined &&
              valIsReflexive &&
              !valIsNull &&
              !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive
          ) {
            return -1;
          }
        }
        return 0;
      }

      /**
       * Used by `_.orderBy` to compare multiple properties of a value to another
       * and stable sort them.
       *
       * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
       * specify an order of "desc" for descending or "asc" for ascending sort order
       * of corresponding values.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {boolean[]|string[]} orders The order to sort by for each property.
       * @returns {number} Returns the sort order indicator for `object`.
       */
      function compareMultiple(object, other, orders) {
        var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

        while (++index < length) {
          var result = compareAscending(objCriteria[index], othCriteria[index]);
          if (result) {
            if (index >= ordersLength) {
              return result;
            }
            var order = orders[index];
            return result * (order == 'desc' ? -1 : 1);
          }
        }
        // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
        // that causes it, under certain circumstances, to provide the same value for
        // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
        // for more details.
        //
        // This also ensures a stable sort in V8 and other engines.
        // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
        return object.index - other.index;
      }

      /**
       * Creates an array that is the composition of partially applied arguments,
       * placeholders, and provided arguments into a single array of arguments.
       *
       * @private
       * @param {Array} args The provided arguments.
       * @param {Array} partials The arguments to prepend to those provided.
       * @param {Array} holders The `partials` placeholder indexes.
       * @params {boolean} [isCurried] Specify composing for a curried function.
       * @returns {Array} Returns the new array of composed arguments.
       */
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

        while (++leftIndex < leftLength) {
          result[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result[leftIndex++] = args[argsIndex++];
        }
        return result;
      }

      /**
       * This function is like `composeArgs` except that the arguments composition
       * is tailored for `_.partialRight`.
       *
       * @private
       * @param {Array} args The provided arguments.
       * @param {Array} partials The arguments to append to those provided.
       * @param {Array} holders The `partials` placeholder indexes.
       * @params {boolean} [isCurried] Specify composing for a curried function.
       * @returns {Array} Returns the new array of composed arguments.
       */
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

        while (++argsIndex < rangeLength) {
          result[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result;
      }

      /**
       * Copies the values of `source` to `array`.
       *
       * @private
       * @param {Array} source The array to copy values from.
       * @param {Array} [array=[]] The array to copy values to.
       * @returns {Array} Returns `array`.
       */
      function copyArray(source, array) {
        var index = -1,
          length = source.length;

        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }

      /**
       * Copies properties of `source` to `object`.
       *
       * @private
       * @param {Object} source The object to copy properties from.
       * @param {Array} props The property identifiers to copy.
       * @param {Object} [object={}] The object to copy properties to.
       * @param {Function} [customizer] The function to customize copied values.
       * @returns {Object} Returns `object`.
       */
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});

        var index = -1,
          length = props.length;

        while (++index < length) {
          var key = props[index];

          var newValue = customizer
            ? customizer(object[key], source[key], key, object, source)
            : undefined$1;

          if (newValue === undefined$1) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }

      /**
       * Copies own symbols of `source` to `object`.
       *
       * @private
       * @param {Object} source The object to copy symbols from.
       * @param {Object} [object={}] The object to copy symbols to.
       * @returns {Object} Returns `object`.
       */
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }

      /**
       * Copies own and inherited symbols of `source` to `object`.
       *
       * @private
       * @param {Object} source The object to copy symbols from.
       * @param {Object} [object={}] The object to copy symbols to.
       * @returns {Object} Returns `object`.
       */
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }

      /**
       * Creates a function like `_.groupBy`.
       *
       * @private
       * @param {Function} setter The function to set accumulator values.
       * @param {Function} [initializer] The accumulator object initializer.
       * @returns {Function} Returns the new aggregator function.
       */
      function createAggregator(setter, initializer) {
        return function(collection, iteratee) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

          return func(
            collection,
            setter,
            getIteratee(iteratee, 2),
            accumulator
          );
        };
      }

      /**
       * Creates a function like `_.assign`.
       *
       * @private
       * @param {Function} assigner The function to assign values.
       * @returns {Function} Returns the new assigner function.
       */
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined$1,
            guard = length > 2 ? sources[2] : undefined$1;

          customizer =
            assigner.length > 3 && typeof customizer == 'function'
              ? (length--, customizer)
              : undefined$1;

          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined$1 : customizer;
            length = 1;
          }
          object = Object(object);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object, source, index, customizer);
            }
          }
          return object;
        });
      }

      /**
       * Creates a `baseEach` or `baseEachRight` function.
       *
       * @private
       * @param {Function} eachFunc The function to iterate over a collection.
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Function} Returns the new base function.
       */
      function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee);
          }
          var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

          while (fromRight ? index-- : ++index < length) {
            if (iteratee(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }

      /**
       * Creates a base function for methods like `_.forIn` and `_.forOwn`.
       *
       * @private
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Function} Returns the new base function.
       */
      function createBaseFor(fromRight) {
        return function(object, iteratee, keysFunc) {
          var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

          while (length--) {
            var key = props[fromRight ? length : ++index];
            if (iteratee(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }

      /**
       * Creates a function that wraps `func` to invoke it with the optional `this`
       * binding of `thisArg`.
       *
       * @private
       * @param {Function} func The function to wrap.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @param {*} [thisArg] The `this` binding of `func`.
       * @returns {Function} Returns the new wrapped function.
       */
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

        function wrapper() {
          var fn =
            this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }

      /**
       * Creates a function like `_.lowerFirst`.
       *
       * @private
       * @param {string} methodName The name of the `String` case method to use.
       * @returns {Function} Returns the new case function.
       */
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString(string);

          var strSymbols = hasUnicode(string)
            ? stringToArray(string)
            : undefined$1;

          var chr = strSymbols ? strSymbols[0] : string.charAt(0);

          var trailing = strSymbols
            ? castSlice(strSymbols, 1).join('')
            : string.slice(1);

          return chr[methodName]() + trailing;
        };
      }

      /**
       * Creates a function like `_.camelCase`.
       *
       * @private
       * @param {Function} callback The function to combine each word.
       * @returns {Function} Returns the new compounder function.
       */
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(
            words(deburr(string).replace(reApos, '')),
            callback,
            ''
          );
        };
      }

      /**
       * Creates a function that produces an instance of `Ctor` regardless of
       * whether it was invoked as part of a `new` expression or by `call` or `apply`.
       *
       * @private
       * @param {Function} Ctor The constructor to wrap.
       * @returns {Function} Returns the new wrapped function.
       */
      function createCtor(Ctor) {
        return function() {
          // Use a `switch` statement to work with class constructors. See
          // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
          // for more details.
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(
                args[0],
                args[1],
                args[2],
                args[3],
                args[4],
                args[5]
              );
            case 7:
              return new Ctor(
                args[0],
                args[1],
                args[2],
                args[3],
                args[4],
                args[5],
                args[6]
              );
          }
          var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

          // Mimic the constructor's `return` behavior.
          // See https://es5.github.io/#x13.2.2 for more details.
          return isObject(result) ? result : thisBinding;
        };
      }

      /**
       * Creates a function that wraps `func` to enable currying.
       *
       * @private
       * @param {Function} func The function to wrap.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @param {number} arity The arity of `func`.
       * @returns {Function} Returns the new wrapped function.
       */
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);

        function wrapper() {
          var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

          while (index--) {
            args[index] = arguments[index];
          }
          var holders =
            length < 3 &&
            args[0] !== placeholder &&
            args[length - 1] !== placeholder
              ? []
              : replaceHolders(args, placeholder);

          length -= holders.length;
          if (length < arity) {
            return createRecurry(
              func,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              undefined$1,
              args,
              holders,
              undefined$1,
              undefined$1,
              arity - length
            );
          }
          var fn =
            this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }
        return wrapper;
      }

      /**
       * Creates a `_.find` or `_.findLast` function.
       *
       * @private
       * @param {Function} findIndexFunc The function to find the collection index.
       * @returns {Function} Returns the new find function.
       */
      function createFind(findIndexFunc) {
        return function(collection, predicate, fromIndex) {
          var iterable = Object(collection);
          if (!isArrayLike(collection)) {
            var iteratee = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function(key) {
              return iteratee(iterable[key], key, iterable);
            };
          }
          var index = findIndexFunc(collection, predicate, fromIndex);
          return index > -1
            ? iterable[iteratee ? collection[index] : index]
            : undefined$1;
        };
      }

      /**
       * Creates a `_.flow` or `_.flowRight` function.
       *
       * @private
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Function} Returns the new flow function.
       */
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

          if (fromRight) {
            funcs.reverse();
          }
          while (index--) {
            var func = funcs[index];
            if (typeof func != 'function') {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index = wrapper ? index : length;
          while (++index < length) {
            func = funcs[index];

            var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined$1;

            if (
              data &&
              isLaziable(data[0]) &&
              data[1] ==
                (WRAP_ARY_FLAG |
                  WRAP_CURRY_FLAG |
                  WRAP_PARTIAL_FLAG |
                  WRAP_REARG_FLAG) &&
              !data[4].length &&
              data[9] == 1
            ) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper =
                func.length == 1 && isLaziable(func)
                  ? wrapper[funcName]()
                  : wrapper.thru(func);
            }
          }
          return function() {
            var args = arguments,
              value = args[0];

            if (wrapper && args.length == 1 && isArray(value)) {
              return wrapper.plant(value).value();
            }
            var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

            while (++index < length) {
              result = funcs[index].call(this, result);
            }
            return result;
          };
        });
      }

      /**
       * Creates a function that wraps `func` to invoke it with optional `this`
       * binding of `thisArg`, partial application, and currying.
       *
       * @private
       * @param {Function|string} func The function or method name to wrap.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @param {*} [thisArg] The `this` binding of `func`.
       * @param {Array} [partials] The arguments to prepend to those provided to
       *  the new function.
       * @param {Array} [holders] The `partials` placeholder indexes.
       * @param {Array} [partialsRight] The arguments to append to those provided
       *  to the new function.
       * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
       * @param {Array} [argPos] The argument positions of the new function.
       * @param {number} [ary] The arity cap of `func`.
       * @param {number} [arity] The arity of `func`.
       * @returns {Function} Returns the new wrapped function.
       */
      function createHybrid(
        func,
        bitmask,
        thisArg,
        partials,
        holders,
        partialsRight,
        holdersRight,
        argPos,
        ary,
        arity
      ) {
        var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined$1 : createCtor(func);

        function wrapper() {
          var length = arguments.length,
            args = Array(length),
            index = length;

          while (index--) {
            args[index] = arguments[index];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(
              args,
              partialsRight,
              holdersRight,
              isCurried
            );
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(
              func,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              thisArg,
              args,
              newHolders,
              argPos,
              ary,
              arity - length
            );
          }
          var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary < length) {
            args.length = ary;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }

      /**
       * Creates a function like `_.invertBy`.
       *
       * @private
       * @param {Function} setter The function to set accumulator values.
       * @param {Function} toIteratee The function to resolve iteratees.
       * @returns {Function} Returns the new inverter function.
       */
      function createInverter(setter, toIteratee) {
        return function(object, iteratee) {
          return baseInverter(object, setter, toIteratee(iteratee), {});
        };
      }

      /**
       * Creates a function that performs a mathematical operation on two values.
       *
       * @private
       * @param {Function} operator The function to perform the operation.
       * @param {number} [defaultValue] The value used for `undefined` arguments.
       * @returns {Function} Returns the new mathematical operation function.
       */
      function createMathOperation(operator, defaultValue) {
        return function(value, other) {
          var result;
          if (value === undefined$1 && other === undefined$1) {
            return defaultValue;
          }
          if (value !== undefined$1) {
            result = value;
          }
          if (other !== undefined$1) {
            if (result === undefined$1) {
              return other;
            }
            if (typeof value == 'string' || typeof other == 'string') {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result = operator(value, other);
          }
          return result;
        };
      }

      /**
       * Creates a function like `_.over`.
       *
       * @private
       * @param {Function} arrayFunc The function to iterate over iteratees.
       * @returns {Function} Returns the new over function.
       */
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee) {
              return apply(iteratee, thisArg, args);
            });
          });
        });
      }

      /**
       * Creates the padding for `string` based on `length`. The `chars` string
       * is truncated if the number of characters exceeds `length`.
       *
       * @private
       * @param {number} length The padding length.
       * @param {string} [chars=' '] The string used as padding.
       * @returns {string} Returns the padding for `string`.
       */
      function createPadding(length, chars) {
        chars = chars === undefined$1 ? ' ' : baseToString(chars);

        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars)
          ? castSlice(stringToArray(result), 0, length).join('')
          : result.slice(0, length);
      }

      /**
       * Creates a function that wraps `func` to invoke it with the `this` binding
       * of `thisArg` and `partials` prepended to the arguments it receives.
       *
       * @private
       * @param {Function} func The function to wrap.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @param {*} thisArg The `this` binding of `func`.
       * @param {Array} partials The arguments to prepend to those provided to
       *  the new function.
       * @returns {Function} Returns the new wrapped function.
       */
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

        function wrapper() {
          var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = this && this !== root && this instanceof wrapper ? Ctor : func;

          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }

      /**
       * Creates a `_.range` or `_.rangeRight` function.
       *
       * @private
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Function} Returns the new range function.
       */
      function createRange(fromRight) {
        return function(start, end, step) {
          if (
            step &&
            typeof step != 'number' &&
            isIterateeCall(start, end, step)
          ) {
            end = step = undefined$1;
          }
          // Ensure the sign of `-0` is preserved.
          start = toFinite(start);
          if (end === undefined$1) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined$1 ? (start < end ? 1 : -1) : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }

      /**
       * Creates a function that performs a relational operation on two values.
       *
       * @private
       * @param {Function} operator The function to perform the operation.
       * @returns {Function} Returns the new relational operation function.
       */
      function createRelationalOperation(operator) {
        return function(value, other) {
          if (!(typeof value == 'string' && typeof other == 'string')) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }

      /**
       * Creates a function that wraps `func` to continue currying.
       *
       * @private
       * @param {Function} func The function to wrap.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @param {Function} wrapFunc The function to create the `func` wrapper.
       * @param {*} placeholder The placeholder value.
       * @param {*} [thisArg] The `this` binding of `func`.
       * @param {Array} [partials] The arguments to prepend to those provided to
       *  the new function.
       * @param {Array} [holders] The `partials` placeholder indexes.
       * @param {Array} [argPos] The argument positions of the new function.
       * @param {number} [ary] The arity cap of `func`.
       * @param {number} [arity] The arity of `func`.
       * @returns {Function} Returns the new wrapped function.
       */
      function createRecurry(
        func,
        bitmask,
        wrapFunc,
        placeholder,
        thisArg,
        partials,
        holders,
        argPos,
        ary,
        arity
      ) {
        var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined$1,
          newHoldersRight = isCurry ? undefined$1 : holders,
          newPartials = isCurry ? partials : undefined$1,
          newPartialsRight = isCurry ? undefined$1 : partials;

        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [
          func,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary,
          arity,
        ];

        var result = wrapFunc.apply(undefined$1, newData);
        if (isLaziable(func)) {
          setData(result, newData);
        }
        result.placeholder = placeholder;
        return setWrapToString(result, func, bitmask);
      }

      /**
       * Creates a function like `_.round`.
       *
       * @private
       * @param {string} methodName The name of the `Math` method to use when rounding.
       * @returns {Function} Returns the new round function.
       */
      function createRound(methodName) {
        var func = Math[methodName];
        return function(number, precision) {
          number = toNumber(number);
          precision =
            precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            // Shift with exponential notation to avoid floating-point issues.
            // See [MDN](https://mdn.io/round#Examples) for more details.
            var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

            pair = (toString(value) + 'e').split('e');
            return +(pair[0] + 'e' + (+pair[1] - precision));
          }
          return func(number);
        };
      }

      /**
       * Creates a set object of `values`.
       *
       * @private
       * @param {Array} values The values to add to the set.
       * @returns {Object} Returns the new set.
       */
      var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY)
        ? noop
        : function(values) {
            return new Set(values);
          };

      /**
       * Creates a `_.toPairs` or `_.toPairsIn` function.
       *
       * @private
       * @param {Function} keysFunc The function to get the keys of a given object.
       * @returns {Function} Returns the new pairs function.
       */
      function createToPairs(keysFunc) {
        return function(object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }

      /**
       * Creates a function that either curries or invokes `func` with optional
       * `this` binding and partially applied arguments.
       *
       * @private
       * @param {Function|string} func The function or method name to wrap.
       * @param {number} bitmask The bitmask flags.
       *    1 - `_.bind`
       *    2 - `_.bindKey`
       *    4 - `_.curry` or `_.curryRight` of a bound function
       *    8 - `_.curry`
       *   16 - `_.curryRight`
       *   32 - `_.partial`
       *   64 - `_.partialRight`
       *  128 - `_.rearg`
       *  256 - `_.ary`
       *  512 - `_.flip`
       * @param {*} [thisArg] The `this` binding of `func`.
       * @param {Array} [partials] The arguments to be partially applied.
       * @param {Array} [holders] The `partials` placeholder indexes.
       * @param {Array} [argPos] The argument positions of the new function.
       * @param {number} [ary] The arity cap of `func`.
       * @param {number} [arity] The arity of `func`.
       * @returns {Function} Returns the new wrapped function.
       */
      function createWrap(
        func,
        bitmask,
        thisArg,
        partials,
        holders,
        argPos,
        ary,
        arity
      ) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined$1;
        }
        ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
        arity = arity === undefined$1 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;

        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials,
            holdersRight = holders;

          partials = holders = undefined$1;
        }
        var data = isBindKey ? undefined$1 : getData(func);

        var newData = [
          func,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary,
          arity,
        ];

        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] =
          newData[9] === undefined$1
            ? isBindKey
              ? 0
              : func.length
            : nativeMax(newData[9] - length, 0);

        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result = createBind(func, bitmask, thisArg);
        } else if (
          bitmask == WRAP_CURRY_FLAG ||
          bitmask == WRAP_CURRY_RIGHT_FLAG
        ) {
          result = createCurry(func, bitmask, arity);
        } else if (
          (bitmask == WRAP_PARTIAL_FLAG ||
            bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) &&
          !holders.length
        ) {
          result = createPartial(func, bitmask, thisArg, partials);
        } else {
          result = createHybrid.apply(undefined$1, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result, newData), func, bitmask);
      }

      /**
       * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
       * of source objects to the destination object for all destination properties
       * that resolve to `undefined`.
       *
       * @private
       * @param {*} objValue The destination value.
       * @param {*} srcValue The source value.
       * @param {string} key The key of the property to assign.
       * @param {Object} object The parent object of `objValue`.
       * @returns {*} Returns the value to assign.
       */
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (
          objValue === undefined$1 ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))
        ) {
          return srcValue;
        }
        return objValue;
      }

      /**
       * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
       * objects into destination objects that are passed thru.
       *
       * @private
       * @param {*} objValue The destination value.
       * @param {*} srcValue The source value.
       * @param {string} key The key of the property to merge.
       * @param {Object} object The parent object of `objValue`.
       * @param {Object} source The parent object of `srcValue`.
       * @param {Object} [stack] Tracks traversed source values and their merged
       *  counterparts.
       * @returns {*} Returns the value to assign.
       */
      function customDefaultsMerge(
        objValue,
        srcValue,
        key,
        object,
        source,
        stack
      ) {
        if (isObject(objValue) && isObject(srcValue)) {
          // Recursively merge objects and arrays (susceptible to call stack limits).
          stack.set(srcValue, objValue);
          baseMerge(
            objValue,
            srcValue,
            undefined$1,
            customDefaultsMerge,
            stack
          );
          stack['delete'](srcValue);
        }
        return objValue;
      }

      /**
       * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
       * objects.
       *
       * @private
       * @param {*} value The value to inspect.
       * @param {string} key The key of the property to inspect.
       * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
       */
      function customOmitClone(value) {
        return isPlainObject(value) ? undefined$1 : value;
      }

      /**
       * A specialized version of `baseIsEqualDeep` for arrays with support for
       * partial deep comparisons.
       *
       * @private
       * @param {Array} array The array to compare.
       * @param {Array} other The other array to compare.
       * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
       * @param {Function} customizer The function to customize comparisons.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Object} stack Tracks traversed `array` and `other` objects.
       * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
       */
      function equalArrays(
        array,
        other,
        bitmask,
        customizer,
        equalFunc,
        stack
      ) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(array);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var index = -1,
          result = true,
          seen =
            bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;

        stack.set(array, other);
        stack.set(other, array);

        // Ignore non-index properties.
        while (++index < arrLength) {
          var arrValue = array[index],
            othValue = other[index];

          if (customizer) {
            var compared = isPartial
              ? customizer(othValue, arrValue, index, other, array, stack)
              : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== undefined$1) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          // Recursively compare arrays (susceptible to call stack limits).
          if (seen) {
            if (
              !arraySome(other, function(othValue, othIndex) {
                if (
                  !cacheHas(seen, othIndex) &&
                  (arrValue === othValue ||
                    equalFunc(arrValue, othValue, bitmask, customizer, stack))
                ) {
                  return seen.push(othIndex);
                }
              })
            ) {
              result = false;
              break;
            }
          } else if (
            !(
              arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )
          ) {
            result = false;
            break;
          }
        }
        stack['delete'](array);
        stack['delete'](other);
        return result;
      }

      /**
       * A specialized version of `baseIsEqualDeep` for comparing objects of
       * the same `toStringTag`.
       *
       * **Note:** This function only supports comparing values with tags of
       * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {string} tag The `toStringTag` of the objects to compare.
       * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
       * @param {Function} customizer The function to customize comparisons.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Object} stack Tracks traversed `object` and `other` objects.
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function equalByTag(
        object,
        other,
        tag,
        bitmask,
        customizer,
        equalFunc,
        stack
      ) {
        switch (tag) {
          case dataViewTag:
            if (
              object.byteLength != other.byteLength ||
              object.byteOffset != other.byteOffset
            ) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;

          case arrayBufferTag:
            if (
              object.byteLength != other.byteLength ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))
            ) {
              return false;
            }
            return true;

          case boolTag:
          case dateTag:
          case numberTag:
            // Coerce booleans to `1` or `0` and dates to milliseconds.
            // Invalid dates are coerced to `NaN`.
            return eq(+object, +other);

          case errorTag:
            return object.name == other.name && object.message == other.message;

          case regexpTag:
          case stringTag:
            // Coerce regexes to strings and treat strings, primitives and objects,
            // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
            // for more details.
            return object == other + '';

          case mapTag:
            var convert = mapToArray;

          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);

            if (object.size != other.size && !isPartial) {
              return false;
            }
            // Assume cyclic values are equal.
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;

            // Recursively compare objects (susceptible to call stack limits).
            stack.set(object, other);
            var result = equalArrays(
              convert(object),
              convert(other),
              bitmask,
              customizer,
              equalFunc,
              stack
            );
            stack['delete'](object);
            return result;

          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }

      /**
       * A specialized version of `baseIsEqualDeep` for objects with support for
       * partial deep comparisons.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
       * @param {Function} customizer The function to customize comparisons.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Object} stack Tracks traversed `object` and `other` objects.
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function equalObjects(
        object,
        other,
        bitmask,
        customizer,
        equalFunc,
        stack
      ) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);

        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key],
            othValue = other[key];

          if (customizer) {
            var compared = isPartial
              ? customizer(othValue, objValue, key, other, object, stack)
              : customizer(objValue, othValue, key, object, other, stack);
          }
          // Recursively compare objects (susceptible to call stack limits).
          if (
            !(compared === undefined$1
              ? objValue === othValue ||
                equalFunc(objValue, othValue, bitmask, customizer, stack)
              : compared)
          ) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == 'constructor');
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor,
            othCtor = other.constructor;

          // Non `Object` object instances with different constructors are not equal.
          if (
            objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(
              typeof objCtor == 'function' &&
              objCtor instanceof objCtor &&
              typeof othCtor == 'function' &&
              othCtor instanceof othCtor
            )
          ) {
            result = false;
          }
        }
        stack['delete'](object);
        stack['delete'](other);
        return result;
      }

      /**
       * A specialized version of `baseRest` which flattens the rest array.
       *
       * @private
       * @param {Function} func The function to apply a rest parameter to.
       * @returns {Function} Returns the new function.
       */
      function flatRest(func) {
        return setToString(overRest(func, undefined$1, flatten), func + '');
      }

      /**
       * Creates an array of own enumerable property names and symbols of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names and symbols.
       */
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }

      /**
       * Creates an array of own and inherited enumerable property names and
       * symbols of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names and symbols.
       */
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }

      /**
       * Gets metadata for `func`.
       *
       * @private
       * @param {Function} func The function to query.
       * @returns {*} Returns the metadata for `func`.
       */
      var getData = !metaMap
        ? noop
        : function(func) {
            return metaMap.get(func);
          };

      /**
       * Gets the name of `func`.
       *
       * @private
       * @param {Function} func The function to query.
       * @returns {string} Returns the function name.
       */
      function getFuncName(func) {
        var result = func.name + '',
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

        while (length--) {
          var data = array[length],
            otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result;
      }

      /**
       * Gets the argument placeholder value for `func`.
       *
       * @private
       * @param {Function} func The function to inspect.
       * @returns {*} Returns the placeholder value.
       */
      function getHolder(func) {
        var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
        return object.placeholder;
      }

      /**
       * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
       * this function returns the custom method, otherwise it returns `baseIteratee`.
       * If arguments are provided, the chosen function is invoked with them and
       * its result is returned.
       *
       * @private
       * @param {*} [value] The value to convert to an iteratee.
       * @param {number} [arity] The arity of the created iteratee.
       * @returns {Function} Returns the chosen function or its result.
       */
      function getIteratee() {
        var result = lodash.iteratee || iteratee;
        result = result === iteratee ? baseIteratee : result;
        return arguments.length ? result(arguments[0], arguments[1]) : result;
      }

      /**
       * Gets the data for `map`.
       *
       * @private
       * @param {Object} map The map to query.
       * @param {string} key The reference key.
       * @returns {*} Returns the map data.
       */
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key)
          ? data[typeof key == 'string' ? 'string' : 'hash']
          : data.map;
      }

      /**
       * Gets the property names, values, and compare flags of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the match data of `object`.
       */
      function getMatchData(object) {
        var result = keys(object),
          length = result.length;

        while (length--) {
          var key = result[length],
            value = object[key];

          result[length] = [key, value, isStrictComparable(value)];
        }
        return result;
      }

      /**
       * Gets the native function at `key` of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {string} key The key of the method to get.
       * @returns {*} Returns the function if it's native, else `undefined`.
       */
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined$1;
      }

      /**
       * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
       *
       * @private
       * @param {*} value The value to query.
       * @returns {string} Returns the raw `toStringTag`.
       */
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

        try {
          value[symToStringTag] = undefined$1;
          var unmasked = true;
        } catch (e) {}

        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }

      /**
       * Creates an array of the own enumerable symbols of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of symbols.
       */
      var getSymbols = !nativeGetSymbols
        ? stubArray
        : function(object) {
            if (object == null) {
              return [];
            }
            object = Object(object);
            return arrayFilter(nativeGetSymbols(object), function(symbol) {
              return propertyIsEnumerable.call(object, symbol);
            });
          };

      /**
       * Creates an array of the own and inherited enumerable symbols of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of symbols.
       */
      var getSymbolsIn = !nativeGetSymbols
        ? stubArray
        : function(object) {
            var result = [];
            while (object) {
              arrayPush(result, getSymbols(object));
              object = getPrototype(object);
            }
            return result;
          };

      /**
       * Gets the `toStringTag` of `value`.
       *
       * @private
       * @param {*} value The value to query.
       * @returns {string} Returns the `toStringTag`.
       */
      var getTag = baseGetTag;

      // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
      if (
        (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map()) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set()) != setTag) ||
        (WeakMap && getTag(new WeakMap()) != weakMapTag)
      ) {
        getTag = function(value) {
          var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined$1,
            ctorString = Ctor ? toSource(Ctor) : '';

          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result;
        };
      }

      /**
       * Gets the view, applying any `transforms` to the `start` and `end` positions.
       *
       * @private
       * @param {number} start The start of the view.
       * @param {number} end The end of the view.
       * @param {Array} transforms The transformations to apply to the view.
       * @returns {Object} Returns an object containing the `start` and `end`
       *  positions of the view.
       */
      function getView(start, end, transforms) {
        var index = -1,
          length = transforms.length;

        while (++index < length) {
          var data = transforms[index],
            size = data.size;

          switch (data.type) {
            case 'drop':
              start += size;
              break;
            case 'dropRight':
              end -= size;
              break;
            case 'take':
              end = nativeMin(end, start + size);
              break;
            case 'takeRight':
              start = nativeMax(start, end - size);
              break;
          }
        }
        return { start: start, end: end };
      }

      /**
       * Extracts wrapper details from the `source` body comment.
       *
       * @private
       * @param {string} source The source to inspect.
       * @returns {Array} Returns the wrapper details.
       */
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }

      /**
       * Checks if `path` exists on `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array|string} path The path to check.
       * @param {Function} hasFunc The function to check properties.
       * @returns {boolean} Returns `true` if `path` exists, else `false`.
       */
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);

        var index = -1,
          length = path.length,
          result = false;

        while (++index < length) {
          var key = toKey(path[index]);
          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result || ++index != length) {
          return result;
        }
        length = object == null ? 0 : object.length;
        return (
          !!length &&
          isLength(length) &&
          isIndex(key, length) &&
          (isArray(object) || isArguments(object))
        );
      }

      /**
       * Initializes an array clone.
       *
       * @private
       * @param {Array} array The array to clone.
       * @returns {Array} Returns the initialized clone.
       */
      function initCloneArray(array) {
        var length = array.length,
          result = new array.constructor(length);

        // Add properties assigned by `RegExp#exec`.
        if (
          length &&
          typeof array[0] == 'string' &&
          hasOwnProperty.call(array, 'index')
        ) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }

      /**
       * Initializes an object clone.
       *
       * @private
       * @param {Object} object The object to clone.
       * @returns {Object} Returns the initialized clone.
       */
      function initCloneObject(object) {
        return typeof object.constructor == 'function' && !isPrototype(object)
          ? baseCreate(getPrototype(object))
          : {};
      }

      /**
       * Initializes an object clone based on its `toStringTag`.
       *
       * **Note:** This function only supports cloning values with tags of
       * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
       *
       * @private
       * @param {Object} object The object to clone.
       * @param {string} tag The `toStringTag` of the object to clone.
       * @param {boolean} [isDeep] Specify a deep clone.
       * @returns {Object} Returns the initialized clone.
       */
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);

          case boolTag:
          case dateTag:
            return new Ctor(+object);

          case dataViewTag:
            return cloneDataView(object, isDeep);

          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);

          case mapTag:
            return new Ctor();

          case numberTag:
          case stringTag:
            return new Ctor(object);

          case regexpTag:
            return cloneRegExp(object);

          case setTag:
            return new Ctor();

          case symbolTag:
            return cloneSymbol(object);
        }
      }

      /**
       * Inserts wrapper `details` in a comment at the top of the `source` body.
       *
       * @private
       * @param {string} source The source to modify.
       * @returns {Array} details The details to insert.
       * @returns {string} Returns the modified source.
       */
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
        details = details.join(length > 2 ? ', ' : ' ');
        return source.replace(
          reWrapComment,
          '{\n/* [wrapped with ' + details + '] */\n'
        );
      }

      /**
       * Checks if `value` is a flattenable `arguments` object or array.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
       */
      function isFlattenable(value) {
        return (
          isArray(value) ||
          isArguments(value) ||
          !!(spreadableSymbol && value && value[spreadableSymbol])
        );
      }

      /**
       * Checks if `value` is a valid array-like index.
       *
       * @private
       * @param {*} value The value to check.
       * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
       * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
       */
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;

        return (
          !!length &&
          (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length)
        );
      }

      /**
       * Checks if the given arguments are from an iteratee call.
       *
       * @private
       * @param {*} value The potential iteratee value argument.
       * @param {*} index The potential iteratee index or key argument.
       * @param {*} object The potential iteratee object argument.
       * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
       *  else `false`.
       */
      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (
          type == 'number'
            ? isArrayLike(object) && isIndex(index, object.length)
            : type == 'string' && index in object
        ) {
          return eq(object[index], value);
        }
        return false;
      }

      /**
       * Checks if `value` is a property name and not a property path.
       *
       * @private
       * @param {*} value The value to check.
       * @param {Object} [object] The object to query keys on.
       * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
       */
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (
          type == 'number' ||
          type == 'symbol' ||
          type == 'boolean' ||
          value == null ||
          isSymbol(value)
        ) {
          return true;
        }
        return (
          reIsPlainProp.test(value) ||
          !reIsDeepProp.test(value) ||
          (object != null && value in Object(object))
        );
      }

      /**
       * Checks if `value` is suitable for use as unique object key.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
       */
      function isKeyable(value) {
        var type = typeof value;
        return type == 'string' ||
          type == 'number' ||
          type == 'symbol' ||
          type == 'boolean'
          ? value !== '__proto__'
          : value === null;
      }

      /**
       * Checks if `func` has a lazy counterpart.
       *
       * @private
       * @param {Function} func The function to check.
       * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
       *  else `false`.
       */
      function isLaziable(func) {
        var funcName = getFuncName(func),
          other = lodash[funcName];

        if (
          typeof other != 'function' ||
          !(funcName in LazyWrapper.prototype)
        ) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }

      /**
       * Checks if `func` has its source masked.
       *
       * @private
       * @param {Function} func The function to check.
       * @returns {boolean} Returns `true` if `func` is masked, else `false`.
       */
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }

      /**
       * Checks if `func` is capable of being masked.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
       */
      var isMaskable = coreJsData ? isFunction : stubFalse;

      /**
       * Checks if `value` is likely a prototype object.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
       */
      function isPrototype(value) {
        var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

        return value === proto;
      }

      /**
       * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` if suitable for strict
       *  equality comparisons, else `false`.
       */
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }

      /**
       * A specialized version of `matchesProperty` for source values suitable
       * for strict equality comparisons, i.e. `===`.
       *
       * @private
       * @param {string} key The key of the property to get.
       * @param {*} srcValue The value to match.
       * @returns {Function} Returns the new spec function.
       */
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return (
            object[key] === srcValue &&
            (srcValue !== undefined$1 || key in Object(object))
          );
        };
      }

      /**
       * A specialized version of `_.memoize` which clears the memoized function's
       * cache when it exceeds `MAX_MEMOIZE_SIZE`.
       *
       * @private
       * @param {Function} func The function to have its output memoized.
       * @returns {Function} Returns the new memoized function.
       */
      function memoizeCapped(func) {
        var result = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });

        var cache = result.cache;
        return result;
      }

      /**
       * Merges the function metadata of `source` into `data`.
       *
       * Merging metadata reduces the number of wrappers used to invoke a function.
       * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
       * may be applied regardless of execution order. Methods like `_.ary` and
       * `_.rearg` modify function arguments, making the order in which they are
       * executed important, preventing the merging of metadata. However, we make
       * an exception for a safe combined case where curried functions have `_.ary`
       * and or `_.rearg` applied.
       *
       * @private
       * @param {Array} data The destination metadata.
       * @param {Array} source The source metadata.
       * @returns {Array} Returns `data`.
       */
      function mergeData(data, source) {
        var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon =
            newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

        var isCombo =
          (srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG) ||
          (srcBitmask == WRAP_ARY_FLAG &&
            bitmask == WRAP_REARG_FLAG &&
            data[7].length <= source[8]) ||
          (srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) &&
            source[7].length <= source[8] &&
            bitmask == WRAP_CURRY_FLAG);

        // Exit early if metadata can't be merged.
        if (!(isCommon || isCombo)) {
          return data;
        }
        // Use source `thisArg` if available.
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          // Set when currying a bound function.
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        // Compose partial arguments.
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        // Compose partial right arguments.
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials
            ? composeArgsRight(partials, value, source[6])
            : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        // Use source `argPos` if available.
        value = source[7];
        if (value) {
          data[7] = value;
        }
        // Use source `ary` if it's smaller.
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        // Use source `arity` if one is not provided.
        if (data[9] == null) {
          data[9] = source[9];
        }
        // Use source `func` and merge bitmasks.
        data[0] = source[0];
        data[1] = newBitmask;

        return data;
      }

      /**
       * This function is like
       * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
       * except that it includes inherited enumerable properties.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       */
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }

      /**
       * Converts `value` to a string using `Object.prototype.toString`.
       *
       * @private
       * @param {*} value The value to convert.
       * @returns {string} Returns the converted string.
       */
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }

      /**
       * A specialized version of `baseRest` which transforms the rest array.
       *
       * @private
       * @param {Function} func The function to apply a rest parameter to.
       * @param {number} [start=func.length-1] The start position of the rest parameter.
       * @param {Function} transform The rest array transform.
       * @returns {Function} Returns the new function.
       */
      function overRest(func, start, transform) {
        start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform(array);
          return apply(func, this, otherArgs);
        };
      }

      /**
       * Gets the parent value at `path` of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array} path The path to get the parent value of.
       * @returns {*} Returns the parent value.
       */
      function parent(object, path) {
        return path.length < 2
          ? object
          : baseGet(object, baseSlice(path, 0, -1));
      }

      /**
       * Reorder `array` according to the specified indexes where the element at
       * the first index is assigned as the first element, the element at
       * the second index is assigned as the second element, and so on.
       *
       * @private
       * @param {Array} array The array to reorder.
       * @param {Array} indexes The arranged array indexes.
       * @returns {Array} Returns `array`.
       */
      function reorder(array, indexes) {
        var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

        while (length--) {
          var index = indexes[length];
          array[length] = isIndex(index, arrLength)
            ? oldArray[index]
            : undefined$1;
        }
        return array;
      }

      /**
       * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
       *
       * @private
       * @param {Object} object The object to query.
       * @param {string} key The key of the property to get.
       * @returns {*} Returns the property value.
       */
      function safeGet(object, key) {
        if (key === 'constructor' && typeof object[key] === 'function') {
          return;
        }

        if (key == '__proto__') {
          return;
        }

        return object[key];
      }

      /**
       * Sets metadata for `func`.
       *
       * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
       * period of time, it will trip its breaker and transition to an identity
       * function to avoid garbage collection pauses in V8. See
       * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
       * for more details.
       *
       * @private
       * @param {Function} func The function to associate metadata with.
       * @param {*} data The metadata.
       * @returns {Function} Returns `func`.
       */
      var setData = shortOut(baseSetData);

      /**
       * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
       *
       * @private
       * @param {Function} func The function to delay.
       * @param {number} wait The number of milliseconds to delay invocation.
       * @returns {number|Object} Returns the timer id or timeout object.
       */
      var setTimeout =
        ctxSetTimeout ||
        function(func, wait) {
          return root.setTimeout(func, wait);
        };

      /**
       * Sets the `toString` method of `func` to return `string`.
       *
       * @private
       * @param {Function} func The function to modify.
       * @param {Function} string The `toString` result.
       * @returns {Function} Returns `func`.
       */
      var setToString = shortOut(baseSetToString);

      /**
       * Sets the `toString` method of `wrapper` to mimic the source of `reference`
       * with wrapper details in a comment at the top of the source body.
       *
       * @private
       * @param {Function} wrapper The function to modify.
       * @param {Function} reference The reference function.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @returns {Function} Returns `wrapper`.
       */
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + '';
        return setToString(
          wrapper,
          insertWrapDetails(
            source,
            updateWrapDetails(getWrapDetails(source), bitmask)
          )
        );
      }

      /**
       * Creates a function that'll short out and invoke `identity` instead
       * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
       * milliseconds.
       *
       * @private
       * @param {Function} func The function to restrict.
       * @returns {Function} Returns the new shortable function.
       */
      function shortOut(func) {
        var count = 0,
          lastCalled = 0;

        return function() {
          var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined$1, arguments);
        };
      }

      /**
       * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
       *
       * @private
       * @param {Array} array The array to shuffle.
       * @param {number} [size=array.length] The size of `array`.
       * @returns {Array} Returns `array`.
       */
      function shuffleSelf(array, size) {
        var index = -1,
          length = array.length,
          lastIndex = length - 1;

        size = size === undefined$1 ? length : size;
        while (++index < size) {
          var rand = baseRandom(index, lastIndex),
            value = array[rand];

          array[rand] = array[index];
          array[index] = value;
        }
        array.length = size;
        return array;
      }

      /**
       * Converts `string` to a property path array.
       *
       * @private
       * @param {string} string The string to convert.
       * @returns {Array} Returns the property path array.
       */
      var stringToPath = memoizeCapped(function(string) {
        var result = [];
        if (string.charCodeAt(0) === 46 /* . */) {
          result.push('');
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result.push(
            quote ? subString.replace(reEscapeChar, '$1') : number || match
          );
        });
        return result;
      });

      /**
       * Converts `value` to a string key if it's not a string or symbol.
       *
       * @private
       * @param {*} value The value to inspect.
       * @returns {string|symbol} Returns the key.
       */
      function toKey(value) {
        if (typeof value == 'string' || isSymbol(value)) {
          return value;
        }
        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

      /**
       * Converts `func` to its source code.
       *
       * @private
       * @param {Function} func The function to convert.
       * @returns {string} Returns the source code.
       */
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {}
          try {
            return func + '';
          } catch (e) {}
        }
        return '';
      }

      /**
       * Updates wrapper `details` based on `bitmask` flags.
       *
       * @private
       * @returns {Array} details The details to modify.
       * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
       * @returns {Array} Returns `details`.
       */
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair) {
          var value = '_.' + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }

      /**
       * Creates a clone of `wrapper`.
       *
       * @private
       * @param {Object} wrapper The wrapper to clone.
       * @returns {Object} Returns the cloned wrapper.
       */
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result.__actions__ = copyArray(wrapper.__actions__);
        result.__index__ = wrapper.__index__;
        result.__values__ = wrapper.__values__;
        return result;
      }

      /*------------------------------------------------------------------------*/

      /**
       * Creates an array of elements split into groups the length of `size`.
       * If `array` can't be split evenly, the final chunk will be the remaining
       * elements.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to process.
       * @param {number} [size=1] The length of each chunk
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the new array of chunks.
       * @example
       *
       * _.chunk(['a', 'b', 'c', 'd'], 2);
       * // => [['a', 'b'], ['c', 'd']]
       *
       * _.chunk(['a', 'b', 'c', 'd'], 3);
       * // => [['a', 'b', 'c'], ['d']]
       */
      function chunk(array, size, guard) {
        if (guard ? isIterateeCall(array, size, guard) : size === undefined$1) {
          size = 1;
        } else {
          size = nativeMax(toInteger(size), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size < 1) {
          return [];
        }
        var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

        while (index < length) {
          result[resIndex++] = baseSlice(array, index, (index += size));
        }
        return result;
      }

      /**
       * Creates an array with all falsey values removed. The values `false`, `null`,
       * `0`, `""`, `undefined`, and `NaN` are falsey.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to compact.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * _.compact([0, 1, false, 2, '', 3]);
       * // => [1, 2, 3]
       */
      function compact(array) {
        var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

        while (++index < length) {
          var value = array[index];
          if (value) {
            result[resIndex++] = value;
          }
        }
        return result;
      }

      /**
       * Creates a new array concatenating `array` with any additional arrays
       * and/or values.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to concatenate.
       * @param {...*} [values] The values to concatenate.
       * @returns {Array} Returns the new concatenated array.
       * @example
       *
       * var array = [1];
       * var other = _.concat(array, 2, [3], [[4]]);
       *
       * console.log(other);
       * // => [1, 2, 3, [4]]
       *
       * console.log(array);
       * // => [1]
       */
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array(length - 1),
          array = arguments[0],
          index = length;

        while (index--) {
          args[index - 1] = arguments[index];
        }
        return arrayPush(
          isArray(array) ? copyArray(array) : [array],
          baseFlatten(args, 1)
        );
      }

      /**
       * Creates an array of `array` values not included in the other given arrays
       * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons. The order and references of result values are
       * determined by the first array.
       *
       * **Note:** Unlike `_.pullAll`, this method returns a new array.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {...Array} [values] The values to exclude.
       * @returns {Array} Returns the new array of filtered values.
       * @see _.without, _.xor
       * @example
       *
       * _.difference([2, 1], [2, 3]);
       * // => [1]
       */
      var difference = baseRest(function(array, values) {
        return isArrayLikeObject(array)
          ? baseDifference(
              array,
              baseFlatten(values, 1, isArrayLikeObject, true)
            )
          : [];
      });

      /**
       * This method is like `_.difference` except that it accepts `iteratee` which
       * is invoked for each element of `array` and `values` to generate the criterion
       * by which they're compared. The order and references of result values are
       * determined by the first array. The iteratee is invoked with one argument:
       * (value).
       *
       * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {...Array} [values] The values to exclude.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
       * // => [1.2]
       *
       * // The `_.property` iteratee shorthand.
       * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
       * // => [{ 'x': 2 }]
       */
      var differenceBy = baseRest(function(array, values) {
        var iteratee = last(values);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return isArrayLikeObject(array)
          ? baseDifference(
              array,
              baseFlatten(values, 1, isArrayLikeObject, true),
              getIteratee(iteratee, 2)
            )
          : [];
      });

      /**
       * This method is like `_.difference` except that it accepts `comparator`
       * which is invoked to compare elements of `array` to `values`. The order and
       * references of result values are determined by the first array. The comparator
       * is invoked with two arguments: (arrVal, othVal).
       *
       * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {...Array} [values] The values to exclude.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
       *
       * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
       * // => [{ 'x': 2, 'y': 1 }]
       */
      var differenceWith = baseRest(function(array, values) {
        var comparator = last(values);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined$1;
        }
        return isArrayLikeObject(array)
          ? baseDifference(
              array,
              baseFlatten(values, 1, isArrayLikeObject, true),
              undefined$1,
              comparator
            )
          : [];
      });

      /**
       * Creates a slice of `array` with `n` elements dropped from the beginning.
       *
       * @static
       * @memberOf _
       * @since 0.5.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {number} [n=1] The number of elements to drop.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.drop([1, 2, 3]);
       * // => [2, 3]
       *
       * _.drop([1, 2, 3], 2);
       * // => [3]
       *
       * _.drop([1, 2, 3], 5);
       * // => []
       *
       * _.drop([1, 2, 3], 0);
       * // => [1, 2, 3]
       */
      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }

      /**
       * Creates a slice of `array` with `n` elements dropped from the end.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {number} [n=1] The number of elements to drop.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.dropRight([1, 2, 3]);
       * // => [1, 2]
       *
       * _.dropRight([1, 2, 3], 2);
       * // => [1]
       *
       * _.dropRight([1, 2, 3], 5);
       * // => []
       *
       * _.dropRight([1, 2, 3], 0);
       * // => [1, 2, 3]
       */
      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }

      /**
       * Creates a slice of `array` excluding elements dropped from the end.
       * Elements are dropped until `predicate` returns falsey. The predicate is
       * invoked with three arguments: (value, index, array).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': true },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': false }
       * ];
       *
       * _.dropRightWhile(users, function(o) { return !o.active; });
       * // => objects for ['barney']
       *
       * // The `_.matches` iteratee shorthand.
       * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
       * // => objects for ['barney', 'fred']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.dropRightWhile(users, ['active', false]);
       * // => objects for ['barney']
       *
       * // The `_.property` iteratee shorthand.
       * _.dropRightWhile(users, 'active');
       * // => objects for ['barney', 'fred', 'pebbles']
       */
      function dropRightWhile(array, predicate) {
        return array && array.length
          ? baseWhile(array, getIteratee(predicate, 3), true, true)
          : [];
      }

      /**
       * Creates a slice of `array` excluding elements dropped from the beginning.
       * Elements are dropped until `predicate` returns falsey. The predicate is
       * invoked with three arguments: (value, index, array).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': false },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': true }
       * ];
       *
       * _.dropWhile(users, function(o) { return !o.active; });
       * // => objects for ['pebbles']
       *
       * // The `_.matches` iteratee shorthand.
       * _.dropWhile(users, { 'user': 'barney', 'active': false });
       * // => objects for ['fred', 'pebbles']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.dropWhile(users, ['active', false]);
       * // => objects for ['pebbles']
       *
       * // The `_.property` iteratee shorthand.
       * _.dropWhile(users, 'active');
       * // => objects for ['barney', 'fred', 'pebbles']
       */
      function dropWhile(array, predicate) {
        return array && array.length
          ? baseWhile(array, getIteratee(predicate, 3), true)
          : [];
      }

      /**
       * Fills elements of `array` with `value` from `start` up to, but not
       * including, `end`.
       *
       * **Note:** This method mutates `array`.
       *
       * @static
       * @memberOf _
       * @since 3.2.0
       * @category Array
       * @param {Array} array The array to fill.
       * @param {*} value The value to fill `array` with.
       * @param {number} [start=0] The start position.
       * @param {number} [end=array.length] The end position.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = [1, 2, 3];
       *
       * _.fill(array, 'a');
       * console.log(array);
       * // => ['a', 'a', 'a']
       *
       * _.fill(Array(3), 2);
       * // => [2, 2, 2]
       *
       * _.fill([4, 6, 8, 10], '*', 1, 3);
       * // => [4, '*', '*', 10]
       */
      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (
          start &&
          typeof start != 'number' &&
          isIterateeCall(array, value, start)
        ) {
          start = 0;
          end = length;
        }
        return baseFill(array, value, start, end);
      }

      /**
       * This method is like `_.find` except that it returns the index of the first
       * element `predicate` returns truthy for instead of the element itself.
       *
       * @static
       * @memberOf _
       * @since 1.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param {number} [fromIndex=0] The index to search from.
       * @returns {number} Returns the index of the found element, else `-1`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': false },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': true }
       * ];
       *
       * _.findIndex(users, function(o) { return o.user == 'barney'; });
       * // => 0
       *
       * // The `_.matches` iteratee shorthand.
       * _.findIndex(users, { 'user': 'fred', 'active': false });
       * // => 1
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.findIndex(users, ['active', false]);
       * // => 0
       *
       * // The `_.property` iteratee shorthand.
       * _.findIndex(users, 'active');
       * // => 2
       */
      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index);
      }

      /**
       * This method is like `_.findIndex` except that it iterates over elements
       * of `collection` from right to left.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param {number} [fromIndex=array.length-1] The index to search from.
       * @returns {number} Returns the index of the found element, else `-1`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': true },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': false }
       * ];
       *
       * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
       * // => 2
       *
       * // The `_.matches` iteratee shorthand.
       * _.findLastIndex(users, { 'user': 'barney', 'active': true });
       * // => 0
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.findLastIndex(users, ['active', false]);
       * // => 2
       *
       * // The `_.property` iteratee shorthand.
       * _.findLastIndex(users, 'active');
       * // => 0
       */
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index =
            fromIndex < 0
              ? nativeMax(length + index, 0)
              : nativeMin(index, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index, true);
      }

      /**
       * Flattens `array` a single level deep.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to flatten.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * _.flatten([1, [2, [3, [4]], 5]]);
       * // => [1, 2, [3, [4]], 5]
       */
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }

      /**
       * Recursively flattens `array`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to flatten.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * _.flattenDeep([1, [2, [3, [4]], 5]]);
       * // => [1, 2, 3, 4, 5]
       */
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }

      /**
       * Recursively flatten `array` up to `depth` times.
       *
       * @static
       * @memberOf _
       * @since 4.4.0
       * @category Array
       * @param {Array} array The array to flatten.
       * @param {number} [depth=1] The maximum recursion depth.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * var array = [1, [2, [3, [4]], 5]];
       *
       * _.flattenDepth(array, 1);
       * // => [1, 2, [3, [4]], 5]
       *
       * _.flattenDepth(array, 2);
       * // => [1, 2, 3, [4], 5]
       */
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }

      /**
       * The inverse of `_.toPairs`; this method returns an object composed
       * from key-value `pairs`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} pairs The key-value pairs.
       * @returns {Object} Returns the new object.
       * @example
       *
       * _.fromPairs([['a', 1], ['b', 2]]);
       * // => { 'a': 1, 'b': 2 }
       */
      function fromPairs(pairs) {
        var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

        while (++index < length) {
          var pair = pairs[index];
          result[pair[0]] = pair[1];
        }
        return result;
      }

      /**
       * Gets the first element of `array`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @alias first
       * @category Array
       * @param {Array} array The array to query.
       * @returns {*} Returns the first element of `array`.
       * @example
       *
       * _.head([1, 2, 3]);
       * // => 1
       *
       * _.head([]);
       * // => undefined
       */
      function head(array) {
        return array && array.length ? array[0] : undefined$1;
      }

      /**
       * Gets the index at which the first occurrence of `value` is found in `array`
       * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons. If `fromIndex` is negative, it's used as the
       * offset from the end of `array`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {*} value The value to search for.
       * @param {number} [fromIndex=0] The index to search from.
       * @returns {number} Returns the index of the matched value, else `-1`.
       * @example
       *
       * _.indexOf([1, 2, 1, 2], 2);
       * // => 1
       *
       * // Search from the `fromIndex`.
       * _.indexOf([1, 2, 1, 2], 2, 2);
       * // => 3
       */
      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseIndexOf(array, value, index);
      }

      /**
       * Gets all but the last element of `array`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to query.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.initial([1, 2, 3]);
       * // => [1, 2]
       */
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }

      /**
       * Creates an array of unique values that are included in all given arrays
       * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons. The order and references of result values are
       * determined by the first array.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @returns {Array} Returns the new array of intersecting values.
       * @example
       *
       * _.intersection([2, 1], [2, 3]);
       * // => [2]
       */
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0]
          ? baseIntersection(mapped)
          : [];
      });

      /**
       * This method is like `_.intersection` except that it accepts `iteratee`
       * which is invoked for each element of each `arrays` to generate the criterion
       * by which they're compared. The order and references of result values are
       * determined by the first array. The iteratee is invoked with one argument:
       * (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns the new array of intersecting values.
       * @example
       *
       * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
       * // => [2.1]
       *
       * // The `_.property` iteratee shorthand.
       * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
       * // => [{ 'x': 1 }]
       */
      var intersectionBy = baseRest(function(arrays) {
        var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

        if (iteratee === last(mapped)) {
          iteratee = undefined$1;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0]
          ? baseIntersection(mapped, getIteratee(iteratee, 2))
          : [];
      });

      /**
       * This method is like `_.intersection` except that it accepts `comparator`
       * which is invoked to compare elements of `arrays`. The order and references
       * of result values are determined by the first array. The comparator is
       * invoked with two arguments: (arrVal, othVal).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of intersecting values.
       * @example
       *
       * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
       * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
       *
       * _.intersectionWith(objects, others, _.isEqual);
       * // => [{ 'x': 1, 'y': 2 }]
       */
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0]
          ? baseIntersection(mapped, undefined$1, comparator)
          : [];
      });

      /**
       * Converts all elements in `array` into a string separated by `separator`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to convert.
       * @param {string} [separator=','] The element separator.
       * @returns {string} Returns the joined string.
       * @example
       *
       * _.join(['a', 'b', 'c'], '~');
       * // => 'a~b~c'
       */
      function join(array, separator) {
        return array == null ? '' : nativeJoin.call(array, separator);
      }

      /**
       * Gets the last element of `array`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to query.
       * @returns {*} Returns the last element of `array`.
       * @example
       *
       * _.last([1, 2, 3]);
       * // => 3
       */
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined$1;
      }

      /**
       * This method is like `_.indexOf` except that it iterates over elements of
       * `array` from right to left.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {*} value The value to search for.
       * @param {number} [fromIndex=array.length-1] The index to search from.
       * @returns {number} Returns the index of the matched value, else `-1`.
       * @example
       *
       * _.lastIndexOf([1, 2, 1, 2], 2);
       * // => 3
       *
       * // Search from the `fromIndex`.
       * _.lastIndexOf([1, 2, 1, 2], 2, 2);
       * // => 1
       */
      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length;
        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index =
            index < 0
              ? nativeMax(length + index, 0)
              : nativeMin(index, length - 1);
        }
        return value === value
          ? strictLastIndexOf(array, value, index)
          : baseFindIndex(array, baseIsNaN, index, true);
      }

      /**
       * Gets the element at index `n` of `array`. If `n` is negative, the nth
       * element from the end is returned.
       *
       * @static
       * @memberOf _
       * @since 4.11.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {number} [n=0] The index of the element to return.
       * @returns {*} Returns the nth element of `array`.
       * @example
       *
       * var array = ['a', 'b', 'c', 'd'];
       *
       * _.nth(array, 1);
       * // => 'b'
       *
       * _.nth(array, -2);
       * // => 'c';
       */
      function nth(array, n) {
        return array && array.length
          ? baseNth(array, toInteger(n))
          : undefined$1;
      }

      /**
       * Removes all given values from `array` using
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons.
       *
       * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
       * to remove elements from an array by predicate.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {...*} [values] The values to remove.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
       *
       * _.pull(array, 'a', 'c');
       * console.log(array);
       * // => ['b', 'b']
       */
      var pull = baseRest(pullAll);

      /**
       * This method is like `_.pull` except that it accepts an array of values to remove.
       *
       * **Note:** Unlike `_.difference`, this method mutates `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {Array} values The values to remove.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
       *
       * _.pullAll(array, ['a', 'c']);
       * console.log(array);
       * // => ['b', 'b']
       */
      function pullAll(array, values) {
        return array && array.length && values && values.length
          ? basePullAll(array, values)
          : array;
      }

      /**
       * This method is like `_.pullAll` except that it accepts `iteratee` which is
       * invoked for each element of `array` and `values` to generate the criterion
       * by which they're compared. The iteratee is invoked with one argument: (value).
       *
       * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {Array} values The values to remove.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
       *
       * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
       * console.log(array);
       * // => [{ 'x': 2 }]
       */
      function pullAllBy(array, values, iteratee) {
        return array && array.length && values && values.length
          ? basePullAll(array, values, getIteratee(iteratee, 2))
          : array;
      }

      /**
       * This method is like `_.pullAll` except that it accepts `comparator` which
       * is invoked to compare elements of `array` to `values`. The comparator is
       * invoked with two arguments: (arrVal, othVal).
       *
       * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
       *
       * @static
       * @memberOf _
       * @since 4.6.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {Array} values The values to remove.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
       *
       * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
       * console.log(array);
       * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
       */
      function pullAllWith(array, values, comparator) {
        return array && array.length && values && values.length
          ? basePullAll(array, values, undefined$1, comparator)
          : array;
      }

      /**
       * Removes elements from `array` corresponding to `indexes` and returns an
       * array of removed elements.
       *
       * **Note:** Unlike `_.at`, this method mutates `array`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {...(number|number[])} [indexes] The indexes of elements to remove.
       * @returns {Array} Returns the new array of removed elements.
       * @example
       *
       * var array = ['a', 'b', 'c', 'd'];
       * var pulled = _.pullAt(array, [1, 3]);
       *
       * console.log(array);
       * // => ['a', 'c']
       *
       * console.log(pulled);
       * // => ['b', 'd']
       */
      var pullAt = flatRest(function(array, indexes) {
        var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

        basePullAt(
          array,
          arrayMap(indexes, function(index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending)
        );

        return result;
      });

      /**
       * Removes all elements from `array` that `predicate` returns truthy for
       * and returns an array of the removed elements. The predicate is invoked
       * with three arguments: (value, index, array).
       *
       * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
       * to pull elements from an array by value.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new array of removed elements.
       * @example
       *
       * var array = [1, 2, 3, 4];
       * var evens = _.remove(array, function(n) {
       *   return n % 2 == 0;
       * });
       *
       * console.log(array);
       * // => [1, 3]
       *
       * console.log(evens);
       * // => [2, 4]
       */
      function remove(array, predicate) {
        var result = [];
        if (!(array && array.length)) {
          return result;
        }
        var index = -1,
          indexes = [],
          length = array.length;

        predicate = getIteratee(predicate, 3);
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result.push(value);
            indexes.push(index);
          }
        }
        basePullAt(array, indexes);
        return result;
      }

      /**
       * Reverses `array` so that the first element becomes the last, the second
       * element becomes the second to last, and so on.
       *
       * **Note:** This method mutates `array` and is based on
       * [`Array#reverse`](https://mdn.io/Array/reverse).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to modify.
       * @returns {Array} Returns `array`.
       * @example
       *
       * var array = [1, 2, 3];
       *
       * _.reverse(array);
       * // => [3, 2, 1]
       *
       * console.log(array);
       * // => [3, 2, 1]
       */
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }

      /**
       * Creates a slice of `array` from `start` up to, but not including, `end`.
       *
       * **Note:** This method is used instead of
       * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
       * returned.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to slice.
       * @param {number} [start=0] The start position.
       * @param {number} [end=array.length] The end position.
       * @returns {Array} Returns the slice of `array`.
       */
      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (
          end &&
          typeof end != 'number' &&
          isIterateeCall(array, start, end)
        ) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined$1 ? length : toInteger(end);
        }
        return baseSlice(array, start, end);
      }

      /**
       * Uses a binary search to determine the lowest index at which `value`
       * should be inserted into `array` in order to maintain its sort order.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       * @example
       *
       * _.sortedIndex([30, 50], 40);
       * // => 1
       */
      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }

      /**
       * This method is like `_.sortedIndex` except that it accepts `iteratee`
       * which is invoked for `value` and each element of `array` to compute their
       * sort ranking. The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       * @example
       *
       * var objects = [{ 'x': 4 }, { 'x': 5 }];
       *
       * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
       * // => 0
       *
       * // The `_.property` iteratee shorthand.
       * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
       * // => 0
       */
      function sortedIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
      }

      /**
       * This method is like `_.indexOf` except that it performs a binary
       * search on a sorted `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {*} value The value to search for.
       * @returns {number} Returns the index of the matched value, else `-1`.
       * @example
       *
       * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
       * // => 1
       */
      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value);
          if (index < length && eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }

      /**
       * This method is like `_.sortedIndex` except that it returns the highest
       * index at which `value` should be inserted into `array` in order to
       * maintain its sort order.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       * @example
       *
       * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
       * // => 4
       */
      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }

      /**
       * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
       * which is invoked for `value` and each element of `array` to compute their
       * sort ranking. The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The sorted array to inspect.
       * @param {*} value The value to evaluate.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {number} Returns the index at which `value` should be inserted
       *  into `array`.
       * @example
       *
       * var objects = [{ 'x': 4 }, { 'x': 5 }];
       *
       * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
       * // => 1
       *
       * // The `_.property` iteratee shorthand.
       * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
       * // => 1
       */
      function sortedLastIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
      }

      /**
       * This method is like `_.lastIndexOf` except that it performs a binary
       * search on a sorted `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {*} value The value to search for.
       * @returns {number} Returns the index of the matched value, else `-1`.
       * @example
       *
       * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
       * // => 3
       */
      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value, true) - 1;
          if (eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }

      /**
       * This method is like `_.uniq` except that it's designed and optimized
       * for sorted arrays.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @returns {Array} Returns the new duplicate free array.
       * @example
       *
       * _.sortedUniq([1, 1, 2]);
       * // => [1, 2]
       */
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }

      /**
       * This method is like `_.uniqBy` except that it's designed and optimized
       * for sorted arrays.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {Function} [iteratee] The iteratee invoked per element.
       * @returns {Array} Returns the new duplicate free array.
       * @example
       *
       * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
       * // => [1.1, 2.3]
       */
      function sortedUniqBy(array, iteratee) {
        return array && array.length
          ? baseSortedUniq(array, getIteratee(iteratee, 2))
          : [];
      }

      /**
       * Gets all but the first element of `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.tail([1, 2, 3]);
       * // => [2, 3]
       */
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }

      /**
       * Creates a slice of `array` with `n` elements taken from the beginning.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {number} [n=1] The number of elements to take.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.take([1, 2, 3]);
       * // => [1]
       *
       * _.take([1, 2, 3], 2);
       * // => [1, 2]
       *
       * _.take([1, 2, 3], 5);
       * // => [1, 2, 3]
       *
       * _.take([1, 2, 3], 0);
       * // => []
       */
      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }

      /**
       * Creates a slice of `array` with `n` elements taken from the end.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {number} [n=1] The number of elements to take.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * _.takeRight([1, 2, 3]);
       * // => [3]
       *
       * _.takeRight([1, 2, 3], 2);
       * // => [2, 3]
       *
       * _.takeRight([1, 2, 3], 5);
       * // => [1, 2, 3]
       *
       * _.takeRight([1, 2, 3], 0);
       * // => []
       */
      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }

      /**
       * Creates a slice of `array` with elements taken from the end. Elements are
       * taken until `predicate` returns falsey. The predicate is invoked with
       * three arguments: (value, index, array).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': true },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': false }
       * ];
       *
       * _.takeRightWhile(users, function(o) { return !o.active; });
       * // => objects for ['fred', 'pebbles']
       *
       * // The `_.matches` iteratee shorthand.
       * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
       * // => objects for ['pebbles']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.takeRightWhile(users, ['active', false]);
       * // => objects for ['fred', 'pebbles']
       *
       * // The `_.property` iteratee shorthand.
       * _.takeRightWhile(users, 'active');
       * // => []
       */
      function takeRightWhile(array, predicate) {
        return array && array.length
          ? baseWhile(array, getIteratee(predicate, 3), false, true)
          : [];
      }

      /**
       * Creates a slice of `array` with elements taken from the beginning. Elements
       * are taken until `predicate` returns falsey. The predicate is invoked with
       * three arguments: (value, index, array).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Array
       * @param {Array} array The array to query.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the slice of `array`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'active': false },
       *   { 'user': 'fred',    'active': false },
       *   { 'user': 'pebbles', 'active': true }
       * ];
       *
       * _.takeWhile(users, function(o) { return !o.active; });
       * // => objects for ['barney', 'fred']
       *
       * // The `_.matches` iteratee shorthand.
       * _.takeWhile(users, { 'user': 'barney', 'active': false });
       * // => objects for ['barney']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.takeWhile(users, ['active', false]);
       * // => objects for ['barney', 'fred']
       *
       * // The `_.property` iteratee shorthand.
       * _.takeWhile(users, 'active');
       * // => []
       */
      function takeWhile(array, predicate) {
        return array && array.length
          ? baseWhile(array, getIteratee(predicate, 3))
          : [];
      }

      /**
       * Creates an array of unique values, in order, from all given arrays using
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @returns {Array} Returns the new array of combined values.
       * @example
       *
       * _.union([2], [1, 2]);
       * // => [2, 1]
       */
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });

      /**
       * This method is like `_.union` except that it accepts `iteratee` which is
       * invoked for each element of each `arrays` to generate the criterion by
       * which uniqueness is computed. Result values are chosen from the first
       * array in which the value occurs. The iteratee is invoked with one argument:
       * (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns the new array of combined values.
       * @example
       *
       * _.unionBy([2.1], [1.2, 2.3], Math.floor);
       * // => [2.1, 1.2]
       *
       * // The `_.property` iteratee shorthand.
       * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
       * // => [{ 'x': 1 }, { 'x': 2 }]
       */
      var unionBy = baseRest(function(arrays) {
        var iteratee = last(arrays);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return baseUniq(
          baseFlatten(arrays, 1, isArrayLikeObject, true),
          getIteratee(iteratee, 2)
        );
      });

      /**
       * This method is like `_.union` except that it accepts `comparator` which
       * is invoked to compare elements of `arrays`. Result values are chosen from
       * the first array in which the value occurs. The comparator is invoked
       * with two arguments: (arrVal, othVal).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of combined values.
       * @example
       *
       * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
       * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
       *
       * _.unionWith(objects, others, _.isEqual);
       * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
       */
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseUniq(
          baseFlatten(arrays, 1, isArrayLikeObject, true),
          undefined$1,
          comparator
        );
      });

      /**
       * Creates a duplicate-free version of an array, using
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons, in which only the first occurrence of each element
       * is kept. The order of result values is determined by the order they occur
       * in the array.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @returns {Array} Returns the new duplicate free array.
       * @example
       *
       * _.uniq([2, 1, 2]);
       * // => [2, 1]
       */
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }

      /**
       * This method is like `_.uniq` except that it accepts `iteratee` which is
       * invoked for each element in `array` to generate the criterion by which
       * uniqueness is computed. The order of result values is determined by the
       * order they occur in the array. The iteratee is invoked with one argument:
       * (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns the new duplicate free array.
       * @example
       *
       * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
       * // => [2.1, 1.2]
       *
       * // The `_.property` iteratee shorthand.
       * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
       * // => [{ 'x': 1 }, { 'x': 2 }]
       */
      function uniqBy(array, iteratee) {
        return array && array.length
          ? baseUniq(array, getIteratee(iteratee, 2))
          : [];
      }

      /**
       * This method is like `_.uniq` except that it accepts `comparator` which
       * is invoked to compare elements of `array`. The order of result values is
       * determined by the order they occur in the array.The comparator is invoked
       * with two arguments: (arrVal, othVal).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new duplicate free array.
       * @example
       *
       * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
       *
       * _.uniqWith(objects, _.isEqual);
       * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
       */
      function uniqWith(array, comparator) {
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return array && array.length
          ? baseUniq(array, undefined$1, comparator)
          : [];
      }

      /**
       * This method is like `_.zip` except that it accepts an array of grouped
       * elements and creates an array regrouping the elements to their pre-zip
       * configuration.
       *
       * @static
       * @memberOf _
       * @since 1.2.0
       * @category Array
       * @param {Array} array The array of grouped elements to process.
       * @returns {Array} Returns the new array of regrouped elements.
       * @example
       *
       * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
       * // => [['a', 1, true], ['b', 2, false]]
       *
       * _.unzip(zipped);
       * // => [['a', 'b'], [1, 2], [true, false]]
       */
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index) {
          return arrayMap(array, baseProperty(index));
        });
      }

      /**
       * This method is like `_.unzip` except that it accepts `iteratee` to specify
       * how regrouped values should be combined. The iteratee is invoked with the
       * elements of each group: (...group).
       *
       * @static
       * @memberOf _
       * @since 3.8.0
       * @category Array
       * @param {Array} array The array of grouped elements to process.
       * @param {Function} [iteratee=_.identity] The function to combine
       *  regrouped values.
       * @returns {Array} Returns the new array of regrouped elements.
       * @example
       *
       * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
       * // => [[1, 10, 100], [2, 20, 200]]
       *
       * _.unzipWith(zipped, _.add);
       * // => [3, 30, 300]
       */
      function unzipWith(array, iteratee) {
        if (!(array && array.length)) {
          return [];
        }
        var result = unzip(array);
        if (iteratee == null) {
          return result;
        }
        return arrayMap(result, function(group) {
          return apply(iteratee, undefined$1, group);
        });
      }

      /**
       * Creates an array excluding all given values using
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * for equality comparisons.
       *
       * **Note:** Unlike `_.pull`, this method returns a new array.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {...*} [values] The values to exclude.
       * @returns {Array} Returns the new array of filtered values.
       * @see _.difference, _.xor
       * @example
       *
       * _.without([2, 1, 2, 3], 1, 2);
       * // => [3]
       */
      var without = baseRest(function(array, values) {
        return isArrayLikeObject(array) ? baseDifference(array, values) : [];
      });

      /**
       * Creates an array of unique values that is the
       * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
       * of the given arrays. The order of result values is determined by the order
       * they occur in the arrays.
       *
       * @static
       * @memberOf _
       * @since 2.4.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @returns {Array} Returns the new array of filtered values.
       * @see _.difference, _.without
       * @example
       *
       * _.xor([2, 1], [2, 3]);
       * // => [1, 3]
       */
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });

      /**
       * This method is like `_.xor` except that it accepts `iteratee` which is
       * invoked for each element of each `arrays` to generate the criterion by
       * which by which they're compared. The order of result values is determined
       * by the order they occur in the arrays. The iteratee is invoked with one
       * argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
       * // => [1.2, 3.4]
       *
       * // The `_.property` iteratee shorthand.
       * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
       * // => [{ 'x': 2 }]
       */
      var xorBy = baseRest(function(arrays) {
        var iteratee = last(arrays);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return baseXor(
          arrayFilter(arrays, isArrayLikeObject),
          getIteratee(iteratee, 2)
        );
      });

      /**
       * This method is like `_.xor` except that it accepts `comparator` which is
       * invoked to compare elements of `arrays`. The order of result values is
       * determined by the order they occur in the arrays. The comparator is invoked
       * with two arguments: (arrVal, othVal).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Array
       * @param {...Array} [arrays] The arrays to inspect.
       * @param {Function} [comparator] The comparator invoked per element.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
       * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
       *
       * _.xorWith(objects, others, _.isEqual);
       * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
       */
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseXor(
          arrayFilter(arrays, isArrayLikeObject),
          undefined$1,
          comparator
        );
      });

      /**
       * Creates an array of grouped elements, the first of which contains the
       * first elements of the given arrays, the second of which contains the
       * second elements of the given arrays, and so on.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Array
       * @param {...Array} [arrays] The arrays to process.
       * @returns {Array} Returns the new array of grouped elements.
       * @example
       *
       * _.zip(['a', 'b'], [1, 2], [true, false]);
       * // => [['a', 1, true], ['b', 2, false]]
       */
      var zip = baseRest(unzip);

      /**
       * This method is like `_.fromPairs` except that it accepts two arrays,
       * one of property identifiers and one of corresponding values.
       *
       * @static
       * @memberOf _
       * @since 0.4.0
       * @category Array
       * @param {Array} [props=[]] The property identifiers.
       * @param {Array} [values=[]] The property values.
       * @returns {Object} Returns the new object.
       * @example
       *
       * _.zipObject(['a', 'b'], [1, 2]);
       * // => { 'a': 1, 'b': 2 }
       */
      function zipObject(props, values) {
        return baseZipObject(props || [], values || [], assignValue);
      }

      /**
       * This method is like `_.zipObject` except that it supports property paths.
       *
       * @static
       * @memberOf _
       * @since 4.1.0
       * @category Array
       * @param {Array} [props=[]] The property identifiers.
       * @param {Array} [values=[]] The property values.
       * @returns {Object} Returns the new object.
       * @example
       *
       * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
       * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
       */
      function zipObjectDeep(props, values) {
        return baseZipObject(props || [], values || [], baseSet);
      }

      /**
       * This method is like `_.zip` except that it accepts `iteratee` to specify
       * how grouped values should be combined. The iteratee is invoked with the
       * elements of each group: (...group).
       *
       * @static
       * @memberOf _
       * @since 3.8.0
       * @category Array
       * @param {...Array} [arrays] The arrays to process.
       * @param {Function} [iteratee=_.identity] The function to combine
       *  grouped values.
       * @returns {Array} Returns the new array of grouped elements.
       * @example
       *
       * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
       *   return a + b + c;
       * });
       * // => [111, 222]
       */
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined$1;

        iteratee =
          typeof iteratee == 'function'
            ? (arrays.pop(), iteratee)
            : undefined$1;
        return unzipWith(arrays, iteratee);
      });

      /*------------------------------------------------------------------------*/

      /**
       * Creates a `lodash` wrapper instance that wraps `value` with explicit method
       * chain sequences enabled. The result of such sequences must be unwrapped
       * with `_#value`.
       *
       * @static
       * @memberOf _
       * @since 1.3.0
       * @category Seq
       * @param {*} value The value to wrap.
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'age': 36 },
       *   { 'user': 'fred',    'age': 40 },
       *   { 'user': 'pebbles', 'age': 1 }
       * ];
       *
       * var youngest = _
       *   .chain(users)
       *   .sortBy('age')
       *   .map(function(o) {
       *     return o.user + ' is ' + o.age;
       *   })
       *   .head()
       *   .value();
       * // => 'pebbles is 1'
       */
      function chain(value) {
        var result = lodash(value);
        result.__chain__ = true;
        return result;
      }

      /**
       * This method invokes `interceptor` and returns `value`. The interceptor
       * is invoked with one argument; (value). The purpose of this method is to
       * "tap into" a method chain sequence in order to modify intermediate results.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Seq
       * @param {*} value The value to provide to `interceptor`.
       * @param {Function} interceptor The function to invoke.
       * @returns {*} Returns `value`.
       * @example
       *
       * _([1, 2, 3])
       *  .tap(function(array) {
       *    // Mutate input array.
       *    array.pop();
       *  })
       *  .reverse()
       *  .value();
       * // => [2, 1]
       */
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }

      /**
       * This method is like `_.tap` except that it returns the result of `interceptor`.
       * The purpose of this method is to "pass thru" values replacing intermediate
       * results in a method chain sequence.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Seq
       * @param {*} value The value to provide to `interceptor`.
       * @param {Function} interceptor The function to invoke.
       * @returns {*} Returns the result of `interceptor`.
       * @example
       *
       * _('  abc  ')
       *  .chain()
       *  .trim()
       *  .thru(function(value) {
       *    return [value];
       *  })
       *  .value();
       * // => ['abc']
       */
      function thru(value, interceptor) {
        return interceptor(value);
      }

      /**
       * This method is the wrapper version of `_.at`.
       *
       * @name at
       * @memberOf _
       * @since 1.0.0
       * @category Seq
       * @param {...(string|string[])} [paths] The property paths to pick.
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
       *
       * _(object).at(['a[0].b.c', 'a[1]']).value();
       * // => [3, 4]
       */
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) {
            return baseAt(object, paths);
          };

        if (
          length > 1 ||
          this.__actions__.length ||
          !(value instanceof LazyWrapper) ||
          !isIndex(start)
        ) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          func: thru,
          args: [interceptor],
          thisArg: undefined$1,
        });
        return new LodashWrapper(value, this.__chain__).thru(function(array) {
          if (length && !array.length) {
            array.push(undefined$1);
          }
          return array;
        });
      });

      /**
       * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
       *
       * @name chain
       * @memberOf _
       * @since 0.1.0
       * @category Seq
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * var users = [
       *   { 'user': 'barney', 'age': 36 },
       *   { 'user': 'fred',   'age': 40 }
       * ];
       *
       * // A sequence without explicit chaining.
       * _(users).head();
       * // => { 'user': 'barney', 'age': 36 }
       *
       * // A sequence with explicit chaining.
       * _(users)
       *   .chain()
       *   .head()
       *   .pick('user')
       *   .value();
       * // => { 'user': 'barney' }
       */
      function wrapperChain() {
        return chain(this);
      }

      /**
       * Executes the chain sequence and returns the wrapped result.
       *
       * @name commit
       * @memberOf _
       * @since 3.2.0
       * @category Seq
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * var array = [1, 2];
       * var wrapped = _(array).push(3);
       *
       * console.log(array);
       * // => [1, 2]
       *
       * wrapped = wrapped.commit();
       * console.log(array);
       * // => [1, 2, 3]
       *
       * wrapped.last();
       * // => 3
       *
       * console.log(array);
       * // => [1, 2, 3]
       */
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }

      /**
       * Gets the next value on a wrapped object following the
       * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
       *
       * @name next
       * @memberOf _
       * @since 4.0.0
       * @category Seq
       * @returns {Object} Returns the next iterator value.
       * @example
       *
       * var wrapped = _([1, 2]);
       *
       * wrapped.next();
       * // => { 'done': false, 'value': 1 }
       *
       * wrapped.next();
       * // => { 'done': false, 'value': 2 }
       *
       * wrapped.next();
       * // => { 'done': true, 'value': undefined }
       */
      function wrapperNext() {
        if (this.__values__ === undefined$1) {
          this.__values__ = toArray(this.value());
        }
        var done = this.__index__ >= this.__values__.length,
          value = done ? undefined$1 : this.__values__[this.__index__++];

        return { done: done, value: value };
      }

      /**
       * Enables the wrapper to be iterable.
       *
       * @name Symbol.iterator
       * @memberOf _
       * @since 4.0.0
       * @category Seq
       * @returns {Object} Returns the wrapper object.
       * @example
       *
       * var wrapped = _([1, 2]);
       *
       * wrapped[Symbol.iterator]() === wrapped;
       * // => true
       *
       * Array.from(wrapped);
       * // => [1, 2]
       */
      function wrapperToIterator() {
        return this;
      }

      /**
       * Creates a clone of the chain sequence planting `value` as the wrapped value.
       *
       * @name plant
       * @memberOf _
       * @since 3.2.0
       * @category Seq
       * @param {*} value The value to plant.
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * var wrapped = _([1, 2]).map(square);
       * var other = wrapped.plant([3, 4]);
       *
       * other.value();
       * // => [9, 16]
       *
       * wrapped.value();
       * // => [1, 4]
       */
      function wrapperPlant(value) {
        var result,
          parent = this;

        while (parent instanceof baseLodash) {
          var clone = wrapperClone(parent);
          clone.__index__ = 0;
          clone.__values__ = undefined$1;
          if (result) {
            previous.__wrapped__ = clone;
          } else {
            result = clone;
          }
          var previous = clone;
          parent = parent.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result;
      }

      /**
       * This method is the wrapper version of `_.reverse`.
       *
       * **Note:** This method mutates the wrapped array.
       *
       * @name reverse
       * @memberOf _
       * @since 0.1.0
       * @category Seq
       * @returns {Object} Returns the new `lodash` wrapper instance.
       * @example
       *
       * var array = [1, 2, 3];
       *
       * _(array).reverse().value()
       * // => [3, 2, 1]
       *
       * console.log(array);
       * // => [3, 2, 1]
       */
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            func: thru,
            args: [reverse],
            thisArg: undefined$1,
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }

      /**
       * Executes the chain sequence to resolve the unwrapped value.
       *
       * @name value
       * @memberOf _
       * @since 0.1.0
       * @alias toJSON, valueOf
       * @category Seq
       * @returns {*} Returns the resolved unwrapped value.
       * @example
       *
       * _([1, 2, 3]).value();
       * // => [1, 2, 3]
       */
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }

      /*------------------------------------------------------------------------*/

      /**
       * Creates an object composed of keys generated from the results of running
       * each element of `collection` thru `iteratee`. The corresponding value of
       * each key is the number of times the key was returned by `iteratee`. The
       * iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 0.5.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
       * @returns {Object} Returns the composed aggregate object.
       * @example
       *
       * _.countBy([6.1, 4.2, 6.3], Math.floor);
       * // => { '4': 1, '6': 2 }
       *
       * // The `_.property` iteratee shorthand.
       * _.countBy(['one', 'two', 'three'], 'length');
       * // => { '3': 2, '5': 1 }
       */
      var countBy = createAggregator(function(result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          ++result[key];
        } else {
          baseAssignValue(result, key, 1);
        }
      });

      /**
       * Checks if `predicate` returns truthy for **all** elements of `collection`.
       * Iteration is stopped once `predicate` returns falsey. The predicate is
       * invoked with three arguments: (value, index|key, collection).
       *
       * **Note:** This method returns `true` for
       * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
       * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
       * elements of empty collections.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {boolean} Returns `true` if all elements pass the predicate check,
       *  else `false`.
       * @example
       *
       * _.every([true, 1, null, 'yes'], Boolean);
       * // => false
       *
       * var users = [
       *   { 'user': 'barney', 'age': 36, 'active': false },
       *   { 'user': 'fred',   'age': 40, 'active': false }
       * ];
       *
       * // The `_.matches` iteratee shorthand.
       * _.every(users, { 'user': 'barney', 'active': false });
       * // => false
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.every(users, ['active', false]);
       * // => true
       *
       * // The `_.property` iteratee shorthand.
       * _.every(users, 'active');
       * // => false
       */
      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }

      /**
       * Iterates over elements of `collection`, returning an array of all elements
       * `predicate` returns truthy for. The predicate is invoked with three
       * arguments: (value, index|key, collection).
       *
       * **Note:** Unlike `_.remove`, this method returns a new array.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new filtered array.
       * @see _.reject
       * @example
       *
       * var users = [
       *   { 'user': 'barney', 'age': 36, 'active': true },
       *   { 'user': 'fred',   'age': 40, 'active': false }
       * ];
       *
       * _.filter(users, function(o) { return !o.active; });
       * // => objects for ['fred']
       *
       * // The `_.matches` iteratee shorthand.
       * _.filter(users, { 'age': 36, 'active': true });
       * // => objects for ['barney']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.filter(users, ['active', false]);
       * // => objects for ['fred']
       *
       * // The `_.property` iteratee shorthand.
       * _.filter(users, 'active');
       * // => objects for ['barney']
       */
      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }

      /**
       * Iterates over elements of `collection`, returning the first element
       * `predicate` returns truthy for. The predicate is invoked with three
       * arguments: (value, index|key, collection).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param {number} [fromIndex=0] The index to search from.
       * @returns {*} Returns the matched element, else `undefined`.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'age': 36, 'active': true },
       *   { 'user': 'fred',    'age': 40, 'active': false },
       *   { 'user': 'pebbles', 'age': 1,  'active': true }
       * ];
       *
       * _.find(users, function(o) { return o.age < 40; });
       * // => object for 'barney'
       *
       * // The `_.matches` iteratee shorthand.
       * _.find(users, { 'age': 1, 'active': true });
       * // => object for 'pebbles'
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.find(users, ['active', false]);
       * // => object for 'fred'
       *
       * // The `_.property` iteratee shorthand.
       * _.find(users, 'active');
       * // => object for 'barney'
       */
      var find = createFind(findIndex);

      /**
       * This method is like `_.find` except that it iterates over elements of
       * `collection` from right to left.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param {number} [fromIndex=collection.length-1] The index to search from.
       * @returns {*} Returns the matched element, else `undefined`.
       * @example
       *
       * _.findLast([1, 2, 3, 4], function(n) {
       *   return n % 2 == 1;
       * });
       * // => 3
       */
      var findLast = createFind(findLastIndex);

      /**
       * Creates a flattened array of values by running each element in `collection`
       * thru `iteratee` and flattening the mapped results. The iteratee is invoked
       * with three arguments: (value, index|key, collection).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * function duplicate(n) {
       *   return [n, n];
       * }
       *
       * _.flatMap([1, 2], duplicate);
       * // => [1, 1, 2, 2]
       */
      function flatMap(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), 1);
      }

      /**
       * This method is like `_.flatMap` except that it recursively flattens the
       * mapped results.
       *
       * @static
       * @memberOf _
       * @since 4.7.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * function duplicate(n) {
       *   return [[[n, n]]];
       * }
       *
       * _.flatMapDeep([1, 2], duplicate);
       * // => [1, 1, 2, 2]
       */
      function flatMapDeep(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), INFINITY);
      }

      /**
       * This method is like `_.flatMap` except that it recursively flattens the
       * mapped results up to `depth` times.
       *
       * @static
       * @memberOf _
       * @since 4.7.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @param {number} [depth=1] The maximum recursion depth.
       * @returns {Array} Returns the new flattened array.
       * @example
       *
       * function duplicate(n) {
       *   return [[[n, n]]];
       * }
       *
       * _.flatMapDepth([1, 2], duplicate, 2);
       * // => [[1, 1], [2, 2]]
       */
      function flatMapDepth(collection, iteratee, depth) {
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee), depth);
      }

      /**
       * Iterates over elements of `collection` and invokes `iteratee` for each element.
       * The iteratee is invoked with three arguments: (value, index|key, collection).
       * Iteratee functions may exit iteration early by explicitly returning `false`.
       *
       * **Note:** As with other "Collections" methods, objects with a "length"
       * property are iterated like arrays. To avoid this behavior use `_.forIn`
       * or `_.forOwn` for object iteration.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @alias each
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array|Object} Returns `collection`.
       * @see _.forEachRight
       * @example
       *
       * _.forEach([1, 2], function(value) {
       *   console.log(value);
       * });
       * // => Logs `1` then `2`.
       *
       * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
       *   console.log(key);
       * });
       * // => Logs 'a' then 'b' (iteration order is not guaranteed).
       */
      function forEach(collection, iteratee) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee, 3));
      }

      /**
       * This method is like `_.forEach` except that it iterates over elements of
       * `collection` from right to left.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @alias eachRight
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array|Object} Returns `collection`.
       * @see _.forEach
       * @example
       *
       * _.forEachRight([1, 2], function(value) {
       *   console.log(value);
       * });
       * // => Logs `2` then `1`.
       */
      function forEachRight(collection, iteratee) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee, 3));
      }

      /**
       * Creates an object composed of keys generated from the results of running
       * each element of `collection` thru `iteratee`. The order of grouped values
       * is determined by the order they occur in `collection`. The corresponding
       * value of each key is an array of elements responsible for generating the
       * key. The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
       * @returns {Object} Returns the composed aggregate object.
       * @example
       *
       * _.groupBy([6.1, 4.2, 6.3], Math.floor);
       * // => { '4': [4.2], '6': [6.1, 6.3] }
       *
       * // The `_.property` iteratee shorthand.
       * _.groupBy(['one', 'two', 'three'], 'length');
       * // => { '3': ['one', 'two'], '5': ['three'] }
       */
      var groupBy = createAggregator(function(result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          result[key].push(value);
        } else {
          baseAssignValue(result, key, [value]);
        }
      });

      /**
       * Checks if `value` is in `collection`. If `collection` is a string, it's
       * checked for a substring of `value`, otherwise
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * is used for equality comparisons. If `fromIndex` is negative, it's used as
       * the offset from the end of `collection`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object|string} collection The collection to inspect.
       * @param {*} value The value to search for.
       * @param {number} [fromIndex=0] The index to search from.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
       * @returns {boolean} Returns `true` if `value` is found, else `false`.
       * @example
       *
       * _.includes([1, 2, 3], 1);
       * // => true
       *
       * _.includes([1, 2, 3], 1, 2);
       * // => false
       *
       * _.includes({ 'a': 1, 'b': 2 }, 1);
       * // => true
       *
       * _.includes('abcd', 'bc');
       * // => true
       */
      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;

        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection)
          ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1
          : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }

      /**
       * Invokes the method at `path` of each element in `collection`, returning
       * an array of the results of each invoked method. Any additional arguments
       * are provided to each invoked method. If `path` is a function, it's invoked
       * for, and `this` bound to, each element in `collection`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Array|Function|string} path The path of the method to invoke or
       *  the function invoked per iteration.
       * @param {...*} [args] The arguments to invoke each method with.
       * @returns {Array} Returns the array of results.
       * @example
       *
       * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
       * // => [[1, 5, 7], [1, 2, 3]]
       *
       * _.invokeMap([123, 456], String.prototype.split, '');
       * // => [['1', '2', '3'], ['4', '5', '6']]
       */
      var invokeMap = baseRest(function(collection, path, args) {
        var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

        baseEach(collection, function(value) {
          result[++index] = isFunc
            ? apply(path, value, args)
            : baseInvoke(value, path, args);
        });
        return result;
      });

      /**
       * Creates an object composed of keys generated from the results of running
       * each element of `collection` thru `iteratee`. The corresponding value of
       * each key is the last element responsible for generating the key. The
       * iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
       * @returns {Object} Returns the composed aggregate object.
       * @example
       *
       * var array = [
       *   { 'dir': 'left', 'code': 97 },
       *   { 'dir': 'right', 'code': 100 }
       * ];
       *
       * _.keyBy(array, function(o) {
       *   return String.fromCharCode(o.code);
       * });
       * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
       *
       * _.keyBy(array, 'dir');
       * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
       */
      var keyBy = createAggregator(function(result, value, key) {
        baseAssignValue(result, key, value);
      });

      /**
       * Creates an array of values by running each element in `collection` thru
       * `iteratee`. The iteratee is invoked with three arguments:
       * (value, index|key, collection).
       *
       * Many lodash methods are guarded to work as iteratees for methods like
       * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
       *
       * The guarded methods are:
       * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
       * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
       * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
       * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new mapped array.
       * @example
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * _.map([4, 8], square);
       * // => [16, 64]
       *
       * _.map({ 'a': 4, 'b': 8 }, square);
       * // => [16, 64] (iteration order is not guaranteed)
       *
       * var users = [
       *   { 'user': 'barney' },
       *   { 'user': 'fred' }
       * ];
       *
       * // The `_.property` iteratee shorthand.
       * _.map(users, 'user');
       * // => ['barney', 'fred']
       */
      function map(collection, iteratee) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee, 3));
      }

      /**
       * This method is like `_.sortBy` except that it allows specifying the sort
       * orders of the iteratees to sort by. If `orders` is unspecified, all values
       * are sorted in ascending order. Otherwise, specify an order of "desc" for
       * descending or "asc" for ascending sort order of corresponding values.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
       *  The iteratees to sort by.
       * @param {string[]} [orders] The sort orders of `iteratees`.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
       * @returns {Array} Returns the new sorted array.
       * @example
       *
       * var users = [
       *   { 'user': 'fred',   'age': 48 },
       *   { 'user': 'barney', 'age': 34 },
       *   { 'user': 'fred',   'age': 40 },
       *   { 'user': 'barney', 'age': 36 }
       * ];
       *
       * // Sort by `user` in ascending order and by `age` in descending order.
       * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
       * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
       */
      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? undefined$1 : orders;
        if (!isArray(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection, iteratees, orders);
      }

      /**
       * Creates an array of elements split into two groups, the first of which
       * contains elements `predicate` returns truthy for, the second of which
       * contains elements `predicate` returns falsey for. The predicate is
       * invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the array of grouped elements.
       * @example
       *
       * var users = [
       *   { 'user': 'barney',  'age': 36, 'active': false },
       *   { 'user': 'fred',    'age': 40, 'active': true },
       *   { 'user': 'pebbles', 'age': 1,  'active': false }
       * ];
       *
       * _.partition(users, function(o) { return o.active; });
       * // => objects for [['fred'], ['barney', 'pebbles']]
       *
       * // The `_.matches` iteratee shorthand.
       * _.partition(users, { 'age': 1, 'active': false });
       * // => objects for [['pebbles'], ['barney', 'fred']]
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.partition(users, ['active', false]);
       * // => objects for [['barney', 'pebbles'], ['fred']]
       *
       * // The `_.property` iteratee shorthand.
       * _.partition(users, 'active');
       * // => objects for [['fred'], ['barney', 'pebbles']]
       */
      var partition = createAggregator(
        function(result, value, key) {
          result[key ? 0 : 1].push(value);
        },
        function() {
          return [[], []];
        }
      );

      /**
       * Reduces `collection` to a value which is the accumulated result of running
       * each element in `collection` thru `iteratee`, where each successive
       * invocation is supplied the return value of the previous. If `accumulator`
       * is not given, the first element of `collection` is used as the initial
       * value. The iteratee is invoked with four arguments:
       * (accumulator, value, index|key, collection).
       *
       * Many lodash methods are guarded to work as iteratees for methods like
       * `_.reduce`, `_.reduceRight`, and `_.transform`.
       *
       * The guarded methods are:
       * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
       * and `sortBy`
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @param {*} [accumulator] The initial value.
       * @returns {*} Returns the accumulated value.
       * @see _.reduceRight
       * @example
       *
       * _.reduce([1, 2], function(sum, n) {
       *   return sum + n;
       * }, 0);
       * // => 3
       *
       * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
       *   (result[value] || (result[value] = [])).push(key);
       *   return result;
       * }, {});
       * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
       */
      function reduce(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

        return func(
          collection,
          getIteratee(iteratee, 4),
          accumulator,
          initAccum,
          baseEach
        );
      }

      /**
       * This method is like `_.reduce` except that it iterates over elements of
       * `collection` from right to left.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @param {*} [accumulator] The initial value.
       * @returns {*} Returns the accumulated value.
       * @see _.reduce
       * @example
       *
       * var array = [[0, 1], [2, 3], [4, 5]];
       *
       * _.reduceRight(array, function(flattened, other) {
       *   return flattened.concat(other);
       * }, []);
       * // => [4, 5, 2, 3, 0, 1]
       */
      function reduceRight(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

        return func(
          collection,
          getIteratee(iteratee, 4),
          accumulator,
          initAccum,
          baseEachRight
        );
      }

      /**
       * The opposite of `_.filter`; this method returns the elements of `collection`
       * that `predicate` does **not** return truthy for.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the new filtered array.
       * @see _.filter
       * @example
       *
       * var users = [
       *   { 'user': 'barney', 'age': 36, 'active': false },
       *   { 'user': 'fred',   'age': 40, 'active': true }
       * ];
       *
       * _.reject(users, function(o) { return !o.active; });
       * // => objects for ['fred']
       *
       * // The `_.matches` iteratee shorthand.
       * _.reject(users, { 'age': 40, 'active': true });
       * // => objects for ['barney']
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.reject(users, ['active', false]);
       * // => objects for ['fred']
       *
       * // The `_.property` iteratee shorthand.
       * _.reject(users, 'active');
       * // => objects for ['barney']
       */
      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }

      /**
       * Gets a random element from `collection`.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to sample.
       * @returns {*} Returns the random element.
       * @example
       *
       * _.sample([1, 2, 3, 4]);
       * // => 2
       */
      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }

      /**
       * Gets `n` random elements at unique keys from `collection` up to the
       * size of `collection`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Collection
       * @param {Array|Object} collection The collection to sample.
       * @param {number} [n=1] The number of elements to sample.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the random elements.
       * @example
       *
       * _.sampleSize([1, 2, 3], 2);
       * // => [3, 1]
       *
       * _.sampleSize([1, 2, 3], 4);
       * // => [2, 3, 1]
       */
      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }

      /**
       * Creates an array of shuffled values, using a version of the
       * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to shuffle.
       * @returns {Array} Returns the new shuffled array.
       * @example
       *
       * _.shuffle([1, 2, 3, 4]);
       * // => [4, 1, 3, 2]
       */
      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }

      /**
       * Gets the size of `collection` by returning its length for array-like
       * values or the number of own enumerable string keyed properties for objects.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object|string} collection The collection to inspect.
       * @returns {number} Returns the collection size.
       * @example
       *
       * _.size([1, 2, 3]);
       * // => 3
       *
       * _.size({ 'a': 1, 'b': 2 });
       * // => 2
       *
       * _.size('pebbles');
       * // => 7
       */
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection)
            ? stringSize(collection)
            : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }

      /**
       * Checks if `predicate` returns truthy for **any** element of `collection`.
       * Iteration is stopped once `predicate` returns truthy. The predicate is
       * invoked with three arguments: (value, index|key, collection).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {boolean} Returns `true` if any element passes the predicate check,
       *  else `false`.
       * @example
       *
       * _.some([null, 0, 'yes', false], Boolean);
       * // => true
       *
       * var users = [
       *   { 'user': 'barney', 'active': true },
       *   { 'user': 'fred',   'active': false }
       * ];
       *
       * // The `_.matches` iteratee shorthand.
       * _.some(users, { 'user': 'barney', 'active': false });
       * // => false
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.some(users, ['active', false]);
       * // => true
       *
       * // The `_.property` iteratee shorthand.
       * _.some(users, 'active');
       * // => true
       */
      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }

      /**
       * Creates an array of elements, sorted in ascending order by the results of
       * running each element in a collection thru each iteratee. This method
       * performs a stable sort, that is, it preserves the original sort order of
       * equal elements. The iteratees are invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Collection
       * @param {Array|Object} collection The collection to iterate over.
       * @param {...(Function|Function[])} [iteratees=[_.identity]]
       *  The iteratees to sort by.
       * @returns {Array} Returns the new sorted array.
       * @example
       *
       * var users = [
       *   { 'user': 'fred',   'age': 48 },
       *   { 'user': 'barney', 'age': 36 },
       *   { 'user': 'fred',   'age': 40 },
       *   { 'user': 'barney', 'age': 34 }
       * ];
       *
       * _.sortBy(users, [function(o) { return o.user; }]);
       * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
       *
       * _.sortBy(users, ['user', 'age']);
       * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
       */
      var sortBy = baseRest(function(collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (
          length > 1 &&
          isIterateeCall(collection, iteratees[0], iteratees[1])
        ) {
          iteratees = [];
        } else if (
          length > 2 &&
          isIterateeCall(iteratees[0], iteratees[1], iteratees[2])
        ) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });

      /*------------------------------------------------------------------------*/

      /**
       * Gets the timestamp of the number of milliseconds that have elapsed since
       * the Unix epoch (1 January 1970 00:00:00 UTC).
       *
       * @static
       * @memberOf _
       * @since 2.4.0
       * @category Date
       * @returns {number} Returns the timestamp.
       * @example
       *
       * _.defer(function(stamp) {
       *   console.log(_.now() - stamp);
       * }, _.now());
       * // => Logs the number of milliseconds it took for the deferred invocation.
       */
      var now =
        ctxNow ||
        function() {
          return root.Date.now();
        };

      /*------------------------------------------------------------------------*/

      /**
       * The opposite of `_.before`; this method creates a function that invokes
       * `func` once it's called `n` or more times.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {number} n The number of calls before `func` is invoked.
       * @param {Function} func The function to restrict.
       * @returns {Function} Returns the new restricted function.
       * @example
       *
       * var saves = ['profile', 'settings'];
       *
       * var done = _.after(saves.length, function() {
       *   console.log('done saving!');
       * });
       *
       * _.forEach(saves, function(type) {
       *   asyncSave({ 'type': type, 'complete': done });
       * });
       * // => Logs 'done saving!' after the two async saves have completed.
       */
      function after(n, func) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }

      /**
       * Creates a function that invokes `func`, with up to `n` arguments,
       * ignoring any additional arguments.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Function
       * @param {Function} func The function to cap arguments for.
       * @param {number} [n=func.length] The arity cap.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Function} Returns the new capped function.
       * @example
       *
       * _.map(['6', '8', '10'], _.ary(parseInt, 1));
       * // => [6, 8, 10]
       */
      function ary(func, n, guard) {
        n = guard ? undefined$1 : n;
        n = func && n == null ? func.length : n;
        return createWrap(
          func,
          WRAP_ARY_FLAG,
          undefined$1,
          undefined$1,
          undefined$1,
          undefined$1,
          n
        );
      }

      /**
       * Creates a function that invokes `func`, with the `this` binding and arguments
       * of the created function, while it's called less than `n` times. Subsequent
       * calls to the created function return the result of the last `func` invocation.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Function
       * @param {number} n The number of calls at which `func` is no longer invoked.
       * @param {Function} func The function to restrict.
       * @returns {Function} Returns the new restricted function.
       * @example
       *
       * jQuery(element).on('click', _.before(5, addContactToList));
       * // => Allows adding up to 4 contacts to the list.
       */
      function before(n, func) {
        var result;
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n > 0) {
            result = func.apply(this, arguments);
          }
          if (n <= 1) {
            func = undefined$1;
          }
          return result;
        };
      }

      /**
       * Creates a function that invokes `func` with the `this` binding of `thisArg`
       * and `partials` prepended to the arguments it receives.
       *
       * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
       * may be used as a placeholder for partially applied arguments.
       *
       * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
       * property of bound functions.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to bind.
       * @param {*} thisArg The `this` binding of `func`.
       * @param {...*} [partials] The arguments to be partially applied.
       * @returns {Function} Returns the new bound function.
       * @example
       *
       * function greet(greeting, punctuation) {
       *   return greeting + ' ' + this.user + punctuation;
       * }
       *
       * var object = { 'user': 'fred' };
       *
       * var bound = _.bind(greet, object, 'hi');
       * bound('!');
       * // => 'hi fred!'
       *
       * // Bound with placeholders.
       * var bound = _.bind(greet, object, _, '!');
       * bound('hi');
       * // => 'hi fred!'
       */
      var bind = baseRest(function(func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });

      /**
       * Creates a function that invokes the method at `object[key]` with `partials`
       * prepended to the arguments it receives.
       *
       * This method differs from `_.bind` by allowing bound functions to reference
       * methods that may be redefined or don't yet exist. See
       * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
       * for more details.
       *
       * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
       * builds, may be used as a placeholder for partially applied arguments.
       *
       * @static
       * @memberOf _
       * @since 0.10.0
       * @category Function
       * @param {Object} object The object to invoke the method on.
       * @param {string} key The key of the method.
       * @param {...*} [partials] The arguments to be partially applied.
       * @returns {Function} Returns the new bound function.
       * @example
       *
       * var object = {
       *   'user': 'fred',
       *   'greet': function(greeting, punctuation) {
       *     return greeting + ' ' + this.user + punctuation;
       *   }
       * };
       *
       * var bound = _.bindKey(object, 'greet', 'hi');
       * bound('!');
       * // => 'hi fred!'
       *
       * object.greet = function(greeting, punctuation) {
       *   return greeting + 'ya ' + this.user + punctuation;
       * };
       *
       * bound('!');
       * // => 'hiya fred!'
       *
       * // Bound with placeholders.
       * var bound = _.bindKey(object, 'greet', _, '!');
       * bound('hi');
       * // => 'hiya fred!'
       */
      var bindKey = baseRest(function(object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });

      /**
       * Creates a function that accepts arguments of `func` and either invokes
       * `func` returning its result, if at least `arity` number of arguments have
       * been provided, or returns a function that accepts the remaining `func`
       * arguments, and so on. The arity of `func` may be specified if `func.length`
       * is not sufficient.
       *
       * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
       * may be used as a placeholder for provided arguments.
       *
       * **Note:** This method doesn't set the "length" property of curried functions.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Function
       * @param {Function} func The function to curry.
       * @param {number} [arity=func.length] The arity of `func`.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Function} Returns the new curried function.
       * @example
       *
       * var abc = function(a, b, c) {
       *   return [a, b, c];
       * };
       *
       * var curried = _.curry(abc);
       *
       * curried(1)(2)(3);
       * // => [1, 2, 3]
       *
       * curried(1, 2)(3);
       * // => [1, 2, 3]
       *
       * curried(1, 2, 3);
       * // => [1, 2, 3]
       *
       * // Curried with placeholders.
       * curried(1)(_, 3)(2);
       * // => [1, 2, 3]
       */
      function curry(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(
          func,
          WRAP_CURRY_FLAG,
          undefined$1,
          undefined$1,
          undefined$1,
          undefined$1,
          undefined$1,
          arity
        );
        result.placeholder = curry.placeholder;
        return result;
      }

      /**
       * This method is like `_.curry` except that arguments are applied to `func`
       * in the manner of `_.partialRight` instead of `_.partial`.
       *
       * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
       * builds, may be used as a placeholder for provided arguments.
       *
       * **Note:** This method doesn't set the "length" property of curried functions.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Function
       * @param {Function} func The function to curry.
       * @param {number} [arity=func.length] The arity of `func`.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Function} Returns the new curried function.
       * @example
       *
       * var abc = function(a, b, c) {
       *   return [a, b, c];
       * };
       *
       * var curried = _.curryRight(abc);
       *
       * curried(3)(2)(1);
       * // => [1, 2, 3]
       *
       * curried(2, 3)(1);
       * // => [1, 2, 3]
       *
       * curried(1, 2, 3);
       * // => [1, 2, 3]
       *
       * // Curried with placeholders.
       * curried(3)(1, _)(2);
       * // => [1, 2, 3]
       */
      function curryRight(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(
          func,
          WRAP_CURRY_RIGHT_FLAG,
          undefined$1,
          undefined$1,
          undefined$1,
          undefined$1,
          undefined$1,
          arity
        );
        result.placeholder = curryRight.placeholder;
        return result;
      }

      /**
       * Creates a debounced function that delays invoking `func` until after `wait`
       * milliseconds have elapsed since the last time the debounced function was
       * invoked. The debounced function comes with a `cancel` method to cancel
       * delayed `func` invocations and a `flush` method to immediately invoke them.
       * Provide `options` to indicate whether `func` should be invoked on the
       * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
       * with the last arguments provided to the debounced function. Subsequent
       * calls to the debounced function return the result of the last `func`
       * invocation.
       *
       * **Note:** If `leading` and `trailing` options are `true`, `func` is
       * invoked on the trailing edge of the timeout only if the debounced function
       * is invoked more than once during the `wait` timeout.
       *
       * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
       * until to the next tick, similar to `setTimeout` with a timeout of `0`.
       *
       * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
       * for details over the differences between `_.debounce` and `_.throttle`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to debounce.
       * @param {number} [wait=0] The number of milliseconds to delay.
       * @param {Object} [options={}] The options object.
       * @param {boolean} [options.leading=false]
       *  Specify invoking on the leading edge of the timeout.
       * @param {number} [options.maxWait]
       *  The maximum time `func` is allowed to be delayed before it's invoked.
       * @param {boolean} [options.trailing=true]
       *  Specify invoking on the trailing edge of the timeout.
       * @returns {Function} Returns the new debounced function.
       * @example
       *
       * // Avoid costly calculations while the window size is in flux.
       * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
       *
       * // Invoke `sendMail` when clicked, debouncing subsequent calls.
       * jQuery(element).on('click', _.debounce(sendMail, 300, {
       *   'leading': true,
       *   'trailing': false
       * }));
       *
       * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
       * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
       * var source = new EventSource('/stream');
       * jQuery(source).on('message', debounced);
       *
       * // Cancel the trailing debounced invocation.
       * jQuery(window).on('popstate', debounced.cancel);
       */
      function debounce(func, wait, options) {
        var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = 'maxWait' in options;
          maxWait = maxing
            ? nativeMax(toNumber(options.maxWait) || 0, wait)
            : maxWait;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }

        function invokeFunc(time) {
          var args = lastArgs,
            thisArg = lastThis;

          lastArgs = lastThis = undefined$1;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }

        function leadingEdge(time) {
          // Reset any `maxWait` timer.
          lastInvokeTime = time;
          // Start the timer for the trailing edge.
          timerId = setTimeout(timerExpired, wait);
          // Invoke the leading edge.
          return leading ? invokeFunc(time) : result;
        }

        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

          return maxing
            ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
        }

        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

          // Either this is the first call, activity has stopped and we're at the
          // trailing edge, the system time has gone backwards and we're treating
          // it as the trailing edge, or we've hit the `maxWait` limit.
          return (
            lastCallTime === undefined$1 ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= maxWait)
          );
        }

        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          // Restart the timer.
          timerId = setTimeout(timerExpired, remainingWait(time));
        }

        function trailingEdge(time) {
          timerId = undefined$1;

          // Only invoke if we have `lastArgs` which means `func` has been
          // debounced at least once.
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined$1;
          return result;
        }

        function cancel() {
          if (timerId !== undefined$1) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined$1;
        }

        function flush() {
          return timerId === undefined$1 ? result : trailingEdge(now());
        }

        function debounced() {
          var time = now(),
            isInvoking = shouldInvoke(time);

          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;

          if (isInvoking) {
            if (timerId === undefined$1) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              // Handle invocations in a tight loop.
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined$1) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }

      /**
       * Defers invoking the `func` until the current call stack has cleared. Any
       * additional arguments are provided to `func` when it's invoked.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to defer.
       * @param {...*} [args] The arguments to invoke `func` with.
       * @returns {number} Returns the timer id.
       * @example
       *
       * _.defer(function(text) {
       *   console.log(text);
       * }, 'deferred');
       * // => Logs 'deferred' after one millisecond.
       */
      var defer = baseRest(function(func, args) {
        return baseDelay(func, 1, args);
      });

      /**
       * Invokes `func` after `wait` milliseconds. Any additional arguments are
       * provided to `func` when it's invoked.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to delay.
       * @param {number} wait The number of milliseconds to delay invocation.
       * @param {...*} [args] The arguments to invoke `func` with.
       * @returns {number} Returns the timer id.
       * @example
       *
       * _.delay(function(text) {
       *   console.log(text);
       * }, 1000, 'later');
       * // => Logs 'later' after one second.
       */
      var delay = baseRest(function(func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });

      /**
       * Creates a function that invokes `func` with arguments reversed.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Function
       * @param {Function} func The function to flip arguments for.
       * @returns {Function} Returns the new flipped function.
       * @example
       *
       * var flipped = _.flip(function() {
       *   return _.toArray(arguments);
       * });
       *
       * flipped('a', 'b', 'c', 'd');
       * // => ['d', 'c', 'b', 'a']
       */
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }

      /**
       * Creates a function that memoizes the result of `func`. If `resolver` is
       * provided, it determines the cache key for storing the result based on the
       * arguments provided to the memoized function. By default, the first argument
       * provided to the memoized function is used as the map cache key. The `func`
       * is invoked with the `this` binding of the memoized function.
       *
       * **Note:** The cache is exposed as the `cache` property on the memoized
       * function. Its creation may be customized by replacing the `_.memoize.Cache`
       * constructor with one whose instances implement the
       * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
       * method interface of `clear`, `delete`, `get`, `has`, and `set`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to have its output memoized.
       * @param {Function} [resolver] The function to resolve the cache key.
       * @returns {Function} Returns the new memoized function.
       * @example
       *
       * var object = { 'a': 1, 'b': 2 };
       * var other = { 'c': 3, 'd': 4 };
       *
       * var values = _.memoize(_.values);
       * values(object);
       * // => [1, 2]
       *
       * values(other);
       * // => [3, 4]
       *
       * object.a = 2;
       * values(object);
       * // => [1, 2]
       *
       * // Modify the result cache.
       * values.cache.set(object, ['a', 'b']);
       * values(object);
       * // => ['a', 'b']
       *
       * // Replace `_.memoize.Cache`.
       * _.memoize.Cache = WeakMap;
       */
      function memoize(func, resolver) {
        if (
          typeof func != 'function' ||
          (resolver != null && typeof resolver != 'function')
        ) {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }

      // Expose `MapCache`.
      memoize.Cache = MapCache;

      /**
       * Creates a function that negates the result of the predicate `func`. The
       * `func` predicate is invoked with the `this` binding and arguments of the
       * created function.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Function
       * @param {Function} predicate The predicate to negate.
       * @returns {Function} Returns the new negated function.
       * @example
       *
       * function isEven(n) {
       *   return n % 2 == 0;
       * }
       *
       * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
       * // => [1, 3, 5]
       */
      function negate(predicate) {
        if (typeof predicate != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }

      /**
       * Creates a function that is restricted to invoking `func` once. Repeat calls
       * to the function return the value of the first invocation. The `func` is
       * invoked with the `this` binding and arguments of the created function.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to restrict.
       * @returns {Function} Returns the new restricted function.
       * @example
       *
       * var initialize = _.once(createApplication);
       * initialize();
       * initialize();
       * // => `createApplication` is invoked once
       */
      function once(func) {
        return before(2, func);
      }

      /**
       * Creates a function that invokes `func` with its arguments transformed.
       *
       * @static
       * @since 4.0.0
       * @memberOf _
       * @category Function
       * @param {Function} func The function to wrap.
       * @param {...(Function|Function[])} [transforms=[_.identity]]
       *  The argument transforms.
       * @returns {Function} Returns the new function.
       * @example
       *
       * function doubled(n) {
       *   return n * 2;
       * }
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * var func = _.overArgs(function(x, y) {
       *   return [x, y];
       * }, [square, doubled]);
       *
       * func(9, 3);
       * // => [81, 6]
       *
       * func(10, 5);
       * // => [100, 10]
       */
      var overArgs = castRest(function(func, transforms) {
        transforms =
          transforms.length == 1 && isArray(transforms[0])
            ? arrayMap(transforms[0], baseUnary(getIteratee()))
            : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index = -1,
            length = nativeMin(args.length, funcsLength);

          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }
          return apply(func, this, args);
        });
      });

      /**
       * Creates a function that invokes `func` with `partials` prepended to the
       * arguments it receives. This method is like `_.bind` except it does **not**
       * alter the `this` binding.
       *
       * The `_.partial.placeholder` value, which defaults to `_` in monolithic
       * builds, may be used as a placeholder for partially applied arguments.
       *
       * **Note:** This method doesn't set the "length" property of partially
       * applied functions.
       *
       * @static
       * @memberOf _
       * @since 0.2.0
       * @category Function
       * @param {Function} func The function to partially apply arguments to.
       * @param {...*} [partials] The arguments to be partially applied.
       * @returns {Function} Returns the new partially applied function.
       * @example
       *
       * function greet(greeting, name) {
       *   return greeting + ' ' + name;
       * }
       *
       * var sayHelloTo = _.partial(greet, 'hello');
       * sayHelloTo('fred');
       * // => 'hello fred'
       *
       * // Partially applied with placeholders.
       * var greetFred = _.partial(greet, _, 'fred');
       * greetFred('hi');
       * // => 'hi fred'
       */
      var partial = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(
          func,
          WRAP_PARTIAL_FLAG,
          undefined$1,
          partials,
          holders
        );
      });

      /**
       * This method is like `_.partial` except that partially applied arguments
       * are appended to the arguments it receives.
       *
       * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
       * builds, may be used as a placeholder for partially applied arguments.
       *
       * **Note:** This method doesn't set the "length" property of partially
       * applied functions.
       *
       * @static
       * @memberOf _
       * @since 1.0.0
       * @category Function
       * @param {Function} func The function to partially apply arguments to.
       * @param {...*} [partials] The arguments to be partially applied.
       * @returns {Function} Returns the new partially applied function.
       * @example
       *
       * function greet(greeting, name) {
       *   return greeting + ' ' + name;
       * }
       *
       * var greetFred = _.partialRight(greet, 'fred');
       * greetFred('hi');
       * // => 'hi fred'
       *
       * // Partially applied with placeholders.
       * var sayHelloTo = _.partialRight(greet, 'hello', _);
       * sayHelloTo('fred');
       * // => 'hello fred'
       */
      var partialRight = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(
          func,
          WRAP_PARTIAL_RIGHT_FLAG,
          undefined$1,
          partials,
          holders
        );
      });

      /**
       * Creates a function that invokes `func` with arguments arranged according
       * to the specified `indexes` where the argument value at the first index is
       * provided as the first argument, the argument value at the second index is
       * provided as the second argument, and so on.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Function
       * @param {Function} func The function to rearrange arguments for.
       * @param {...(number|number[])} indexes The arranged argument indexes.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var rearged = _.rearg(function(a, b, c) {
       *   return [a, b, c];
       * }, [2, 0, 1]);
       *
       * rearged('b', 'c', 'a')
       * // => ['a', 'b', 'c']
       */
      var rearg = flatRest(function(func, indexes) {
        return createWrap(
          func,
          WRAP_REARG_FLAG,
          undefined$1,
          undefined$1,
          undefined$1,
          indexes
        );
      });

      /**
       * Creates a function that invokes `func` with the `this` binding of the
       * created function and arguments from `start` and beyond provided as
       * an array.
       *
       * **Note:** This method is based on the
       * [rest parameter](https://mdn.io/rest_parameters).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Function
       * @param {Function} func The function to apply a rest parameter to.
       * @param {number} [start=func.length-1] The start position of the rest parameter.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var say = _.rest(function(what, names) {
       *   return what + ' ' + _.initial(names).join(', ') +
       *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
       * });
       *
       * say('hello', 'fred', 'barney', 'pebbles');
       * // => 'hello fred, barney, & pebbles'
       */
      function rest(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = start === undefined$1 ? start : toInteger(start);
        return baseRest(func, start);
      }

      /**
       * Creates a function that invokes `func` with the `this` binding of the
       * create function and an array of arguments much like
       * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
       *
       * **Note:** This method is based on the
       * [spread operator](https://mdn.io/spread_operator).
       *
       * @static
       * @memberOf _
       * @since 3.2.0
       * @category Function
       * @param {Function} func The function to spread arguments over.
       * @param {number} [start=0] The start position of the spread.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var say = _.spread(function(who, what) {
       *   return who + ' says ' + what;
       * });
       *
       * say(['fred', 'hello']);
       * // => 'fred says hello'
       *
       * var numbers = Promise.all([
       *   Promise.resolve(40),
       *   Promise.resolve(36)
       * ]);
       *
       * numbers.then(_.spread(function(x, y) {
       *   return x + y;
       * }));
       * // => a Promise of 76
       */
      function spread(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function(args) {
          var array = args[start],
            otherArgs = castSlice(args, 0, start);

          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }

      /**
       * Creates a throttled function that only invokes `func` at most once per
       * every `wait` milliseconds. The throttled function comes with a `cancel`
       * method to cancel delayed `func` invocations and a `flush` method to
       * immediately invoke them. Provide `options` to indicate whether `func`
       * should be invoked on the leading and/or trailing edge of the `wait`
       * timeout. The `func` is invoked with the last arguments provided to the
       * throttled function. Subsequent calls to the throttled function return the
       * result of the last `func` invocation.
       *
       * **Note:** If `leading` and `trailing` options are `true`, `func` is
       * invoked on the trailing edge of the timeout only if the throttled function
       * is invoked more than once during the `wait` timeout.
       *
       * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
       * until to the next tick, similar to `setTimeout` with a timeout of `0`.
       *
       * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
       * for details over the differences between `_.throttle` and `_.debounce`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {Function} func The function to throttle.
       * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
       * @param {Object} [options={}] The options object.
       * @param {boolean} [options.leading=true]
       *  Specify invoking on the leading edge of the timeout.
       * @param {boolean} [options.trailing=true]
       *  Specify invoking on the trailing edge of the timeout.
       * @returns {Function} Returns the new throttled function.
       * @example
       *
       * // Avoid excessively updating the position while scrolling.
       * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
       *
       * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
       * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
       * jQuery(element).on('click', throttled);
       *
       * // Cancel the trailing throttled invocation.
       * jQuery(window).on('popstate', throttled.cancel);
       */
      function throttle(func, wait, options) {
        var leading = true,
          trailing = true;

        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = 'leading' in options ? !!options.leading : leading;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          leading: leading,
          maxWait: wait,
          trailing: trailing,
        });
      }

      /**
       * Creates a function that accepts up to one argument, ignoring any
       * additional arguments.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Function
       * @param {Function} func The function to cap arguments for.
       * @returns {Function} Returns the new capped function.
       * @example
       *
       * _.map(['6', '8', '10'], _.unary(parseInt));
       * // => [6, 8, 10]
       */
      function unary(func) {
        return ary(func, 1);
      }

      /**
       * Creates a function that provides `value` to `wrapper` as its first
       * argument. Any additional arguments provided to the function are appended
       * to those provided to the `wrapper`. The wrapper is invoked with the `this`
       * binding of the created function.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Function
       * @param {*} value The value to wrap.
       * @param {Function} [wrapper=identity] The wrapper function.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var p = _.wrap(_.escape, function(func, text) {
       *   return '<p>' + func(text) + '</p>';
       * });
       *
       * p('fred, barney, & pebbles');
       * // => '<p>fred, barney, &amp; pebbles</p>'
       */
      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }

      /*------------------------------------------------------------------------*/

      /**
       * Casts `value` as an array if it's not one.
       *
       * @static
       * @memberOf _
       * @since 4.4.0
       * @category Lang
       * @param {*} value The value to inspect.
       * @returns {Array} Returns the cast array.
       * @example
       *
       * _.castArray(1);
       * // => [1]
       *
       * _.castArray({ 'a': 1 });
       * // => [{ 'a': 1 }]
       *
       * _.castArray('abc');
       * // => ['abc']
       *
       * _.castArray(null);
       * // => [null]
       *
       * _.castArray(undefined);
       * // => [undefined]
       *
       * _.castArray();
       * // => []
       *
       * var array = [1, 2, 3];
       * console.log(_.castArray(array) === array);
       * // => true
       */
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray(value) ? value : [value];
      }

      /**
       * Creates a shallow clone of `value`.
       *
       * **Note:** This method is loosely based on the
       * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
       * and supports cloning arrays, array buffers, booleans, date objects, maps,
       * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
       * arrays. The own enumerable properties of `arguments` objects are cloned
       * as plain objects. An empty object is returned for uncloneable values such
       * as error objects, functions, DOM nodes, and WeakMaps.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to clone.
       * @returns {*} Returns the cloned value.
       * @see _.cloneDeep
       * @example
       *
       * var objects = [{ 'a': 1 }, { 'b': 2 }];
       *
       * var shallow = _.clone(objects);
       * console.log(shallow[0] === objects[0]);
       * // => true
       */
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }

      /**
       * This method is like `_.clone` except that it accepts `customizer` which
       * is invoked to produce the cloned value. If `customizer` returns `undefined`,
       * cloning is handled by the method instead. The `customizer` is invoked with
       * up to four arguments; (value [, index|key, object, stack]).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to clone.
       * @param {Function} [customizer] The function to customize cloning.
       * @returns {*} Returns the cloned value.
       * @see _.cloneDeepWith
       * @example
       *
       * function customizer(value) {
       *   if (_.isElement(value)) {
       *     return value.cloneNode(false);
       *   }
       * }
       *
       * var el = _.cloneWith(document.body, customizer);
       *
       * console.log(el === document.body);
       * // => false
       * console.log(el.nodeName);
       * // => 'BODY'
       * console.log(el.childNodes.length);
       * // => 0
       */
      function cloneWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }

      /**
       * This method is like `_.clone` except that it recursively clones `value`.
       *
       * @static
       * @memberOf _
       * @since 1.0.0
       * @category Lang
       * @param {*} value The value to recursively clone.
       * @returns {*} Returns the deep cloned value.
       * @see _.clone
       * @example
       *
       * var objects = [{ 'a': 1 }, { 'b': 2 }];
       *
       * var deep = _.cloneDeep(objects);
       * console.log(deep[0] === objects[0]);
       * // => false
       */
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }

      /**
       * This method is like `_.cloneWith` except that it recursively clones `value`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to recursively clone.
       * @param {Function} [customizer] The function to customize cloning.
       * @returns {*} Returns the deep cloned value.
       * @see _.cloneWith
       * @example
       *
       * function customizer(value) {
       *   if (_.isElement(value)) {
       *     return value.cloneNode(true);
       *   }
       * }
       *
       * var el = _.cloneDeepWith(document.body, customizer);
       *
       * console.log(el === document.body);
       * // => false
       * console.log(el.nodeName);
       * // => 'BODY'
       * console.log(el.childNodes.length);
       * // => 20
       */
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(
          value,
          CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG,
          customizer
        );
      }

      /**
       * Checks if `object` conforms to `source` by invoking the predicate
       * properties of `source` with the corresponding property values of `object`.
       *
       * **Note:** This method is equivalent to `_.conforms` when `source` is
       * partially applied.
       *
       * @static
       * @memberOf _
       * @since 4.14.0
       * @category Lang
       * @param {Object} object The object to inspect.
       * @param {Object} source The object of property predicates to conform to.
       * @returns {boolean} Returns `true` if `object` conforms, else `false`.
       * @example
       *
       * var object = { 'a': 1, 'b': 2 };
       *
       * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
       * // => true
       *
       * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
       * // => false
       */
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }

      /**
       * Performs a
       * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
       * comparison between two values to determine if they are equivalent.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       * @example
       *
       * var object = { 'a': 1 };
       * var other = { 'a': 1 };
       *
       * _.eq(object, object);
       * // => true
       *
       * _.eq(object, other);
       * // => false
       *
       * _.eq('a', 'a');
       * // => true
       *
       * _.eq('a', Object('a'));
       * // => false
       *
       * _.eq(NaN, NaN);
       * // => true
       */
      function eq(value, other) {
        return value === other || (value !== value && other !== other);
      }

      /**
       * Checks if `value` is greater than `other`.
       *
       * @static
       * @memberOf _
       * @since 3.9.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is greater than `other`,
       *  else `false`.
       * @see _.lt
       * @example
       *
       * _.gt(3, 1);
       * // => true
       *
       * _.gt(3, 3);
       * // => false
       *
       * _.gt(1, 3);
       * // => false
       */
      var gt = createRelationalOperation(baseGt);

      /**
       * Checks if `value` is greater than or equal to `other`.
       *
       * @static
       * @memberOf _
       * @since 3.9.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is greater than or equal to
       *  `other`, else `false`.
       * @see _.lte
       * @example
       *
       * _.gte(3, 1);
       * // => true
       *
       * _.gte(3, 3);
       * // => true
       *
       * _.gte(1, 3);
       * // => false
       */
      var gte = createRelationalOperation(function(value, other) {
        return value >= other;
      });

      /**
       * Checks if `value` is likely an `arguments` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an `arguments` object,
       *  else `false`.
       * @example
       *
       * _.isArguments(function() { return arguments; }());
       * // => true
       *
       * _.isArguments([1, 2, 3]);
       * // => false
       */
      var isArguments = baseIsArguments(
        (function() {
          return arguments;
        })()
      )
        ? baseIsArguments
        : function(value) {
            return (
              isObjectLike(value) &&
              hasOwnProperty.call(value, 'callee') &&
              !propertyIsEnumerable.call(value, 'callee')
            );
          };

      /**
       * Checks if `value` is classified as an `Array` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an array, else `false`.
       * @example
       *
       * _.isArray([1, 2, 3]);
       * // => true
       *
       * _.isArray(document.body.children);
       * // => false
       *
       * _.isArray('abc');
       * // => false
       *
       * _.isArray(_.noop);
       * // => false
       */
      var isArray = Array.isArray;

      /**
       * Checks if `value` is classified as an `ArrayBuffer` object.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
       * @example
       *
       * _.isArrayBuffer(new ArrayBuffer(2));
       * // => true
       *
       * _.isArrayBuffer(new Array(2));
       * // => false
       */
      var isArrayBuffer = nodeIsArrayBuffer
        ? baseUnary(nodeIsArrayBuffer)
        : baseIsArrayBuffer;

      /**
       * Checks if `value` is array-like. A value is considered array-like if it's
       * not a function and has a `value.length` that's an integer greater than or
       * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
       * @example
       *
       * _.isArrayLike([1, 2, 3]);
       * // => true
       *
       * _.isArrayLike(document.body.children);
       * // => true
       *
       * _.isArrayLike('abc');
       * // => true
       *
       * _.isArrayLike(_.noop);
       * // => false
       */
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }

      /**
       * This method is like `_.isArrayLike` except that it also checks if `value`
       * is an object.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an array-like object,
       *  else `false`.
       * @example
       *
       * _.isArrayLikeObject([1, 2, 3]);
       * // => true
       *
       * _.isArrayLikeObject(document.body.children);
       * // => true
       *
       * _.isArrayLikeObject('abc');
       * // => false
       *
       * _.isArrayLikeObject(_.noop);
       * // => false
       */
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }

      /**
       * Checks if `value` is classified as a boolean primitive or object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
       * @example
       *
       * _.isBoolean(false);
       * // => true
       *
       * _.isBoolean(null);
       * // => false
       */
      function isBoolean(value) {
        return (
          value === true ||
          value === false ||
          (isObjectLike(value) && baseGetTag(value) == boolTag)
        );
      }

      /**
       * Checks if `value` is a buffer.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
       * @example
       *
       * _.isBuffer(new Buffer(2));
       * // => true
       *
       * _.isBuffer(new Uint8Array(2));
       * // => false
       */
      var isBuffer = nativeIsBuffer || stubFalse;

      /**
       * Checks if `value` is classified as a `Date` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
       * @example
       *
       * _.isDate(new Date);
       * // => true
       *
       * _.isDate('Mon April 23 2012');
       * // => false
       */
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

      /**
       * Checks if `value` is likely a DOM element.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
       * @example
       *
       * _.isElement(document.body);
       * // => true
       *
       * _.isElement('<body>');
       * // => false
       */
      function isElement(value) {
        return (
          isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value)
        );
      }

      /**
       * Checks if `value` is an empty object, collection, map, or set.
       *
       * Objects are considered empty if they have no own enumerable string keyed
       * properties.
       *
       * Array-like values such as `arguments` objects, arrays, buffers, strings, or
       * jQuery-like collections are considered empty if they have a `length` of `0`.
       * Similarly, maps and sets are considered empty if they have a `size` of `0`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is empty, else `false`.
       * @example
       *
       * _.isEmpty(null);
       * // => true
       *
       * _.isEmpty(true);
       * // => true
       *
       * _.isEmpty(1);
       * // => true
       *
       * _.isEmpty([1, 2, 3]);
       * // => false
       *
       * _.isEmpty({ 'a': 1 });
       * // => false
       */
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (
          isArrayLike(value) &&
          (isArray(value) ||
            typeof value == 'string' ||
            typeof value.splice == 'function' ||
            isBuffer(value) ||
            isTypedArray(value) ||
            isArguments(value))
        ) {
          return !value.length;
        }
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty.call(value, key)) {
            return false;
          }
        }
        return true;
      }

      /**
       * Performs a deep comparison between two values to determine if they are
       * equivalent.
       *
       * **Note:** This method supports comparing arrays, array buffers, booleans,
       * date objects, error objects, maps, numbers, `Object` objects, regexes,
       * sets, strings, symbols, and typed arrays. `Object` objects are compared
       * by their own, not inherited, enumerable properties. Functions and DOM
       * nodes are compared by strict equality, i.e. `===`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       * @example
       *
       * var object = { 'a': 1 };
       * var other = { 'a': 1 };
       *
       * _.isEqual(object, other);
       * // => true
       *
       * object === other;
       * // => false
       */
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }

      /**
       * This method is like `_.isEqual` except that it accepts `customizer` which
       * is invoked to compare values. If `customizer` returns `undefined`, comparisons
       * are handled by the method instead. The `customizer` is invoked with up to
       * six arguments: (objValue, othValue [, index|key, object, other, stack]).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @param {Function} [customizer] The function to customize comparisons.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       * @example
       *
       * function isGreeting(value) {
       *   return /^h(?:i|ello)$/.test(value);
       * }
       *
       * function customizer(objValue, othValue) {
       *   if (isGreeting(objValue) && isGreeting(othValue)) {
       *     return true;
       *   }
       * }
       *
       * var array = ['hello', 'goodbye'];
       * var other = ['hi', 'goodbye'];
       *
       * _.isEqualWith(array, other, customizer);
       * // => true
       */
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        var result = customizer ? customizer(value, other) : undefined$1;
        return result === undefined$1
          ? baseIsEqual(value, other, undefined$1, customizer)
          : !!result;
      }

      /**
       * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
       * `SyntaxError`, `TypeError`, or `URIError` object.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
       * @example
       *
       * _.isError(new Error);
       * // => true
       *
       * _.isError(Error);
       * // => false
       */
      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return (
          tag == errorTag ||
          tag == domExcTag ||
          (typeof value.message == 'string' &&
            typeof value.name == 'string' &&
            !isPlainObject(value))
        );
      }

      /**
       * Checks if `value` is a finite primitive number.
       *
       * **Note:** This method is based on
       * [`Number.isFinite`](https://mdn.io/Number/isFinite).
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
       * @example
       *
       * _.isFinite(3);
       * // => true
       *
       * _.isFinite(Number.MIN_VALUE);
       * // => true
       *
       * _.isFinite(Infinity);
       * // => false
       *
       * _.isFinite('3');
       * // => false
       */
      function isFinite(value) {
        return typeof value == 'number' && nativeIsFinite(value);
      }

      /**
       * Checks if `value` is classified as a `Function` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a function, else `false`.
       * @example
       *
       * _.isFunction(_);
       * // => true
       *
       * _.isFunction(/abc/);
       * // => false
       */
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        // The use of `Object#toString` avoids issues with the `typeof` operator
        // in Safari 9 which returns 'object' for typed arrays and other constructors.
        var tag = baseGetTag(value);
        return (
          tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag
        );
      }

      /**
       * Checks if `value` is an integer.
       *
       * **Note:** This method is based on
       * [`Number.isInteger`](https://mdn.io/Number/isInteger).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
       * @example
       *
       * _.isInteger(3);
       * // => true
       *
       * _.isInteger(Number.MIN_VALUE);
       * // => false
       *
       * _.isInteger(Infinity);
       * // => false
       *
       * _.isInteger('3');
       * // => false
       */
      function isInteger(value) {
        return typeof value == 'number' && value == toInteger(value);
      }

      /**
       * Checks if `value` is a valid array-like length.
       *
       * **Note:** This method is loosely based on
       * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
       * @example
       *
       * _.isLength(3);
       * // => true
       *
       * _.isLength(Number.MIN_VALUE);
       * // => false
       *
       * _.isLength(Infinity);
       * // => false
       *
       * _.isLength('3');
       * // => false
       */
      function isLength(value) {
        return (
          typeof value == 'number' &&
          value > -1 &&
          value % 1 == 0 &&
          value <= MAX_SAFE_INTEGER
        );
      }

      /**
       * Checks if `value` is the
       * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
       * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is an object, else `false`.
       * @example
       *
       * _.isObject({});
       * // => true
       *
       * _.isObject([1, 2, 3]);
       * // => true
       *
       * _.isObject(_.noop);
       * // => true
       *
       * _.isObject(null);
       * // => false
       */
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
      }

      /**
       * Checks if `value` is object-like. A value is object-like if it's not `null`
       * and has a `typeof` result of "object".
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
       * @example
       *
       * _.isObjectLike({});
       * // => true
       *
       * _.isObjectLike([1, 2, 3]);
       * // => true
       *
       * _.isObjectLike(_.noop);
       * // => false
       *
       * _.isObjectLike(null);
       * // => false
       */
      function isObjectLike(value) {
        return value != null && typeof value == 'object';
      }

      /**
       * Checks if `value` is classified as a `Map` object.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a map, else `false`.
       * @example
       *
       * _.isMap(new Map);
       * // => true
       *
       * _.isMap(new WeakMap);
       * // => false
       */
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

      /**
       * Performs a partial deep comparison between `object` and `source` to
       * determine if `object` contains equivalent property values.
       *
       * **Note:** This method is equivalent to `_.matches` when `source` is
       * partially applied.
       *
       * Partial comparisons will match empty array and empty object `source`
       * values against any array or object value, respectively. See `_.isEqual`
       * for a list of supported value comparisons.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {Object} object The object to inspect.
       * @param {Object} source The object of property values to match.
       * @returns {boolean} Returns `true` if `object` is a match, else `false`.
       * @example
       *
       * var object = { 'a': 1, 'b': 2 };
       *
       * _.isMatch(object, { 'b': 2 });
       * // => true
       *
       * _.isMatch(object, { 'b': 1 });
       * // => false
       */
      function isMatch(object, source) {
        return (
          object === source || baseIsMatch(object, source, getMatchData(source))
        );
      }

      /**
       * This method is like `_.isMatch` except that it accepts `customizer` which
       * is invoked to compare values. If `customizer` returns `undefined`, comparisons
       * are handled by the method instead. The `customizer` is invoked with five
       * arguments: (objValue, srcValue, index|key, object, source).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {Object} object The object to inspect.
       * @param {Object} source The object of property values to match.
       * @param {Function} [customizer] The function to customize comparisons.
       * @returns {boolean} Returns `true` if `object` is a match, else `false`.
       * @example
       *
       * function isGreeting(value) {
       *   return /^h(?:i|ello)$/.test(value);
       * }
       *
       * function customizer(objValue, srcValue) {
       *   if (isGreeting(objValue) && isGreeting(srcValue)) {
       *     return true;
       *   }
       * }
       *
       * var object = { 'greeting': 'hello' };
       * var source = { 'greeting': 'hi' };
       *
       * _.isMatchWith(object, source, customizer);
       * // => true
       */
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }

      /**
       * Checks if `value` is `NaN`.
       *
       * **Note:** This method is based on
       * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
       * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
       * `undefined` and other non-number values.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
       * @example
       *
       * _.isNaN(NaN);
       * // => true
       *
       * _.isNaN(new Number(NaN));
       * // => true
       *
       * isNaN(undefined);
       * // => true
       *
       * _.isNaN(undefined);
       * // => false
       */
      function isNaN(value) {
        // An `NaN` primitive is the only value that is not equal to itself.
        // Perform the `toStringTag` check first to avoid errors with some
        // ActiveX objects in IE.
        return isNumber(value) && value != +value;
      }

      /**
       * Checks if `value` is a pristine native function.
       *
       * **Note:** This method can't reliably detect native functions in the presence
       * of the core-js package because core-js circumvents this kind of detection.
       * Despite multiple requests, the core-js maintainer has made it clear: any
       * attempt to fix the detection will be obstructed. As a result, we're left
       * with little choice but to throw an error. Unfortunately, this also affects
       * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
       * which rely on core-js.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a native function,
       *  else `false`.
       * @example
       *
       * _.isNative(Array.prototype.push);
       * // => true
       *
       * _.isNative(_);
       * // => false
       */
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }

      /**
       * Checks if `value` is `null`.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
       * @example
       *
       * _.isNull(null);
       * // => true
       *
       * _.isNull(void 0);
       * // => false
       */
      function isNull(value) {
        return value === null;
      }

      /**
       * Checks if `value` is `null` or `undefined`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
       * @example
       *
       * _.isNil(null);
       * // => true
       *
       * _.isNil(void 0);
       * // => true
       *
       * _.isNil(NaN);
       * // => false
       */
      function isNil(value) {
        return value == null;
      }

      /**
       * Checks if `value` is classified as a `Number` primitive or object.
       *
       * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
       * classified as numbers, use the `_.isFinite` method.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a number, else `false`.
       * @example
       *
       * _.isNumber(3);
       * // => true
       *
       * _.isNumber(Number.MIN_VALUE);
       * // => true
       *
       * _.isNumber(Infinity);
       * // => true
       *
       * _.isNumber('3');
       * // => false
       */
      function isNumber(value) {
        return (
          typeof value == 'number' ||
          (isObjectLike(value) && baseGetTag(value) == numberTag)
        );
      }

      /**
       * Checks if `value` is a plain object, that is, an object created by the
       * `Object` constructor or one with a `[[Prototype]]` of `null`.
       *
       * @static
       * @memberOf _
       * @since 0.8.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       * }
       *
       * _.isPlainObject(new Foo);
       * // => false
       *
       * _.isPlainObject([1, 2, 3]);
       * // => false
       *
       * _.isPlainObject({ 'x': 0, 'y': 0 });
       * // => true
       *
       * _.isPlainObject(Object.create(null));
       * // => true
       */
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor =
          hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return (
          typeof Ctor == 'function' &&
          Ctor instanceof Ctor &&
          funcToString.call(Ctor) == objectCtorString
        );
      }

      /**
       * Checks if `value` is classified as a `RegExp` object.
       *
       * @static
       * @memberOf _
       * @since 0.1.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
       * @example
       *
       * _.isRegExp(/abc/);
       * // => true
       *
       * _.isRegExp('/abc/');
       * // => false
       */
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

      /**
       * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
       * double precision number which isn't the result of a rounded unsafe integer.
       *
       * **Note:** This method is based on
       * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
       * @example
       *
       * _.isSafeInteger(3);
       * // => true
       *
       * _.isSafeInteger(Number.MIN_VALUE);
       * // => false
       *
       * _.isSafeInteger(Infinity);
       * // => false
       *
       * _.isSafeInteger('3');
       * // => false
       */
      function isSafeInteger(value) {
        return (
          isInteger(value) &&
          value >= -MAX_SAFE_INTEGER &&
          value <= MAX_SAFE_INTEGER
        );
      }

      /**
       * Checks if `value` is classified as a `Set` object.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a set, else `false`.
       * @example
       *
       * _.isSet(new Set);
       * // => true
       *
       * _.isSet(new WeakSet);
       * // => false
       */
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

      /**
       * Checks if `value` is classified as a `String` primitive or object.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a string, else `false`.
       * @example
       *
       * _.isString('abc');
       * // => true
       *
       * _.isString(1);
       * // => false
       */
      function isString(value) {
        return (
          typeof value == 'string' ||
          (!isArray(value) &&
            isObjectLike(value) &&
            baseGetTag(value) == stringTag)
        );
      }

      /**
       * Checks if `value` is classified as a `Symbol` primitive or object.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
       * @example
       *
       * _.isSymbol(Symbol.iterator);
       * // => true
       *
       * _.isSymbol('abc');
       * // => false
       */
      function isSymbol(value) {
        return (
          typeof value == 'symbol' ||
          (isObjectLike(value) && baseGetTag(value) == symbolTag)
        );
      }

      /**
       * Checks if `value` is classified as a typed array.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
       * @example
       *
       * _.isTypedArray(new Uint8Array);
       * // => true
       *
       * _.isTypedArray([]);
       * // => false
       */
      var isTypedArray = nodeIsTypedArray
        ? baseUnary(nodeIsTypedArray)
        : baseIsTypedArray;

      /**
       * Checks if `value` is `undefined`.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
       * @example
       *
       * _.isUndefined(void 0);
       * // => true
       *
       * _.isUndefined(null);
       * // => false
       */
      function isUndefined(value) {
        return value === undefined$1;
      }

      /**
       * Checks if `value` is classified as a `WeakMap` object.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
       * @example
       *
       * _.isWeakMap(new WeakMap);
       * // => true
       *
       * _.isWeakMap(new Map);
       * // => false
       */
      function isWeakMap(value) {
        return isObjectLike(value) && getTag(value) == weakMapTag;
      }

      /**
       * Checks if `value` is classified as a `WeakSet` object.
       *
       * @static
       * @memberOf _
       * @since 4.3.0
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
       * @example
       *
       * _.isWeakSet(new WeakSet);
       * // => true
       *
       * _.isWeakSet(new Set);
       * // => false
       */
      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }

      /**
       * Checks if `value` is less than `other`.
       *
       * @static
       * @memberOf _
       * @since 3.9.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is less than `other`,
       *  else `false`.
       * @see _.gt
       * @example
       *
       * _.lt(1, 3);
       * // => true
       *
       * _.lt(3, 3);
       * // => false
       *
       * _.lt(3, 1);
       * // => false
       */
      var lt = createRelationalOperation(baseLt);

      /**
       * Checks if `value` is less than or equal to `other`.
       *
       * @static
       * @memberOf _
       * @since 3.9.0
       * @category Lang
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @returns {boolean} Returns `true` if `value` is less than or equal to
       *  `other`, else `false`.
       * @see _.gte
       * @example
       *
       * _.lte(1, 3);
       * // => true
       *
       * _.lte(3, 3);
       * // => true
       *
       * _.lte(3, 1);
       * // => false
       */
      var lte = createRelationalOperation(function(value, other) {
        return value <= other;
      });

      /**
       * Converts `value` to an array.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {Array} Returns the converted array.
       * @example
       *
       * _.toArray({ 'a': 1, 'b': 2 });
       * // => [1, 2]
       *
       * _.toArray('abc');
       * // => ['a', 'b', 'c']
       *
       * _.toArray(1);
       * // => []
       *
       * _.toArray(null);
       * // => []
       */
      function toArray(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }
        var tag = getTag(value),
          func =
            tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;

        return func(value);
      }

      /**
       * Converts `value` to a finite number.
       *
       * @static
       * @memberOf _
       * @since 4.12.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {number} Returns the converted number.
       * @example
       *
       * _.toFinite(3.2);
       * // => 3.2
       *
       * _.toFinite(Number.MIN_VALUE);
       * // => 5e-324
       *
       * _.toFinite(Infinity);
       * // => 1.7976931348623157e+308
       *
       * _.toFinite('3.2');
       * // => 3.2
       */
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }

      /**
       * Converts `value` to an integer.
       *
       * **Note:** This method is loosely based on
       * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {number} Returns the converted integer.
       * @example
       *
       * _.toInteger(3.2);
       * // => 3
       *
       * _.toInteger(Number.MIN_VALUE);
       * // => 0
       *
       * _.toInteger(Infinity);
       * // => 1.7976931348623157e+308
       *
       * _.toInteger('3.2');
       * // => 3
       */
      function toInteger(value) {
        var result = toFinite(value),
          remainder = result % 1;

        return result === result
          ? remainder
            ? result - remainder
            : result
          : 0;
      }

      /**
       * Converts `value` to an integer suitable for use as the length of an
       * array-like object.
       *
       * **Note:** This method is based on
       * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {number} Returns the converted integer.
       * @example
       *
       * _.toLength(3.2);
       * // => 3
       *
       * _.toLength(Number.MIN_VALUE);
       * // => 0
       *
       * _.toLength(Infinity);
       * // => 4294967295
       *
       * _.toLength('3.2');
       * // => 3
       */
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }

      /**
       * Converts `value` to a number.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to process.
       * @returns {number} Returns the number.
       * @example
       *
       * _.toNumber(3.2);
       * // => 3.2
       *
       * _.toNumber(Number.MIN_VALUE);
       * // => 5e-324
       *
       * _.toNumber(Infinity);
       * // => Infinity
       *
       * _.toNumber('3.2');
       * // => 3.2
       */
      function toNumber(value) {
        if (typeof value == 'number') {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other =
            typeof value.valueOf == 'function' ? value.valueOf() : value;
          value = isObject(other) ? other + '' : other;
        }
        if (typeof value != 'string') {
          return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, '');
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value)
          ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
          : reIsBadHex.test(value)
          ? NAN
          : +value;
      }

      /**
       * Converts `value` to a plain object flattening inherited enumerable string
       * keyed properties of `value` to own properties of the plain object.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {Object} Returns the converted plain object.
       * @example
       *
       * function Foo() {
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.assign({ 'a': 1 }, new Foo);
       * // => { 'a': 1, 'b': 2 }
       *
       * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
       * // => { 'a': 1, 'b': 2, 'c': 3 }
       */
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }

      /**
       * Converts `value` to a safe integer. A safe integer can be compared and
       * represented correctly.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {number} Returns the converted integer.
       * @example
       *
       * _.toSafeInteger(3.2);
       * // => 3
       *
       * _.toSafeInteger(Number.MIN_VALUE);
       * // => 0
       *
       * _.toSafeInteger(Infinity);
       * // => 9007199254740991
       *
       * _.toSafeInteger('3.2');
       * // => 3
       */
      function toSafeInteger(value) {
        return value
          ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
          : value === 0
          ? value
          : 0;
      }

      /**
       * Converts `value` to a string. An empty string is returned for `null`
       * and `undefined` values. The sign of `-0` is preserved.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Lang
       * @param {*} value The value to convert.
       * @returns {string} Returns the converted string.
       * @example
       *
       * _.toString(null);
       * // => ''
       *
       * _.toString(-0);
       * // => '-0'
       *
       * _.toString([1, 2, 3]);
       * // => '1,2,3'
       */
      function toString(value) {
        return value == null ? '' : baseToString(value);
      }

      /*------------------------------------------------------------------------*/

      /**
       * Assigns own enumerable string keyed properties of source objects to the
       * destination object. Source objects are applied from left to right.
       * Subsequent sources overwrite property assignments of previous sources.
       *
       * **Note:** This method mutates `object` and is loosely based on
       * [`Object.assign`](https://mdn.io/Object/assign).
       *
       * @static
       * @memberOf _
       * @since 0.10.0
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} [sources] The source objects.
       * @returns {Object} Returns `object`.
       * @see _.assignIn
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       * }
       *
       * function Bar() {
       *   this.c = 3;
       * }
       *
       * Foo.prototype.b = 2;
       * Bar.prototype.d = 4;
       *
       * _.assign({ 'a': 0 }, new Foo, new Bar);
       * // => { 'a': 1, 'c': 3 }
       */
      var assign = createAssigner(function(object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });

      /**
       * This method is like `_.assign` except that it iterates over own and
       * inherited source properties.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @alias extend
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} [sources] The source objects.
       * @returns {Object} Returns `object`.
       * @see _.assign
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       * }
       *
       * function Bar() {
       *   this.c = 3;
       * }
       *
       * Foo.prototype.b = 2;
       * Bar.prototype.d = 4;
       *
       * _.assignIn({ 'a': 0 }, new Foo, new Bar);
       * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
       */
      var assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
      });

      /**
       * This method is like `_.assignIn` except that it accepts `customizer`
       * which is invoked to produce the assigned values. If `customizer` returns
       * `undefined`, assignment is handled by the method instead. The `customizer`
       * is invoked with five arguments: (objValue, srcValue, key, object, source).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @alias extendWith
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} sources The source objects.
       * @param {Function} [customizer] The function to customize assigned values.
       * @returns {Object} Returns `object`.
       * @see _.assignWith
       * @example
       *
       * function customizer(objValue, srcValue) {
       *   return _.isUndefined(objValue) ? srcValue : objValue;
       * }
       *
       * var defaults = _.partialRight(_.assignInWith, customizer);
       *
       * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
       * // => { 'a': 1, 'b': 2 }
       */
      var assignInWith = createAssigner(function(
        object,
        source,
        srcIndex,
        customizer
      ) {
        copyObject(source, keysIn(source), object, customizer);
      });

      /**
       * This method is like `_.assign` except that it accepts `customizer`
       * which is invoked to produce the assigned values. If `customizer` returns
       * `undefined`, assignment is handled by the method instead. The `customizer`
       * is invoked with five arguments: (objValue, srcValue, key, object, source).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} sources The source objects.
       * @param {Function} [customizer] The function to customize assigned values.
       * @returns {Object} Returns `object`.
       * @see _.assignInWith
       * @example
       *
       * function customizer(objValue, srcValue) {
       *   return _.isUndefined(objValue) ? srcValue : objValue;
       * }
       *
       * var defaults = _.partialRight(_.assignWith, customizer);
       *
       * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
       * // => { 'a': 1, 'b': 2 }
       */
      var assignWith = createAssigner(function(
        object,
        source,
        srcIndex,
        customizer
      ) {
        copyObject(source, keys(source), object, customizer);
      });

      /**
       * Creates an array of values corresponding to `paths` of `object`.
       *
       * @static
       * @memberOf _
       * @since 1.0.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {...(string|string[])} [paths] The property paths to pick.
       * @returns {Array} Returns the picked values.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
       *
       * _.at(object, ['a[0].b.c', 'a[1]']);
       * // => [3, 4]
       */
      var at = flatRest(baseAt);

      /**
       * Creates an object that inherits from the `prototype` object. If a
       * `properties` object is given, its own enumerable string keyed properties
       * are assigned to the created object.
       *
       * @static
       * @memberOf _
       * @since 2.3.0
       * @category Object
       * @param {Object} prototype The object to inherit from.
       * @param {Object} [properties] The properties to assign to the object.
       * @returns {Object} Returns the new object.
       * @example
       *
       * function Shape() {
       *   this.x = 0;
       *   this.y = 0;
       * }
       *
       * function Circle() {
       *   Shape.call(this);
       * }
       *
       * Circle.prototype = _.create(Shape.prototype, {
       *   'constructor': Circle
       * });
       *
       * var circle = new Circle;
       * circle instanceof Circle;
       * // => true
       *
       * circle instanceof Shape;
       * // => true
       */
      function create(prototype, properties) {
        var result = baseCreate(prototype);
        return properties == null ? result : baseAssign(result, properties);
      }

      /**
       * Assigns own and inherited enumerable string keyed properties of source
       * objects to the destination object for all destination properties that
       * resolve to `undefined`. Source objects are applied from left to right.
       * Once a property is set, additional values of the same property are ignored.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} [sources] The source objects.
       * @returns {Object} Returns `object`.
       * @see _.defaultsDeep
       * @example
       *
       * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
       * // => { 'a': 1, 'b': 2 }
       */
      var defaults = baseRest(function(object, sources) {
        object = Object(object);

        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined$1;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }

        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;

          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];

            if (
              value === undefined$1 ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))
            ) {
              object[key] = source[key];
            }
          }
        }

        return object;
      });

      /**
       * This method is like `_.defaults` except that it recursively assigns
       * default properties.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 3.10.0
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} [sources] The source objects.
       * @returns {Object} Returns `object`.
       * @see _.defaults
       * @example
       *
       * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
       * // => { 'a': { 'b': 2, 'c': 3 } }
       */
      var defaultsDeep = baseRest(function(args) {
        args.push(undefined$1, customDefaultsMerge);
        return apply(mergeWith, undefined$1, args);
      });

      /**
       * This method is like `_.find` except that it returns the key of the first
       * element `predicate` returns truthy for instead of the element itself.
       *
       * @static
       * @memberOf _
       * @since 1.1.0
       * @category Object
       * @param {Object} object The object to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {string|undefined} Returns the key of the matched element,
       *  else `undefined`.
       * @example
       *
       * var users = {
       *   'barney':  { 'age': 36, 'active': true },
       *   'fred':    { 'age': 40, 'active': false },
       *   'pebbles': { 'age': 1,  'active': true }
       * };
       *
       * _.findKey(users, function(o) { return o.age < 40; });
       * // => 'barney' (iteration order is not guaranteed)
       *
       * // The `_.matches` iteratee shorthand.
       * _.findKey(users, { 'age': 1, 'active': true });
       * // => 'pebbles'
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.findKey(users, ['active', false]);
       * // => 'fred'
       *
       * // The `_.property` iteratee shorthand.
       * _.findKey(users, 'active');
       * // => 'barney'
       */
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }

      /**
       * This method is like `_.findKey` except that it iterates over elements of
       * a collection in the opposite order.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Object
       * @param {Object} object The object to inspect.
       * @param {Function} [predicate=_.identity] The function invoked per iteration.
       * @returns {string|undefined} Returns the key of the matched element,
       *  else `undefined`.
       * @example
       *
       * var users = {
       *   'barney':  { 'age': 36, 'active': true },
       *   'fred':    { 'age': 40, 'active': false },
       *   'pebbles': { 'age': 1,  'active': true }
       * };
       *
       * _.findLastKey(users, function(o) { return o.age < 40; });
       * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
       *
       * // The `_.matches` iteratee shorthand.
       * _.findLastKey(users, { 'age': 36, 'active': true });
       * // => 'barney'
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.findLastKey(users, ['active', false]);
       * // => 'fred'
       *
       * // The `_.property` iteratee shorthand.
       * _.findLastKey(users, 'active');
       * // => 'pebbles'
       */
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }

      /**
       * Iterates over own and inherited enumerable string keyed properties of an
       * object and invokes `iteratee` for each property. The iteratee is invoked
       * with three arguments: (value, key, object). Iteratee functions may exit
       * iteration early by explicitly returning `false`.
       *
       * @static
       * @memberOf _
       * @since 0.3.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns `object`.
       * @see _.forInRight
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.forIn(new Foo, function(value, key) {
       *   console.log(key);
       * });
       * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
       */
      function forIn(object, iteratee) {
        return object == null
          ? object
          : baseFor(object, getIteratee(iteratee, 3), keysIn);
      }

      /**
       * This method is like `_.forIn` except that it iterates over properties of
       * `object` in the opposite order.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns `object`.
       * @see _.forIn
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.forInRight(new Foo, function(value, key) {
       *   console.log(key);
       * });
       * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
       */
      function forInRight(object, iteratee) {
        return object == null
          ? object
          : baseForRight(object, getIteratee(iteratee, 3), keysIn);
      }

      /**
       * Iterates over own enumerable string keyed properties of an object and
       * invokes `iteratee` for each property. The iteratee is invoked with three
       * arguments: (value, key, object). Iteratee functions may exit iteration
       * early by explicitly returning `false`.
       *
       * @static
       * @memberOf _
       * @since 0.3.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns `object`.
       * @see _.forOwnRight
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.forOwn(new Foo, function(value, key) {
       *   console.log(key);
       * });
       * // => Logs 'a' then 'b' (iteration order is not guaranteed).
       */
      function forOwn(object, iteratee) {
        return object && baseForOwn(object, getIteratee(iteratee, 3));
      }

      /**
       * This method is like `_.forOwn` except that it iterates over properties of
       * `object` in the opposite order.
       *
       * @static
       * @memberOf _
       * @since 2.0.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns `object`.
       * @see _.forOwn
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.forOwnRight(new Foo, function(value, key) {
       *   console.log(key);
       * });
       * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
       */
      function forOwnRight(object, iteratee) {
        return object && baseForOwnRight(object, getIteratee(iteratee, 3));
      }

      /**
       * Creates an array of function property names from own enumerable properties
       * of `object`.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to inspect.
       * @returns {Array} Returns the function names.
       * @see _.functionsIn
       * @example
       *
       * function Foo() {
       *   this.a = _.constant('a');
       *   this.b = _.constant('b');
       * }
       *
       * Foo.prototype.c = _.constant('c');
       *
       * _.functions(new Foo);
       * // => ['a', 'b']
       */
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }

      /**
       * Creates an array of function property names from own and inherited
       * enumerable properties of `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The object to inspect.
       * @returns {Array} Returns the function names.
       * @see _.functions
       * @example
       *
       * function Foo() {
       *   this.a = _.constant('a');
       *   this.b = _.constant('b');
       * }
       *
       * Foo.prototype.c = _.constant('c');
       *
       * _.functionsIn(new Foo);
       * // => ['a', 'b', 'c']
       */
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }

      /**
       * Gets the value at `path` of `object`. If the resolved value is
       * `undefined`, the `defaultValue` is returned in its place.
       *
       * @static
       * @memberOf _
       * @since 3.7.0
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to get.
       * @param {*} [defaultValue] The value returned for `undefined` resolved values.
       * @returns {*} Returns the resolved value.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }] };
       *
       * _.get(object, 'a[0].b.c');
       * // => 3
       *
       * _.get(object, ['a', '0', 'b', 'c']);
       * // => 3
       *
       * _.get(object, 'a.b.c', 'default');
       * // => 'default'
       */
      function get(object, path, defaultValue) {
        var result = object == null ? undefined$1 : baseGet(object, path);
        return result === undefined$1 ? defaultValue : result;
      }

      /**
       * Checks if `path` is a direct property of `object`.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path to check.
       * @returns {boolean} Returns `true` if `path` exists, else `false`.
       * @example
       *
       * var object = { 'a': { 'b': 2 } };
       * var other = _.create({ 'a': _.create({ 'b': 2 }) });
       *
       * _.has(object, 'a');
       * // => true
       *
       * _.has(object, 'a.b');
       * // => true
       *
       * _.has(object, ['a', 'b']);
       * // => true
       *
       * _.has(other, 'a');
       * // => false
       */
      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }

      /**
       * Checks if `path` is a direct or inherited property of `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path to check.
       * @returns {boolean} Returns `true` if `path` exists, else `false`.
       * @example
       *
       * var object = _.create({ 'a': _.create({ 'b': 2 }) });
       *
       * _.hasIn(object, 'a');
       * // => true
       *
       * _.hasIn(object, 'a.b');
       * // => true
       *
       * _.hasIn(object, ['a', 'b']);
       * // => true
       *
       * _.hasIn(object, 'b');
       * // => false
       */
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }

      /**
       * Creates an object composed of the inverted keys and values of `object`.
       * If `object` contains duplicate values, subsequent values overwrite
       * property assignments of previous values.
       *
       * @static
       * @memberOf _
       * @since 0.7.0
       * @category Object
       * @param {Object} object The object to invert.
       * @returns {Object} Returns the new inverted object.
       * @example
       *
       * var object = { 'a': 1, 'b': 2, 'c': 1 };
       *
       * _.invert(object);
       * // => { '1': 'c', '2': 'b' }
       */
      var invert = createInverter(function(result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }

        result[value] = key;
      }, constant(identity));

      /**
       * This method is like `_.invert` except that the inverted object is generated
       * from the results of running each element of `object` thru `iteratee`. The
       * corresponding inverted value of each inverted key is an array of keys
       * responsible for generating the inverted value. The iteratee is invoked
       * with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.1.0
       * @category Object
       * @param {Object} object The object to invert.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {Object} Returns the new inverted object.
       * @example
       *
       * var object = { 'a': 1, 'b': 2, 'c': 1 };
       *
       * _.invertBy(object);
       * // => { '1': ['a', 'c'], '2': ['b'] }
       *
       * _.invertBy(object, function(value) {
       *   return 'group' + value;
       * });
       * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
       */
      var invertBy = createInverter(function(result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }

        if (hasOwnProperty.call(result, value)) {
          result[value].push(key);
        } else {
          result[value] = [key];
        }
      }, getIteratee);

      /**
       * Invokes the method at `path` of `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the method to invoke.
       * @param {...*} [args] The arguments to invoke the method with.
       * @returns {*} Returns the result of the invoked method.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
       *
       * _.invoke(object, 'a[0].b.c.slice', 1, 3);
       * // => [2, 3]
       */
      var invoke = baseRest(baseInvoke);

      /**
       * Creates an array of the own enumerable property names of `object`.
       *
       * **Note:** Non-object values are coerced to objects. See the
       * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
       * for more details.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.keys(new Foo);
       * // => ['a', 'b'] (iteration order is not guaranteed)
       *
       * _.keys('hi');
       * // => ['0', '1']
       */
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }

      /**
       * Creates an array of the own and inherited enumerable property names of `object`.
       *
       * **Note:** Non-object values are coerced to objects.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.keysIn(new Foo);
       * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
       */
      function keysIn(object) {
        return isArrayLike(object)
          ? arrayLikeKeys(object, true)
          : baseKeysIn(object);
      }

      /**
       * The opposite of `_.mapValues`; this method creates an object with the
       * same values as `object` and keys generated by running each own enumerable
       * string keyed property of `object` thru `iteratee`. The iteratee is invoked
       * with three arguments: (value, key, object).
       *
       * @static
       * @memberOf _
       * @since 3.8.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns the new mapped object.
       * @see _.mapValues
       * @example
       *
       * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
       *   return key + value;
       * });
       * // => { 'a1': 1, 'b2': 2 }
       */
      function mapKeys(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);

        baseForOwn(object, function(value, key, object) {
          baseAssignValue(result, iteratee(value, key, object), value);
        });
        return result;
      }

      /**
       * Creates an object with the same keys as `object` and values generated
       * by running each own enumerable string keyed property of `object` thru
       * `iteratee`. The iteratee is invoked with three arguments:
       * (value, key, object).
       *
       * @static
       * @memberOf _
       * @since 2.4.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Object} Returns the new mapped object.
       * @see _.mapKeys
       * @example
       *
       * var users = {
       *   'fred':    { 'user': 'fred',    'age': 40 },
       *   'pebbles': { 'user': 'pebbles', 'age': 1 }
       * };
       *
       * _.mapValues(users, function(o) { return o.age; });
       * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
       *
       * // The `_.property` iteratee shorthand.
       * _.mapValues(users, 'age');
       * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
       */
      function mapValues(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);

        baseForOwn(object, function(value, key, object) {
          baseAssignValue(result, key, iteratee(value, key, object));
        });
        return result;
      }

      /**
       * This method is like `_.assign` except that it recursively merges own and
       * inherited enumerable string keyed properties of source objects into the
       * destination object. Source properties that resolve to `undefined` are
       * skipped if a destination value exists. Array and plain object properties
       * are merged recursively. Other objects and value types are overridden by
       * assignment. Source objects are applied from left to right. Subsequent
       * sources overwrite property assignments of previous sources.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 0.5.0
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} [sources] The source objects.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var object = {
       *   'a': [{ 'b': 2 }, { 'd': 4 }]
       * };
       *
       * var other = {
       *   'a': [{ 'c': 3 }, { 'e': 5 }]
       * };
       *
       * _.merge(object, other);
       * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
       */
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });

      /**
       * This method is like `_.merge` except that it accepts `customizer` which
       * is invoked to produce the merged values of the destination and source
       * properties. If `customizer` returns `undefined`, merging is handled by the
       * method instead. The `customizer` is invoked with six arguments:
       * (objValue, srcValue, key, object, source, stack).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The destination object.
       * @param {...Object} sources The source objects.
       * @param {Function} customizer The function to customize assigned values.
       * @returns {Object} Returns `object`.
       * @example
       *
       * function customizer(objValue, srcValue) {
       *   if (_.isArray(objValue)) {
       *     return objValue.concat(srcValue);
       *   }
       * }
       *
       * var object = { 'a': [1], 'b': [2] };
       * var other = { 'a': [3], 'b': [4] };
       *
       * _.mergeWith(object, other, customizer);
       * // => { 'a': [1, 3], 'b': [2, 4] }
       */
      var mergeWith = createAssigner(function(
        object,
        source,
        srcIndex,
        customizer
      ) {
        baseMerge(object, source, srcIndex, customizer);
      });

      /**
       * The opposite of `_.pick`; this method creates an object composed of the
       * own and inherited enumerable property paths of `object` that are not omitted.
       *
       * **Note:** This method is considerably slower than `_.pick`.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The source object.
       * @param {...(string|string[])} [paths] The property paths to omit.
       * @returns {Object} Returns the new object.
       * @example
       *
       * var object = { 'a': 1, 'b': '2', 'c': 3 };
       *
       * _.omit(object, ['a', 'c']);
       * // => { 'b': '2' }
       */
      var omit = flatRest(function(object, paths) {
        var result = {};
        if (object == null) {
          return result;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result);
        if (isDeep) {
          result = baseClone(
            result,
            CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG,
            customOmitClone
          );
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result, paths[length]);
        }
        return result;
      });

      /**
       * The opposite of `_.pickBy`; this method creates an object composed of
       * the own and inherited enumerable string keyed properties of `object` that
       * `predicate` doesn't return truthy for. The predicate is invoked with two
       * arguments: (value, key).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The source object.
       * @param {Function} [predicate=_.identity] The function invoked per property.
       * @returns {Object} Returns the new object.
       * @example
       *
       * var object = { 'a': 1, 'b': '2', 'c': 3 };
       *
       * _.omitBy(object, _.isNumber);
       * // => { 'b': '2' }
       */
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }

      /**
       * Creates an object composed of the picked `object` properties.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The source object.
       * @param {...(string|string[])} [paths] The property paths to pick.
       * @returns {Object} Returns the new object.
       * @example
       *
       * var object = { 'a': 1, 'b': '2', 'c': 3 };
       *
       * _.pick(object, ['a', 'c']);
       * // => { 'a': 1, 'c': 3 }
       */
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });

      /**
       * Creates an object composed of the `object` properties `predicate` returns
       * truthy for. The predicate is invoked with two arguments: (value, key).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The source object.
       * @param {Function} [predicate=_.identity] The function invoked per property.
       * @returns {Object} Returns the new object.
       * @example
       *
       * var object = { 'a': 1, 'b': '2', 'c': 3 };
       *
       * _.pickBy(object, _.isNumber);
       * // => { 'a': 1, 'c': 3 }
       */
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object), function(prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function(value, path) {
          return predicate(value, path[0]);
        });
      }

      /**
       * This method is like `_.get` except that if the resolved value is a
       * function it's invoked with the `this` binding of its parent object and
       * its result is returned.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @param {Array|string} path The path of the property to resolve.
       * @param {*} [defaultValue] The value returned for `undefined` resolved values.
       * @returns {*} Returns the resolved value.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
       *
       * _.result(object, 'a[0].b.c1');
       * // => 3
       *
       * _.result(object, 'a[0].b.c2');
       * // => 4
       *
       * _.result(object, 'a[0].b.c3', 'default');
       * // => 'default'
       *
       * _.result(object, 'a[0].b.c3', _.constant('default'));
       * // => 'default'
       */
      function result(object, path, defaultValue) {
        path = castPath(path, object);

        var index = -1,
          length = path.length;

        // Ensure the loop is entered when path is empty.
        if (!length) {
          length = 1;
          object = undefined$1;
        }
        while (++index < length) {
          var value = object == null ? undefined$1 : object[toKey(path[index])];
          if (value === undefined$1) {
            index = length;
            value = defaultValue;
          }
          object = isFunction(value) ? value.call(object) : value;
        }
        return object;
      }

      /**
       * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
       * it's created. Arrays are created for missing index properties while objects
       * are created for all other missing properties. Use `_.setWith` to customize
       * `path` creation.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 3.7.0
       * @category Object
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to set.
       * @param {*} value The value to set.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }] };
       *
       * _.set(object, 'a[0].b.c', 4);
       * console.log(object.a[0].b.c);
       * // => 4
       *
       * _.set(object, ['x', '0', 'y', 'z'], 5);
       * console.log(object.x[0].y.z);
       * // => 5
       */
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }

      /**
       * This method is like `_.set` except that it accepts `customizer` which is
       * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
       * path creation is handled by the method instead. The `customizer` is invoked
       * with three arguments: (nsValue, key, nsObject).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to set.
       * @param {*} value The value to set.
       * @param {Function} [customizer] The function to customize assigned values.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var object = {};
       *
       * _.setWith(object, '[0][1]', 'a', Object);
       * // => { '0': { '1': 'a' } }
       */
      function setWith(object, path, value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null
          ? object
          : baseSet(object, path, value, customizer);
      }

      /**
       * Creates an array of own enumerable string keyed-value pairs for `object`
       * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
       * entries are returned.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @alias entries
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the key-value pairs.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.toPairs(new Foo);
       * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
       */
      var toPairs = createToPairs(keys);

      /**
       * Creates an array of own and inherited enumerable string keyed-value pairs
       * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
       * or set, its entries are returned.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @alias entriesIn
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the key-value pairs.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.toPairsIn(new Foo);
       * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
       */
      var toPairsIn = createToPairs(keysIn);

      /**
       * An alternative to `_.reduce`; this method transforms `object` to a new
       * `accumulator` object which is the result of running each of its own
       * enumerable string keyed properties thru `iteratee`, with each invocation
       * potentially mutating the `accumulator` object. If `accumulator` is not
       * provided, a new object with the same `[[Prototype]]` will be used. The
       * iteratee is invoked with four arguments: (accumulator, value, key, object).
       * Iteratee functions may exit iteration early by explicitly returning `false`.
       *
       * @static
       * @memberOf _
       * @since 1.3.0
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @param {*} [accumulator] The custom accumulator value.
       * @returns {*} Returns the accumulated value.
       * @example
       *
       * _.transform([2, 3, 4], function(result, n) {
       *   result.push(n *= n);
       *   return n % 2 == 0;
       * }, []);
       * // => [4, 9]
       *
       * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
       *   (result[value] || (result[value] = [])).push(key);
       * }, {});
       * // => { '1': ['a', 'c'], '2': ['b'] }
       */
      function transform(object, iteratee, accumulator) {
        var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

        iteratee = getIteratee(iteratee, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor)
              ? baseCreate(getPrototype(object))
              : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function(
          value,
          index,
          object
        ) {
          return iteratee(accumulator, value, index, object);
        });
        return accumulator;
      }

      /**
       * Removes the property at `path` of `object`.
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Object
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to unset.
       * @returns {boolean} Returns `true` if the property is deleted, else `false`.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 7 } }] };
       * _.unset(object, 'a[0].b.c');
       * // => true
       *
       * console.log(object);
       * // => { 'a': [{ 'b': {} }] };
       *
       * _.unset(object, ['a', '0', 'b', 'c']);
       * // => true
       *
       * console.log(object);
       * // => { 'a': [{ 'b': {} }] };
       */
      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }

      /**
       * This method is like `_.set` except that accepts `updater` to produce the
       * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
       * is invoked with one argument: (value).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.6.0
       * @category Object
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to set.
       * @param {Function} updater The function to produce the updated value.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var object = { 'a': [{ 'b': { 'c': 3 } }] };
       *
       * _.update(object, 'a[0].b.c', function(n) { return n * n; });
       * console.log(object.a[0].b.c);
       * // => 9
       *
       * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
       * console.log(object.x[0].y.z);
       * // => 0
       */
      function update(object, path, updater) {
        return object == null
          ? object
          : baseUpdate(object, path, castFunction(updater));
      }

      /**
       * This method is like `_.update` except that it accepts `customizer` which is
       * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
       * path creation is handled by the method instead. The `customizer` is invoked
       * with three arguments: (nsValue, key, nsObject).
       *
       * **Note:** This method mutates `object`.
       *
       * @static
       * @memberOf _
       * @since 4.6.0
       * @category Object
       * @param {Object} object The object to modify.
       * @param {Array|string} path The path of the property to set.
       * @param {Function} updater The function to produce the updated value.
       * @param {Function} [customizer] The function to customize assigned values.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var object = {};
       *
       * _.updateWith(object, '[0][1]', _.constant('a'), Object);
       * // => { '0': { '1': 'a' } }
       */
      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null
          ? object
          : baseUpdate(object, path, castFunction(updater), customizer);
      }

      /**
       * Creates an array of the own enumerable string keyed property values of `object`.
       *
       * **Note:** Non-object values are coerced to objects.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property values.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.values(new Foo);
       * // => [1, 2] (iteration order is not guaranteed)
       *
       * _.values('hi');
       * // => ['h', 'i']
       */
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }

      /**
       * Creates an array of the own and inherited enumerable string keyed property
       * values of `object`.
       *
       * **Note:** Non-object values are coerced to objects.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property values.
       * @example
       *
       * function Foo() {
       *   this.a = 1;
       *   this.b = 2;
       * }
       *
       * Foo.prototype.c = 3;
       *
       * _.valuesIn(new Foo);
       * // => [1, 2, 3] (iteration order is not guaranteed)
       */
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }

      /*------------------------------------------------------------------------*/

      /**
       * Clamps `number` within the inclusive `lower` and `upper` bounds.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Number
       * @param {number} number The number to clamp.
       * @param {number} [lower] The lower bound.
       * @param {number} upper The upper bound.
       * @returns {number} Returns the clamped number.
       * @example
       *
       * _.clamp(-10, -5, 5);
       * // => -5
       *
       * _.clamp(10, -5, 5);
       * // => 5
       */
      function clamp(number, lower, upper) {
        if (upper === undefined$1) {
          upper = lower;
          lower = undefined$1;
        }
        if (upper !== undefined$1) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined$1) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }

      /**
       * Checks if `n` is between `start` and up to, but not including, `end`. If
       * `end` is not specified, it's set to `start` with `start` then set to `0`.
       * If `start` is greater than `end` the params are swapped to support
       * negative ranges.
       *
       * @static
       * @memberOf _
       * @since 3.3.0
       * @category Number
       * @param {number} number The number to check.
       * @param {number} [start=0] The start of the range.
       * @param {number} end The end of the range.
       * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
       * @see _.range, _.rangeRight
       * @example
       *
       * _.inRange(3, 2, 4);
       * // => true
       *
       * _.inRange(4, 8);
       * // => true
       *
       * _.inRange(4, 2);
       * // => false
       *
       * _.inRange(2, 2);
       * // => false
       *
       * _.inRange(1.2, 2);
       * // => true
       *
       * _.inRange(5.2, 4);
       * // => false
       *
       * _.inRange(-3, -2, -6);
       * // => true
       */
      function inRange(number, start, end) {
        start = toFinite(start);
        if (end === undefined$1) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start, end);
      }

      /**
       * Produces a random number between the inclusive `lower` and `upper` bounds.
       * If only one argument is provided a number between `0` and the given number
       * is returned. If `floating` is `true`, or either `lower` or `upper` are
       * floats, a floating-point number is returned instead of an integer.
       *
       * **Note:** JavaScript follows the IEEE-754 standard for resolving
       * floating-point values which can produce unexpected results.
       *
       * @static
       * @memberOf _
       * @since 0.7.0
       * @category Number
       * @param {number} [lower=0] The lower bound.
       * @param {number} [upper=1] The upper bound.
       * @param {boolean} [floating] Specify returning a floating-point number.
       * @returns {number} Returns the random number.
       * @example
       *
       * _.random(0, 5);
       * // => an integer between 0 and 5
       *
       * _.random(5);
       * // => also an integer between 0 and 5
       *
       * _.random(5, true);
       * // => a floating-point number between 0 and 5
       *
       * _.random(1.2, 5.2);
       * // => a floating-point number between 1.2 and 5.2
       */
      function random(lower, upper, floating) {
        if (
          floating &&
          typeof floating != 'boolean' &&
          isIterateeCall(lower, upper, floating)
        ) {
          upper = floating = undefined$1;
        }
        if (floating === undefined$1) {
          if (typeof upper == 'boolean') {
            floating = upper;
            upper = undefined$1;
          } else if (typeof lower == 'boolean') {
            floating = lower;
            lower = undefined$1;
          }
        }
        if (lower === undefined$1 && upper === undefined$1) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined$1) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(
            lower +
              rand *
                (upper -
                  lower +
                  freeParseFloat('1e-' + ((rand + '').length - 1))),
            upper
          );
        }
        return baseRandom(lower, upper);
      }

      /*------------------------------------------------------------------------*/

      /**
       * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the camel cased string.
       * @example
       *
       * _.camelCase('Foo Bar');
       * // => 'fooBar'
       *
       * _.camelCase('--foo-bar--');
       * // => 'fooBar'
       *
       * _.camelCase('__FOO_BAR__');
       * // => 'fooBar'
       */
      var camelCase = createCompounder(function(result, word, index) {
        word = word.toLowerCase();
        return result + (index ? capitalize(word) : word);
      });

      /**
       * Converts the first character of `string` to upper case and the remaining
       * to lower case.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to capitalize.
       * @returns {string} Returns the capitalized string.
       * @example
       *
       * _.capitalize('FRED');
       * // => 'Fred'
       */
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }

      /**
       * Deburrs `string` by converting
       * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
       * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
       * letters to basic Latin letters and removing
       * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to deburr.
       * @returns {string} Returns the deburred string.
       * @example
       *
       * _.deburr('déjà vu');
       * // => 'deja vu'
       */
      function deburr(string) {
        string = toString(string);
        return (
          string &&
          string.replace(reLatin, deburrLetter).replace(reComboMark, '')
        );
      }

      /**
       * Checks if `string` ends with the given target string.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to inspect.
       * @param {string} [target] The string to search for.
       * @param {number} [position=string.length] The position to search up to.
       * @returns {boolean} Returns `true` if `string` ends with `target`,
       *  else `false`.
       * @example
       *
       * _.endsWith('abc', 'c');
       * // => true
       *
       * _.endsWith('abc', 'b');
       * // => false
       *
       * _.endsWith('abc', 'b', 2);
       * // => true
       */
      function endsWith(string, target, position) {
        string = toString(string);
        target = baseToString(target);

        var length = string.length;
        position =
          position === undefined$1
            ? length
            : baseClamp(toInteger(position), 0, length);

        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }

      /**
       * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
       * corresponding HTML entities.
       *
       * **Note:** No other characters are escaped. To escape additional
       * characters use a third-party library like [_he_](https://mths.be/he).
       *
       * Though the ">" character is escaped for symmetry, characters like
       * ">" and "/" don't need escaping in HTML and have no special meaning
       * unless they're part of a tag or unquoted attribute value. See
       * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
       * (under "semi-related fun fact") for more details.
       *
       * When working with HTML you should always
       * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
       * XSS vectors.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category String
       * @param {string} [string=''] The string to escape.
       * @returns {string} Returns the escaped string.
       * @example
       *
       * _.escape('fred, barney, & pebbles');
       * // => 'fred, barney, &amp; pebbles'
       */
      function escape(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string)
          ? string.replace(reUnescapedHtml, escapeHtmlChar)
          : string;
      }

      /**
       * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
       * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to escape.
       * @returns {string} Returns the escaped string.
       * @example
       *
       * _.escapeRegExp('[lodash](https://lodash.com/)');
       * // => '\[lodash\]\(https://lodash\.com/\)'
       */
      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string)
          ? string.replace(reRegExpChar, '\\$&')
          : string;
      }

      /**
       * Converts `string` to
       * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the kebab cased string.
       * @example
       *
       * _.kebabCase('Foo Bar');
       * // => 'foo-bar'
       *
       * _.kebabCase('fooBar');
       * // => 'foo-bar'
       *
       * _.kebabCase('__FOO_BAR__');
       * // => 'foo-bar'
       */
      var kebabCase = createCompounder(function(result, word, index) {
        return result + (index ? '-' : '') + word.toLowerCase();
      });

      /**
       * Converts `string`, as space separated words, to lower case.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the lower cased string.
       * @example
       *
       * _.lowerCase('--Foo-Bar--');
       * // => 'foo bar'
       *
       * _.lowerCase('fooBar');
       * // => 'foo bar'
       *
       * _.lowerCase('__FOO_BAR__');
       * // => 'foo bar'
       */
      var lowerCase = createCompounder(function(result, word, index) {
        return result + (index ? ' ' : '') + word.toLowerCase();
      });

      /**
       * Converts the first character of `string` to lower case.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the converted string.
       * @example
       *
       * _.lowerFirst('Fred');
       * // => 'fred'
       *
       * _.lowerFirst('FRED');
       * // => 'fRED'
       */
      var lowerFirst = createCaseFirst('toLowerCase');

      /**
       * Pads `string` on the left and right sides if it's shorter than `length`.
       * Padding characters are truncated if they can't be evenly divided by `length`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to pad.
       * @param {number} [length=0] The padding length.
       * @param {string} [chars=' '] The string used as padding.
       * @returns {string} Returns the padded string.
       * @example
       *
       * _.pad('abc', 8);
       * // => '  abc   '
       *
       * _.pad('abc', 8, '_-');
       * // => '_-abc_-_'
       *
       * _.pad('abc', 3);
       * // => 'abc'
       */
      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);

        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return (
          createPadding(nativeFloor(mid), chars) +
          string +
          createPadding(nativeCeil(mid), chars)
        );
      }

      /**
       * Pads `string` on the right side if it's shorter than `length`. Padding
       * characters are truncated if they exceed `length`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to pad.
       * @param {number} [length=0] The padding length.
       * @param {string} [chars=' '] The string used as padding.
       * @returns {string} Returns the padded string.
       * @example
       *
       * _.padEnd('abc', 6);
       * // => 'abc   '
       *
       * _.padEnd('abc', 6, '_-');
       * // => 'abc_-_'
       *
       * _.padEnd('abc', 3);
       * // => 'abc'
       */
      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);

        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length
          ? string + createPadding(length - strLength, chars)
          : string;
      }

      /**
       * Pads `string` on the left side if it's shorter than `length`. Padding
       * characters are truncated if they exceed `length`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to pad.
       * @param {number} [length=0] The padding length.
       * @param {string} [chars=' '] The string used as padding.
       * @returns {string} Returns the padded string.
       * @example
       *
       * _.padStart('abc', 6);
       * // => '   abc'
       *
       * _.padStart('abc', 6, '_-');
       * // => '_-_abc'
       *
       * _.padStart('abc', 3);
       * // => 'abc'
       */
      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);

        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length
          ? createPadding(length - strLength, chars) + string
          : string;
      }

      /**
       * Converts `string` to an integer of the specified radix. If `radix` is
       * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
       * hexadecimal, in which case a `radix` of `16` is used.
       *
       * **Note:** This method aligns with the
       * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
       *
       * @static
       * @memberOf _
       * @since 1.1.0
       * @category String
       * @param {string} string The string to convert.
       * @param {number} [radix=10] The radix to interpret `value` by.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {number} Returns the converted integer.
       * @example
       *
       * _.parseInt('08');
       * // => 8
       *
       * _.map(['6', '08', '10'], _.parseInt);
       * // => [6, 8, 10]
       */
      function parseInt(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(
          toString(string).replace(reTrimStart, ''),
          radix || 0
        );
      }

      /**
       * Repeats the given string `n` times.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to repeat.
       * @param {number} [n=1] The number of times to repeat the string.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {string} Returns the repeated string.
       * @example
       *
       * _.repeat('*', 3);
       * // => '***'
       *
       * _.repeat('abc', 2);
       * // => 'abcabc'
       *
       * _.repeat('abc', 0);
       * // => ''
       */
      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString(string), n);
      }

      /**
       * Replaces matches for `pattern` in `string` with `replacement`.
       *
       * **Note:** This method is based on
       * [`String#replace`](https://mdn.io/String/replace).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to modify.
       * @param {RegExp|string} pattern The pattern to replace.
       * @param {Function|string} replacement The match replacement.
       * @returns {string} Returns the modified string.
       * @example
       *
       * _.replace('Hi Fred', 'Fred', 'Barney');
       * // => 'Hi Barney'
       */
      function replace() {
        var args = arguments,
          string = toString(args[0]);

        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }

      /**
       * Converts `string` to
       * [snake case](https://en.wikipedia.org/wiki/Snake_case).
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the snake cased string.
       * @example
       *
       * _.snakeCase('Foo Bar');
       * // => 'foo_bar'
       *
       * _.snakeCase('fooBar');
       * // => 'foo_bar'
       *
       * _.snakeCase('--FOO-BAR--');
       * // => 'foo_bar'
       */
      var snakeCase = createCompounder(function(result, word, index) {
        return result + (index ? '_' : '') + word.toLowerCase();
      });

      /**
       * Splits `string` by `separator`.
       *
       * **Note:** This method is based on
       * [`String#split`](https://mdn.io/String/split).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to split.
       * @param {RegExp|string} separator The separator pattern to split by.
       * @param {number} [limit] The length to truncate results to.
       * @returns {Array} Returns the string segments.
       * @example
       *
       * _.split('a-b-c', '-', 2);
       * // => ['a', 'b']
       */
      function split(string, separator, limit) {
        if (
          limit &&
          typeof limit != 'number' &&
          isIterateeCall(string, separator, limit)
        ) {
          separator = limit = undefined$1;
        }
        limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString(string);
        if (
          string &&
          (typeof separator == 'string' ||
            (separator != null && !isRegExp(separator)))
        ) {
          separator = baseToString(separator);
          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator, limit);
      }

      /**
       * Converts `string` to
       * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
       *
       * @static
       * @memberOf _
       * @since 3.1.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the start cased string.
       * @example
       *
       * _.startCase('--foo-bar--');
       * // => 'Foo Bar'
       *
       * _.startCase('fooBar');
       * // => 'Foo Bar'
       *
       * _.startCase('__FOO_BAR__');
       * // => 'FOO BAR'
       */
      var startCase = createCompounder(function(result, word, index) {
        return result + (index ? ' ' : '') + upperFirst(word);
      });

      /**
       * Checks if `string` starts with the given target string.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to inspect.
       * @param {string} [target] The string to search for.
       * @param {number} [position=0] The position to search from.
       * @returns {boolean} Returns `true` if `string` starts with `target`,
       *  else `false`.
       * @example
       *
       * _.startsWith('abc', 'a');
       * // => true
       *
       * _.startsWith('abc', 'b');
       * // => false
       *
       * _.startsWith('abc', 'b', 1);
       * // => true
       */
      function startsWith(string, target, position) {
        string = toString(string);
        position =
          position == null
            ? 0
            : baseClamp(toInteger(position), 0, string.length);

        target = baseToString(target);
        return string.slice(position, position + target.length) == target;
      }

      /**
       * Creates a compiled template function that can interpolate data properties
       * in "interpolate" delimiters, HTML-escape interpolated data properties in
       * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
       * properties may be accessed as free variables in the template. If a setting
       * object is given, it takes precedence over `_.templateSettings` values.
       *
       * **Note:** In the development build `_.template` utilizes
       * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
       * for easier debugging.
       *
       * For more information on precompiling templates see
       * [lodash's custom builds documentation](https://lodash.com/custom-builds).
       *
       * For more information on Chrome extension sandboxes see
       * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category String
       * @param {string} [string=''] The template string.
       * @param {Object} [options={}] The options object.
       * @param {RegExp} [options.escape=_.templateSettings.escape]
       *  The HTML "escape" delimiter.
       * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
       *  The "evaluate" delimiter.
       * @param {Object} [options.imports=_.templateSettings.imports]
       *  An object to import into the template as free variables.
       * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
       *  The "interpolate" delimiter.
       * @param {string} [options.sourceURL='lodash.templateSources[n]']
       *  The sourceURL of the compiled template.
       * @param {string} [options.variable='obj']
       *  The data object variable name.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Function} Returns the compiled template function.
       * @example
       *
       * // Use the "interpolate" delimiter to create a compiled template.
       * var compiled = _.template('hello <%= user %>!');
       * compiled({ 'user': 'fred' });
       * // => 'hello fred!'
       *
       * // Use the HTML "escape" delimiter to escape data property values.
       * var compiled = _.template('<b><%- value %></b>');
       * compiled({ 'value': '<script>' });
       * // => '<b>&lt;script&gt;</b>'
       *
       * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
       * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
       * compiled({ 'users': ['fred', 'barney'] });
       * // => '<li>fred</li><li>barney</li>'
       *
       * // Use the internal `print` function in "evaluate" delimiters.
       * var compiled = _.template('<% print("hello " + user); %>!');
       * compiled({ 'user': 'barney' });
       * // => 'hello barney!'
       *
       * // Use the ES template literal delimiter as an "interpolate" delimiter.
       * // Disable support by replacing the "interpolate" delimiter.
       * var compiled = _.template('hello ${ user }!');
       * compiled({ 'user': 'pebbles' });
       * // => 'hello pebbles!'
       *
       * // Use backslashes to treat delimiters as plain text.
       * var compiled = _.template('<%= "\\<%- value %\\>" %>');
       * compiled({ 'value': 'ignored' });
       * // => '<%- value %>'
       *
       * // Use the `imports` option to import `jQuery` as `jq`.
       * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
       * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
       * compiled({ 'users': ['fred', 'barney'] });
       * // => '<li>fred</li><li>barney</li>'
       *
       * // Use the `sourceURL` option to specify a custom sourceURL for the template.
       * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
       * compiled(data);
       * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
       *
       * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
       * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
       * compiled.source;
       * // => function(data) {
       * //   var __t, __p = '';
       * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
       * //   return __p;
       * // }
       *
       * // Use custom template delimiters.
       * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
       * var compiled = _.template('hello {{ user }}!');
       * compiled({ 'user': 'mustache' });
       * // => 'hello mustache!'
       *
       * // Use the `source` property to inline compiled templates for meaningful
       * // line numbers in error messages and stack traces.
       * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
       *   var JST = {\
       *     "main": ' + _.template(mainText).source + '\
       *   };\
       * ');
       */
      function template(string, options, guard) {
        // Based on John Resig's `tmpl` implementation
        // (http://ejohn.org/blog/javascript-micro-templating/)
        // and Laura Doktorova's doT.js (https://github.com/olado/doT).
        var settings = lodash.templateSettings;

        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined$1;
        }
        string = toString(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);

        var imports = assignInWith(
            {},
            options.imports,
            settings.imports,
            customDefaultsAssignIn
          ),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

        var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

        // Compile the regexp to match each delimiter.
        var reDelimiters = RegExp(
          (options.escape || reNoMatch).source +
            '|' +
            interpolate.source +
            '|' +
            (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source +
            '|' +
            (options.evaluate || reNoMatch).source +
            '|$',
          'g'
        );

        // Use a sourceURL for easier debugging.
        // The sourceURL gets injected into the source that's eval-ed, so be careful
        // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
        // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.
        var sourceURL =
          '//# sourceURL=' +
          (hasOwnProperty.call(options, 'sourceURL')
            ? (options.sourceURL + '').replace(/[\r\n]/g, ' ')
            : 'lodash.templateSources[' + ++templateCounter + ']') +
          '\n';

        string.replace(reDelimiters, function(
          match,
          escapeValue,
          interpolateValue,
          esTemplateValue,
          evaluateValue,
          offset
        ) {
          interpolateValue || (interpolateValue = esTemplateValue);

          // Escape characters that can't be included in string literals.
          source += string
            .slice(index, offset)
            .replace(reUnescapedString, escapeStringChar);

          // Replace delimiters with snippets.
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source +=
              "' +\n((__t = (" +
              interpolateValue +
              ")) == null ? '' : __t) +\n'";
          }
          index = offset + match.length;

          // The JS engine embedded in Adobe products needs `match` returned in
          // order to produce the correct `offset` value.
          return match;
        });

        source += "';\n";

        // If `variable` is not specified wrap a with-statement around the generated
        // code to add the data object to the top of the scope chain.
        // Like with sourceURL, we take care to not check the option's prototype,
        // as this configuration is a code injection vector.
        var variable =
          hasOwnProperty.call(options, 'variable') && options.variable;
        if (!variable) {
          source = 'with (obj) {\n' + source + '\n}\n';
        }
        // Cleanup code by stripping empty strings.
        source = (isEvaluating
          ? source.replace(reEmptyStringLeading, '')
          : source
        )
          .replace(reEmptyStringMiddle, '$1')
          .replace(reEmptyStringTrailing, '$1;');

        // Frame code as the function body.
        source =
          'function(' +
          (variable || 'obj') +
          ') {\n' +
          (variable ? '' : 'obj || (obj = {});\n') +
          "var __t, __p = ''" +
          (isEscaping ? ', __e = _.escape' : '') +
          (isEvaluating
            ? ', __j = Array.prototype.join;\n' +
              "function print() { __p += __j.call(arguments, '') }\n"
            : ';\n') +
          source +
          'return __p\n}';

        var result = attempt(function() {
          return Function(importsKeys, sourceURL + 'return ' + source).apply(
            undefined$1,
            importsValues
          );
        });

        // Provide the compiled function's source by its `toString` method or
        // the `source` property as a convenience for inlining compiled templates.
        result.source = source;
        if (isError(result)) {
          throw result;
        }
        return result;
      }

      /**
       * Converts `string`, as a whole, to lower case just like
       * [String#toLowerCase](https://mdn.io/toLowerCase).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the lower cased string.
       * @example
       *
       * _.toLower('--Foo-Bar--');
       * // => '--foo-bar--'
       *
       * _.toLower('fooBar');
       * // => 'foobar'
       *
       * _.toLower('__FOO_BAR__');
       * // => '__foo_bar__'
       */
      function toLower(value) {
        return toString(value).toLowerCase();
      }

      /**
       * Converts `string`, as a whole, to upper case just like
       * [String#toUpperCase](https://mdn.io/toUpperCase).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the upper cased string.
       * @example
       *
       * _.toUpper('--foo-bar--');
       * // => '--FOO-BAR--'
       *
       * _.toUpper('fooBar');
       * // => 'FOOBAR'
       *
       * _.toUpper('__foo_bar__');
       * // => '__FOO_BAR__'
       */
      function toUpper(value) {
        return toString(value).toUpperCase();
      }

      /**
       * Removes leading and trailing whitespace or specified characters from `string`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to trim.
       * @param {string} [chars=whitespace] The characters to trim.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {string} Returns the trimmed string.
       * @example
       *
       * _.trim('  abc  ');
       * // => 'abc'
       *
       * _.trim('-_-abc-_-', '_-');
       * // => 'abc'
       *
       * _.map(['  foo  ', '  bar  '], _.trim);
       * // => ['foo', 'bar']
       */
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrim, '');
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

        return castSlice(strSymbols, start, end).join('');
      }

      /**
       * Removes trailing whitespace or specified characters from `string`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to trim.
       * @param {string} [chars=whitespace] The characters to trim.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {string} Returns the trimmed string.
       * @example
       *
       * _.trimEnd('  abc  ');
       * // => '  abc'
       *
       * _.trimEnd('-_-abc-_-', '_-');
       * // => '-_-abc'
       */
      function trimEnd(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimEnd, '');
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

        return castSlice(strSymbols, 0, end).join('');
      }

      /**
       * Removes leading whitespace or specified characters from `string`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to trim.
       * @param {string} [chars=whitespace] The characters to trim.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {string} Returns the trimmed string.
       * @example
       *
       * _.trimStart('  abc  ');
       * // => 'abc  '
       *
       * _.trimStart('-_-abc-_-', '_-');
       * // => 'abc-_-'
       */
      function trimStart(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimStart, '');
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

        return castSlice(strSymbols, start).join('');
      }

      /**
       * Truncates `string` if it's longer than the given maximum string length.
       * The last characters of the truncated string are replaced with the omission
       * string which defaults to "...".
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to truncate.
       * @param {Object} [options={}] The options object.
       * @param {number} [options.length=30] The maximum string length.
       * @param {string} [options.omission='...'] The string to indicate text is omitted.
       * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
       * @returns {string} Returns the truncated string.
       * @example
       *
       * _.truncate('hi-diddly-ho there, neighborino');
       * // => 'hi-diddly-ho there, neighbo...'
       *
       * _.truncate('hi-diddly-ho there, neighborino', {
       *   'length': 24,
       *   'separator': ' '
       * });
       * // => 'hi-diddly-ho there,...'
       *
       * _.truncate('hi-diddly-ho there, neighborino', {
       *   'length': 24,
       *   'separator': /,? +/
       * });
       * // => 'hi-diddly-ho there...'
       *
       * _.truncate('hi-diddly-ho there, neighborino', {
       *   'omission': ' [...]'
       * });
       * // => 'hi-diddly-ho there, neig [...]'
       */
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

        if (isObject(options)) {
          var separator =
            'separator' in options ? options.separator : separator;
          length = 'length' in options ? toInteger(options.length) : length;
          omission =
            'omission' in options ? baseToString(options.omission) : omission;
        }
        string = toString(string);

        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result = strSymbols
          ? castSlice(strSymbols, 0, end).join('')
          : string.slice(0, end);

        if (separator === undefined$1) {
          return result + omission;
        }
        if (strSymbols) {
          end += result.length - end;
        }
        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match,
              substring = result;

            if (!separator.global) {
              separator = RegExp(
                separator.source,
                toString(reFlags.exec(separator)) + 'g'
              );
            }
            separator.lastIndex = 0;
            while ((match = separator.exec(substring))) {
              var newEnd = match.index;
            }
            result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator), end) != end) {
          var index = result.lastIndexOf(separator);
          if (index > -1) {
            result = result.slice(0, index);
          }
        }
        return result + omission;
      }

      /**
       * The inverse of `_.escape`; this method converts the HTML entities
       * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
       * their corresponding characters.
       *
       * **Note:** No other HTML entities are unescaped. To unescape additional
       * HTML entities use a third-party library like [_he_](https://mths.be/he).
       *
       * @static
       * @memberOf _
       * @since 0.6.0
       * @category String
       * @param {string} [string=''] The string to unescape.
       * @returns {string} Returns the unescaped string.
       * @example
       *
       * _.unescape('fred, barney, &amp; pebbles');
       * // => 'fred, barney, & pebbles'
       */
      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string)
          ? string.replace(reEscapedHtml, unescapeHtmlChar)
          : string;
      }

      /**
       * Converts `string`, as space separated words, to upper case.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the upper cased string.
       * @example
       *
       * _.upperCase('--foo-bar');
       * // => 'FOO BAR'
       *
       * _.upperCase('fooBar');
       * // => 'FOO BAR'
       *
       * _.upperCase('__foo_bar__');
       * // => 'FOO BAR'
       */
      var upperCase = createCompounder(function(result, word, index) {
        return result + (index ? ' ' : '') + word.toUpperCase();
      });

      /**
       * Converts the first character of `string` to upper case.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category String
       * @param {string} [string=''] The string to convert.
       * @returns {string} Returns the converted string.
       * @example
       *
       * _.upperFirst('fred');
       * // => 'Fred'
       *
       * _.upperFirst('FRED');
       * // => 'FRED'
       */
      var upperFirst = createCaseFirst('toUpperCase');

      /**
       * Splits `string` into an array of its words.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category String
       * @param {string} [string=''] The string to inspect.
       * @param {RegExp|string} [pattern] The pattern to match words.
       * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
       * @returns {Array} Returns the words of `string`.
       * @example
       *
       * _.words('fred, barney, & pebbles');
       * // => ['fred', 'barney', 'pebbles']
       *
       * _.words('fred, barney, & pebbles', /[^, ]+/g);
       * // => ['fred', 'barney', '&', 'pebbles']
       */
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined$1 : pattern;

        if (pattern === undefined$1) {
          return hasUnicodeWord(string)
            ? unicodeWords(string)
            : asciiWords(string);
        }
        return string.match(pattern) || [];
      }

      /*------------------------------------------------------------------------*/

      /**
       * Attempts to invoke `func`, returning either the result or the caught error
       * object. Any additional arguments are provided to `func` when it's invoked.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Util
       * @param {Function} func The function to attempt.
       * @param {...*} [args] The arguments to invoke `func` with.
       * @returns {*} Returns the `func` result or error object.
       * @example
       *
       * // Avoid throwing errors for invalid selectors.
       * var elements = _.attempt(function(selector) {
       *   return document.querySelectorAll(selector);
       * }, '>_>');
       *
       * if (_.isError(elements)) {
       *   elements = [];
       * }
       */
      var attempt = baseRest(function(func, args) {
        try {
          return apply(func, undefined$1, args);
        } catch (e) {
          return isError(e) ? e : new Error(e);
        }
      });

      /**
       * Binds methods of an object to the object itself, overwriting the existing
       * method.
       *
       * **Note:** This method doesn't set the "length" property of bound functions.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {Object} object The object to bind and assign the bound methods to.
       * @param {...(string|string[])} methodNames The object method names to bind.
       * @returns {Object} Returns `object`.
       * @example
       *
       * var view = {
       *   'label': 'docs',
       *   'click': function() {
       *     console.log('clicked ' + this.label);
       *   }
       * };
       *
       * _.bindAll(view, ['click']);
       * jQuery(element).on('click', view.click);
       * // => Logs 'clicked docs' when clicked.
       */
      var bindAll = flatRest(function(object, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });

      /**
       * Creates a function that iterates over `pairs` and invokes the corresponding
       * function of the first predicate to return truthy. The predicate-function
       * pairs are invoked with the `this` binding and arguments of the created
       * function.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {Array} pairs The predicate-function pairs.
       * @returns {Function} Returns the new composite function.
       * @example
       *
       * var func = _.cond([
       *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
       *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
       *   [_.stubTrue,                      _.constant('no match')]
       * ]);
       *
       * func({ 'a': 1, 'b': 2 });
       * // => 'matches A'
       *
       * func({ 'a': 0, 'b': 1 });
       * // => 'matches B'
       *
       * func({ 'a': '1', 'b': '2' });
       * // => 'no match'
       */
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

        pairs = !length
          ? []
          : arrayMap(pairs, function(pair) {
              if (typeof pair[1] != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
              }
              return [toIteratee(pair[0]), pair[1]];
            });

        return baseRest(function(args) {
          var index = -1;
          while (++index < length) {
            var pair = pairs[index];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }

      /**
       * Creates a function that invokes the predicate properties of `source` with
       * the corresponding property values of a given object, returning `true` if
       * all predicates return truthy, else `false`.
       *
       * **Note:** The created function is equivalent to `_.conformsTo` with
       * `source` partially applied.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {Object} source The object of property predicates to conform to.
       * @returns {Function} Returns the new spec function.
       * @example
       *
       * var objects = [
       *   { 'a': 2, 'b': 1 },
       *   { 'a': 1, 'b': 2 }
       * ];
       *
       * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
       * // => [{ 'a': 1, 'b': 2 }]
       */
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }

      /**
       * Creates a function that returns `value`.
       *
       * @static
       * @memberOf _
       * @since 2.4.0
       * @category Util
       * @param {*} value The value to return from the new function.
       * @returns {Function} Returns the new constant function.
       * @example
       *
       * var objects = _.times(2, _.constant({ 'a': 1 }));
       *
       * console.log(objects);
       * // => [{ 'a': 1 }, { 'a': 1 }]
       *
       * console.log(objects[0] === objects[1]);
       * // => true
       */
      function constant(value) {
        return function() {
          return value;
        };
      }

      /**
       * Checks `value` to determine whether a default value should be returned in
       * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
       * or `undefined`.
       *
       * @static
       * @memberOf _
       * @since 4.14.0
       * @category Util
       * @param {*} value The value to check.
       * @param {*} defaultValue The default value.
       * @returns {*} Returns the resolved value.
       * @example
       *
       * _.defaultTo(1, 10);
       * // => 1
       *
       * _.defaultTo(undefined, 10);
       * // => 10
       */
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }

      /**
       * Creates a function that returns the result of invoking the given functions
       * with the `this` binding of the created function, where each successive
       * invocation is supplied the return value of the previous.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Util
       * @param {...(Function|Function[])} [funcs] The functions to invoke.
       * @returns {Function} Returns the new composite function.
       * @see _.flowRight
       * @example
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * var addSquare = _.flow([_.add, square]);
       * addSquare(1, 2);
       * // => 9
       */
      var flow = createFlow();

      /**
       * This method is like `_.flow` except that it creates a function that
       * invokes the given functions from right to left.
       *
       * @static
       * @since 3.0.0
       * @memberOf _
       * @category Util
       * @param {...(Function|Function[])} [funcs] The functions to invoke.
       * @returns {Function} Returns the new composite function.
       * @see _.flow
       * @example
       *
       * function square(n) {
       *   return n * n;
       * }
       *
       * var addSquare = _.flowRight([square, _.add]);
       * addSquare(1, 2);
       * // => 9
       */
      var flowRight = createFlow(true);

      /**
       * This method returns the first argument it receives.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {*} value Any value.
       * @returns {*} Returns `value`.
       * @example
       *
       * var object = { 'a': 1 };
       *
       * console.log(_.identity(object) === object);
       * // => true
       */
      function identity(value) {
        return value;
      }

      /**
       * Creates a function that invokes `func` with the arguments of the created
       * function. If `func` is a property name, the created function returns the
       * property value for a given element. If `func` is an array or object, the
       * created function returns `true` for elements that contain the equivalent
       * source properties, otherwise it returns `false`.
       *
       * @static
       * @since 4.0.0
       * @memberOf _
       * @category Util
       * @param {*} [func=_.identity] The value to convert to a callback.
       * @returns {Function} Returns the callback.
       * @example
       *
       * var users = [
       *   { 'user': 'barney', 'age': 36, 'active': true },
       *   { 'user': 'fred',   'age': 40, 'active': false }
       * ];
       *
       * // The `_.matches` iteratee shorthand.
       * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
       * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
       *
       * // The `_.matchesProperty` iteratee shorthand.
       * _.filter(users, _.iteratee(['user', 'fred']));
       * // => [{ 'user': 'fred', 'age': 40 }]
       *
       * // The `_.property` iteratee shorthand.
       * _.map(users, _.iteratee('user'));
       * // => ['barney', 'fred']
       *
       * // Create custom iteratee shorthands.
       * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
       *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
       *     return func.test(string);
       *   };
       * });
       *
       * _.filter(['abc', 'def'], /ef/);
       * // => ['def']
       */
      function iteratee(func) {
        return baseIteratee(
          typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG)
        );
      }

      /**
       * Creates a function that performs a partial deep comparison between a given
       * object and `source`, returning `true` if the given object has equivalent
       * property values, else `false`.
       *
       * **Note:** The created function is equivalent to `_.isMatch` with `source`
       * partially applied.
       *
       * Partial comparisons will match empty array and empty object `source`
       * values against any array or object value, respectively. See `_.isEqual`
       * for a list of supported value comparisons.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Util
       * @param {Object} source The object of property values to match.
       * @returns {Function} Returns the new spec function.
       * @example
       *
       * var objects = [
       *   { 'a': 1, 'b': 2, 'c': 3 },
       *   { 'a': 4, 'b': 5, 'c': 6 }
       * ];
       *
       * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
       * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
       */
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }

      /**
       * Creates a function that performs a partial deep comparison between the
       * value at `path` of a given object to `srcValue`, returning `true` if the
       * object value is equivalent, else `false`.
       *
       * **Note:** Partial comparisons will match empty array and empty object
       * `srcValue` values against any array or object value, respectively. See
       * `_.isEqual` for a list of supported value comparisons.
       *
       * @static
       * @memberOf _
       * @since 3.2.0
       * @category Util
       * @param {Array|string} path The path of the property to get.
       * @param {*} srcValue The value to match.
       * @returns {Function} Returns the new spec function.
       * @example
       *
       * var objects = [
       *   { 'a': 1, 'b': 2, 'c': 3 },
       *   { 'a': 4, 'b': 5, 'c': 6 }
       * ];
       *
       * _.find(objects, _.matchesProperty('a', 4));
       * // => { 'a': 4, 'b': 5, 'c': 6 }
       */
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }

      /**
       * Creates a function that invokes the method at `path` of a given object.
       * Any additional arguments are provided to the invoked method.
       *
       * @static
       * @memberOf _
       * @since 3.7.0
       * @category Util
       * @param {Array|string} path The path of the method to invoke.
       * @param {...*} [args] The arguments to invoke the method with.
       * @returns {Function} Returns the new invoker function.
       * @example
       *
       * var objects = [
       *   { 'a': { 'b': _.constant(2) } },
       *   { 'a': { 'b': _.constant(1) } }
       * ];
       *
       * _.map(objects, _.method('a.b'));
       * // => [2, 1]
       *
       * _.map(objects, _.method(['a', 'b']));
       * // => [2, 1]
       */
      var method = baseRest(function(path, args) {
        return function(object) {
          return baseInvoke(object, path, args);
        };
      });

      /**
       * The opposite of `_.method`; this method creates a function that invokes
       * the method at a given path of `object`. Any additional arguments are
       * provided to the invoked method.
       *
       * @static
       * @memberOf _
       * @since 3.7.0
       * @category Util
       * @param {Object} object The object to query.
       * @param {...*} [args] The arguments to invoke the method with.
       * @returns {Function} Returns the new invoker function.
       * @example
       *
       * var array = _.times(3, _.constant),
       *     object = { 'a': array, 'b': array, 'c': array };
       *
       * _.map(['a[2]', 'c[0]'], _.methodOf(object));
       * // => [2, 0]
       *
       * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
       * // => [2, 0]
       */
      var methodOf = baseRest(function(object, args) {
        return function(path) {
          return baseInvoke(object, path, args);
        };
      });

      /**
       * Adds all own enumerable string keyed function properties of a source
       * object to the destination object. If `object` is a function, then methods
       * are added to its prototype as well.
       *
       * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
       * avoid conflicts caused by modifying the original.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {Function|Object} [object=lodash] The destination object.
       * @param {Object} source The object of functions to add.
       * @param {Object} [options={}] The options object.
       * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
       * @returns {Function|Object} Returns `object`.
       * @example
       *
       * function vowels(string) {
       *   return _.filter(string, function(v) {
       *     return /[aeiou]/i.test(v);
       *   });
       * }
       *
       * _.mixin({ 'vowels': vowels });
       * _.vowels('fred');
       * // => ['e']
       *
       * _('fred').vowels().value();
       * // => ['e']
       *
       * _.mixin({ 'vowels': vowels }, { 'chain': false });
       * _('fred').vowels();
       * // => ['e']
       */
      function mixin(object, source, options) {
        var props = keys(source),
          methodNames = baseFunctions(source, props);

        if (
          options == null &&
          !(isObject(source) && (methodNames.length || !props.length))
        ) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain =
            !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

        arrayEach(methodNames, function(methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                  actions = (result.__actions__ = copyArray(this.__actions__));

                actions.push({ func: func, args: arguments, thisArg: object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });

        return object;
      }

      /**
       * Reverts the `_` variable to its previous value and returns a reference to
       * the `lodash` function.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @returns {Function} Returns the `lodash` function.
       * @example
       *
       * var lodash = _.noConflict();
       */
      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }
        return this;
      }

      /**
       * This method returns `undefined`.
       *
       * @static
       * @memberOf _
       * @since 2.3.0
       * @category Util
       * @example
       *
       * _.times(2, _.noop);
       * // => [undefined, undefined]
       */
      function noop() {
        // No operation performed.
      }

      /**
       * Creates a function that gets the argument at index `n`. If `n` is negative,
       * the nth argument from the end is returned.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {number} [n=0] The index of the argument to return.
       * @returns {Function} Returns the new pass-thru function.
       * @example
       *
       * var func = _.nthArg(1);
       * func('a', 'b', 'c', 'd');
       * // => 'b'
       *
       * var func = _.nthArg(-2);
       * func('a', 'b', 'c', 'd');
       * // => 'c'
       */
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function(args) {
          return baseNth(args, n);
        });
      }

      /**
       * Creates a function that invokes `iteratees` with the arguments it receives
       * and returns their results.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {...(Function|Function[])} [iteratees=[_.identity]]
       *  The iteratees to invoke.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var func = _.over([Math.max, Math.min]);
       *
       * func(1, 2, 3, 4);
       * // => [4, 1]
       */
      var over = createOver(arrayMap);

      /**
       * Creates a function that checks if **all** of the `predicates` return
       * truthy when invoked with the arguments it receives.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {...(Function|Function[])} [predicates=[_.identity]]
       *  The predicates to check.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var func = _.overEvery([Boolean, isFinite]);
       *
       * func('1');
       * // => true
       *
       * func(null);
       * // => false
       *
       * func(NaN);
       * // => false
       */
      var overEvery = createOver(arrayEvery);

      /**
       * Creates a function that checks if **any** of the `predicates` return
       * truthy when invoked with the arguments it receives.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {...(Function|Function[])} [predicates=[_.identity]]
       *  The predicates to check.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var func = _.overSome([Boolean, isFinite]);
       *
       * func('1');
       * // => true
       *
       * func(null);
       * // => true
       *
       * func(NaN);
       * // => false
       */
      var overSome = createOver(arraySome);

      /**
       * Creates a function that returns the value at `path` of a given object.
       *
       * @static
       * @memberOf _
       * @since 2.4.0
       * @category Util
       * @param {Array|string} path The path of the property to get.
       * @returns {Function} Returns the new accessor function.
       * @example
       *
       * var objects = [
       *   { 'a': { 'b': 2 } },
       *   { 'a': { 'b': 1 } }
       * ];
       *
       * _.map(objects, _.property('a.b'));
       * // => [2, 1]
       *
       * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
       * // => [1, 2]
       */
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }

      /**
       * The opposite of `_.property`; this method creates a function that returns
       * the value at a given path of `object`.
       *
       * @static
       * @memberOf _
       * @since 3.0.0
       * @category Util
       * @param {Object} object The object to query.
       * @returns {Function} Returns the new accessor function.
       * @example
       *
       * var array = [0, 1, 2],
       *     object = { 'a': array, 'b': array, 'c': array };
       *
       * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
       * // => [2, 0]
       *
       * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
       * // => [2, 0]
       */
      function propertyOf(object) {
        return function(path) {
          return object == null ? undefined$1 : baseGet(object, path);
        };
      }

      /**
       * Creates an array of numbers (positive and/or negative) progressing from
       * `start` up to, but not including, `end`. A step of `-1` is used if a negative
       * `start` is specified without an `end` or `step`. If `end` is not specified,
       * it's set to `start` with `start` then set to `0`.
       *
       * **Note:** JavaScript follows the IEEE-754 standard for resolving
       * floating-point values which can produce unexpected results.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {number} [start=0] The start of the range.
       * @param {number} end The end of the range.
       * @param {number} [step=1] The value to increment or decrement by.
       * @returns {Array} Returns the range of numbers.
       * @see _.inRange, _.rangeRight
       * @example
       *
       * _.range(4);
       * // => [0, 1, 2, 3]
       *
       * _.range(-4);
       * // => [0, -1, -2, -3]
       *
       * _.range(1, 5);
       * // => [1, 2, 3, 4]
       *
       * _.range(0, 20, 5);
       * // => [0, 5, 10, 15]
       *
       * _.range(0, -4, -1);
       * // => [0, -1, -2, -3]
       *
       * _.range(1, 4, 0);
       * // => [1, 1, 1]
       *
       * _.range(0);
       * // => []
       */
      var range = createRange();

      /**
       * This method is like `_.range` except that it populates values in
       * descending order.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {number} [start=0] The start of the range.
       * @param {number} end The end of the range.
       * @param {number} [step=1] The value to increment or decrement by.
       * @returns {Array} Returns the range of numbers.
       * @see _.inRange, _.range
       * @example
       *
       * _.rangeRight(4);
       * // => [3, 2, 1, 0]
       *
       * _.rangeRight(-4);
       * // => [-3, -2, -1, 0]
       *
       * _.rangeRight(1, 5);
       * // => [4, 3, 2, 1]
       *
       * _.rangeRight(0, 20, 5);
       * // => [15, 10, 5, 0]
       *
       * _.rangeRight(0, -4, -1);
       * // => [-3, -2, -1, 0]
       *
       * _.rangeRight(1, 4, 0);
       * // => [1, 1, 1]
       *
       * _.rangeRight(0);
       * // => []
       */
      var rangeRight = createRange(true);

      /**
       * This method returns a new empty array.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {Array} Returns the new empty array.
       * @example
       *
       * var arrays = _.times(2, _.stubArray);
       *
       * console.log(arrays);
       * // => [[], []]
       *
       * console.log(arrays[0] === arrays[1]);
       * // => false
       */
      function stubArray() {
        return [];
      }

      /**
       * This method returns `false`.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {boolean} Returns `false`.
       * @example
       *
       * _.times(2, _.stubFalse);
       * // => [false, false]
       */
      function stubFalse() {
        return false;
      }

      /**
       * This method returns a new empty object.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {Object} Returns the new empty object.
       * @example
       *
       * var objects = _.times(2, _.stubObject);
       *
       * console.log(objects);
       * // => [{}, {}]
       *
       * console.log(objects[0] === objects[1]);
       * // => false
       */
      function stubObject() {
        return {};
      }

      /**
       * This method returns an empty string.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {string} Returns the empty string.
       * @example
       *
       * _.times(2, _.stubString);
       * // => ['', '']
       */
      function stubString() {
        return '';
      }

      /**
       * This method returns `true`.
       *
       * @static
       * @memberOf _
       * @since 4.13.0
       * @category Util
       * @returns {boolean} Returns `true`.
       * @example
       *
       * _.times(2, _.stubTrue);
       * // => [true, true]
       */
      function stubTrue() {
        return true;
      }

      /**
       * Invokes the iteratee `n` times, returning an array of the results of
       * each invocation. The iteratee is invoked with one argument; (index).
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {number} n The number of times to invoke `iteratee`.
       * @param {Function} [iteratee=_.identity] The function invoked per iteration.
       * @returns {Array} Returns the array of results.
       * @example
       *
       * _.times(3, String);
       * // => ['0', '1', '2']
       *
       *  _.times(4, _.constant(0));
       * // => [0, 0, 0, 0]
       */
      function times(n, iteratee) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }
        var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

        iteratee = getIteratee(iteratee);
        n -= MAX_ARRAY_LENGTH;

        var result = baseTimes(length, iteratee);
        while (++index < n) {
          iteratee(index);
        }
        return result;
      }

      /**
       * Converts `value` to a property path array.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Util
       * @param {*} value The value to convert.
       * @returns {Array} Returns the new property path array.
       * @example
       *
       * _.toPath('a.b.c');
       * // => ['a', 'b', 'c']
       *
       * _.toPath('a[0].b.c');
       * // => ['a', '0', 'b', 'c']
       */
      function toPath(value) {
        if (isArray(value)) {
          return arrayMap(value, toKey);
        }
        return isSymbol(value)
          ? [value]
          : copyArray(stringToPath(toString(value)));
      }

      /**
       * Generates a unique ID. If `prefix` is given, the ID is appended to it.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Util
       * @param {string} [prefix=''] The value to prefix the ID with.
       * @returns {string} Returns the unique ID.
       * @example
       *
       * _.uniqueId('contact_');
       * // => 'contact_104'
       *
       * _.uniqueId();
       * // => '105'
       */
      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString(prefix) + id;
      }

      /*------------------------------------------------------------------------*/

      /**
       * Adds two numbers.
       *
       * @static
       * @memberOf _
       * @since 3.4.0
       * @category Math
       * @param {number} augend The first number in an addition.
       * @param {number} addend The second number in an addition.
       * @returns {number} Returns the total.
       * @example
       *
       * _.add(6, 4);
       * // => 10
       */
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);

      /**
       * Computes `number` rounded up to `precision`.
       *
       * @static
       * @memberOf _
       * @since 3.10.0
       * @category Math
       * @param {number} number The number to round up.
       * @param {number} [precision=0] The precision to round up to.
       * @returns {number} Returns the rounded up number.
       * @example
       *
       * _.ceil(4.006);
       * // => 5
       *
       * _.ceil(6.004, 2);
       * // => 6.01
       *
       * _.ceil(6040, -2);
       * // => 6100
       */
      var ceil = createRound('ceil');

      /**
       * Divide two numbers.
       *
       * @static
       * @memberOf _
       * @since 4.7.0
       * @category Math
       * @param {number} dividend The first number in a division.
       * @param {number} divisor The second number in a division.
       * @returns {number} Returns the quotient.
       * @example
       *
       * _.divide(6, 4);
       * // => 1.5
       */
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);

      /**
       * Computes `number` rounded down to `precision`.
       *
       * @static
       * @memberOf _
       * @since 3.10.0
       * @category Math
       * @param {number} number The number to round down.
       * @param {number} [precision=0] The precision to round down to.
       * @returns {number} Returns the rounded down number.
       * @example
       *
       * _.floor(4.006);
       * // => 4
       *
       * _.floor(0.046, 2);
       * // => 0.04
       *
       * _.floor(4060, -2);
       * // => 4000
       */
      var floor = createRound('floor');

      /**
       * Computes the maximum value of `array`. If `array` is empty or falsey,
       * `undefined` is returned.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Math
       * @param {Array} array The array to iterate over.
       * @returns {*} Returns the maximum value.
       * @example
       *
       * _.max([4, 2, 8, 6]);
       * // => 8
       *
       * _.max([]);
       * // => undefined
       */
      function max(array) {
        return array && array.length
          ? baseExtremum(array, identity, baseGt)
          : undefined$1;
      }

      /**
       * This method is like `_.max` except that it accepts `iteratee` which is
       * invoked for each element in `array` to generate the criterion by which
       * the value is ranked. The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {*} Returns the maximum value.
       * @example
       *
       * var objects = [{ 'n': 1 }, { 'n': 2 }];
       *
       * _.maxBy(objects, function(o) { return o.n; });
       * // => { 'n': 2 }
       *
       * // The `_.property` iteratee shorthand.
       * _.maxBy(objects, 'n');
       * // => { 'n': 2 }
       */
      function maxBy(array, iteratee) {
        return array && array.length
          ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
          : undefined$1;
      }

      /**
       * Computes the mean of the values in `array`.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @returns {number} Returns the mean.
       * @example
       *
       * _.mean([4, 2, 8, 6]);
       * // => 5
       */
      function mean(array) {
        return baseMean(array, identity);
      }

      /**
       * This method is like `_.mean` except that it accepts `iteratee` which is
       * invoked for each element in `array` to generate the value to be averaged.
       * The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.7.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {number} Returns the mean.
       * @example
       *
       * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
       *
       * _.meanBy(objects, function(o) { return o.n; });
       * // => 5
       *
       * // The `_.property` iteratee shorthand.
       * _.meanBy(objects, 'n');
       * // => 5
       */
      function meanBy(array, iteratee) {
        return baseMean(array, getIteratee(iteratee, 2));
      }

      /**
       * Computes the minimum value of `array`. If `array` is empty or falsey,
       * `undefined` is returned.
       *
       * @static
       * @since 0.1.0
       * @memberOf _
       * @category Math
       * @param {Array} array The array to iterate over.
       * @returns {*} Returns the minimum value.
       * @example
       *
       * _.min([4, 2, 8, 6]);
       * // => 2
       *
       * _.min([]);
       * // => undefined
       */
      function min(array) {
        return array && array.length
          ? baseExtremum(array, identity, baseLt)
          : undefined$1;
      }

      /**
       * This method is like `_.min` except that it accepts `iteratee` which is
       * invoked for each element in `array` to generate the criterion by which
       * the value is ranked. The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {*} Returns the minimum value.
       * @example
       *
       * var objects = [{ 'n': 1 }, { 'n': 2 }];
       *
       * _.minBy(objects, function(o) { return o.n; });
       * // => { 'n': 1 }
       *
       * // The `_.property` iteratee shorthand.
       * _.minBy(objects, 'n');
       * // => { 'n': 1 }
       */
      function minBy(array, iteratee) {
        return array && array.length
          ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
          : undefined$1;
      }

      /**
       * Multiply two numbers.
       *
       * @static
       * @memberOf _
       * @since 4.7.0
       * @category Math
       * @param {number} multiplier The first number in a multiplication.
       * @param {number} multiplicand The second number in a multiplication.
       * @returns {number} Returns the product.
       * @example
       *
       * _.multiply(6, 4);
       * // => 24
       */
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);

      /**
       * Computes `number` rounded to `precision`.
       *
       * @static
       * @memberOf _
       * @since 3.10.0
       * @category Math
       * @param {number} number The number to round.
       * @param {number} [precision=0] The precision to round to.
       * @returns {number} Returns the rounded number.
       * @example
       *
       * _.round(4.006);
       * // => 4
       *
       * _.round(4.006, 2);
       * // => 4.01
       *
       * _.round(4060, -2);
       * // => 4100
       */
      var round = createRound('round');

      /**
       * Subtract two numbers.
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Math
       * @param {number} minuend The first number in a subtraction.
       * @param {number} subtrahend The second number in a subtraction.
       * @returns {number} Returns the difference.
       * @example
       *
       * _.subtract(6, 4);
       * // => 2
       */
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);

      /**
       * Computes the sum of the values in `array`.
       *
       * @static
       * @memberOf _
       * @since 3.4.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @returns {number} Returns the sum.
       * @example
       *
       * _.sum([4, 2, 8, 6]);
       * // => 20
       */
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }

      /**
       * This method is like `_.sum` except that it accepts `iteratee` which is
       * invoked for each element in `array` to generate the value to be summed.
       * The iteratee is invoked with one argument: (value).
       *
       * @static
       * @memberOf _
       * @since 4.0.0
       * @category Math
       * @param {Array} array The array to iterate over.
       * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
       * @returns {number} Returns the sum.
       * @example
       *
       * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
       *
       * _.sumBy(objects, function(o) { return o.n; });
       * // => 20
       *
       * // The `_.property` iteratee shorthand.
       * _.sumBy(objects, 'n');
       * // => 20
       */
      function sumBy(array, iteratee) {
        return array && array.length
          ? baseSum(array, getIteratee(iteratee, 2))
          : 0;
      }

      /*------------------------------------------------------------------------*/

      // Add methods that return wrapped values in chain sequences.
      lodash.after = after;
      lodash.ary = ary;
      lodash.assign = assign;
      lodash.assignIn = assignIn;
      lodash.assignInWith = assignInWith;
      lodash.assignWith = assignWith;
      lodash.at = at;
      lodash.before = before;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.castArray = castArray;
      lodash.chain = chain;
      lodash.chunk = chunk;
      lodash.compact = compact;
      lodash.concat = concat;
      lodash.cond = cond;
      lodash.conforms = conforms;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.curry = curry;
      lodash.curryRight = curryRight;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defaultsDeep = defaultsDeep;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.differenceBy = differenceBy;
      lodash.differenceWith = differenceWith;
      lodash.drop = drop;
      lodash.dropRight = dropRight;
      lodash.dropRightWhile = dropRightWhile;
      lodash.dropWhile = dropWhile;
      lodash.fill = fill;
      lodash.filter = filter;
      lodash.flatMap = flatMap;
      lodash.flatMapDeep = flatMapDeep;
      lodash.flatMapDepth = flatMapDepth;
      lodash.flatten = flatten;
      lodash.flattenDeep = flattenDeep;
      lodash.flattenDepth = flattenDepth;
      lodash.flip = flip;
      lodash.flow = flow;
      lodash.flowRight = flowRight;
      lodash.fromPairs = fromPairs;
      lodash.functions = functions;
      lodash.functionsIn = functionsIn;
      lodash.groupBy = groupBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.intersectionBy = intersectionBy;
      lodash.intersectionWith = intersectionWith;
      lodash.invert = invert;
      lodash.invertBy = invertBy;
      lodash.invokeMap = invokeMap;
      lodash.iteratee = iteratee;
      lodash.keyBy = keyBy;
      lodash.keys = keys;
      lodash.keysIn = keysIn;
      lodash.map = map;
      lodash.mapKeys = mapKeys;
      lodash.mapValues = mapValues;
      lodash.matches = matches;
      lodash.matchesProperty = matchesProperty;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.mergeWith = mergeWith;
      lodash.method = method;
      lodash.methodOf = methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = nthArg;
      lodash.omit = omit;
      lodash.omitBy = omitBy;
      lodash.once = once;
      lodash.orderBy = orderBy;
      lodash.over = over;
      lodash.overArgs = overArgs;
      lodash.overEvery = overEvery;
      lodash.overSome = overSome;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.partition = partition;
      lodash.pick = pick;
      lodash.pickBy = pickBy;
      lodash.property = property;
      lodash.propertyOf = propertyOf;
      lodash.pull = pull;
      lodash.pullAll = pullAll;
      lodash.pullAllBy = pullAllBy;
      lodash.pullAllWith = pullAllWith;
      lodash.pullAt = pullAt;
      lodash.range = range;
      lodash.rangeRight = rangeRight;
      lodash.rearg = rearg;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.reverse = reverse;
      lodash.sampleSize = sampleSize;
      lodash.set = set;
      lodash.setWith = setWith;
      lodash.shuffle = shuffle;
      lodash.slice = slice;
      lodash.sortBy = sortBy;
      lodash.sortedUniq = sortedUniq;
      lodash.sortedUniqBy = sortedUniqBy;
      lodash.split = split;
      lodash.spread = spread;
      lodash.tail = tail;
      lodash.take = take;
      lodash.takeRight = takeRight;
      lodash.takeRightWhile = takeRightWhile;
      lodash.takeWhile = takeWhile;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.thru = thru;
      lodash.toArray = toArray;
      lodash.toPairs = toPairs;
      lodash.toPairsIn = toPairsIn;
      lodash.toPath = toPath;
      lodash.toPlainObject = toPlainObject;
      lodash.transform = transform;
      lodash.unary = unary;
      lodash.union = union;
      lodash.unionBy = unionBy;
      lodash.unionWith = unionWith;
      lodash.uniq = uniq;
      lodash.uniqBy = uniqBy;
      lodash.uniqWith = uniqWith;
      lodash.unset = unset;
      lodash.unzip = unzip;
      lodash.unzipWith = unzipWith;
      lodash.update = update;
      lodash.updateWith = updateWith;
      lodash.values = values;
      lodash.valuesIn = valuesIn;
      lodash.without = without;
      lodash.words = words;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.xorBy = xorBy;
      lodash.xorWith = xorWith;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.zipObjectDeep = zipObjectDeep;
      lodash.zipWith = zipWith;

      // Add aliases.
      lodash.entries = toPairs;
      lodash.entriesIn = toPairsIn;
      lodash.extend = assignIn;
      lodash.extendWith = assignInWith;

      // Add methods to `lodash.prototype`.
      mixin(lodash, lodash);

      /*------------------------------------------------------------------------*/

      // Add methods that return unwrapped values in chain sequences.
      lodash.add = add;
      lodash.attempt = attempt;
      lodash.camelCase = camelCase;
      lodash.capitalize = capitalize;
      lodash.ceil = ceil;
      lodash.clamp = clamp;
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.cloneDeepWith = cloneDeepWith;
      lodash.cloneWith = cloneWith;
      lodash.conformsTo = conformsTo;
      lodash.deburr = deburr;
      lodash.defaultTo = defaultTo;
      lodash.divide = divide;
      lodash.endsWith = endsWith;
      lodash.eq = eq;
      lodash.escape = escape;
      lodash.escapeRegExp = escapeRegExp;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.floor = floor;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.get = get;
      lodash.gt = gt;
      lodash.gte = gte;
      lodash.has = has;
      lodash.hasIn = hasIn;
      lodash.head = head;
      lodash.identity = identity;
      lodash.includes = includes;
      lodash.indexOf = indexOf;
      lodash.inRange = inRange;
      lodash.invoke = invoke;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isArrayBuffer = isArrayBuffer;
      lodash.isArrayLike = isArrayLike;
      lodash.isArrayLikeObject = isArrayLikeObject;
      lodash.isBoolean = isBoolean;
      lodash.isBuffer = isBuffer;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual;
      lodash.isEqualWith = isEqualWith;
      lodash.isError = isError;
      lodash.isFinite = isFinite;
      lodash.isFunction = isFunction;
      lodash.isInteger = isInteger;
      lodash.isLength = isLength;
      lodash.isMap = isMap;
      lodash.isMatch = isMatch;
      lodash.isMatchWith = isMatchWith;
      lodash.isNaN = isNaN;
      lodash.isNative = isNative;
      lodash.isNil = isNil;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isObjectLike = isObjectLike;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isSafeInteger = isSafeInteger;
      lodash.isSet = isSet;
      lodash.isString = isString;
      lodash.isSymbol = isSymbol;
      lodash.isTypedArray = isTypedArray;
      lodash.isUndefined = isUndefined;
      lodash.isWeakMap = isWeakMap;
      lodash.isWeakSet = isWeakSet;
      lodash.join = join;
      lodash.kebabCase = kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = lastIndexOf;
      lodash.lowerCase = lowerCase;
      lodash.lowerFirst = lowerFirst;
      lodash.lt = lt;
      lodash.lte = lte;
      lodash.max = max;
      lodash.maxBy = maxBy;
      lodash.mean = mean;
      lodash.meanBy = meanBy;
      lodash.min = min;
      lodash.minBy = minBy;
      lodash.stubArray = stubArray;
      lodash.stubFalse = stubFalse;
      lodash.stubObject = stubObject;
      lodash.stubString = stubString;
      lodash.stubTrue = stubTrue;
      lodash.multiply = multiply;
      lodash.nth = nth;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.pad = pad;
      lodash.padEnd = padEnd;
      lodash.padStart = padStart;
      lodash.parseInt = parseInt;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.repeat = repeat;
      lodash.replace = replace;
      lodash.result = result;
      lodash.round = round;
      lodash.runInContext = runInContext;
      lodash.sample = sample;
      lodash.size = size;
      lodash.snakeCase = snakeCase;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.sortedIndexBy = sortedIndexBy;
      lodash.sortedIndexOf = sortedIndexOf;
      lodash.sortedLastIndex = sortedLastIndex;
      lodash.sortedLastIndexBy = sortedLastIndexBy;
      lodash.sortedLastIndexOf = sortedLastIndexOf;
      lodash.startCase = startCase;
      lodash.startsWith = startsWith;
      lodash.subtract = subtract;
      lodash.sum = sum;
      lodash.sumBy = sumBy;
      lodash.template = template;
      lodash.times = times;
      lodash.toFinite = toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = toLength;
      lodash.toLower = toLower;
      lodash.toNumber = toNumber;
      lodash.toSafeInteger = toSafeInteger;
      lodash.toString = toString;
      lodash.toUpper = toUpper;
      lodash.trim = trim;
      lodash.trimEnd = trimEnd;
      lodash.trimStart = trimStart;
      lodash.truncate = truncate;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.upperCase = upperCase;
      lodash.upperFirst = upperFirst;

      // Add aliases.
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.first = head;

      mixin(
        lodash,
        (function() {
          var source = {};
          baseForOwn(lodash, function(func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        })(),
        { chain: false }
      );

      /*------------------------------------------------------------------------*/

      /**
       * The semantic version number.
       *
       * @static
       * @memberOf _
       * @type {string}
       */
      lodash.VERSION = VERSION;

      // Assign default placeholders.
      arrayEach(
        ['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'],
        function(methodName) {
          lodash[methodName].placeholder = lodash;
        }
      );

      // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
      arrayEach(['drop', 'take'], function(methodName, index) {
        LazyWrapper.prototype[methodName] = function(n) {
          n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);

          var result =
            this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();

          if (result.__filtered__) {
            result.__takeCount__ = nativeMin(n, result.__takeCount__);
          } else {
            result.__views__.push({
              size: nativeMin(n, MAX_ARRAY_LENGTH),
              type: methodName + (result.__dir__ < 0 ? 'Right' : ''),
            });
          }
          return result;
        };

        LazyWrapper.prototype[methodName + 'Right'] = function(n) {
          return this.reverse()
            [methodName](n)
            .reverse();
        };
      });

      // Add `LazyWrapper` methods that accept an `iteratee` value.
      arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
        var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

        LazyWrapper.prototype[methodName] = function(iteratee) {
          var result = this.clone();
          result.__iteratees__.push({
            iteratee: getIteratee(iteratee, 3),
            type: type,
          });
          result.__filtered__ = result.__filtered__ || isFilter;
          return result;
        };
      });

      // Add `LazyWrapper` methods for `_.head` and `_.last`.
      arrayEach(['head', 'last'], function(methodName, index) {
        var takeName = 'take' + (index ? 'Right' : '');

        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });

      // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
      arrayEach(['initial', 'tail'], function(methodName, index) {
        var dropName = 'drop' + (index ? '' : 'Right');

        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });

      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };

      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };

      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };

      LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
        if (typeof path == 'function') {
          return new LazyWrapper(this);
        }
        return this.map(function(value) {
          return baseInvoke(value, path, args);
        });
      });

      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };

      LazyWrapper.prototype.slice = function(start, end) {
        start = toInteger(start);

        var result = this;
        if (result.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result);
        }
        if (start < 0) {
          result = result.takeRight(-start);
        } else if (start) {
          result = result.drop(start);
        }
        if (end !== undefined$1) {
          end = toInteger(end);
          result = end < 0 ? result.dropRight(-end) : result.take(end - start);
        }
        return result;
      };

      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse()
          .takeWhile(predicate)
          .reverse();
      };

      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };

      // Add `LazyWrapper` methods to `lodash.prototype`.
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(
            methodName
          ),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc =
            lodash[
              isTaker
                ? 'take' + (methodName == 'last' ? 'Right' : '')
                : methodName
            ],
          retUnwrapped = isTaker || /^find/.test(methodName);

        if (!lodashFunc) {
          return;
        }
        lodash.prototype[methodName] = function() {
          var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

          var interceptor = function(value) {
            var result = lodashFunc.apply(lodash, arrayPush([value], args));
            return isTaker && chainAll ? result[0] : result;
          };

          if (
            useLazy &&
            checkIteratee &&
            typeof iteratee == 'function' &&
            iteratee.length != 1
          ) {
            // Avoid lazy use if the iteratee has a "length" value other than `1`.
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result = func.apply(value, args);
            result.__actions__.push({
              func: thru,
              args: [interceptor],
              thisArg: undefined$1,
            });
            return new LodashWrapper(result, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result = this.thru(interceptor);
          return isUnwrapped
            ? isTaker
              ? result.value()[0]
              : result.value()
            : result;
        };
      });

      // Add `Array` methods to `lodash.prototype`.
      arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(
        methodName
      ) {
        var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName)
            ? 'tap'
            : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

        lodash.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray(value) ? value : [], args);
          }
          return this[chainName](function(value) {
            return func.apply(isArray(value) ? value : [], args);
          });
        };
      });

      // Map minified method names to their real names.
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var lodashFunc = lodash[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + '';
          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({ name: methodName, func: lodashFunc });
        }
      });

      realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [
        {
          name: 'wrapper',
          func: undefined$1,
        },
      ];

      // Add methods to `LazyWrapper`.
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;

      // Add chain sequence methods to the `lodash` wrapper.
      lodash.prototype.at = wrapperAt;
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.commit = wrapperCommit;
      lodash.prototype.next = wrapperNext;
      lodash.prototype.plant = wrapperPlant;
      lodash.prototype.reverse = wrapperReverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

      // Add lazy aliases.
      lodash.prototype.first = lodash.prototype.head;

      if (symIterator) {
        lodash.prototype[symIterator] = wrapperToIterator;
      }
      return lodash;
    };

    /*--------------------------------------------------------------------------*/

    // Export lodash.
    var _ = runInContext();

    // Some AMD build optimizers, like r.js, check for condition patterns like:
    if (freeModule) {
      // Export for Node.js.
      (freeModule.exports = _)._ = _;
      // Export for CommonJS support.
      freeExports._ = _;
    } else {
      // Export to the global object.
      root._ = _;
    }
  }.call(commonjsGlobal));
});

const { keys } = lodash;

// The client names we'll allow in the `{name: lib}` pairing.
const CLIENT_ALIASES = Object.freeze({
  pg: 'postgres',
  postgresql: 'postgres',
  sqlite: 'sqlite3',
});

const SUPPORTED_CLIENTS = Object.freeze(
  [
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'postgres',
    'redshift',
    'sqlite3',
  ].concat(keys(CLIENT_ALIASES))
);

const POOL_CONFIG_OPTIONS = Object.freeze([
  'maxWaitingClients',
  'testOnBorrow',
  'fifo',
  'priorityRange',
  'autostart',
  'evictionRunIntervalMillis',
  'numTestsPerRun',
  'softIdleTimeoutMillis',
  'Promise',
]);

var constants = {
  CLIENT_ALIASES,
  SUPPORTED_CLIENTS,
  POOL_CONFIG_OPTIONS,
};

/* eslint no-console:0 */

const {
  isFunction,
  isUndefined,
  isPlainObject,
  isArray,
  isTypedArray,
} = lodash;
const { CLIENT_ALIASES: CLIENT_ALIASES$1 } = constants;

// Check if the first argument is an array, otherwise uses all arguments as an
// array.

function normalizeArr() {
  const args = new Array(arguments.length);
  for (let i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  if (Array.isArray(args[0])) {
    return args[0];
  }
  return args;
}

function containsUndefined(mixed) {
  let argContainsUndefined = false;

  if (isTypedArray(mixed)) return false;

  if (mixed && isFunction(mixed.toSQL)) {
    //Any QueryBuilder or Raw will automatically be validated during compile.
    return argContainsUndefined;
  }

  if (isArray(mixed)) {
    for (let i = 0; i < mixed.length; i++) {
      if (argContainsUndefined) break;
      argContainsUndefined = containsUndefined(mixed[i]);
    }
  } else if (isPlainObject(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (!argContainsUndefined) {
        argContainsUndefined = containsUndefined(mixed[key]);
      }
    });
  } else {
    argContainsUndefined = isUndefined(mixed);
  }

  return argContainsUndefined;
}

function getUndefinedIndices(mixed) {
  const indices = [];

  if (Array.isArray(mixed)) {
    mixed.forEach((item, index) => {
      if (containsUndefined(item)) {
        indices.push(index);
      }
    });
  } else if (isPlainObject(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (containsUndefined(mixed[key])) {
        indices.push(key);
      }
    });
  } else {
    indices.push(0);
  }

  return indices;
}

function addQueryContext(Target) {
  // Stores or returns (if called with no arguments) context passed to
  // wrapIdentifier and postProcessResponse hooks
  Target.prototype.queryContext = function(context) {
    if (isUndefined(context)) {
      return this._queryContext;
    }
    this._queryContext = context;
    return this;
  };
}

function resolveClientNameWithAliases(clientName) {
  return CLIENT_ALIASES$1[clientName] || clientName;
}

var helpers = {
  addQueryContext,
  containsUndefined,
  normalizeArr,
  resolveClientNameWithAliases,
  getUndefinedIndices,
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;

  Object.keys(env).forEach((key) => {
    createDebug[key] = env[key];
  });

  /**
   * Active `debug` instances.
   */
  createDebug.instances = [];

  /**
   * The currently active debug mode names, and names to skip.
   */

  createDebug.names = [];
  createDebug.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */
  createDebug.formatters = {};

  /**
   * Selects a color for a debug namespace
   * @param {String} namespace The namespace string for the for the debug instance to be colored
   * @return {Number|String} An ANSI color code for the given namespace
   * @api private
   */
  function selectColor(namespace) {
    let hash = 0;

    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */
  function createDebug(namespace) {
    let prevTime;

    function debug(...args) {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      const self = debug;

      // Set `diff` timestamp
      const curr = Number(new Date());
      const ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      }

      // Apply any `formatters` transformations
      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }
        index++;
        const formatter = createDebug.formatters[format];
        if (typeof formatter === 'function') {
          const val = args[index];
          match = formatter.call(self, val);

          // Now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      // Apply env-specific formatting (colors, etc.)
      createDebug.formatArgs.call(self, args);

      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend;
    // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;

    // env-specific initialization logic for debug instances
    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);

    return debug;
  }

  function destroy() {
    const index = createDebug.instances.indexOf(this);
    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }
    return false;
  }

  function extend(namespace, delimiter) {
    const newDebug = createDebug(
      this.namespace +
        (typeof delimiter === 'undefined' ? ':' : delimiter) +
        namespace
    );
    newDebug.log = this.log;
    return newDebug;
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */
  function enable(namespaces) {
    createDebug.save(namespaces);

    createDebug.names = [];
    createDebug.skips = [];

    let i;
    const split = (typeof namespaces === 'string' ? namespaces : '').split(
      /[\s,]+/
    );
    const len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      const instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }

  /**
   * Disable debug output.
   *
   * @return {String} namespaces
   * @api public
   */
  function disable() {
    const namespaces = [
      ...createDebug.names.map(toNamespace),
      ...createDebug.skips.map(toNamespace).map((namespace) => '-' + namespace),
    ].join(',');
    createDebug.enable('');
    return namespaces;
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */
  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    let i;
    let len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Convert regexp to namespace
   *
   * @param {RegExp} regxep
   * @return {String} namespace
   * @api private
   */
  function toNamespace(regexp) {
    return regexp
      .toString()
      .substring(2, regexp.toString().length - 2)
      .replace(/\.\*\?$/, '*');
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */
  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }
    return val;
  }

  createDebug.enable(createDebug.load());

  return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function(module, exports) {
  /* eslint-env browser */

  /**
   * This is the web browser implementation of `debug()`.
   */

  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();

  /**
   * Colors.
   */

  exports.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33',
  ];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  // eslint-disable-next-line complexity
  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (
      typeof window !== 'undefined' &&
      window.process &&
      (window.process.type === 'renderer' || window.process.__nwjs)
    ) {
      return true;
    }

    // Internet Explorer and Edge do not support colors.
    if (
      typeof navigator !== 'undefined' &&
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
    ) {
      return false;
    }

    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return (
      (typeof document !== 'undefined' &&
        document.documentElement &&
        document.documentElement.style &&
        document.documentElement.style.WebkitAppearance) ||
      // Is firebug? http://stackoverflow.com/a/398120/376773
      (typeof window !== 'undefined' &&
        window.console &&
        (window.console.firebug ||
          (window.console.exception && window.console.table))) ||
      // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      (typeof navigator !== 'undefined' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
        parseInt(RegExp.$1, 10) >= 31) ||
      // Double check webkit in userAgent just in case we are in a worker
      (typeof navigator !== 'undefined' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
    );
  }

  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    args[0] =
      (this.useColors ? '%c' : '') +
      this.namespace +
      (this.useColors ? ' %c' : ' ') +
      args[0] +
      (this.useColors ? '%c ' : ' ') +
      '+' +
      module.exports.humanize(this.diff);

    if (!this.useColors) {
      return;
    }

    const c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');

    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === '%%') {
        return;
      }
      index++;
      if (match === '%c') {
        // We only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */
  function log(...args) {
    // This hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return typeof console === 'object' && console.log && console.log(...args);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem('debug', namespaces);
      } else {
        exports.storage.removeItem('debug');
      }
    } catch (error) {
      // Swallow
      // XXX (@Qix-) should we be logging these?
    }
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */
  function load() {
    let r;
    try {
      r = exports.storage.getItem('debug');
    } catch (error) {
      // Swallow
      // XXX (@Qix-) should we be logging these?
    }

    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }

    return r;
  }

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
    try {
      // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
      // The Browser also has localStorage in the global context.
      return localStorage;
    } catch (error) {
      // Swallow
      // XXX (@Qix-) should we be logging these?
    }
  }

  module.exports = common(exports);

  const { formatters } = module.exports;

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return '[UnexpectedJSONParseError]: ' + error.message;
    }
  };
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var hasFlag = (flag, argv = process.argv) => {
  const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf('--');
  return (
    position !== -1 &&
    (terminatorPosition === -1 || position < terminatorPosition)
  );
};

const { env } = process;

let forceColor;
if (
  hasFlag('no-color') ||
  hasFlag('no-colors') ||
  hasFlag('color=false') ||
  hasFlag('color=never')
) {
  forceColor = 0;
} else if (
  hasFlag('color') ||
  hasFlag('colors') ||
  hasFlag('color=true') ||
  hasFlag('color=always')
) {
  forceColor = 1;
}

if ('FORCE_COLOR' in env) {
  if (env.FORCE_COLOR === 'true') {
    forceColor = 1;
  } else if (env.FORCE_COLOR === 'false') {
    forceColor = 0;
  } else {
    forceColor =
      env.FORCE_COLOR.length === 0
        ? 1
        : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
  }
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(haveStream, streamIsTTY) {
  if (forceColor === 0) {
    return 0;
  }

  if (
    hasFlag('color=16m') ||
    hasFlag('color=full') ||
    hasFlag('color=truecolor')
  ) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }

  const min = forceColor || 0;

  if (env.TERM === 'dumb') {
    return min;
  }

  if (process.platform === 'win32') {
    // Windows 10 build 10586 is the first Windows release that supports 256 colors.
    // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
    const osRelease = os.release().split('.');
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (
      ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
        (sign) => sign in env
      ) ||
      env.CI_NAME === 'codeship'
    ) {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }

  if ('GITHUB_ACTIONS' in env) {
    return 1;
  }

  if (env.COLORTERM === 'truecolor') {
    return 3;
  }

  if ('TERM_PROGRAM' in env) {
    const version = parseInt(
      (env.TERM_PROGRAM_VERSION || '').split('.')[0],
      10
    );

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (
    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)
  ) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  return min;
}

function getSupportLevel(stream) {
  const level = supportsColor(stream, stream && stream.isTTY);
  return translateLevel(level);
}

var supportsColor_1 = {
  supportsColor: getSupportLevel,
  stdout: translateLevel(supportsColor(true, tty.isatty(1))),
  stderr: translateLevel(supportsColor(true, tty.isatty(2))),
};

var node = createCommonjsModule(function(module, exports) {
  /**
   * Module dependencies.
   */

  /**
   * This is the Node.js implementation of `debug()`.
   */

  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;

  /**
   * Colors.
   */

  exports.colors = [6, 2, 3, 4, 5, 1];

  try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = supportsColor_1;

    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
      exports.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221,
      ];
    }
  } catch (error) {
    // Swallow - we only care if `supports-color` is available; it doesn't have to be.
  }

  /**
   * Build up the default `inspectOpts` object from the environment variables.
   *
   *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
   */

  exports.inspectOpts = Object.keys(process.env)
    .filter((key) => {
      return /^debug_/i.test(key);
    })
    .reduce((obj, key) => {
      // Camel-case
      const prop = key
        .substring(6)
        .toLowerCase()
        .replace(/_([a-z])/g, (_, k) => {
          return k.toUpperCase();
        });

      // Coerce string value into JS value
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === 'null') {
        val = null;
      } else {
        val = Number(val);
      }

      obj[prop] = val;
      return obj;
    }, {});

  /**
   * Is stdout a TTY? Colored output is enabled when `true`.
   */

  function useColors() {
    return 'colors' in exports.inspectOpts
      ? Boolean(exports.inspectOpts.colors)
      : tty.isatty(process.stderr.fd);
  }

  /**
   * Adds ANSI color escape codes if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    const { namespace: name, useColors } = this;

    if (useColors) {
      const c = this.color;
      const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
      const prefix = `  ${colorCode};1m${name} \u001B[0m`;

      args[0] = prefix + args[0].split('\n').join('\n' + prefix);
      args.push(
        colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m'
      );
    } else {
      args[0] = getDate() + name + ' ' + args[0];
    }
  }

  function getDate() {
    if (exports.inspectOpts.hideDate) {
      return '';
    }
    return new Date().toISOString() + ' ';
  }

  /**
   * Invokes `util.format()` with the specified arguments and writes to stderr.
   */

  function log(...args) {
    return process.stderr.write(util.format(...args) + '\n');
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */
  function save(namespaces) {
    if (namespaces) {
      process.env.DEBUG = namespaces;
    } else {
      // If you set a process.env field to null or undefined, it gets cast to the
      // string 'null' or 'undefined'. Just delete instead.
      delete process.env.DEBUG;
    }
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    return process.env.DEBUG;
  }

  /**
   * Init logic for `debug` instances.
   *
   * Create a new `inspectOpts` object in case `useColors` is set
   * differently for a particular `debug` instance.
   */

  function init(debug) {
    debug.inspectOpts = {};

    const keys = Object.keys(exports.inspectOpts);
    for (let i = 0; i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }

  module.exports = common(exports);

  const { formatters } = module.exports;

  /**
   * Map %o to `util.inspect()`, all on a single line.
   */

  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, ' ');
  };

  /**
   * Map %O to `util.inspect()`, allowing multiple lines if needed.
   */

  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function(module) {
  /**
   * Detect Electron renderer / nwjs process, which is node, but we should
   * treat as a browser.
   */

  if (
    typeof process === 'undefined' ||
    process.type === 'renderer' ||
    process.browser === true ||
    process.__nwjs
  ) {
    module.exports = browser;
  } else {
    module.exports = node;
  }
});

var saveAsyncStack = function saveAsyncStack(instance, lines) {
  if (instance.client.config.asyncStackTraces) {
    // a hack to get a callstack into the client code despite this
    // node.js bug https://github.com/nodejs/node/issues/11865
    const stackByLines = new Error().stack.split('\n');
    stackByLines.splice(0, lines);
    instance._asyncStack = stackByLines;
  }
};

function rng() {
  return crypto.randomBytes(16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    '-',
    bth[buf[i++]],
    bth[buf[i++]],
    '-',
    bth[buf[i++]],
    bth[buf[i++]],
    '-',
    bth[buf[i++]],
    bth[buf[i++]],
    '-',
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
  ].join('');
}

//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time

var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = (buf && offset) || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1],
        seedBytes[2],
        seedBytes[3],
        seedBytes[4],
        seedBytes[5],
      ];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.

  var msecs =
    options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = (clockseq + 1) & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval

  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested

  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = (tl >>> 24) & 0xff;
  b[i++] = (tl >>> 16) & 0xff;
  b[i++] = (tl >>> 8) & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
  b[i++] = (tmh >>> 8) & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = ((tmh >>> 24) & 0xf) | 0x10; // include version

  b[i++] = (tmh >>> 16) & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = (clockseq >>> 8) | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

function uuidToBytes(uuid) {
  // Note: We assume we're being passed a valid uuid string
  var bytes = [];
  uuid.replace(/[a-fA-F0-9]{2}/g, function(hex) {
    bytes.push(parseInt(hex, 16));
  });
  return bytes;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = new Array(str.length);

  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35(name, version, hashfunc) {
  var generateUUID = function(value, namespace, buf, offset) {
    var off = (buf && offset) || 0;
    if (typeof value == 'string') value = stringToBytes(value);
    if (typeof namespace == 'string') namespace = uuidToBytes(namespace);
    if (!Array.isArray(value))
      throw TypeError('value must be an array of bytes');
    if (!Array.isArray(namespace) || namespace.length !== 16)
      throw TypeError(
        'namespace must be uuid string or an Array of 16 byte values'
      ); // Per 4.3

    var bytes = hashfunc(namespace.concat(value));
    bytes[6] = (bytes[6] & 0x0f) | version;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    if (buf) {
      for (var idx = 0; idx < 16; ++idx) {
        buf[off + idx] = bytes[idx];
      }
    }

    return buf || bytesToUuid(bytes);
  }; // Function#name is not settable on some platforms (#270)

  try {
    generateUUID.name = name;
  } catch (err) {} // For CommonJS default export support

  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto
    .createHash('md5')
    .update(bytes)
    .digest();
}

const v3 = v35('v3', 0x30, md5);

function v4(options, buf, offset) {
  var i = (buf && offset) || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto
    .createHash('sha1')
    .update(bytes)
    .digest();
}

const v5 = v35('v5', 0x50, sha1);

var esmNode = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  v1: v1,
  v3: v3,
  v4: v4,
  v5: v5,
});

var noop = function() {};

const finallyMixin = (prototype) =>
  Object.assign(prototype, {
    finally(onFinally) {
      return this.then().finally(onFinally);
    },
  });

// FYI: Support for `Promise.prototype.finally` was not introduced until Node 9.
//      Therefore, Knex will need to conditionally inject support for `.finally(..)`
//      until support for Node 8 is officially dropped.
var finallyMixin_1 = Promise.prototype.finally ? noop : finallyMixin;

const { isEmpty, map, clone } = lodash;
const { callbackify } = util;

var _interface = function(Target) {
  Target.prototype.toQuery = function(tz) {
    let data = this.toSQL(this._method, tz);
    if (!Array.isArray(data)) data = [data];
    return map(data, (statement) => {
      return this.client._formatQuery(statement.sql, statement.bindings, tz);
    }).join(';\n');
  };

  // Create a new instance of the `Runner`, passing in the current object.
  Target.prototype.then = function(/* onFulfilled, onRejected */) {
    let result = this.client.runner(this).run();

    if (this.client.config.asyncStackTraces) {
      result = result.catch((err) => {
        err.originalStack = err.stack;
        const firstLine = err.stack.split('\n')[0];
        this._asyncStack.unshift(firstLine);
        // put the fake more helpful "async" stack on the thrown error
        err.stack = this._asyncStack.join('\n');
        throw err;
      });
    }

    return result.then.apply(result, arguments);
  };

  // Add additional "options" to the builder. Typically used for client specific
  // items, like the `mysql` and `sqlite3` drivers.
  Target.prototype.options = function(opts) {
    this._options = this._options || [];
    this._options.push(clone(opts) || {});
    return this;
  };

  // Sets an explicit "connection" we wish to use for this query.
  Target.prototype.connection = function(connection) {
    this._connection = connection;
    return this;
  };

  // Set a debug flag for the current schema query stack.
  Target.prototype.debug = function(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  };

  // Set the transaction object for this query.
  Target.prototype.transacting = function(t) {
    if (t && t.client) {
      if (!t.client.transacting) {
        t.client.logger.warn(`Invalid transaction value: ${t.client}`);
      } else {
        this.client = t.client;
      }
    }
    if (isEmpty(t)) {
      this.client.logger.error(
        'Invalid value on transacting call, potential bug'
      );
      throw Error(
        'Invalid transacting value (null, undefined or empty object)'
      );
    }
    return this;
  };

  // Initializes a stream.
  Target.prototype.stream = function(options) {
    return this.client.runner(this).stream(options);
  };

  // Initialize a stream & pipe automatically.
  Target.prototype.pipe = function(writable, options) {
    return this.client.runner(this).pipe(
      writable,
      options
    );
  };

  Target.prototype.asCallback = function(cb) {
    const promise = this.then();
    callbackify(() => promise)(cb);
    return promise;
  };

  Target.prototype.catch = function(onReject) {
    return this.then().catch(onReject);
  };

  Object.defineProperty(Target.prototype, Symbol.toStringTag, {
    get: () => 'object',
  });

  finallyMixin_1(Target.prototype);
};

// Raw
// -------

const { EventEmitter } = events;

const {
  assign,
  reduce,
  isPlainObject: isPlainObject$1,
  isObject,
  isUndefined: isUndefined$1,
  isNumber,
} = lodash;

const debugBindings = src('knex:bindings');

function Raw(client) {
  this.client = client;

  this.sql = '';
  this.bindings = [];

  // Todo: Deprecate
  this._wrappedBefore = undefined;
  this._wrappedAfter = undefined;
  if (client && client.config) {
    this._debug = client.config.debug;
    saveAsyncStack(this, 4);
  }
}

inherits(Raw, EventEmitter);

assign(Raw.prototype, {
  set(sql, bindings) {
    this.sql = sql;
    this.bindings =
      (isObject(bindings) && !bindings.toSQL) || isUndefined$1(bindings)
        ? bindings
        : [bindings];

    return this;
  },

  timeout(ms, { cancel } = {}) {
    if (isNumber(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  },

  // Wraps the current sql with `before` and `after`.
  wrap(before, after) {
    this._wrappedBefore = before;
    this._wrappedAfter = after;
    return this;
  },

  // Calls `toString` on the Knex object.
  toString() {
    return this.toQuery();
  },

  // Returns the raw sql for the query.
  toSQL(method, tz) {
    let obj;
    const formatter = this.client.formatter(this);

    if (Array.isArray(this.bindings)) {
      obj = replaceRawArrBindings(this, formatter);
    } else if (this.bindings && isPlainObject$1(this.bindings)) {
      obj = replaceKeyBindings(this, formatter);
    } else {
      obj = {
        method: 'raw',
        sql: this.sql,
        bindings: isUndefined$1(this.bindings) ? [] : [this.bindings],
      };
    }

    if (this._wrappedBefore) {
      obj.sql = this._wrappedBefore + obj.sql;
    }
    if (this._wrappedAfter) {
      obj.sql = obj.sql + this._wrappedAfter;
    }

    obj.options = reduce(this._options, assign, {});

    if (this._timeout) {
      obj.timeout = this._timeout;
      if (this._cancelOnTimeout) {
        obj.cancelOnTimeout = this._cancelOnTimeout;
      }
    }

    obj.bindings = obj.bindings || [];
    if (helpers.containsUndefined(obj.bindings)) {
      const undefinedBindingIndices = helpers.getUndefinedIndices(
        this.bindings
      );
      debugBindings(obj.bindings);
      throw new Error(
        `Undefined binding(s) detected for keys [${undefinedBindingIndices}] when compiling RAW query: ${obj.sql}`
      );
    }

    obj.__knexQueryUid = esmNode.v1();

    return obj;
  },
});

function replaceRawArrBindings(raw, formatter) {
  const expectedBindings = raw.bindings.length;
  const values = raw.bindings;
  let index = 0;

  const sql = raw.sql.replace(/\\?\?\??/g, function(match) {
    if (match === '\\?') {
      return match;
    }

    const value = values[index++];

    if (match === '??') {
      return formatter.columnize(value);
    }
    return formatter.parameter(value);
  });

  if (expectedBindings !== index) {
    throw new Error(`Expected ${expectedBindings} bindings, saw ${index}`);
  }

  return {
    method: 'raw',
    sql,
    bindings: formatter.bindings,
  };
}

function replaceKeyBindings(raw, formatter) {
  const values = raw.bindings;
  const regex = /\\?(:(\w+):(?=::)|:(\w+):(?!:)|:(\w+))/g;

  const sql = raw.sql.replace(regex, function(match, p1, p2, p3, p4) {
    if (match !== p1) {
      return p1;
    }

    const part = p2 || p3 || p4;
    const key = match.trim();
    const isIdentifier = key[key.length - 1] === ':';
    const value = values[part];

    if (value === undefined) {
      if (Object.prototype.hasOwnProperty.call(values, part)) {
        formatter.bindings.push(value);
      }

      return match;
    }

    if (isIdentifier) {
      return match.replace(p1, formatter.columnize(value));
    }

    return match.replace(p1, formatter.parameter(value));
  });

  return {
    method: 'raw',
    sql,
    bindings: formatter.bindings,
  };
}

// Allow the `Raw` object to be utilized with full access to the relevant
// promise API.
_interface(Raw);
helpers.addQueryContext(Raw);

var raw = Raw;

class Ref extends raw {
  constructor(client, ref) {
    super(client);

    this.ref = ref;
    this._schema = null;
    this._alias = null;
  }

  withSchema(schema) {
    this._schema = schema;

    return this;
  }

  as(alias) {
    this._alias = alias;

    return this;
  }

  toSQL() {
    const string = this._schema ? `${this._schema}.${this.ref}` : this.ref;

    const formatter = this.client.formatter(this);

    const ref = formatter.columnize(string);

    const sql = this._alias ? `${ref} as ${formatter.wrap(this._alias)}` : ref;

    this.set(sql, []);

    return super.toSQL(...arguments);
  }
}

var ref = Ref;

class KnexTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KnexTimeoutError';
  }
}

function timeout(promise, ms) {
  return new Promise(function(resolve, reject) {
    const id = setTimeout(function() {
      reject(new KnexTimeoutError('operation timed out'));
    }, ms);

    function wrappedResolve(value) {
      clearTimeout(id);
      resolve(value);
    }

    function wrappedReject(err) {
      clearTimeout(id);
      reject(err);
    }

    promise.then(wrappedResolve, wrappedReject);
  });
}

var KnexTimeoutError_1 = KnexTimeoutError;
var timeout_2 = timeout;

var timeout_1 = {
  KnexTimeoutError: KnexTimeoutError_1,
  timeout: timeout_2,
};

const { KnexTimeoutError: KnexTimeoutError$1 } = timeout_1;
const { timeout: timeout$1 } = timeout_1;

let PassThrough;

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.
function Runner(client, builder) {
  this.client = client;
  this.builder = builder;
  this.queries = [];

  // The "connection" object is set on the runner when
  // "run" is called.
  this.connection = void 0;
}

Object.assign(Runner.prototype, {
  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.
  run() {
    const runner = this;
    return (
      this.ensureConnection(function(connection) {
        runner.connection = connection;

        runner.client.emit('start', runner.builder);
        runner.builder.emit('start', runner.builder);
        const sql = runner.builder.toSQL();

        if (runner.builder._debug) {
          runner.client.logger.debug(sql);
        }

        if (Array.isArray(sql)) {
          return runner.queryArray(sql);
        }
        return runner.query(sql);
      })

        // If there are any "error" listeners, we fire an error event
        // and then re-throw the error to be eventually handled by
        // the promise chain. Useful if you're wrapping in a custom `Promise`.
        .catch(function(err) {
          if (runner.builder._events && runner.builder._events.error) {
            runner.builder.emit('error', err);
          }
          throw err;
        })

        // Fire a single "end" event on the builder when
        // all queries have successfully completed.
        .then(function(res) {
          runner.builder.emit('end');
          return res;
        })
    );
  },

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are
  stream(options, handler) {
    // If we specify stream(handler).then(...
    if (arguments.length === 1) {
      if (typeof options === 'function') {
        handler = options;
        options = {};
      }
    }

    // Determines whether we emit an error or throw here.
    const hasHandler = typeof handler === 'function';

    // Lazy-load the "PassThrough" dependency.
    PassThrough = PassThrough || stream.PassThrough;

    const runner = this;
    const stream$1 = new PassThrough({ objectMode: true });

    let hasConnection = false;
    const promise = this.ensureConnection(function(connection) {
      hasConnection = true;
      runner.connection = connection;
      try {
        const sql = runner.builder.toSQL();

        if (Array.isArray(sql) && hasHandler) {
          throw new Error(
            'The stream may only be used with a single query statement.'
          );
        }

        return runner.client.stream(runner.connection, sql, stream$1, options);
      } catch (e) {
        stream$1.emit('error', e);
        throw e;
      }
    });

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itself.
    if (hasHandler) {
      handler(stream$1);
      return promise;
    }

    // Emit errors on the stream if the error occurred before a connection
    // could be acquired.
    // If the connection was acquired, assume the error occurred in the client
    // code and has already been emitted on the stream. Don't emit it twice.
    promise.catch(function(err) {
      if (!hasConnection) stream$1.emit('error', err);
    });
    return stream$1;
  },

  // Allow you to pipe the stream to a writable stream.
  pipe(writable, options) {
    return this.stream(options).pipe(writable);
  },

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.
  query: async function(obj) {
    const { __knexUid, __knexTxId } = this.connection;

    this.builder.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));

    const runner = this;
    let queryPromise = this.client.query(this.connection, obj);

    if (obj.timeout) {
      queryPromise = timeout$1(queryPromise, obj.timeout);
    }

    // Await the return value of client.processResponse; in the case of sqlite3's
    // dropColumn()/renameColumn(), it will be a Promise for the transaction
    // containing the complete rename procedure.
    return queryPromise
      .then((resp) => this.client.processResponse(resp, runner))
      .then((processedResponse) => {
        const queryContext = this.builder.queryContext();
        const postProcessedResponse = this.client.postProcessResponse(
          processedResponse,
          queryContext
        );

        this.builder.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj),
          this.builder
        );

        this.client.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj),
          this.builder
        );

        return postProcessedResponse;
      })
      .catch((error) => {
        if (!(error instanceof KnexTimeoutError$1)) {
          return Promise.reject(error);
        }
        const { timeout, sql, bindings } = obj;

        let cancelQuery;
        if (obj.cancelOnTimeout) {
          cancelQuery = this.client.cancelQuery(this.connection);
        } else {
          // If we don't cancel the query, we need to mark the connection as disposed so that
          // it gets destroyed by the pool and is never used again. If we don't do this and
          // return the connection to the pool, it will be useless until the current operation
          // that timed out, finally finishes.
          this.connection.__knex__disposed = error;
          cancelQuery = Promise.resolve();
        }

        return cancelQuery
          .catch((cancelError) => {
            // If the cancellation failed, we need to mark the connection as disposed so that
            // it gets destroyed by the pool and is never used again. If we don't do this and
            // return the connection to the pool, it will be useless until the current operation
            // that timed out, finally finishes.
            this.connection.__knex__disposed = error;

            // cancellation failed
            throw Object.assign(cancelError, {
              message: `After query timeout of ${timeout}ms exceeded, cancelling of query failed.`,
              sql,
              bindings,
              timeout,
            });
          })
          .then(() => {
            // cancellation succeeded, rethrow timeout error
            throw Object.assign(error, {
              message: `Defined query timeout of ${timeout}ms exceeded when running query.`,
              sql,
              bindings,
              timeout,
            });
          });
      })
      .catch((error) => {
        this.builder.emit(
          'query-error',
          error,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj)
        );
        throw error;
      });
  },

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.
  async queryArray(queries) {
    if (queries.length === 1) {
      return this.query(queries[0]);
    }

    const results = [];
    for (const query of queries) {
      results.push(await this.query(query));
    }
    return results;
  },

  // Check whether there's a transaction flag, and that it has a connection.
  async ensureConnection(cb) {
    // Use override from a builder if passed
    if (this.builder._connection) {
      return cb(this.builder._connection);
    }

    if (this.connection) {
      return cb(this.connection);
    }
    return this.client
      .acquireConnection()
      .catch((error) => {
        if (!(error instanceof KnexTimeoutError$1)) {
          return Promise.reject(error);
        }
        if (this.builder) {
          error.sql = this.builder.sql;
          error.bindings = this.builder.bindings;
        }
        throw error;
      })
      .then(async (connection) => {
        try {
          return await cb(connection);
        } finally {
          await this.client.releaseConnection(this.connection);
        }
      });
  },
});

var runner = Runner;

// JoinClause
// -------

// The "JoinClause" is an object holding any necessary info about a join,
// including the type, and any associated tables & columns being joined.
function JoinClause(table, type, schema) {
  this.schema = schema;
  this.table = table;
  this.joinType = type;
  this.and = this;
  this.clauses = [];
}

function getClauseFromArguments(compilerType, bool, first, operator, second) {
  let data = null;

  if (typeof first === 'function') {
    data = {
      type: 'onWrapped',
      value: first,
      bool: bool,
    };
  } else {
    switch (arguments.length) {
      case 3: {
        data = { type: 'onRaw', value: first, bool };
        break;
      }
      case 4:
        data = {
          type: compilerType,
          column: first,
          operator: '=',
          value: operator,
          bool,
        };
        break;
      default:
        data = {
          type: compilerType,
          column: first,
          operator,
          value: second,
          bool,
        };
    }
  }

  return data;
}

Object.assign(JoinClause.prototype, {
  grouping: 'join',

  // Adds an "on" clause to the current join object.
  on(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOn' : 'on';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onBasic', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  // Adds a "using" clause to the current join.
  using(column) {
    return this.clauses.push({ type: 'onUsing', column, bool: this._bool() });
  },

  /*// Adds an "and on" clause to the current join object.
  andOn() {
    return this.on.apply(this, arguments);
  },*/

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    return this._bool('or').on.apply(this, arguments);
  },

  onVal(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOnVal' : 'onVal';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onVal', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  andOnVal() {
    return this.onVal(...arguments);
  },

  orOnVal() {
    return this._bool('or').onVal(...arguments);
  },

  onBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to onBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the onBetween clause'
    );
    this.clauses.push({
      type: 'onBetween',
      column,
      value: values,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  onNotBetween(column, values) {
    return this._not(true).onBetween(column, values);
  },

  orOnBetween(column, values) {
    return this._bool('or').onBetween(column, values);
  },

  orOnNotBetween(column, values) {
    return this._bool('or')
      ._not(true)
      .onBetween(column, values);
  },

  onIn(column, values) {
    if (Array.isArray(values) && values.length === 0) return this.on(1, '=', 0);
    this.clauses.push({
      type: 'onIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  onNotIn(column, values) {
    return this._not(true).onIn(column, values);
  },

  orOnIn(column, values) {
    return this._bool('or').onIn(column, values);
  },

  orOnNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .onIn(column, values);
  },

  onNull(column) {
    this.clauses.push({
      type: 'onNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnNull(callback) {
    return this._bool('or').onNull(callback);
  },

  onNotNull(callback) {
    return this._not(true).onNull(callback);
  },

  orOnNotNull(callback) {
    return this._not(true)
      ._bool('or')
      .onNull(callback);
  },

  onExists(callback) {
    this.clauses.push({
      type: 'onExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnExists(callback) {
    return this._bool('or').onExists(callback);
  },

  onNotExists(callback) {
    return this._not(true).onExists(callback);
  },

  orOnNotExists(callback) {
    return this._not(true)
      ._bool('or')
      .onExists(callback);
  },

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  },

  _bool(bool) {
    if (arguments.length === 1) {
      this._boolFlag = bool;
      return this;
    }
    const ret = this._boolFlag || 'and';
    this._boolFlag = 'and';
    return ret;
  },

  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },
});

Object.defineProperty(JoinClause.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

JoinClause.prototype.andOn = JoinClause.prototype.on;
JoinClause.prototype.andOnIn = JoinClause.prototype.onIn;
JoinClause.prototype.andOnNotIn = JoinClause.prototype.onNotIn;
JoinClause.prototype.andOnNull = JoinClause.prototype.onNull;
JoinClause.prototype.andOnNotNull = JoinClause.prototype.onNotNull;
JoinClause.prototype.andOnExists = JoinClause.prototype.onExists;
JoinClause.prototype.andOnNotExists = JoinClause.prototype.onNotExists;
JoinClause.prototype.andOnBetween = JoinClause.prototype.onBetween;
JoinClause.prototype.andOnNotBetween = JoinClause.prototype.onNotBetween;

var joinclause = JoinClause;

/**
 * internal constants, do not use in application code
 */
var constants$1 = {
  lockMode: {
    forShare: 'forShare',
    forUpdate: 'forUpdate',
  },
  waitMode: {
    skipLocked: 'skipLocked',
    noWait: 'noWait',
  },
};

// Builder
// -------

const { EventEmitter: EventEmitter$1 } = events;

const {
  assign: assign$1,
  clone: clone$1,
  each,
  isBoolean,
  isEmpty: isEmpty$1,
  isFunction: isFunction$1,
  isNil,
  isNumber: isNumber$1,
  isObject: isObject$1,
  isString,
  isUndefined: isUndefined$2,
  tail,
  toArray,
  reject,
  includes,
  last,
  isPlainObject: isPlainObject$2,
} = lodash;

const { lockMode, waitMode } = constants$1;

// Typically called from `knex.builder`,
// start a new query building chain.
function Builder(client) {
  this.client = client;
  this.and = this;
  this._single = {};
  this._statements = [];
  this._method = 'select';
  if (client.config) {
    saveAsyncStack(this, 5);
    this._debug = client.config.debug;
  }
  // Internal flags used in the builder.
  this._joinFlag = 'inner';
  this._boolFlag = 'and';
  this._notFlag = false;
  this._asColumnFlag = false;
}

inherits(Builder, EventEmitter$1);

const validateWithArgs = function(alias, statement, method) {
  if (typeof alias !== 'string') {
    throw new Error(`${method}() first argument must be a string`);
  }
  if (
    typeof statement === 'function' ||
    statement instanceof Builder ||
    statement instanceof raw
  ) {
    return;
  }
  throw new Error(
    `${method}() second argument must be a function / QueryBuilder or a raw`
  );
};

assign$1(Builder.prototype, {
  toString() {
    return this.toQuery();
  },

  // Convert the current query "toSQL"
  toSQL(method, tz) {
    return this.client.queryCompiler(this).toSQL(method || this._method, tz);
  },

  // Create a shallow clone of the current query builder.
  clone() {
    const cloned = new this.constructor(this.client);
    cloned._method = this._method;
    cloned._single = clone$1(this._single);
    cloned._statements = clone$1(this._statements);
    cloned._debug = this._debug;

    // `_option` is assigned by the `Interface` mixin.
    if (!isUndefined$2(this._options)) {
      cloned._options = clone$1(this._options);
    }
    if (!isUndefined$2(this._queryContext)) {
      cloned._queryContext = clone$1(this._queryContext);
    }
    if (!isUndefined$2(this._connection)) {
      cloned._connection = this._connection;
    }

    return cloned;
  },

  timeout(ms, { cancel } = {}) {
    if (isNumber$1(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  },

  // With
  // ------

  with(alias, statement) {
    validateWithArgs(alias, statement, 'with');
    return this.withWrapped(alias, statement);
  },

  // Helper for compiling any advanced `with` queries.
  withWrapped(alias, query) {
    this._statements.push({
      grouping: 'with',
      type: 'withWrapped',
      alias: alias,
      value: query,
    });
    return this;
  },

  // With Recursive
  // ------

  withRecursive(alias, statement) {
    validateWithArgs(alias, statement, 'withRecursive');
    return this.withRecursiveWrapped(alias, statement);
  },

  // Helper for compiling any advanced `withRecursive` queries.
  withRecursiveWrapped(alias, query) {
    this.withWrapped(alias, query);
    this._statements[this._statements.length - 1].recursive = true;
    return this;
  },

  // Select
  // ------

  // Adds a column or columns to the list of "columns"
  // being selected on the query.
  columns(column) {
    if (!column && column !== 0) return this;
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Allow for a sub-select to be explicitly aliased as a column,
  // without needing to compile the query in a where.
  as(column) {
    this._single.as = column;
    return this;
  },

  // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
  withSchema(schemaName) {
    this._single.schema = schemaName;
    return this;
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert statements
  // e.g. builder.insert({a: value}).into('tableName')
  // `options`: options object containing keys:
  //   - `only`: whether the query should use SQL's ONLY to not return
  //           inheriting table data. Defaults to false.
  table(tableName, options = {}) {
    this._single.table = tableName;
    this._single.only = options.only === true;
    return this;
  },

  // Adds a `distinct` clause to the query.
  distinct() {
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
      distinct: true,
    });
    return this;
  },

  distinctOn() {
    const value = helpers.normalizeArr.apply(null, arguments);
    if (isEmpty$1(value)) {
      throw new Error('distinctOn requires atleast on argument');
    }
    this._statements.push({
      grouping: 'columns',
      value,
      distinctOn: true,
    });
    return this;
  },

  // Adds a join clause to the query, allowing for advanced joins
  // with an anonymous function as the second argument.
  // function(table, first, operator, second)
  join(table, first) {
    let join;
    const { schema } = this._single;
    const joinType = this._joinType();
    if (typeof first === 'function') {
      join = new joinclause(table, joinType, schema);
      first.call(join, join);
    } else if (joinType === 'raw') {
      join = new joinclause(this.client.raw(table, first), 'raw');
    } else {
      join = new joinclause(
        table,
        joinType,
        table instanceof Builder ? undefined : schema
      );
      if (arguments.length > 1) {
        join.on.apply(join, toArray(arguments).slice(1));
      }
    }
    this._statements.push(join);
    return this;
  },

  // JOIN blocks:
  innerJoin() {
    return this._joinType('inner').join.apply(this, arguments);
  },
  leftJoin() {
    return this._joinType('left').join.apply(this, arguments);
  },
  leftOuterJoin() {
    return this._joinType('left outer').join.apply(this, arguments);
  },
  rightJoin() {
    return this._joinType('right').join.apply(this, arguments);
  },
  rightOuterJoin() {
    return this._joinType('right outer').join.apply(this, arguments);
  },
  outerJoin() {
    return this._joinType('outer').join.apply(this, arguments);
  },
  fullOuterJoin() {
    return this._joinType('full outer').join.apply(this, arguments);
  },
  crossJoin() {
    return this._joinType('cross').join.apply(this, arguments);
  },
  joinRaw() {
    return this._joinType('raw').join.apply(this, arguments);
  },

  // The where function can be used in several ways:
  // The most basic is `where(key, value)`, which expands to
  // where key = value.
  where(column, operator, value) {
    // Support "where true || where false"
    if (column === false || column === true) {
      return this.where(1, '=', column ? 1 : 0);
    }

    // Check if the column is a function, in which case it's
    // a where statement wrapped in parens.
    if (typeof column === 'function') {
      return this.whereWrapped(column);
    }

    // Allow a raw statement to be passed along to the query.
    if (column instanceof raw && arguments.length === 1)
      return this.whereRaw(column);

    // Allows `where({id: 2})` syntax.
    if (isObject$1(column) && !(column instanceof raw))
      return this._objectWhere(column);

    // Enable the where('key', value) syntax, only when there
    // are explicitly two arguments passed, so it's not possible to
    // do where('key', '!=') and have that turn into where key != null
    if (arguments.length === 2) {
      value = operator;
      operator = '=';

      // If the value is null, and it's a two argument query,
      // we assume we're going for a `whereNull`.
      if (value === null) {
        return this.whereNull(column);
      }
    }

    // lower case the operator for comparison purposes
    const checkOperator = `${operator}`.toLowerCase().trim();

    // If there are 3 arguments, check whether 'in' is one of them.
    if (arguments.length === 3) {
      if (checkOperator === 'in' || checkOperator === 'not in') {
        return this._not(checkOperator === 'not in').whereIn(
          arguments[0],
          arguments[2]
        );
      }
      if (checkOperator === 'between' || checkOperator === 'not between') {
        return this._not(checkOperator === 'not between').whereBetween(
          arguments[0],
          arguments[2]
        );
      }
    }

    // If the value is still null, check whether they're meaning
    // where value is null
    if (value === null) {
      // Check for .where(key, 'is', null) or .where(key, 'is not', 'null');
      if (checkOperator === 'is' || checkOperator === 'is not') {
        return this._not(checkOperator === 'is not').whereNull(column);
      }
    }

    // Push onto the where statement stack.
    this._statements.push({
      grouping: 'where',
      type: 'whereBasic',
      column,
      operator,
      value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    });
    return this;
  },

  whereColumn(column, operator, rightColumn) {
    this._asColumnFlag = true;
    this.where.apply(this, arguments);
    this._asColumnFlag = false;
    return this;
  },

  // Adds an `or where` clause to the query.
  orWhere() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.whereWrapped(function() {
        for (const key in obj) {
          this.andWhere(key, obj[key]);
        }
      });
    }
    return this.where.apply(this, arguments);
  },

  orWhereColumn() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.whereWrapped(function() {
        for (const key in obj) {
          this.andWhereColumn(key, '=', obj[key]);
        }
      });
    }
    return this.whereColumn.apply(this, arguments);
  },

  // Adds an `not where` clause to the query.
  whereNot() {
    return this._not(true).where.apply(this, arguments);
  },

  whereNotColumn() {
    return this._not(true).whereColumn.apply(this, arguments);
  },

  // Adds an `or not where` clause to the query.
  orWhereNot() {
    return this._bool('or').whereNot.apply(this, arguments);
  },

  orWhereNotColumn() {
    return this._bool('or').whereNotColumn.apply(this, arguments);
  },

  // Processes an object literal provided in a "where" clause.
  _objectWhere(obj) {
    const boolVal = this._bool();
    const notVal = this._not() ? 'Not' : '';
    for (const key in obj) {
      this[boolVal + 'Where' + notVal](key, obj[key]);
    }
    return this;
  },

  // Adds a raw `where` clause to the query.
  whereRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'where',
      type: 'whereRaw',
      value: raw$1,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orWhereRaw(sql, bindings) {
    return this._bool('or').whereRaw(sql, bindings);
  },

  // Helper for compiling any advanced `where` queries.
  whereWrapped(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereWrapped',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where exists` clause to the query.
  whereExists(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds an `or where exists` clause to the query.
  orWhereExists(callback) {
    return this._bool('or').whereExists(callback);
  },

  // Adds a `where not exists` clause to the query.
  whereNotExists(callback) {
    return this._not(true).whereExists(callback);
  },

  // Adds a `or where not exists` clause to the query.
  orWhereNotExists(callback) {
    return this._bool('or').whereNotExists(callback);
  },

  // Adds a `where in` clause to the query.
  whereIn(column, values) {
    if (Array.isArray(values) && isEmpty$1(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'where',
      type: 'whereIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orWhereIn(column, values) {
    return this._bool('or').whereIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  whereNotIn(column, values) {
    return this._not(true).whereIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orWhereNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .whereIn(column, values);
  },

  // Adds a `where null` clause to the query.
  whereNull(column) {
    this._statements.push({
      grouping: 'where',
      type: 'whereNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where null` clause to the query.
  orWhereNull(column) {
    return this._bool('or').whereNull(column);
  },

  // Adds a `where not null` clause to the query.
  whereNotNull(column) {
    return this._not(true).whereNull(column);
  },

  // Adds a `or where not null` clause to the query.
  orWhereNotNull(column) {
    return this._bool('or').whereNotNull(column);
  },

  // Adds a `where between` clause to the query.
  whereBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to whereBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the whereBetween clause'
    );
    this._statements.push({
      grouping: 'where',
      type: 'whereBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where not between` clause to the query.
  whereNotBetween(column, values) {
    return this._not(true).whereBetween(column, values);
  },

  // Adds a `or where between` clause to the query.
  orWhereBetween(column, values) {
    return this._bool('or').whereBetween(column, values);
  },

  // Adds a `or where not between` clause to the query.
  orWhereNotBetween(column, values) {
    return this._bool('or').whereNotBetween(column, values);
  },

  // Adds a `group by` clause to the query.
  groupBy(item) {
    if (item instanceof raw) {
      return this.groupByRaw.apply(this, arguments);
    }
    this._statements.push({
      grouping: 'group',
      type: 'groupByBasic',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Adds a raw `group by` clause to the query.
  groupByRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'group',
      type: 'groupByRaw',
      value: raw$1,
    });
    return this;
  },

  // Adds a `order by` clause to the query.
  orderBy(column, direction) {
    if (Array.isArray(column)) {
      return this._orderByArray(column);
    }
    this._statements.push({
      grouping: 'order',
      type: 'orderByBasic',
      value: column,
      direction,
    });
    return this;
  },

  // Adds a `order by` with multiple columns to the query.
  _orderByArray(columnDefs) {
    for (let i = 0; i < columnDefs.length; i++) {
      const columnInfo = columnDefs[i];
      if (isObject$1(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo['column'],
          direction: columnInfo['order'],
        });
      } else if (isString(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo,
        });
      }
    }
    return this;
  },

  // Add a raw `order by` clause to the query.
  orderByRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'order',
      type: 'orderByRaw',
      value: raw$1,
    });
    return this;
  },

  _union(clause, args) {
    let callbacks = args[0];
    let wrap = args[1];
    if (args.length === 1 || (args.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: clause,
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(args).slice(0, args.length - 1);
      wrap = args[args.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this._union(clause, [callbacks, wrap]);
    }
    return this;
  },

  // Add a union statement to the query.
  union(...args) {
    return this._union('union', args);
  },

  // Adds a union all statement to the query.
  unionAll(...args) {
    return this._union('union all', args);
  },

  // Adds an intersect statement to the query
  intersect(callbacks, wrap) {
    if (arguments.length === 1 || (arguments.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: 'intersect',
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(arguments).slice(0, arguments.length - 1);
      wrap = arguments[arguments.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this.intersect(callbacks, wrap);
    }
    return this;
  },

  // Adds a `having` clause to the query.
  having(column, operator, value) {
    if (column instanceof raw && arguments.length === 1) {
      return this.havingRaw(column);
    }

    // Check if the column is a function, in which case it's
    // a having statement wrapped in parens.
    if (typeof column === 'function') {
      return this.havingWrapped(column);
    }

    this._statements.push({
      grouping: 'having',
      type: 'havingBasic',
      column,
      operator,
      value,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHaving: function orHaving() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.havingWrapped(function() {
        for (const key in obj) {
          this.andHaving(key, obj[key]);
        }
      });
    }
    return this.having.apply(this, arguments);
  },

  // Helper for compiling any advanced `having` queries.
  havingWrapped(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingWrapped',
      value: callback,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  havingNull(column) {
    this._statements.push({
      grouping: 'having',
      type: 'havingNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingNull(callback) {
    return this._bool('or').havingNull(callback);
  },

  havingNotNull(callback) {
    return this._not(true).havingNull(callback);
  },

  orHavingNotNull(callback) {
    return this._not(true)
      ._bool('or')
      .havingNull(callback);
  },

  havingExists(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingExists(callback) {
    return this._bool('or').havingExists(callback);
  },

  havingNotExists(callback) {
    return this._not(true).havingExists(callback);
  },

  orHavingNotExists(callback) {
    return this._not(true)
      ._bool('or')
      .havingExists(callback);
  },

  havingBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to havingBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the havingBetween clause'
    );
    this._statements.push({
      grouping: 'having',
      type: 'havingBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingBetween(column, values) {
    return this._bool('or').havingBetween(column, values);
  },

  havingNotBetween(column, values) {
    return this._not(true).havingBetween(column, values);
  },

  orHavingNotBetween(column, values) {
    return this._not(true)
      ._bool('or')
      .havingBetween(column, values);
  },

  havingIn(column, values) {
    if (Array.isArray(values) && isEmpty$1(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'having',
      type: 'havingIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orHavingIn(column, values) {
    return this._bool('or').havingIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  havingNotIn(column, values) {
    return this._not(true).havingIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orHavingNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .havingIn(column, values);
  },

  // Adds a raw `having` clause to the query.
  havingRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'having',
      type: 'havingRaw',
      value: raw$1,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHavingRaw(sql, bindings) {
    return this._bool('or').havingRaw(sql, bindings);
  },

  // Only allow a single "offset" to be set for the current query.
  offset(value) {
    if (isNil(value) || value instanceof raw || value instanceof Builder) {
      // Builder for backward compatibility
      this._single.offset = value;
    } else {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        this.client.logger.warn('A valid integer must be provided to offset');
      } else {
        this._single.offset = val;
      }
    }
    return this;
  },

  // Only allow a single "limit" to be set for the current query.
  limit(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.client.logger.warn('A valid integer must be provided to limit');
    } else {
      this._single.limit = val;
    }
    return this;
  },

  // Retrieve the "count" result of the query.
  count(column, options) {
    return this._aggregate('count', column || '*', options);
  },

  // Retrieve the minimum value of a given column.
  min(column, options) {
    return this._aggregate('min', column, options);
  },

  // Retrieve the maximum value of a given column.
  max(column, options) {
    return this._aggregate('max', column, options);
  },

  // Retrieve the sum of the values of a given column.
  sum(column, options) {
    return this._aggregate('sum', column, options);
  },

  // Retrieve the average of the values of a given column.
  avg(column, options) {
    return this._aggregate('avg', column, options);
  },

  // Retrieve the "count" of the distinct results of the query.
  countDistinct() {
    let columns = helpers.normalizeArr.apply(null, arguments);
    let options;
    if (columns.length > 1 && isPlainObject$2(last(columns))) {
      [options] = columns.splice(columns.length - 1, 1);
    }

    if (!columns.length) {
      columns = '*';
    } else if (columns.length === 1) {
      columns = columns[0];
    }

    return this._aggregate('count', columns, { ...options, distinct: true });
  },

  // Retrieve the sum of the distinct values of a given column.
  sumDistinct(column, options) {
    return this._aggregate('sum', column, { ...options, distinct: true });
  },

  // Retrieve the vg of the distinct results of the query.
  avgDistinct(column, options) {
    return this._aggregate('avg', column, { ...options, distinct: true });
  },

  // Increments a column's value by the specified amount.
  increment(column, amount = 1) {
    if (isObject$1(column)) {
      for (const key in column) {
        this._counter(key, column[key]);
      }

      return this;
    }

    return this._counter(column, amount);
  },

  // Decrements a column's value by the specified amount.
  decrement(column, amount = 1) {
    if (isObject$1(column)) {
      for (const key in column) {
        this._counter(key, -column[key]);
      }

      return this;
    }

    return this._counter(column, -amount);
  },

  // Clears increments/decrements
  clearCounters() {
    this._single.counter = {};

    return this;
  },

  // Sets the values for a `select` query, informing that only the first
  // row should be returned (limit 1).
  first() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .first() on "${this._method}" query!`);
    }

    const args = new Array(arguments.length);
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    this.select.apply(this, args);
    this._method = 'first';
    this.limit(1);
    return this;
  },

  // Use existing connection to execute the query
  // Same value that client.acquireConnection() for an according client returns should be passed
  connection(_connection) {
    this._connection = _connection;
    return this;
  },

  // Pluck a column from a query.
  pluck(column) {
    this._method = 'pluck';
    this._single.pluck = column;
    this._statements.push({
      grouping: 'columns',
      type: 'pluck',
      value: column,
    });
    return this;
  },

  // Remove everything from select clause
  clearSelect() {
    this._clearGrouping('columns');
    return this;
  },

  // Remove everything from where clause
  clearWhere() {
    this._clearGrouping('where');
    return this;
  },

  // Remove everything from group clause
  clearGroup() {
    this._clearGrouping('group');
    return this;
  },

  // Remove everything from order clause
  clearOrder() {
    this._clearGrouping('order');
    return this;
  },

  // Remove everything from having clause
  clearHaving() {
    this._clearGrouping('having');
    return this;
  },

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    this._method = 'insert';
    if (!isEmpty$1(returning)) this.returning(returning);
    this._single.insert = values;
    return this;
  },

  // Sets the values for an `update`, allowing for both
  // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
  update(values, returning) {
    let ret;
    const obj = this._single.update || {};
    this._method = 'update';
    if (isString(values)) {
      obj[values] = returning;
      if (arguments.length > 2) {
        ret = arguments[2];
      }
    } else {
      const keys = Object.keys(values);
      if (this._single.update) {
        this.client.logger.warn('Update called multiple times with objects.');
      }
      let i = -1;
      while (++i < keys.length) {
        obj[keys[i]] = values[keys[i]];
      }
      ret = arguments[1];
    }
    if (!isEmpty$1(ret)) this.returning(ret);
    this._single.update = obj;
    return this;
  },

  // Sets the returning value for the query.
  returning(returning) {
    this._single.returning = returning;
    return this;
  },

  // Delete
  // ------

  // Executes a delete statement on the query;
  delete(ret) {
    this._method = 'del';
    if (!isEmpty$1(ret)) this.returning(ret);
    return this;
  },

  // Truncates a table, ends the query chain.
  truncate(tableName) {
    this._method = 'truncate';
    if (tableName) {
      this._single.table = tableName;
    }
    return this;
  },

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    this._method = 'columnInfo';
    this._single.columnInfo = column;
    return this;
  },

  // Set a lock for update constraint.
  forUpdate() {
    this._single.lock = lockMode.forUpdate;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Set a lock for share constraint.
  forShare() {
    this._single.lock = lockMode.forShare;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Skips locked rows when using a lock constraint.
  skipLocked() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.skipLocked() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.noWait) {
      throw new Error('.skipLocked() cannot be used together with .noWait()!');
    }
    this._single.waitMode = waitMode.skipLocked;
    return this;
  },

  // Causes error when acessing a locked row instead of waiting for it to be released.
  noWait() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.noWait() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.skipLocked) {
      throw new Error('.noWait() cannot be used together with .skipLocked()!');
    }
    this._single.waitMode = waitMode.noWait;
    return this;
  },

  // Takes a JS object of methods to call and calls them
  fromJS(obj) {
    each(obj, (val, key) => {
      if (typeof this[key] !== 'function') {
        this.client.logger.warn(`Knex Error: unknown key ${key}`);
      }
      if (Array.isArray(val)) {
        this[key].apply(this, val);
      } else {
        this[key](val);
      }
    });
    return this;
  },

  // Passes query to provided callback function, useful for e.g. composing
  // domain-specific helpers
  modify(callback) {
    callback.apply(this, [this].concat(tail(arguments)));
    return this;
  },

  // ----------------------------------------------------------------------

  // Helper for the incrementing/decrementing queries.
  _counter(column, amount) {
    amount = parseFloat(amount);

    this._method = 'update';

    this._single.counter = this._single.counter || {};

    this._single.counter[column] = amount;

    return this;
  },

  // Helper to get or set the "boolFlag" value.
  _bool(val) {
    if (arguments.length === 1) {
      this._boolFlag = val;
      return this;
    }
    const ret = this._boolFlag;
    this._boolFlag = 'and';
    return ret;
  },

  // Helper to get or set the "notFlag" value.
  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },

  // Helper to get or set the "joinFlag" value.
  _joinType(val) {
    if (arguments.length === 1) {
      this._joinFlag = val;
      return this;
    }
    const ret = this._joinFlag || 'inner';
    this._joinFlag = 'inner';
    return ret;
  },

  // Helper for compiling any aggregate queries.
  _aggregate(method, column, options = {}) {
    this._statements.push({
      grouping: 'columns',
      type: column instanceof raw ? 'aggregateRaw' : 'aggregate',
      method,
      value: column,
      aggregateDistinct: options.distinct || false,
      alias: options.as,
    });
    return this;
  },

  // Helper function for clearing or reseting a grouping type from the builder
  _clearGrouping(grouping) {
    this._statements = reject(this._statements, { grouping });
  },

  // Helper function that checks if the builder will emit a select query
  _isSelectQuery() {
    return includes(['pluck', 'first', 'select'], this._method);
  },

  // Helper function that checks if the query has a lock mode set
  _hasLockMode() {
    return includes([lockMode.forShare, lockMode.forUpdate], this._single.lock);
  },
});

Object.defineProperty(Builder.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

Object.defineProperty(Builder.prototype, 'not', {
  get() {
    return this._not(true);
  },
});

Builder.prototype.select = Builder.prototype.columns;
Builder.prototype.column = Builder.prototype.columns;
Builder.prototype.andWhereNot = Builder.prototype.whereNot;
Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
Builder.prototype.andWhere = Builder.prototype.where;
Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
Builder.prototype.andHaving = Builder.prototype.having;
Builder.prototype.andHavingIn = Builder.prototype.havingIn;
Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
Builder.prototype.andHavingNull = Builder.prototype.havingNull;
Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
Builder.prototype.andHavingExists = Builder.prototype.havingExists;
Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
Builder.prototype.from = Builder.prototype.table;
Builder.prototype.into = Builder.prototype.table;
Builder.prototype.del = Builder.prototype.delete;

// Attach all of the top level promise methods that should be chainable.
_interface(Builder);
helpers.addQueryContext(Builder);

Builder.extend = (methodName, fn) => {
  if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
    throw new Error(
      `Can't extend QueryBuilder with existing method ('${methodName}').`
    );
  }

  assign$1(Builder.prototype, { [methodName]: fn });
};

var builder = Builder;

const { transform } = lodash;

// Valid values for the `order by` clause generation.
const orderBys = ['asc', 'desc'];

// Turn this into a lookup map
const operators = transform(
  [
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!=',
    'like',
    'not like',
    'between',
    'not between',
    'ilike',
    'not ilike',
    'exists',
    'not exist',
    'rlike',
    'not rlike',
    'regexp',
    'not regexp',
    '&',
    '|',
    '^',
    '<<',
    '>>',
    '~',
    '~*',
    '!~',
    '!~*',
    '#',
    '&&',
    '@>',
    '<@',
    '||',
    '&<',
    '&>',
    '-|-',
    '@@',
    '!!',
    ['?', '\\?'],
    ['?|', '\\?|'],
    ['?&', '\\?&'],
  ],
  (result, key) => {
    if (Array.isArray(key)) {
      result[key[0]] = key[1];
    } else {
      result[key] = key;
    }
  },
  {}
);

class Formatter {
  constructor(client, builder) {
    this.client = client;
    this.builder = builder;
    this.bindings = [];
  }

  // Accepts a string or array of columns to wrap as appropriate.
  columnize(target) {
    const columns = Array.isArray(target) ? target : [target];
    let str = '',
      i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', ';
      str += this.wrap(columns[i]);
    }
    return str;
  }

  // Turns a list of values into a list of ?'s, joining them with commas unless
  // a "joining" value is specified (e.g. ' and ')
  parameterize(values, notSetValue) {
    if (typeof values === 'function') return this.parameter(values);
    values = Array.isArray(values) ? values : [values];
    let str = '',
      i = -1;
    while (++i < values.length) {
      if (i > 0) str += ', ';
      str += this.parameter(values[i] === undefined ? notSetValue : values[i]);
    }
    return str;
  }

  // Formats `values` into a parenthesized list of parameters for a `VALUES`
  // clause.
  //
  // [1, 2]                  -> '(?, ?)'
  // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
  // knex('table')           -> '(select * from "table")'
  // knex.raw('select ?', 1) -> '(select ?)'
  //
  values(values) {
    if (Array.isArray(values)) {
      if (Array.isArray(values[0])) {
        return `(${values
          .map((value) => `(${this.parameterize(value)})`)
          .join(', ')})`;
      }
      return `(${this.parameterize(values)})`;
    }

    if (values instanceof raw) {
      return `(${this.parameter(values)})`;
    }

    return this.parameter(values);
  }

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  parameter(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    }
    return this.unwrapRaw(value, true) || '?';
  }

  unwrapRaw(value, isParameter) {
    let query;
    if (value instanceof builder) {
      query = this.client.queryCompiler(value).toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return this.outputQuery(query, isParameter);
    }
    if (value instanceof raw) {
      value.client = this.client;
      if (this.builder._queryContext) {
        value.queryContext = () => {
          return this.builder._queryContext;
        };
      }

      query = value.toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return query.sql;
    }
    if (isParameter) {
      this.bindings.push(value);
    }
  }

  /**
   * Creates SQL for a parameter, which might be passed to where() or .with() or
   * pretty much anywhere in API.
   *
   * @param query Callback (for where or complete builder), Raw or QueryBuilder
   * @param method Optional at least 'select' or 'update' are valid
   */
  rawOrFn(value, method) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value, method));
    }
    return this.unwrapRaw(value) || '';
  }

  // Puts the appropriate wrapper around a value depending on the database
  // engine, unless it's a knex.raw value, in which case it's left alone.
  wrap(value, isParameter) {
    const raw = this.unwrapRaw(value, isParameter);
    if (raw) return raw;
    switch (typeof value) {
      case 'function':
        return this.outputQuery(this.compileCallback(value), true);
      case 'object':
        return this.parseObject(value);
      case 'number':
        return value;
      default:
        return this.wrapString(value + '');
    }
  }

  wrapAsIdentifier(value) {
    const queryContext = this.builder.queryContext();
    return this.client.wrapIdentifier((value || '').trim(), queryContext);
  }

  alias(first, second) {
    return first + ' as ' + second;
  }

  operator(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    const operator = operators[(value || '').toLowerCase()];
    if (!operator) {
      throw new TypeError(`The operator "${value}" is not permitted`);
    }
    return operator;
  }

  // Specify the direction of the ordering.
  direction(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    return orderBys.indexOf((value || '').toLowerCase()) !== -1 ? value : 'asc';
  }

  // Compiles a callback using the query builder.
  compileCallback(callback, method) {
    const { client } = this;

    // Build the callback
    const builder = client.queryBuilder();
    callback.call(builder, builder);

    // Compile the callback, using the current formatter (to track all bindings).
    const compiler = client.queryCompiler(builder);
    compiler.formatter = this;

    // Return the compiled & parameterized sql.
    return compiler.toSQL(method || builder._method || 'select');
  }

  // Ensures the query is aliased if necessary.
  outputQuery(compiled, isParameter) {
    let sql = compiled.sql || '';
    if (sql) {
      if (
        (compiled.method === 'select' || compiled.method === 'first') &&
        (isParameter || compiled.as)
      ) {
        sql = `(${sql})`;
        if (compiled.as) return this.alias(sql, this.wrap(compiled.as));
      }
    }
    return sql;
  }

  // Key-value notation for alias
  parseObject(obj) {
    const ret = [];
    for (const alias in obj) {
      const queryOrIdentifier = obj[alias];
      // Avoids double aliasing for subqueries
      if (typeof queryOrIdentifier === 'function') {
        const compiled = this.compileCallback(queryOrIdentifier);
        compiled.as = alias; // enforces the object's alias
        ret.push(this.outputQuery(compiled, true));
      } else if (queryOrIdentifier instanceof builder) {
        ret.push(
          this.alias(
            `(${this.wrap(queryOrIdentifier)})`,
            this.wrapAsIdentifier(alias)
          )
        );
      } else {
        ret.push(
          this.alias(this.wrap(queryOrIdentifier), this.wrapAsIdentifier(alias))
        );
      }
    }
    return ret.join(', ');
  }

  // Coerce to string to prevent strange errors when it's not a string.
  wrapString(value) {
    const asIndex = value.toLowerCase().indexOf(' as ');
    if (asIndex !== -1) {
      const first = value.slice(0, asIndex);
      const second = value.slice(asIndex + 4);
      return this.alias(this.wrap(first), this.wrapAsIdentifier(second));
    }
    const wrapped = [];
    let i = -1;
    const segments = value.split('.');
    while (++i < segments.length) {
      value = segments[i];
      if (i === 0 && segments.length > 1) {
        wrapped.push(this.wrap((value || '').trim()));
      } else {
        wrapped.push(this.wrapAsIdentifier(value));
      }
    }
    return wrapped.join('.');
  }
}

var formatter = Formatter;

//Get schema-aware table name
function getTableName(tableName, schemaName) {
  return schemaName ? `${schemaName}.${tableName}` : tableName;
}

//Get schema-aware query builder for a given table and schema name
function getTable(trxOrKnex, tableName, schemaName) {
  return schemaName
    ? trxOrKnex(tableName).withSchema(schemaName)
    : trxOrKnex(tableName);
}
function getLockTableName(tableName) {
  return tableName + '_lock';
}

function getLockTableNameWithSchema(tableName, schemaName) {
  return schemaName
    ? schemaName + '.' + getLockTableName(tableName)
    : getLockTableName(tableName);
}

var tableResolver = {
  getLockTableName,
  getLockTableNameWithSchema,
  getTable,
  getTableName,
};

const {
  getTable: getTable$1,
  getLockTableName: getLockTableName$1,
  getLockTableNameWithSchema: getLockTableNameWithSchema$1,
  getTableName: getTableName$1,
} = tableResolver;

function ensureTable(tableName, schemaName, trxOrKnex) {
  const lockTable = getLockTableName$1(tableName);
  const lockTableWithSchema = getLockTableNameWithSchema$1(
    tableName,
    schemaName
  );
  return getSchemaBuilder(trxOrKnex, schemaName)
    .hasTable(tableName)
    .then((exists) => {
      return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
    })
    .then(() => {
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
    })
    .then((exists) => {
      return (
        !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex)
      );
    })
    .then(() => {
      return getTable$1(trxOrKnex, lockTable, schemaName).select('*');
    })
    .then((data) => {
      return (
        !data.length &&
        trxOrKnex.into(lockTableWithSchema).insert({ is_locked: 0 })
      );
    });
}

function _createMigrationTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    getTableName$1(tableName),
    function(t) {
      t.increments();
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    }
  );
}

function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    tableName,
    function(t) {
      t.increments('index').primary();
      t.integer('is_locked');
    }
  );
}

//Get schema-aware schema builder for a given schema nam
function getSchemaBuilder(trxOrKnex, schemaName) {
  return schemaName
    ? trxOrKnex.schema.withSchema(schemaName)
    : trxOrKnex.schema;
}

var tableCreator = {
  ensureTable,
  getSchemaBuilder,
};

const { getTableName: getTableName$2 } = tableResolver;
const { ensureTable: ensureTable$1 } = tableCreator;

// Lists all available migration versions, as a sorted array.
function listAll(migrationSource, loadExtensions) {
  return migrationSource.getMigrations(loadExtensions);
}

// Lists all migrations that have been completed for the current db, as an
// array.
function listCompleted(tableName, schemaName, trxOrKnex) {
  return ensureTable$1(tableName, schemaName, trxOrKnex)
    .then(() =>
      trxOrKnex
        .from(getTableName$2(tableName, schemaName))
        .orderBy('id')
        .select('name')
    )
    .then((migrations) =>
      migrations.map((migration) => {
        return migration.name;
      })
    );
}

// Gets the migration list from the migration directory specified in config, as well as
// the list of completed migrations to check what should be run.
function listAllAndCompleted(config, trxOrKnex) {
  return Promise.all([
    listAll(config.migrationSource, config.loadExtensions),
    listCompleted(config.tableName, config.schemaName, trxOrKnex),
  ]);
}

var migrationListResolver = {
  listAll,
  listAllAndCompleted,
  listCompleted,
};

const { promisify } = util;

const optsArg = (opts) => {
  if (!opts) opts = { mode: 0o777, fs };
  else if (typeof opts === 'object') opts = { mode: 0o777, fs, ...opts };
  else if (typeof opts === 'number') opts = { mode: opts, fs };
  else if (typeof opts === 'string') opts = { mode: parseInt(opts, 8), fs };
  else throw new TypeError('invalid options argument');

  opts.mkdir = opts.mkdir || opts.fs.mkdir || fs.mkdir;
  opts.mkdirAsync = promisify(opts.mkdir);
  opts.stat = opts.stat || opts.fs.stat || fs.stat;
  opts.statAsync = promisify(opts.stat);
  opts.statSync = opts.statSync || opts.fs.statSync || fs.statSync;
  opts.mkdirSync = opts.mkdirSync || opts.fs.mkdirSync || fs.mkdirSync;
  return opts;
};
var optsArg_1 = optsArg;

const platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
const { resolve, parse: parse$1 } = path;
const pathArg = (path) => {
  if (/\0/.test(path)) {
    // simulate same failure that node raises
    throw Object.assign(
      new TypeError('path must be a string without null bytes'),
      {
        path,
        code: 'ERR_INVALID_ARG_VALUE',
      }
    );
  }

  path = resolve(path);
  if (platform === 'win32') {
    const badWinChars = /[*|"<>?:]/;
    const { root } = parse$1(path);
    if (badWinChars.test(path.substr(root.length))) {
      throw Object.assign(new Error('Illegal characters in path.'), {
        path,
        code: 'EINVAL',
      });
    }
  }

  return path;
};
var pathArg_1 = pathArg;

const { dirname } = path;

const findMade = (opts, parent, path = undefined) => {
  // we never want the 'made' return value to be a root directory
  if (path === parent) return Promise.resolve();

  return opts.statAsync(parent).then(
    (st) => (st.isDirectory() ? path : undefined), // will fail later
    (er) =>
      er.code === 'ENOENT' ? findMade(opts, dirname(parent), parent) : undefined
  );
};

const findMadeSync = (opts, parent, path = undefined) => {
  if (path === parent) return undefined;

  try {
    return opts.statSync(parent).isDirectory() ? path : undefined;
  } catch (er) {
    return er.code === 'ENOENT'
      ? findMadeSync(opts, dirname(parent), parent)
      : undefined;
  }
};

var findMade_1 = { findMade, findMadeSync };

const { dirname: dirname$1 } = path;

const mkdirpManual = (path, opts, made) => {
  opts.recursive = false;
  const parent = dirname$1(path);
  if (parent === path) {
    return opts.mkdirAsync(path, opts).catch((er) => {
      // swallowed by recursive implementation on posix systems
      // any other error is a failure
      if (er.code !== 'EISDIR') throw er;
    });
  }

  return opts.mkdirAsync(path, opts).then(
    () => made || path,
    (er) => {
      if (er.code === 'ENOENT')
        return mkdirpManual(parent, opts).then((made) =>
          mkdirpManual(path, opts, made)
        );
      if (er.code !== 'EEXIST' && er.code !== 'EROFS') throw er;
      return opts.statAsync(path).then(
        (st) => {
          if (st.isDirectory()) return made;
          else throw er;
        },
        () => {
          throw er;
        }
      );
    }
  );
};

const mkdirpManualSync = (path, opts, made) => {
  const parent = dirname$1(path);
  opts.recursive = false;

  if (parent === path) {
    try {
      return opts.mkdirSync(path, opts);
    } catch (er) {
      // swallowed by recursive implementation on posix systems
      // any other error is a failure
      if (er.code !== 'EISDIR') throw er;
      else return;
    }
  }

  try {
    opts.mkdirSync(path, opts);
    return made || path;
  } catch (er) {
    if (er.code === 'ENOENT')
      return mkdirpManualSync(path, opts, mkdirpManualSync(parent, opts, made));
    if (er.code !== 'EEXIST' && er.code !== 'EROFS') throw er;
    try {
      if (!opts.statSync(path).isDirectory()) throw er;
    } catch (_) {
      throw er;
    }
  }
};

var mkdirpManual_1 = { mkdirpManual, mkdirpManualSync };

const { dirname: dirname$2 } = path;
const { findMade: findMade$1, findMadeSync: findMadeSync$1 } = findMade_1;
const {
  mkdirpManual: mkdirpManual$1,
  mkdirpManualSync: mkdirpManualSync$1,
} = mkdirpManual_1;

const mkdirpNative = (path, opts) => {
  opts.recursive = true;
  const parent = dirname$2(path);
  if (parent === path) return opts.mkdirAsync(path, opts);

  return findMade$1(opts, path).then((made) =>
    opts
      .mkdirAsync(path, opts)
      .then(() => made)
      .catch((er) => {
        if (er.code === 'ENOENT') return mkdirpManual$1(path, opts);
        else throw er;
      })
  );
};

const mkdirpNativeSync = (path, opts) => {
  opts.recursive = true;
  const parent = dirname$2(path);
  if (parent === path) return opts.mkdirSync(path, opts);

  const made = findMadeSync$1(opts, path);
  try {
    opts.mkdirSync(path, opts);
    return made;
  } catch (er) {
    if (er.code === 'ENOENT') return mkdirpManualSync$1(path, opts);
    else throw er;
  }
};

var mkdirpNative_1 = { mkdirpNative, mkdirpNativeSync };

const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
const versArr = version.replace(/^v/, '').split('.');
const hasNative = +versArr[0] > 10 || (+versArr[0] === 10 && +versArr[1] >= 12);

const useNative = !hasNative ? () => false : (opts) => opts.mkdir === fs.mkdir;
const useNativeSync = !hasNative
  ? () => false
  : (opts) => opts.mkdirSync === fs.mkdirSync;

var useNative_1 = { useNative, useNativeSync };

const {
  mkdirpNative: mkdirpNative$1,
  mkdirpNativeSync: mkdirpNativeSync$1,
} = mkdirpNative_1;
const {
  mkdirpManual: mkdirpManual$2,
  mkdirpManualSync: mkdirpManualSync$2,
} = mkdirpManual_1;
const { useNative: useNative$1, useNativeSync: useNativeSync$1 } = useNative_1;

const mkdirp = (path, opts) => {
  path = pathArg_1(path);
  opts = optsArg_1(opts);
  return useNative$1(opts)
    ? mkdirpNative$1(path, opts)
    : mkdirpManual$2(path, opts);
};

const mkdirpSync = (path, opts) => {
  path = pathArg_1(path);
  opts = optsArg_1(opts);
  return useNativeSync$1(opts)
    ? mkdirpNativeSync$1(path, opts)
    : mkdirpManualSync$2(path, opts);
};

mkdirp.sync = mkdirpSync;
mkdirp.native = (path, opts) =>
  mkdirpNative$1(pathArg_1(path), optsArg_1(opts));
mkdirp.manual = (path, opts) =>
  mkdirpManual$2(pathArg_1(path), optsArg_1(opts));
mkdirp.nativeSync = (path, opts) =>
  mkdirpNativeSync$1(pathArg_1(path), optsArg_1(opts));
mkdirp.manualSync = (path, opts) =>
  mkdirpManualSync$2(pathArg_1(path), optsArg_1(opts));

var mkdirp_1 = mkdirp;

const { promisify: promisify$1 } = util;

// Promisify common fs functions.
const stat = promisify$1(fs.stat);
const readFile = promisify$1(fs.readFile);
const writeFile = promisify$1(fs.writeFile);
const readdir = promisify$1(fs.readdir);

/**
 * Creates a temporary directory and returns it path.
 *
 * @returns {Promise<string>}
 */
function createTemp() {
  return promisify$1(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);
}

/**
 * Ensures the given path exists.
 *  - If the path already exist, it's fine - it does nothing.
 *  - If the path doesn't exist, it will create it.
 *
 * @param {string} path
 * @returns {Promise}
 */
function ensureDirectoryExists(dir) {
  return stat(dir).catch(() => mkdirp_1(dir));
}

var fs_1 = {
  stat,
  readdir,
  readFile,
  writeFile,
  createTemp,
  ensureDirectoryExists,
};

const { template } = lodash;

const { readFile: readFile$1, writeFile: writeFile$1 } = fs_1;

/**
 * Light wrapper over lodash templates making it safer to be used with javascript source code.
 *
 * In particular, doesn't interfere with use of interpolated strings in javascript.
 *
 * @param {string} content Template source
 * @param {_.TemplateOptions} options Template options
 */
const jsSourceTemplate = (content, options) =>
  template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options,
  });

/**
 * Compile the contents of specified (javascript) file as a lodash template
 *
 * @param {string} filePath Path of file to be used as template
 * @param {_.TemplateOptions} options Lodash template options
 */
const jsFileTemplate = async (filePath, options) => {
  const contentBuffer = await readFile$1(filePath);
  return jsSourceTemplate(contentBuffer.toString(), options);
};

/**
 * Write a javascript file using another file as a (lodash) template
 *
 * @param {string} targetFilePath
 * @param {string} sourceFilePath
 * @param {_.TemplateOptions} options options passed to lodash templates
 */
const writeJsFileUsingTemplate = async (
  targetFilePath,
  sourceFilePath,
  options,
  variables
) =>
  writeFile$1(
    targetFilePath,
    (await jsFileTemplate(sourceFilePath, options))(variables)
  );

var template_1 = {
  jsSourceTemplate,
  jsFileTemplate,
  writeJsFileUsingTemplate,
};

const { sortBy, filter } = lodash;

const { readdir: readdir$1 } = fs_1;

const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
  '.co',
  '.coffee',
  '.eg',
  '.iced',
  '.js',
  '.litcoffee',
  '.ls',
  '.ts',
]);

class FsMigrations {
  constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  getMigrations(loadExtensions) {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      return readdir$1(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }

        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );

        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          this,
          migrations,
          loadExtensions || this.loadExtensions
        );
      }

      return filterMigrations(
        this,
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration) {
    return migration.file;
  }

  getMigration(migration) {
    const absoluteDir = path.resolve(process.cwd(), migration.directory);
    return commonjsRequire(path.join(absoluteDir, migration.file));
  }
}

function filterMigrations(migrationSource, migrations, loadExtensions) {
  return filter(migrations, (migration) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}

var fsMigrations = {
  DEFAULT_LOAD_EXTENSIONS,
  FsMigrations,
};

const {
  FsMigrations: FsMigrations$1,
  DEFAULT_LOAD_EXTENSIONS: DEFAULT_LOAD_EXTENSIONS$1,
} = fsMigrations;

const CONFIG_DEFAULT = Object.freeze({
  extension: 'js',
  loadExtensions: DEFAULT_LOAD_EXTENSIONS$1,
  tableName: 'knex_migrations',
  schemaName: null,
  directory: './migrations',
  disableTransactions: false,
  disableMigrationsListValidation: false,
  sortDirsSeparately: false,
});

function getMergedConfig(config, currentConfig) {
  // config is the user specified config, mergedConfig has defaults and current config
  // applied to it.
  const mergedConfig = Object.assign(
    {},
    CONFIG_DEFAULT,
    currentConfig || {},
    config
  );

  if (
    config &&
    // If user specifies any FS related config,
    // clear existing FsMigrations migrationSource
    (config.directory ||
      config.sortDirsSeparately !== undefined ||
      config.loadExtensions)
  ) {
    mergedConfig.migrationSource = null;
  }

  // If the user has not specified any configs, we need to
  // default to fs migrations to maintain compatibility
  if (!mergedConfig.migrationSource) {
    mergedConfig.migrationSource = new FsMigrations$1(
      mergedConfig.directory,
      mergedConfig.sortDirsSeparately,
      mergedConfig.loadExtensions
    );
  }

  return mergedConfig;
}

var configurationMerger = {
  getMergedConfig,
};

const { writeJsFileUsingTemplate: writeJsFileUsingTemplate$1 } = template_1;
const { getMergedConfig: getMergedConfig$1 } = configurationMerger;
const { ensureDirectoryExists: ensureDirectoryExists$1 } = fs_1;

class MigrationGenerator {
  constructor(migrationConfig) {
    this.config = getMergedConfig$1(migrationConfig);
  }

  // Creates a new migration, with a given name.
  async make(name, config) {
    this.config = getMergedConfig$1(config, this.config);
    if (!name) {
      return Promise.reject(
        new Error('A name must be specified for the generated migration')
      );
    }
    await this._ensureFolder();
    const createdMigrationFilePath = await this._writeNewMigration(name);
    return createdMigrationFilePath;
  }

  // Ensures a folder for the migrations exist, dependent on the migration
  // config settings.
  _ensureFolder() {
    const dirs = this._absoluteConfigDirs();

    const promises = dirs.map(ensureDirectoryExists$1);

    return Promise.all(promises);
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewMigrationName(name) {
    if (name[0] === '-') name = name.slice(1);
    return yyyymmddhhmmss() + '_' + name + '.' + this.config.extension;
  }

  _getNewMigrationPath(name) {
    const fileName = this._getNewMigrationName(name);
    const dirs = this._absoluteConfigDirs();
    const dir = dirs.slice(-1)[0]; // Get last specified directory
    return path.join(dir, fileName);
  }

  // Write a new migration to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewMigration(name) {
    const migrationPath = this._getNewMigrationPath(name);
    await writeJsFileUsingTemplate$1(
      migrationPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return migrationPath;
  }

  _absoluteConfigDirs() {
    const directories = Array.isArray(this.config.directory)
      ? this.config.directory
      : [this.config.directory];
    return directories.map((directory) => {
      if (!directory) {
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to resolve config file, knex cannot determine where to generate migrations'
        );
      }
      return path.resolve(process.cwd(), directory);
    });
  }
}

// Ensure that we have 2 places for each of the date segments.
function padDate(segment) {
  segment = segment.toString();
  return segment[1] ? segment : `0${segment}`;
}

// Get a date object in the correct format, without requiring a full out library
// like "moment.js".
function yyyymmddhhmmss() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())
  );
}

var MigrationGenerator_1 = MigrationGenerator;

// Migrator
// -------
const {
  differenceWith,
  each: each$1,
  filter: filter$1,
  get,
  isFunction: isFunction$2,
  isBoolean: isBoolean$1,
  isEmpty: isEmpty$2,
  isUndefined: isUndefined$3,
  max,
} = lodash;

const {
  getLockTableName: getLockTableName$2,
  getLockTableNameWithSchema: getLockTableNameWithSchema$2,
  getTable: getTable$2,
  getTableName: getTableName$3,
} = tableResolver;
const { getSchemaBuilder: getSchemaBuilder$1 } = tableCreator;

const { getMergedConfig: getMergedConfig$2 } = configurationMerger;

function LockError(msg) {
  this.name = 'MigrationLocked';
  this.message = msg;
}

inherits(LockError, Error);

// The new migration we're performing, typically called from the `knex.migrate`
// interface on the main `knex` object. Passes the `knex` instance performing
// the migration.
class Migrator {
  constructor(knex) {
    // Clone knex instance and remove post-processing that is unnecessary for internal queries from a cloned config
    if (isFunction$2(knex)) {
      if (!knex.isTransaction) {
        this.knex = knex.withUserParams({
          ...knex.userParams,
        });
      } else {
        this.knex = knex;
      }
    } else {
      this.knex = Object.assign({}, knex);
      this.knex.userParams = this.knex.userParams || {};
    }

    this.config = getMergedConfig$2(this.knex.client.config.migrations);
    this.generator = new MigrationGenerator_1(
      this.knex.client.config.migrations
    );
    this._activeMigration = {
      fileName: null,
    };
  }

  // Migrators to the latest configuration.
  latest(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const migrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );

        const transactionForAll =
          !this.config.disableTransactions &&
          isEmpty$2(
            filter$1(migrations, (migration) => {
              const migrationContents = this.config.migrationSource.getMigration(
                migration
              );
              return !this._useTransaction(migrationContents);
            })
          );

        if (transactionForAll) {
          return this.knex.transaction((trx) => {
            return this._runBatch(migrations, 'up', trx);
          });
        } else {
          return this._runBatch(migrations, 'up');
        }
      });
  }

  // Runs the next migration that has not yet been run
  up(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const newMigrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );

        let migrationToRun;
        const name = this.config.name;
        if (name) {
          if (!completed.includes(name)) {
            migrationToRun = newMigrations.find((migration) => {
              return (
                this.config.migrationSource.getMigrationName(migration) === name
              );
            });
            if (!migrationToRun) {
              throw new Error(`Migration "${name}" not found.`);
            }
          }
        } else {
          migrationToRun = newMigrations[0];
        }

        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }

        const transactionForAll =
          !this.config.disableTransactions &&
          isEmpty$2(
            filter$1(migrationsToRun, (migration) => {
              const migrationContents = this.config.migrationSource.getMigration(
                migration
              );

              return !this._useTransaction(migrationContents);
            })
          );

        if (transactionForAll) {
          return this.knex.transaction((trx) => {
            return this._runBatch(migrationsToRun, 'up', trx);
          });
        } else {
          return this._runBatch(migrationsToRun, 'up');
        }
      });
  }

  // Rollback the last "batch", or all, of migrations that were run.
  rollback(config, all = false) {
    this._disableProcessing();
    return new Promise((resolve, reject) => {
      try {
        this.config = getMergedConfig$2(config, this.config);
      } catch (e) {
        reject(e);
      }
      migrationListResolver
        .listAllAndCompleted(this.config, this.knex)
        .then((value) => {
          if (!this.config.disableMigrationsListValidation) {
            validateMigrationList(this.config.migrationSource, value);
          }
          return value;
        })
        .then((val) => {
          const [allMigrations, completedMigrations] = val;

          return all
            ? allMigrations
                .filter((migration) => {
                  return completedMigrations.includes(migration.file);
                })
                .reverse()
            : this._getLastBatch(val);
        })
        .then((migrations) => {
          return this._runBatch(migrations, 'down');
        })
        .then(resolve, reject);
    });
  }

  down(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const completedMigrations = all.filter((migration) => {
          return completed.includes(
            this.config.migrationSource.getMigrationName(migration)
          );
        });

        let migrationToRun;
        const name = this.config.name;
        if (name) {
          migrationToRun = completedMigrations.find((migration) => {
            return (
              this.config.migrationSource.getMigrationName(migration) === name
            );
          });
          if (!migrationToRun) {
            throw new Error(`Migration "${name}" was not run.`);
          }
        } else {
          migrationToRun = completedMigrations[completedMigrations.length - 1];
        }

        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }

        return this._runBatch(migrationsToRun, 'down');
      });
  }

  status(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return Promise.all([
      getTable$2(
        this.knex,
        this.config.tableName,
        this.config.schemaName
      ).select('*'),
      migrationListResolver.listAll(this.config.migrationSource),
    ]).then(([db, code]) => db.length - code.length);
  }

  // Retrieves and returns the current migration version we're on, as a promise.
  // If no migrations have been run yet, return "none".
  currentVersion(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listCompleted(this.config.tableName, this.config.schemaName, this.knex)
      .then((completed) => {
        const val = max(completed.map((value) => value.split('_')[0]));
        return isUndefined$3(val) ? 'none' : val;
      });
  }

  // list all migrations
  async list(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    const [all, completed] = await migrationListResolver.listAllAndCompleted(
      this.config,
      this.knex
    );

    if (!this.config.disableMigrationsListValidation) {
      validateMigrationList(this.config.migrationSource, [all, completed]);
    }

    const newMigrations = getNewMigrations(
      this.config.migrationSource,
      all,
      completed
    );
    return [completed, newMigrations];
  }

  forceFreeMigrationsLock(config) {
    this.config = getMergedConfig$2(config, this.config);

    const lockTable = getLockTableName$2(this.config.tableName);
    return getSchemaBuilder$1(this.knex, this.config.schemaName)
      .hasTable(lockTable)
      .then((exist) => exist && this._freeLock());
  }

  // Creates a new migration, with a given name.
  make(name, config) {
    this.config = getMergedConfig$2(config, this.config);
    return this.generator.make(name, this.config);
  }

  _disableProcessing() {
    if (this.knex.disableProcessing) {
      this.knex.disableProcessing();
    }
  }

  _lockMigrations(trx) {
    const tableName = getLockTableName$2(this.config.tableName);
    return getTable$2(this.knex, tableName, this.config.schemaName)
      .transacting(trx)
      .where('is_locked', '=', 0)
      .update({ is_locked: 1 })
      .then((rowCount) => {
        if (rowCount != 1) {
          throw new Error('Migration table is already locked');
        }
      });
  }

  _getLock(trx) {
    const transact = trx ? (fn) => fn(trx) : (fn) => this.knex.transaction(fn);
    return transact((trx) => {
      return this._lockMigrations(trx);
    }).catch((err) => {
      throw new LockError(err.message);
    });
  }

  _freeLock(trx = this.knex) {
    const tableName = getLockTableName$2(this.config.tableName);
    return getTable$2(trx, tableName, this.config.schemaName).update({
      is_locked: 0,
    });
  }

  // Run a batch of current migrations, in sequence.
  _runBatch(migrations, direction, trx) {
    return (
      this._getLock(trx)
        // When there is a wrapping transaction, some migrations
        // could have been done while waiting for the lock:
        .then(() =>
          trx
            ? migrationListResolver.listCompleted(
                this.config.tableName,
                this.config.schemaName,
                trx
              )
            : []
        )
        .then(
          (completed) =>
            (migrations = getNewMigrations(
              this.config.migrationSource,
              migrations,
              completed
            ))
        )
        .then(() =>
          Promise.all(
            migrations.map(this._validateMigrationStructure.bind(this))
          )
        )
        .then(() => this._latestBatchNumber(trx))
        .then((batchNo) => {
          if (direction === 'up') batchNo++;
          return batchNo;
        })
        .then((batchNo) => {
          return this._waterfallBatch(batchNo, migrations, direction, trx);
        })
        .then(async (res) => {
          await this._freeLock(trx);
          return res;
        })
        .catch(async (error) => {
          let cleanupReady = Promise.resolve();

          if (error instanceof LockError) {
            // If locking error do not free the lock.
            this.knex.client.logger.warn(
              `Can't take lock to run migrations: ${error.message}`
            );
            this.knex.client.logger.warn(
              'If you are sure migrations are not running you can release the ' +
                'lock manually by deleting all the rows = require(migrations lock ' +
                'table: ' +
                getLockTableNameWithSchema$2(
                  this.config.tableName,
                  this.config.schemaName
                )
            );
          } else {
            if (this._activeMigration.fileName) {
              this.knex.client.logger.warn(
                `migration file "${this._activeMigration.fileName}" failed`
              );
            }
            this.knex.client.logger.warn(
              `migration failed with error: ${error.message}`
            );
            // If the error was not due to a locking issue, then remove the lock.
            cleanupReady = this._freeLock(trx);
          }

          try {
            await cleanupReady;
            // eslint-disable-next-line no-empty
          } catch (e) {}
          throw error;
        })
    );
  }

  // Validates some migrations by requiring and checking for an `up` and `down`
  // function.
  _validateMigrationStructure(migration) {
    const migrationName = this.config.migrationSource.getMigrationName(
      migration
    );
    const migrationContent = this.config.migrationSource.getMigration(
      migration
    );
    if (
      typeof migrationContent.up !== 'function' ||
      typeof migrationContent.down !== 'function'
    ) {
      throw new Error(
        `Invalid migration: ${migrationName} must have both an up and down function`
      );
    }

    return migration;
  }

  // Get the last batch of migrations, by name, ordered by insert id in reverse
  // order.
  _getLastBatch([allMigrations]) {
    const { tableName, schemaName } = this.config;
    return getTable$2(this.knex, tableName, schemaName)
      .where('batch', function(qb) {
        qb.max('batch').from(getTableName$3(tableName, schemaName));
      })
      .orderBy('id', 'desc')
      .then((migrations) =>
        Promise.all(
          migrations.map((migration) => {
            return allMigrations.find((entry) => {
              return (
                this.config.migrationSource.getMigrationName(entry) ===
                migration.name
              );
            });
          })
        )
      );
  }

  // Returns the latest batch number.
  _latestBatchNumber(trx = this.knex) {
    return trx
      .from(getTableName$3(this.config.tableName, this.config.schemaName))
      .max('batch as max_batch')
      .then((obj) => obj[0].max_batch || 0);
  }

  // If transaction config for a single migration is defined, use that.
  // Otherwise, rely on the common config. This allows enabling/disabling
  // transaction for a single migration at will, regardless of the common
  // config.
  _useTransaction(migrationContent, allTransactionsDisabled) {
    const singleTransactionValue = get(migrationContent, 'config.transaction');

    return isBoolean$1(singleTransactionValue)
      ? singleTransactionValue
      : !allTransactionsDisabled;
  }

  // Runs a batch of `migrations` in a specified `direction`, saving the
  // appropriate database information as the migrations are run.
  _waterfallBatch(batchNo, migrations, direction, trx) {
    const trxOrKnex = trx || this.knex;
    const { tableName, schemaName, disableTransactions } = this.config;
    let current = Promise.resolve();
    const log = [];
    each$1(migrations, (migration) => {
      const name = this.config.migrationSource.getMigrationName(migration);
      this._activeMigration.fileName = name;
      const migrationContent = this.config.migrationSource.getMigration(
        migration
      );

      // We're going to run each of the migrations in the current "up".
      current = current
        .then(() => {
          this._activeMigration.fileName = name;
          if (
            !trx &&
            this._useTransaction(migrationContent, disableTransactions)
          ) {
            this.knex.enableProcessing();
            return this._transaction(
              this.knex,
              migrationContent,
              direction,
              name
            );
          }

          trxOrKnex.enableProcessing();
          return checkPromise(
            this.knex.client.logger,
            migrationContent[direction](trxOrKnex),
            name
          );
        })
        .then(() => {
          trxOrKnex.disableProcessing();
          this.knex.disableProcessing();
          log.push(name);
          if (direction === 'up') {
            return trxOrKnex
              .into(getTableName$3(tableName, schemaName))
              .insert({
                name,
                batch: batchNo,
                migration_time: new Date(),
              });
          }
          if (direction === 'down') {
            return trxOrKnex
              .from(getTableName$3(tableName, schemaName))
              .where({ name })
              .del();
          }
        });
    });

    return current.then(() => [batchNo, log]);
  }

  _transaction(knex, migrationContent, direction, name) {
    return knex.transaction((trx) => {
      return checkPromise(
        knex.client.logger,
        migrationContent[direction](trx),
        name,
        () => {
          trx.commit();
        }
      );
    });
  }
}

// Validates that migrations are present in the appropriate directories.
function validateMigrationList(migrationSource, migrations) {
  const all = migrations[0];
  const completed = migrations[1];
  const diff = getMissingMigrations(migrationSource, completed, all);
  if (!isEmpty$2(diff)) {
    throw new Error(
      `The migration directory is corrupt, the following files are missing: ${diff.join(
        ', '
      )}`
    );
  }
}

function getMissingMigrations(migrationSource, completed, all) {
  return differenceWith(completed, all, (completedMigration, allMigration) => {
    return (
      completedMigration === migrationSource.getMigrationName(allMigration)
    );
  });
}

function getNewMigrations(migrationSource, all, completed) {
  return differenceWith(all, completed, (allMigration, completedMigration) => {
    return (
      completedMigration === migrationSource.getMigrationName(allMigration)
    );
  });
}

function checkPromise(logger, migrationPromise, name, commitFn) {
  if (!migrationPromise || typeof migrationPromise.then !== 'function') {
    logger.warn(`migration ${name} did not return a promise`);
    if (commitFn) {
      commitFn();
    }
  }
  return migrationPromise;
}

var Migrator_1 = {
  Migrator,
};

// Seeder
// -------

const { filter: filter$2, includes: includes$1, extend } = lodash;
const {
  readdir: readdir$2,
  ensureDirectoryExists: ensureDirectoryExists$2,
} = fs_1;
const { writeJsFileUsingTemplate: writeJsFileUsingTemplate$2 } = template_1;

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
class Seeder {
  constructor(knex) {
    this.knex = knex;
    this.config = this.setConfig(knex.client.config.seeds);
  }

  // Runs seed files for the given environment.
  async run(config) {
    this.config = this.setConfig(config);
    const all = await this._listAll();
    const files =
      config && config.specific
        ? all.filter((file) => file === config.specific)
        : all;
    return this._runSeeds(files);
  }

  // Creates a new seed file, with a given name.
  async make(name, config) {
    this.config = this.setConfig(config);
    if (!name)
      throw new Error('A name must be specified for the generated seed');
    await this._ensureFolder(config);
    const seedPath = await this._writeNewSeed(name);
    return seedPath;
  }

  // Lists all available seed files as a sorted array.
  async _listAll(config) {
    this.config = this.setConfig(config);
    const loadExtensions = this.config.loadExtensions;
    return readdir$2(this._absoluteConfigDir()).then((seeds) =>
      filter$2(seeds, (value) => {
        const extension = path.extname(value);
        return includes$1(loadExtensions, extension);
      }).sort()
    );
  }

  // Ensures a folder for the seeds exist, dependent on the
  // seed config settings.
  async _ensureFolder() {
    const dir = this._absoluteConfigDir();

    await ensureDirectoryExists$2(dir);
  }

  // Run seed files, in sequence.
  _runSeeds(seeds) {
    seeds.forEach((seed) => this._validateSeedStructure(seed));
    return this._waterfallBatch(seeds);
  }

  // Validates seed files by requiring and checking for a `seed` function.
  _validateSeedStructure(name) {
    const seed = commonjsRequire(path.join(this._absoluteConfigDir(), name));
    if (typeof seed.seed !== 'function') {
      throw new Error(`Invalid seed file: ${name} must have a seed function`);
    }
    return name;
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewStubFileName(name) {
    if (name[0] === '-') name = name.slice(1);
    return name + '.' + this.config.extension;
  }

  _getNewStubFilePath(name) {
    return path.join(this._absoluteConfigDir(), this._getNewStubFileName(name));
  }

  // Write a new seed to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewSeed(name) {
    const seedPath = this._getNewStubFilePath(name);
    await writeJsFileUsingTemplate$2(
      seedPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return seedPath;
  }

  // Runs a batch of seed files.
  async _waterfallBatch(seeds) {
    const { knex } = this;
    const seedDirectory = this._absoluteConfigDir();
    const log = [];
    for (const seedName of seeds) {
      const seedPath = path.join(seedDirectory, seedName);
      const seed = commonjsRequire();
      try {
        await seed.seed(knex);
        log.push(seedPath);
      } catch (originalError) {
        const error = new Error(
          `Error while executing "${seedPath}" seed: ${originalError.message}`
        );
        error.original = originalError;
        error.stack =
          error.stack
            .split('\n')
            .slice(0, 2)
            .join('\n') +
          '\n' +
          originalError.stack;
        throw error;
      }
    }
    return [log];
  }

  _absoluteConfigDir() {
    return path.resolve(process.cwd(), this.config.directory);
  }

  setConfig(config) {
    return extend(
      {
        extension: 'js',
        directory: './seeds',
        loadExtensions: [
          '.co',
          '.coffee',
          '.eg',
          '.iced',
          '.js',
          '.litcoffee',
          '.ls',
          '.ts',
        ],
      },
      this.config || {},
      config
    );
  }
}

var Seeder_1 = Seeder;

// FunctionHelper
// -------
function FunctionHelper(client) {
  this.client = client;
}

FunctionHelper.prototype.now = function(precision) {
  if (typeof precision === 'number') {
    return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
  }
  return this.client.raw('CURRENT_TIMESTAMP');
};

var functionhelper = FunctionHelper;

// All properties we can use to start a query chain
// from the `knex` object, e.g. `knex.select('*').from(...`
var methods = [
  'with',
  'withRecursive',
  'select',
  'as',
  'columns',
  'column',
  'from',
  'fromJS',
  'into',
  'withSchema',
  'table',
  'distinct',
  'join',
  'joinRaw',
  'innerJoin',
  'leftJoin',
  'leftOuterJoin',
  'rightJoin',
  'rightOuterJoin',
  'outerJoin',
  'fullOuterJoin',
  'crossJoin',
  'where',
  'andWhere',
  'orWhere',
  'whereNot',
  'orWhereNot',
  'whereRaw',
  'whereWrapped',
  'havingWrapped',
  'orWhereRaw',
  'whereExists',
  'orWhereExists',
  'whereNotExists',
  'orWhereNotExists',
  'whereIn',
  'orWhereIn',
  'whereNotIn',
  'orWhereNotIn',
  'whereNull',
  'orWhereNull',
  'whereNotNull',
  'orWhereNotNull',
  'whereBetween',
  'whereNotBetween',
  'andWhereBetween',
  'andWhereNotBetween',
  'orWhereBetween',
  'orWhereNotBetween',
  'groupBy',
  'groupByRaw',
  'orderBy',
  'orderByRaw',
  'union',
  'unionAll',
  'intersect',
  'having',
  'havingRaw',
  'orHaving',
  'orHavingRaw',
  'offset',
  'limit',
  'count',
  'countDistinct',
  'min',
  'max',
  'sum',
  'sumDistinct',
  'avg',
  'avgDistinct',
  'increment',
  'decrement',
  'first',
  'debug',
  'pluck',
  'clearSelect',
  'clearWhere',
  'clearGroup',
  'clearOrder',
  'clearHaving',
  'insert',
  'update',
  'returning',
  'del',
  'delete',
  'truncate',
  'transacting',
  'connection',
];

const { promisify: promisify$2 } = util;

var delay = promisify$2(setTimeout);

const { isNumber: isNumber$2, chunk, flatten } = lodash;

var batchInsert = function batchInsert(
  client,
  tableName,
  batch,
  chunkSize = 1000
) {
  let returning = void 0;
  let transaction = null;

  const runInTransaction = (cb) => {
    if (transaction) {
      return cb(transaction);
    }
    return client.transaction(cb);
  };

  return Object.assign(
    Promise.resolve().then(async () => {
      if (!isNumber$2(chunkSize) || chunkSize < 1) {
        throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
      }

      if (!Array.isArray(batch)) {
        throw new TypeError(
          `Invalid batch: Expected array, got ${typeof batch}`
        );
      }

      const chunks = chunk(batch, chunkSize);

      //Next tick to ensure wrapper functions are called if needed
      await delay(1);
      return runInTransaction(async (tr) => {
        const chunksResults = [];
        for (const items of chunks) {
          chunksResults.push(await tr(tableName).insert(items, returning));
        }
        return flatten(chunksResults);
      });
    }),
    {
      returning(columns) {
        returning = columns;

        return this;
      },
      transacting(tr) {
        transaction = tr;

        return this;
      },
    }
  );
};

const { EventEmitter: EventEmitter$2 } = events;

const { Migrator: Migrator$1 } = Migrator_1;

const { merge, isUndefined: isUndefined$4 } = lodash;

// Javascript does not officially support "callable objects".  Instead,
// you must create a regular Function and inject properties/methods
// into it.  In other words: you can't leverage Prototype Inheritance
// to share the property/method definitions.
//
// To work around this, we're creating an Object Property Definition.
// This allow us to quickly inject everything into the `knex` function
// via the `Object.defineProperties(..)` function.  More importantly,
// it allows the same definitions to be shared across `knex` instances.
const KNEX_PROPERTY_DEFINITIONS = {
  client: {
    get() {
      return this.context.client;
    },
    set(client) {
      this.context.client = client;
    },
    configurable: true,
  },

  userParams: {
    get() {
      return this.context.userParams;
    },
    set(userParams) {
      this.context.userParams = userParams;
    },
    configurable: true,
  },

  schema: {
    get() {
      return this.client.schemaBuilder();
    },
    configurable: true,
  },

  migrate: {
    get() {
      return new Migrator$1(this);
    },
    configurable: true,
  },

  seed: {
    get() {
      return new Seeder_1(this);
    },
    configurable: true,
  },

  fn: {
    get() {
      return new functionhelper(this.client);
    },
    configurable: true,
  },
};

// `knex` instances serve as proxies around `context` objects.  So, calling
// any of these methods on the `knex` instance will forward the call to
// the `knex.context` object. This ensures that `this` will correctly refer
// to `context` within each of these methods.
const CONTEXT_METHODS = [
  'raw',
  'batchInsert',
  'transaction',
  'transactionProvider',
  'initialize',
  'destroy',
  'ref',
  'withUserParams',
  'queryBuilder',
  'disableProcessing',
  'enableProcessing',
];

for (const m of CONTEXT_METHODS) {
  KNEX_PROPERTY_DEFINITIONS[m] = {
    value: function(...args) {
      return this.context[m](...args);
    },
    configurable: true,
  };
}

function makeKnex(client) {
  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    return createQueryBuilder(knex.context, tableName, options);
  }

  redefineProperties(knex, client);
  return knex;
}

function initContext(knexFn) {
  const knexContext = knexFn.context || {};
  Object.assign(knexContext, {
    queryBuilder() {
      return this.client.queryBuilder();
    },

    raw() {
      return this.client.raw.apply(this.client, arguments);
    },

    batchInsert(table, batch, chunkSize = 1000) {
      return batchInsert(this, table, batch, chunkSize);
    },

    // Creates a new transaction.
    // If container is provided, returns a promise for when the transaction is resolved.
    // If container is not provided, returns a promise with a transaction that is resolved
    // when transaction is ready to be used.
    transaction(container, _config) {
      const config = Object.assign({}, _config);
      config.userParams = this.userParams || {};
      if (isUndefined$4(config.doNotRejectOnRollback)) {
        // Backwards-compatibility: default value changes depending upon
        // whether or not a `container` was provided.
        config.doNotRejectOnRollback = !container;
      }

      return this._transaction(container, config);
    },

    // Internal method that actually establishes the Transaction.  It makes no assumptions
    // about the `config` or `outerTx`, and expects the caller to handle these details.
    _transaction(container, config, outerTx = null) {
      if (container) {
        const trx = this.client.transaction(container, config, outerTx);
        return trx;
      } else {
        return new Promise((resolve, reject) => {
          const trx = this.client.transaction(resolve, config, outerTx);
          trx.catch(reject);
        });
      }
    },

    transactionProvider(config) {
      let trx;
      return () => {
        if (!trx) {
          trx = this.transaction(undefined, config);
        }
        return trx;
      };
    },

    // Typically never needed, initializes the pool for a knex client.
    initialize(config) {
      return this.client.initializePool(config);
    },

    // Convenience method for tearing down the pool.
    destroy(callback) {
      return this.client.destroy(callback);
    },

    ref(ref) {
      return this.client.ref(ref);
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to disable processing of internal queries in migrations
    disableProcessing() {
      if (this.userParams.isProcessingDisabled) {
        return;
      }
      this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
      this.userParams.postProcessResponse = this.client.config.postProcessResponse;
      this.client.config.wrapIdentifier = null;
      this.client.config.postProcessResponse = null;
      this.userParams.isProcessingDisabled = true;
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
    enableProcessing() {
      if (!this.userParams.isProcessingDisabled) {
        return;
      }
      this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
      this.client.config.postProcessResponse = this.userParams.postProcessResponse;
      this.userParams.isProcessingDisabled = false;
    },

    withUserParams(params) {
      const knexClone = shallowCloneFunction(knexFn); // We need to include getters in our clone
      if (this.client) {
        knexClone.client = Object.create(this.client.constructor.prototype); // Clone client to avoid leaking listeners that are set on it
        merge(knexClone.client, this.client);
        knexClone.client.config = Object.assign({}, this.client.config); // Clone client config to make sure they can be modified independently
      }

      redefineProperties(knexClone, knexClone.client);
      _copyEventListeners('query', knexFn, knexClone);
      _copyEventListeners('query-error', knexFn, knexClone);
      _copyEventListeners('query-response', knexFn, knexClone);
      _copyEventListeners('start', knexFn, knexClone);
      knexClone.userParams = params;
      return knexClone;
    },
  });

  if (!knexFn.context) {
    knexFn.context = knexContext;
  }
}

function _copyEventListeners(eventName, sourceKnex, targetKnex) {
  const listeners = sourceKnex.listeners(eventName);
  listeners.forEach((listener) => {
    targetKnex.on(eventName, listener);
  });
}

function redefineProperties(knex, client) {
  // Allow chaining methods from the root object, before
  // any other information is specified.
  //
  // TODO: `QueryBuilder.extend(..)` allows new QueryBuilder
  //       methods to be introduced via external components.
  //       As a side-effect, it also pushes the new method names
  //       into the `QueryInterface` array.
  //
  //       The Problem: due to the way the code is currently
  //       structured, these new methods cannot be retroactively
  //       injected into existing `knex` instances!  As a result,
  //       some `knex` instances will support the methods, and
  //       others will not.
  //
  //       We should revisit this once we figure out the desired
  //       behavior / usage.  For instance: do we really want to
  //       allow external components to directly manipulate `knex`
  //       data structures?  Or, should we come up w/ a different
  //       approach that avoids side-effects / mutation?
  //
  //      (FYI: I noticed this issue because I attempted to integrate
  //       this logic directly into the `KNEX_PROPERTY_DEFINITIONS`
  //       construction.  However, `KNEX_PROPERTY_DEFINITIONS` is
  //       constructed before any `knex` instances are created.
  //       As a result, the method extensions were missing from all
  //       `knex` instances.)
  methods.forEach(function(method) {
    knex[method] = function() {
      const builder = this.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  });

  Object.defineProperties(knex, KNEX_PROPERTY_DEFINITIONS);

  initContext(knex);
  knex.client = client;

  // TODO: It looks like this field is never actually used.
  //       It should probably be removed in a future PR.
  knex.client.makeKnex = makeKnex;

  knex.userParams = {};

  // Hook up the "knex" object as an EventEmitter.
  const ee = new EventEmitter$2();
  for (const key in ee) {
    knex[key] = ee[key];
  }

  // Unfortunately, something seems to be broken in Node 6 and removing events from a clone also mutates original Knex,
  // which is highly undesirable
  if (knex._internalListeners) {
    knex._internalListeners.forEach(({ eventName, listener }) => {
      knex.client.removeListener(eventName, listener); // Remove duplicates for copies
    });
  }
  knex._internalListeners = [];

  // Passthrough all "start" and "query" events to the knex object.
  _addInternalListener(knex, 'start', (obj) => {
    knex.emit('start', obj);
  });
  _addInternalListener(knex, 'query', (obj) => {
    knex.emit('query', obj);
  });
  _addInternalListener(knex, 'query-error', (err, obj) => {
    knex.emit('query-error', err, obj);
  });
  _addInternalListener(knex, 'query-response', (response, obj, builder) => {
    knex.emit('query-response', response, obj, builder);
  });
}

function _addInternalListener(knex, eventName, listener) {
  knex.client.on(eventName, listener);
  knex._internalListeners.push({
    eventName,
    listener,
  });
}

function createQueryBuilder(knexContext, tableName, options) {
  const qb = knexContext.queryBuilder();
  if (!tableName)
    knexContext.client.logger.warn(
      'calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.'
    );
  return tableName ? qb.table(tableName, options) : qb;
}

function shallowCloneFunction(originalFunction) {
  const fnContext = Object.create(
    Object.getPrototypeOf(originalFunction),
    Object.getOwnPropertyDescriptors(originalFunction)
  );

  const knexContext = {};
  const knexFnWrapper = (tableName, options) => {
    return createQueryBuilder(knexContext, tableName, options);
  };

  const clonedFunction = knexFnWrapper.bind(fnContext);
  Object.assign(clonedFunction, originalFunction);
  clonedFunction.context = knexContext;
  return clonedFunction;
}

var makeKnex_1 = makeKnex;

// Transaction
// -------
const { EventEmitter: EventEmitter$3 } = events;

const { callbackify: callbackify$1 } = util;
const { timeout: timeout$2, KnexTimeoutError: KnexTimeoutError$2 } = timeout_1;

const debug = src('knex:tx');

const { uniqueId, isUndefined: isUndefined$5 } = lodash;

// FYI: This is defined as a function instead of a constant so that
//      each Transactor can have its own copy of the default config.
//      This will minimize the impact of bugs that might be introduced
//      if a Transactor ever mutates its config.
function DEFAULT_CONFIG() {
  return {
    userParams: {},
    doNotRejectOnRollback: true,
  };
}

// Acts as a facade for a Promise, keeping the internal state
// and managing any child transactions.
class Transaction extends EventEmitter$3 {
  constructor(client, container, config = DEFAULT_CONFIG(), outerTx = null) {
    super();
    this.userParams = config.userParams;
    this.doNotRejectOnRollback = config.doNotRejectOnRollback;

    const txid = (this.txid = uniqueId('trx'));

    this.client = client;
    this.logger = client.logger;
    this.outerTx = outerTx;
    this.trxClient = undefined;
    this._completed = false;
    this._debug = client.config && client.config.debug;

    debug(
      '%s: Starting %s transaction',
      txid,
      outerTx ? 'nested' : 'top level'
    );

    // `this` can potentially serve as an `outerTx` for another
    // Transaction.  So, go ahead and establish `_lastChild` now.
    this._lastChild = Promise.resolve();

    const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();

    // FYI: As you will see in a moment, this Promise will be used to construct
    //      2 separate Promise Chains.  This ensures that each Promise Chain
    //      can establish its error-handling semantics without interfering
    //      with the other Promise Chain.
    const basePromise = _previousSibling.then(() =>
      this._evaluateContainer(config, container)
    );

    // FYI: This is the Promise Chain for EXTERNAL use.  It ensures that the
    //      caller must handle any exceptions that result from `basePromise`.
    this._promise = basePromise.then((x) => x);

    if (outerTx) {
      // FYI: This is the Promise Chain for INTERNAL use.  It serves as a signal
      //      for when the next sibling should begin its execution.  Therefore,
      //      exceptions are caught and ignored.
      outerTx._lastChild = basePromise.catch(() => {});
    }
  }

  isCompleted() {
    return (
      this._completed || (this.outerTx && this.outerTx.isCompleted()) || false
    );
  }

  begin(conn) {
    return this.query(conn, 'BEGIN;');
  }

  savepoint(conn) {
    return this.query(conn, `SAVEPOINT ${this.txid};`);
  }

  commit(conn, value) {
    return this.query(conn, 'COMMIT;', 1, value);
  }

  release(conn, value) {
    return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
  }

  rollback(conn, error) {
    return timeout$2(this.query(conn, 'ROLLBACK', 2, error), 5000).catch(
      (err) => {
        if (!(err instanceof KnexTimeoutError$2)) {
          return Promise.reject(err);
        }
        this._rejecter(error);
      }
    );
  }

  rollbackTo(conn, error) {
    return timeout$2(
      this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
      5000
    ).catch((err) => {
      if (!(err instanceof KnexTimeoutError$2)) {
        return Promise.reject(err);
      }
      this._rejecter(error);
    });
  }

  query(conn, sql, status, value) {
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        status = 2;
        value = err;
        this._completed = true;
        debug('%s error running transaction query', this.txid);
      })
      .then((res) => {
        if (status === 1) {
          this._resolver(value);
        }
        if (status === 2) {
          if (isUndefined$5(value)) {
            if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              this._resolver();
              return;
            }

            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          this._rejecter(value);
        }
        return res;
      });
    if (status === 1 || status === 2) {
      this._completed = true;
    }
    return q;
  }

  debug(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  }

  async _evaluateContainer(config, container) {
    return this.acquireConnection(config, (connection) => {
      const trxClient = (this.trxClient = makeTxClient(
        this,
        this.client,
        connection
      ));
      const init = this.client.transacting
        ? this.savepoint(connection)
        : this.begin(connection);
      const executionPromise = new Promise((resolver, rejecter) => {
        this._resolver = resolver;
        this._rejecter = rejecter;
      });

      init
        .then(() => {
          return makeTransactor(this, connection, trxClient);
        })
        .then((transactor) => {
          transactor.executionPromise = executionPromise;

          // If we've returned a "thenable" from the transaction container, assume
          // the rollback and commit are chained to this object's success / failure.
          // Directly thrown errors are treated as automatic rollbacks.
          let result;
          try {
            result = container(transactor);
          } catch (err) {
            result = Promise.reject(err);
          }
          if (result && result.then && typeof result.then === 'function') {
            result
              .then((val) => {
                return transactor.commit(val);
              })
              .catch((err) => {
                return transactor.rollback(err);
              });
          }
          return null;
        })
        .catch((e) => {
          return this._rejecter(e);
        });

      return executionPromise;
    });
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const connection =
      configConnection || (await this.client.acquireConnection());

    try {
      connection.__knexTxId = this.txid;
      return await cb(connection);
    } finally {
      if (!configConnection) {
        debug('%s: releasing connection', this.txid);
        this.client.releaseConnection(connection);
      } else {
        debug('%s: not releasing external connection', this.txid);
      }
    }
  }

  then(onResolve, onReject) {
    return this._promise.then(onResolve, onReject);
  }

  catch(onReject) {
    return this._promise.catch(onReject);
  }

  asCallback(cb) {
    callbackify$1(() => this._promise)(cb);
    return this._promise;
  }
}
finallyMixin_1(Transaction.prototype);

// The transactor is a full featured knex object, with a "commit", a "rollback"
// and a "savepoint" function. The "savepoint" is just sugar for creating a new
// transaction. If the rollback is run inside a savepoint, it rolls back to the
// last savepoint - otherwise it rolls back the transaction.
function makeTransactor(trx, connection, trxClient) {
  const transactor = makeKnex_1(trxClient);

  transactor.context.withUserParams = () => {
    throw new Error(
      'Cannot set user params on a transaction - it can only inherit params from main knex instance'
    );
  };

  transactor.isTransaction = true;
  transactor.userParams = trx.userParams || {};

  transactor.context.transaction = function(container, options) {
    if (!options) {
      options = { doNotRejectOnRollback: true };
    } else if (isUndefined$5(options.doNotRejectOnRollback)) {
      options.doNotRejectOnRollback = true;
    }

    return this._transaction(container, options, trx);
  };

  transactor.savepoint = function(container, options) {
    return transactor.transaction(container, options);
  };

  if (trx.client.transacting) {
    transactor.commit = (value) => trx.release(connection, value);
    transactor.rollback = (error) => trx.rollbackTo(connection, error);
  } else {
    transactor.commit = (value) => trx.commit(connection, value);
    transactor.rollback = (error) => trx.rollback(connection, error);
  }

  transactor.isCompleted = () => trx.isCompleted();

  return transactor;
}

// We need to make a client object which always acquires the same
// connection and does not release back into the pool.
function makeTxClient(trx, client, connection) {
  const trxClient = Object.create(client.constructor.prototype);
  trxClient.version = client.version;
  trxClient.config = client.config;
  trxClient.driver = client.driver;
  trxClient.connectionSettings = client.connectionSettings;
  trxClient.transacting = true;
  trxClient.valueForUndefined = client.valueForUndefined;
  trxClient.logger = client.logger;

  trxClient.on('query', function(arg) {
    trx.emit('query', arg);
    client.emit('query', arg);
  });

  trxClient.on('query-error', function(err, obj) {
    trx.emit('query-error', err, obj);
    client.emit('query-error', err, obj);
  });

  trxClient.on('query-response', function(response, obj, builder) {
    trx.emit('query-response', response, obj, builder);
    client.emit('query-response', response, obj, builder);
  });

  const _query = trxClient.query;
  trxClient.query = function(conn, obj) {
    const completed = trx.isCompleted();
    return new Promise(function(resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_query.call(trxClient, conn, obj));
      } catch (e) {
        reject(e);
      }
    });
  };
  const _stream = trxClient.stream;
  trxClient.stream = function(conn, obj, stream, options) {
    const completed = trx.isCompleted();
    return new Promise(function(resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_stream.call(trxClient, conn, obj, stream, options));
      } catch (e) {
        reject(e);
      }
    });
  };
  trxClient.acquireConnection = function() {
    return Promise.resolve(connection);
  };
  trxClient.releaseConnection = function() {
    return Promise.resolve();
  };

  return trxClient;
}

function completedError(trx, obj) {
  const sql = typeof obj === 'string' ? obj : obj && obj.sql;
  debug('%s: Transaction completed: %s', trx.txid, sql);
  throw new Error(
    'Transaction query already complete, run with DEBUG=knex:tx for more info'
  );
}

var transaction = Transaction;

// Query Compiler
// -------

const {
  assign: assign$2,
  bind,
  compact,
  groupBy,
  isEmpty: isEmpty$3,
  isString: isString$1,
  isUndefined: isUndefined$6,
  map: map$1,
  omitBy,
  reduce: reduce$1,
  has,
} = lodash;

const debugBindings$1 = src('knex:bindings');

const components = [
  'columns',
  'join',
  'where',
  'union',
  'group',
  'having',
  'order',
  'limit',
  'offset',
  'lock',
  'waitMode',
];

// The "QueryCompiler" takes all of the query statements which
// have been gathered in the "QueryBuilder" and turns them into a
// properly formatted / bound query string.
class QueryCompiler {
  constructor(client, builder) {
    this.client = client;
    this.method = builder._method || 'select';
    this.options = builder._options;
    this.single = builder._single;
    this.timeout = builder._timeout || false;
    this.cancelOnTimeout = builder._cancelOnTimeout || false;
    this.grouped = groupBy(builder._statements, 'grouping');
    this.formatter = client.formatter(builder);
    // Used when the insert call is empty.
    this._emptyInsertValue = 'default values';
    this.first = this.select;
  }

  // Collapse the builder into a single object
  toSQL(method, tz) {
    this._undefinedInWhereClause = false;
    this.undefinedBindingsInfo = [];

    method = method || this.method;
    const val = this[method]() || '';

    const query = {
      method,
      options: reduce$1(this.options, assign$2, {}),
      timeout: this.timeout,
      cancelOnTimeout: this.cancelOnTimeout,
      bindings: this.formatter.bindings || [],
      __knexQueryUid: esmNode.v1(),
    };

    Object.defineProperties(query, {
      toNative: {
        value: () => {
          return {
            sql: this.client.positionBindings(query.sql),
            bindings: this.client.prepBindings(query.bindings),
          };
        },
        enumerable: false,
      },
    });

    if (isString$1(val)) {
      query.sql = val;
    } else {
      assign$2(query, val);
    }

    if (method === 'select' || method === 'first') {
      if (this.single.as) {
        query.as = this.single.as;
      }
    }

    if (this._undefinedInWhereClause) {
      debugBindings$1(query.bindings);
      throw new Error(
        `Undefined binding(s) detected when compiling ` +
          `${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
            ', '
          )}] query: ${query.sql}`
      );
    }

    return query;
  }

  // Compiles the `select` statement, or nested sub-selects by calling each of
  // the component compilers, trimming out the empties, and returning a
  // generated query string.
  select() {
    let sql = this.with();

    const statements = components.map((component) => this[component](this));
    sql += compact(statements).join(' ');
    return sql;
  }

  pluck() {
    let toPluck = this.single.pluck;
    if (toPluck.indexOf('.') !== -1) {
      toPluck = toPluck.split('.').slice(-1)[0];
    }
    return {
      sql: this.select(),
      pluck: toPluck,
    };
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const insertValues = this.single.insert || [];
    let sql = this.with() + `insert into ${this.tableName} `;
    if (Array.isArray(insertValues)) {
      if (insertValues.length === 0) {
        return '';
      }
    } else if (typeof insertValues === 'object' && isEmpty$3(insertValues)) {
      return sql + this._emptyInsertValue;
    }

    const insertData = this._prepInsert(insertValues);
    if (typeof insertData === 'string') {
      sql += insertData;
    } else {
      if (insertData.columns.length) {
        sql += `(${this.formatter.columnize(insertData.columns)}`;
        sql += ') values (';
        let i = -1;
        while (++i < insertData.values.length) {
          if (i !== 0) sql += '), (';
          sql += this.formatter.parameterize(
            insertData.values[i],
            this.client.valueForUndefined
          );
        }
        sql += ')';
      } else if (insertValues.length === 1 && insertValues[0]) {
        sql += this._emptyInsertValue;
      } else {
        sql = '';
      }
    }
    return sql;
  }

  // Compiles the "update" query.
  update() {
    // Make sure tableName is processed by the formatter first.
    const withSQL = this.with();
    const { tableName } = this;
    const updateData = this._prepUpdate(this.single.update);
    const wheres = this.where();
    return (
      withSQL +
      `update ${this.single.only ? 'only ' : ''}${tableName}` +
      ' set ' +
      updateData.join(', ') +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles the columns in the query, specifying if an item was distinct.
  columns() {
    let distinctClause = '';
    if (this.onlyUnions()) return '';
    const columns = this.grouped.columns || [];
    let i = -1,
      sql = [];
    if (columns) {
      while (++i < columns.length) {
        const stmt = columns[i];
        if (stmt.distinct) distinctClause = 'distinct ';
        if (stmt.distinctOn) {
          distinctClause = this.distinctOn(stmt.value);
          continue;
        }
        if (stmt.type === 'aggregate') {
          sql.push(...this.aggregate(stmt));
        } else if (stmt.type === 'aggregateRaw') {
          sql.push(this.aggregateRaw(stmt));
        } else if (stmt.value && stmt.value.length > 0) {
          sql.push(this.formatter.columnize(stmt.value));
        }
      }
    }
    if (sql.length === 0) sql = ['*'];
    return (
      `select ${distinctClause}` +
      sql.join(', ') +
      (this.tableName
        ? ` from ${this.single.only ? 'only ' : ''}${this.tableName}`
        : '')
    );
  }

  _aggregate(stmt, { aliasSeparator = ' as ', distinctParentheses } = {}) {
    const value = stmt.value;
    const method = stmt.method;
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    const wrap = (identifier) => this.formatter.wrap(identifier);
    const addAlias = (value, alias) => {
      if (alias) {
        return value + aliasSeparator + wrap(alias);
      }
      return value;
    };
    const aggregateArray = (value, alias) => {
      let columns = value.map(wrap).join(', ');
      if (distinct) {
        const openParen = distinctParentheses ? '(' : ' ';
        const closeParen = distinctParentheses ? ')' : '';
        columns = distinct.trim() + openParen + columns + closeParen;
      }
      const aggregated = `${method}(${columns})`;
      return addAlias(aggregated, alias);
    };
    const aggregateString = (value, alias) => {
      const aggregated = `${method}(${distinct + wrap(value)})`;
      return addAlias(aggregated, alias);
    };

    if (Array.isArray(value)) {
      return [aggregateArray(value)];
    }

    if (typeof value === 'object') {
      if (stmt.alias) {
        throw new Error('When using an object explicit alias can not be used');
      }
      return Object.entries(value).map(([alias, column]) => {
        if (Array.isArray(column)) {
          return aggregateArray(column, alias);
        }
        return aggregateString(column, alias);
      });
    }

    // Allows us to speciy an alias for the aggregate types.
    const splitOn = value.toLowerCase().indexOf(' as ');
    let column = value;
    let { alias } = stmt;
    if (splitOn !== -1) {
      column = value.slice(0, splitOn);
      if (alias) {
        throw new Error(`Found multiple aliases for same column: ${column}`);
      }
      alias = value.slice(splitOn + 4);
    }
    return [aggregateString(column, alias)];
  }

  aggregate(stmt) {
    return this._aggregate(stmt);
  }

  aggregateRaw(stmt) {
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    return `${stmt.method}(${distinct + this.formatter.unwrapRaw(stmt.value)})`;
  }

  // Compiles all each of the `join` clauses on the query,
  // including any nested join queries.
  join() {
    let sql = '';
    let i = -1;
    const joins = this.grouped.join;
    if (!joins) return '';
    while (++i < joins.length) {
      const join = joins[i];
      const table = join.schema ? `${join.schema}.${join.table}` : join.table;
      if (i > 0) sql += ' ';
      if (join.joinType === 'raw') {
        sql += this.formatter.unwrapRaw(join.table);
      } else {
        sql += join.joinType + ' join ' + this.formatter.wrap(table);
        let ii = -1;
        while (++ii < join.clauses.length) {
          const clause = join.clauses[ii];
          if (ii > 0) {
            sql += ` ${clause.bool} `;
          } else {
            sql += ` ${clause.type === 'onUsing' ? 'using' : 'on'} `;
          }
          const val = this[clause.type].call(this, clause);
          if (val) {
            sql += val;
          }
        }
      }
    }
    return sql;
  }

  onBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  onNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  onExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  onIn(statement) {
    if (Array.isArray(statement.column)) return this.multiOnIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiOnIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compiles all `where` statements on the query.
  where() {
    const wheres = this.grouped.where;
    if (!wheres) return;
    const sql = [];
    let i = -1;
    while (++i < wheres.length) {
      const stmt = wheres[i];
      if (
        Object.prototype.hasOwnProperty.call(stmt, 'value') &&
        helpers.containsUndefined(stmt.value)
      ) {
        this.undefinedBindingsInfo.push(stmt.column);
        this._undefinedInWhereClause = true;
      }
      const val = this[stmt.type](stmt);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        } else {
          sql.push(stmt.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  group() {
    return this._groupsOrders('group');
  }

  order() {
    return this._groupsOrders('order');
  }

  // Compiles the `having` statements.
  having() {
    const havings = this.grouped.having;
    if (!havings) return '';
    const sql = ['having'];
    for (let i = 0, l = havings.length; i < l; i++) {
      const s = havings[i];
      const val = this[s.type](s);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        }
        if (sql.length > 1 || (sql.length === 1 && sql[0] !== 'having')) {
          sql.push(s.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  havingRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  havingWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  havingBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      this.formatter.parameter(statement.value)
    );
  }

  havingNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  havingExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  havingBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  havingIn(statement) {
    if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiHavingIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compile the "union" queries attached to the main query.
  union() {
    const onlyUnions = this.onlyUnions();
    const unions = this.grouped.union;
    if (!unions) return '';
    let sql = '';
    for (let i = 0, l = unions.length; i < l; i++) {
      const union = unions[i];
      if (i > 0) sql += ' ';
      if (i > 0 || !onlyUnions) sql += union.clause + ' ';
      const statement = this.formatter.rawOrFn(union.value);
      if (statement) {
        if (union.wrap) sql += '(';
        sql += statement;
        if (union.wrap) sql += ')';
      }
    }
    return sql;
  }

  // If we haven't specified any columns or a `tableName`, we're assuming this
  // is only being used for unions.
  onlyUnions() {
    return !this.grouped.columns && this.grouped.union && !this.tableName;
  }

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit) return '';
    return `limit ${this.formatter.parameter(this.single.limit)}`;
  }

  offset() {
    if (!this.single.offset) return '';
    return `offset ${this.formatter.parameter(this.single.offset)}`;
  }

  // Compiles a `delete` query.
  del() {
    // Make sure tableName is processed by the formatter first.
    const { tableName } = this;
    const withSQL = this.with();
    const wheres = this.where();
    return (
      withSQL +
      `delete from ${this.single.only ? 'only ' : ''}${tableName}` +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate ${this.tableName}`;
  }

  // Compiles the "locks".
  lock() {
    if (this.single.lock) {
      return this[this.single.lock]();
    }
  }

  // Compiles the wait mode on the locks.
  waitMode() {
    if (this.single.waitMode) {
      return this[this.single.waitMode]();
    }
  }

  // Fail on unsupported databases
  skipLocked() {
    throw new Error(
      '.skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+'
    );
  }

  // Fail on unsupported databases
  noWait() {
    throw new Error(
      '.noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+'
    );
  }

  distinctOn(value) {
    throw new Error('.distinctOn() is currently only supported on PostgreSQL');
  }

  // On Clause
  // ------

  onWrapped(clause) {
    const self = this;

    const wrapJoin = new joinclause();
    clause.value.call(wrapJoin, wrapJoin);

    let sql = '';
    wrapJoin.clauses.forEach(function(wrapClause, ii) {
      if (ii > 0) {
        sql += ` ${wrapClause.bool} `;
      }
      const val = self[wrapClause.type](wrapClause);
      if (val) {
        sql += val;
      }
    });

    if (sql.length) {
      return `(${sql})`;
    }
    return '';
  }

  onBasic(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.wrap(clause.value)
    );
  }

  onVal(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.parameter(clause.value)
    );
  }

  onRaw(clause) {
    return this.formatter.unwrapRaw(clause.value);
  }

  onUsing(clause) {
    return '(' + this.formatter.columnize(clause.column) + ')';
  }

  // Where Clause
  // ------

  whereIn(statement) {
    let columns = null;
    if (Array.isArray(statement.column)) {
      columns = `(${this.formatter.columnize(statement.column)})`;
    } else {
      columns = this.formatter.wrap(statement.column);
    }

    const values = this.formatter.values(statement.value);
    return `${columns} ${this._not(statement, 'in ')}${values}`;
  }

  whereNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  // Compiles a basic "where" clause.
  whereBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      (statement.asColumn
        ? this.formatter.wrap(statement.value)
        : this.formatter.parameter(statement.value))
    );
  }

  whereExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  whereWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  whereBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  // Compiles a "whereRaw" query.
  whereRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  wrap(str) {
    if (str.charAt(0) !== '(') return `(${str})`;
    return str;
  }

  // Compiles all `with` statements on the query.
  with() {
    if (!this.grouped.with || !this.grouped.with.length) {
      return '';
    }
    const withs = this.grouped.with;
    if (!withs) return;
    const sql = [];
    let i = -1;
    let isRecursive = false;
    while (++i < withs.length) {
      const stmt = withs[i];
      if (stmt.recursive) {
        isRecursive = true;
      }
      const val = this[stmt.type](stmt);
      sql.push(val);
    }
    return `with ${isRecursive ? 'recursive ' : ''}${sql.join(', ')} `;
  }

  withWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value);
    return (
      (val &&
        this.formatter.columnize(statement.alias) + ' as (' + val + ')') ||
      ''
    );
  }

  // Determines whether to add a "not" prefix to the where clause.
  _not(statement, str) {
    if (statement.not) return `not ${str}`;
    return str;
  }

  _prepInsert(data) {
    const isRaw = this.formatter.rawOrFn(data);
    if (isRaw) return isRaw;
    let columns = [];
    const values = [];
    if (!Array.isArray(data)) data = data ? [data] : [];
    let i = -1;
    while (++i < data.length) {
      if (data[i] == null) break;
      if (i === 0) columns = Object.keys(data[i]).sort();
      const row = new Array(columns.length);
      const keys = Object.keys(data[i]);
      let j = -1;
      while (++j < keys.length) {
        const key = keys[j];
        let idx = columns.indexOf(key);
        if (idx === -1) {
          columns = columns.concat(key).sort();
          idx = columns.indexOf(key);
          let k = -1;
          while (++k < values.length) {
            values[k].splice(idx, 0, undefined);
          }
          row.splice(idx, 0, undefined);
        }
        row[idx] = data[i][key];
      }
      values.push(row);
    }
    return {
      columns,
      values,
    };
  }

  // "Preps" the update.
  _prepUpdate(data = {}) {
    const { counter = {} } = this.single;

    for (const column of Object.keys(counter)) {
      //Skip?
      if (has(data, column)) {
        //Needed?
        this.client.logger.warn(
          `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
        );
        continue;
      }

      let value = counter[column];

      const symbol = value < 0 ? '-' : '+';

      if (symbol === '-') {
        value = -value;
      }

      data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
    }

    data = omitBy(data, isUndefined$6);

    const vals = [];
    const columns = Object.keys(data);
    let i = -1;

    while (++i < columns.length) {
      vals.push(
        this.formatter.wrap(columns[i]) +
          ' = ' +
          this.formatter.parameter(data[columns[i]])
      );
    }

    if (isEmpty$3(vals)) {
      throw new Error(
        [
          'Empty .update() call detected!',
          'Update data does not contain any values to update.',
          'This will result in a faulty query.',
          this.single.table ? `Table: ${this.single.table}.` : '',
          this.single.update
            ? `Columns: ${Object.keys(this.single.update)}.`
            : '',
        ].join(' ')
      );
    }

    return vals;
  }

  _formatGroupsItemValue(value) {
    const { formatter } = this;
    if (value instanceof raw) {
      return formatter.unwrapRaw(value);
    } else if (value instanceof builder) {
      return '(' + formatter.columnize(value) + ')';
    } else {
      return formatter.columnize(value);
    }
  }

  // Compiles the `order by` statements.
  _groupsOrders(type) {
    const items = this.grouped[type];
    if (!items) return '';
    const { formatter } = this;
    const sql = items.map((item) => {
      const column = this._formatGroupsItemValue(item.value);
      const direction =
        type === 'order' && item.type !== 'orderByRaw'
          ? ` ${formatter.direction(item.direction)}`
          : '';
      return column + direction;
    });
    return sql.length ? type + ' by ' + sql.join(', ') : '';
  }

  // Get the table name, wrapping it if necessary.
  // Implemented as a property to prevent ordering issues as described in #704.
  get tableName() {
    if (!this._tableName) {
      // Only call this.formatter.wrap() the first time this property is accessed.
      let tableName = this.single.table;
      const schemaName = this.single.schema;

      if (tableName && schemaName) tableName = `${schemaName}.${tableName}`;

      this._tableName = tableName
        ? // Wrap subQuery with parenthesis, #3485
          this.formatter.wrap(tableName, tableName instanceof builder)
        : '';
    }
    return this._tableName;
  }
}

var compiler = QueryCompiler;

const { EventEmitter: EventEmitter$4 } = events;
const { each: each$2, toArray: toArray$1 } = lodash;
const { addQueryContext: addQueryContext$1 } = helpers;

// Constructor for the builder instance, typically called from
// `knex.builder`, accepting the current `knex` instance,
// and pulling out the `client` and `grammar` from the current
// knex instance.
function SchemaBuilder(client) {
  this.client = client;
  this._sequence = [];

  if (client.config) {
    this._debug = client.config.debug;
    saveAsyncStack(this, 4);
  }
}

inherits(SchemaBuilder, EventEmitter$4);

// Each of the schema builder methods just add to the
// "_sequence" array for consistency.
each$2(
  [
    'createTable',
    'createTableIfNotExists',
    'createSchema',
    'createSchemaIfNotExists',
    'dropSchema',
    'dropSchemaIfExists',
    'createExtension',
    'createExtensionIfNotExists',
    'dropExtension',
    'dropExtensionIfExists',
    'table',
    'alterTable',
    'hasTable',
    'hasColumn',
    'dropTable',
    'renameTable',
    'dropTableIfExists',
    'raw',
  ],
  function(method) {
    SchemaBuilder.prototype[method] = function() {
      if (method === 'createTableIfNotExists') {
        this.client.logger.warn(
          [
            'Use async .hasTable to check if table exists and then use plain .createTable. Since ',
            '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
            'query it will not work correctly if there are any alter table queries generated for ',
            'columns afterwards. To not break old migrations this function is left untouched for now',
            ', but it should not be used when writing new code and it is removed from documentation.',
          ].join('')
        );
      }
      if (method === 'table') method = 'alterTable';
      this._sequence.push({
        method,
        args: toArray$1(arguments),
      });
      return this;
    };
  }
);

_interface(SchemaBuilder);
addQueryContext$1(SchemaBuilder);

SchemaBuilder.prototype.withSchema = function(schemaName) {
  this._schema = schemaName;
  return this;
};

SchemaBuilder.prototype.toString = function() {
  return this.toQuery();
};

SchemaBuilder.prototype.toSQL = function() {
  return this.client.schemaCompiler(this).toSQL();
};

var builder$1 = SchemaBuilder;

const { isString: isString$2, tail: tail$1 } = lodash;

// Push a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function pushQuery(query) {
  if (!query) return;
  if (isString$2(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.formatter.bindings;
  }
  this.sequence.push(query);

  this.formatter = this.client.formatter(this._commonBuilder);
}

// Used in cases where we need to push some additional column specific statements.
function pushAdditional(fn) {
  const child = new this.constructor(
    this.client,
    this.tableCompiler,
    this.columnBuilder
  );
  fn.call(child, tail$1(arguments));
  this.sequence.additional = (this.sequence.additional || []).concat(
    child.sequence
  );
}

// Unshift a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function unshiftQuery(query) {
  if (!query) return;
  if (isString$2(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.formatter.bindings;
  }
  this.sequence.unshift(query);

  this.formatter = this.client.formatter(this._commonBuilder);
}

var helpers$1 = {
  pushAdditional,
  pushQuery,
  unshiftQuery,
};

const {
  pushQuery: pushQuery$1,
  pushAdditional: pushAdditional$1,
  unshiftQuery: unshiftQuery$1,
} = helpers$1;

const { isUndefined: isUndefined$7 } = lodash;

// The "SchemaCompiler" takes all of the query statements which have been
// gathered in the "SchemaBuilder" and turns them into an array of
// properly formatted / bound query strings.
function SchemaCompiler(client, builder) {
  this.builder = builder;
  this._commonBuilder = this.builder;
  this.client = client;
  this.schema = builder._schema;
  this.formatter = client.formatter(builder);
  this.sequence = [];
}

function throwOnlyPGError(operationName) {
  throw new Error(
    `${operationName} is not supported for this dialect (only PostgreSQL supports it currently).`
  );
}

Object.assign(SchemaCompiler.prototype, {
  pushQuery: pushQuery$1,

  pushAdditional: pushAdditional$1,

  unshiftQuery: unshiftQuery$1,

  createTable: buildTable('create'),

  createTableIfNotExists: buildTable('createIfNot'),

  createSchema: () => {
    throwOnlyPGError('createSchema');
  },
  createSchemaIfNotExists: () => {
    throwOnlyPGError('createSchemaIfNotExists');
  },
  dropSchema: () => {
    throwOnlyPGError('dropSchema');
  },
  dropSchemaIfExists: () => {
    throwOnlyPGError('dropSchemaIfExists');
  },

  alterTable: buildTable('alter'),

  dropTablePrefix: 'drop table ',

  dropTable(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  },

  dropTableIfExists(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        'if exists ' +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  },

  raw(sql, bindings) {
    this.sequence.push(this.client.raw(sql, bindings).toSQL());
  },

  toSQL() {
    const sequence = this.builder._sequence;
    for (let i = 0, l = sequence.length; i < l; i++) {
      const query = sequence[i];
      this[query.method].apply(this, query.args);
    }
    return this.sequence;
  },
});

function buildTable(type) {
  return function(tableName, fn) {
    const builder = this.client.tableBuilder(type, tableName, fn);

    // pass queryContext down to tableBuilder but do not overwrite it if already set
    const queryContext = this.builder.queryContext();
    if (!isUndefined$7(queryContext) && isUndefined$7(builder.queryContext())) {
      builder.queryContext(queryContext);
    }

    builder.setSchema(this.schema);
    const sql = builder.toSQL();

    for (let i = 0, l = sql.length; i < l; i++) {
      this.sequence.push(sql[i]);
    }
  };
}

function prefixedTableName(prefix, table) {
  return prefix ? `${prefix}.${table}` : table;
}

var compiler$1 = SchemaCompiler;

// TableBuilder

// Takes the function passed to the "createTable" or "table/editTable"
// functions and calls it with the "TableBuilder" as both the context and
// the first argument. Inside this function we can specify what happens to the
// method, pushing everything we want to do onto the "allStatements" array,
// which is then compiled into sql.
// ------
const {
  extend: extend$1,
  each: each$3,
  toArray: toArray$2,
  isString: isString$3,
  isFunction: isFunction$3,
} = lodash;

function TableBuilder(client, method, tableName, fn) {
  this.client = client;
  this._fn = fn;
  this._method = method;
  this._schemaName = undefined;
  this._tableName = tableName;
  this._statements = [];
  this._single = {};

  if (!isFunction$3(this._fn)) {
    throw new TypeError(
      'A callback function must be supplied to calls against `.createTable` ' +
        'and `.table`'
    );
  }
}

TableBuilder.prototype.setSchema = function(schemaName) {
  this._schemaName = schemaName;
};

// Convert the current tableBuilder object "toSQL"
// giving us additional methods if we're altering
// rather than creating the table.
TableBuilder.prototype.toSQL = function() {
  if (this._method === 'alter') {
    extend$1(this, AlterMethods);
  }
  this._fn.call(this, this);
  return this.client.tableCompiler(this).toSQL();
};

each$3(
  [
    // Each of the index methods can be called individually, with the
    // column name to be used, e.g. table.unique('column').
    'index',
    'primary',
    'unique',

    // Key specific
    'dropPrimary',
    'dropUnique',
    'dropIndex',
    'dropForeign',
  ],
  function(method) {
    TableBuilder.prototype[method] = function() {
      this._statements.push({
        grouping: 'alterTable',
        method,
        args: toArray$2(arguments),
      });
      return this;
    };
  }
);

// Warn for dialect-specific table methods, since that's the
// only time these are supported.
const specialMethods = {
  mysql: ['engine', 'charset', 'collate'],
  postgresql: ['inherits'],
};
each$3(specialMethods, function(methods, dialect) {
  each$3(methods, function(method) {
    TableBuilder.prototype[method] = function(value) {
      if (this.client.dialect !== dialect) {
        throw new Error(
          `Knex only supports ${method} statement with ${dialect}.`
        );
      }
      if (this._method === 'alter') {
        throw new Error(
          `Knex does not support altering the ${method} outside of create ` +
            `table, please use knex.raw statement.`
        );
      }
      this._single[method] = value;
    };
  });
});

helpers.addQueryContext(TableBuilder);

// Each of the column types that we can add, we create a new ColumnBuilder
// instance and push it onto the statements array.
const columnTypes = [
  // Numeric
  'tinyint',
  'smallint',
  'mediumint',
  'int',
  'bigint',
  'decimal',
  'float',
  'double',
  'real',
  'bit',
  'boolean',
  'serial',

  // Date / Time
  'date',
  'datetime',
  'timestamp',
  'time',
  'year',

  // String
  'char',
  'varchar',
  'tinytext',
  'tinyText',
  'text',
  'mediumtext',
  'mediumText',
  'longtext',
  'longText',
  'binary',
  'varbinary',
  'tinyblob',
  'tinyBlob',
  'mediumblob',
  'mediumBlob',
  'blob',
  'longblob',
  'longBlob',
  'enum',
  'set',

  // Increments, Aliases, and Additional
  'bool',
  'dateTime',
  'increments',
  'bigincrements',
  'bigIncrements',
  'integer',
  'biginteger',
  'bigInteger',
  'string',
  'json',
  'jsonb',
  'uuid',
  'enu',
  'specificType',
];

// For each of the column methods, create a new "ColumnBuilder" interface,
// push it onto the "allStatements" stack, and then return the interface,
// with which we can add indexes, etc.
each$3(columnTypes, function(type) {
  TableBuilder.prototype[type] = function() {
    const args = toArray$2(arguments);
    const builder = this.client.columnBuilder(this, type, args);
    this._statements.push({
      grouping: 'columns',
      builder,
    });
    return builder;
  };
});

// The "timestamps" call is really just sets the `created_at` and `updated_at` columns.
TableBuilder.prototype.timestamps = function timestamps() {
  const method = arguments[0] === true ? 'timestamp' : 'datetime';
  const createdAt = this[method]('created_at');
  const updatedAt = this[method]('updated_at');
  if (arguments[1] === true) {
    const now = this.client.raw('CURRENT_TIMESTAMP');
    createdAt.notNullable().defaultTo(now);
    updatedAt.notNullable().defaultTo(now);
  }
  return;
};

// Set the comment value for a table, they're only allowed to be called
// once per table.
TableBuilder.prototype.comment = function(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Table comment must be string');
  }
  this._single.comment = value;
};

// Set a foreign key on the table, calling
// `table.foreign('column_name').references('column').on('table').onDelete()...
// Also called from the ColumnBuilder context when chaining.
TableBuilder.prototype.foreign = function(column, keyName) {
  const foreignData = { column: column, keyName: keyName };
  this._statements.push({
    grouping: 'alterTable',
    method: 'foreign',
    args: [foreignData],
  });
  let returnObj = {
    references(tableColumn) {
      let pieces;
      if (isString$3(tableColumn)) {
        pieces = tableColumn.split('.');
      }
      if (!pieces || pieces.length === 1) {
        foreignData.references = pieces ? pieces[0] : tableColumn;
        return {
          on(tableName) {
            if (typeof tableName !== 'string') {
              throw new TypeError(
                `Expected tableName to be a string, got: ${typeof tableName}`
              );
            }
            foreignData.inTable = tableName;
            return returnObj;
          },
          inTable() {
            return this.on.apply(this, arguments);
          },
        };
      }
      foreignData.inTable = pieces[0];
      foreignData.references = pieces[1];
      return returnObj;
    },
    withKeyName(keyName) {
      foreignData.keyName = keyName;
      return returnObj;
    },
    onUpdate(statement) {
      foreignData.onUpdate = statement;
      return returnObj;
    },
    onDelete(statement) {
      foreignData.onDelete = statement;
      return returnObj;
    },
    _columnBuilder(builder) {
      extend$1(builder, returnObj);
      returnObj = builder;
      return builder;
    },
  };
  return returnObj;
};

const AlterMethods = {
  // Renames the current column `from` the current
  // TODO: this.column(from).rename(to)
  renameColumn(from, to) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'renameColumn',
      args: [from, to],
    });
    return this;
  },

  dropTimestamps() {
    return this.dropColumns(['created_at', 'updated_at']);
  },

  // TODO: changeType
};

// Drop a column from the current table.
// TODO: Enable this.column(columnName).drop();
AlterMethods.dropColumn = AlterMethods.dropColumns = function() {
  this._statements.push({
    grouping: 'alterTable',
    method: 'dropColumn',
    args: toArray$2(arguments),
  });
  return this;
};

var tablebuilder = TableBuilder;

/* eslint max-len:0 */

// Table Compiler
// -------
const {
  pushAdditional: pushAdditional$2,
  pushQuery: pushQuery$2,
  unshiftQuery: unshiftQuery$2,
} = helpers$1;

const {
  groupBy: groupBy$1,
  reduce: reduce$2,
  map: map$2,
  first,
  tail: tail$2,
  isEmpty: isEmpty$4,
  indexOf,
  isArray: isArray$1,
  isUndefined: isUndefined$8,
} = lodash;

function TableCompiler(client, tableBuilder) {
  this.client = client;
  this.tableBuilder = tableBuilder;
  this._commonBuilder = this.tableBuilder;
  this.method = tableBuilder._method;
  this.schemaNameRaw = tableBuilder._schemaName;
  this.tableNameRaw = tableBuilder._tableName;
  this.single = tableBuilder._single;
  this.grouped = groupBy$1(tableBuilder._statements, 'grouping');
  this.formatter = client.formatter(tableBuilder);
  this.sequence = [];
  this._formatting = client.config && client.config.formatting;
}

TableCompiler.prototype.pushQuery = pushQuery$2;

TableCompiler.prototype.pushAdditional = pushAdditional$2;

TableCompiler.prototype.unshiftQuery = unshiftQuery$2;

// Convert the tableCompiler toSQL
TableCompiler.prototype.toSQL = function() {
  this[this.method]();
  return this.sequence;
};

TableCompiler.prototype.lowerCase = true;

// Column Compilation
// -------

// If this is a table "creation", we need to first run through all
// of the columns to build them into a single string,
// and then run through anything else and push it to the query sequence.
TableCompiler.prototype.createAlterTableMethods = null;
TableCompiler.prototype.create = function(ifNot) {
  const columnBuilders = this.getColumns();
  const columns = columnBuilders.map((col) => col.toSQL());
  const columnTypes = this.getColumnTypes(columns);
  if (this.createAlterTableMethods) {
    this.alterTableForCreate(columnTypes);
  }
  this.createQuery(columnTypes, ifNot);
  this.columnQueries(columns);
  delete this.single.comment;
  this.alterTable();
};

// Only create the table if it doesn't exist.
TableCompiler.prototype.createIfNot = function() {
  this.create(true);
};

// If we're altering the table, we need to one-by-one
// go through and handle each of the queries associated
// with altering the table's schema.
TableCompiler.prototype.alter = function() {
  const addColBuilders = this.getColumns();
  const addColumns = addColBuilders.map((col) => col.toSQL());
  const alterColBuilders = this.getColumns('alter');
  const alterColumns = alterColBuilders.map((col) => col.toSQL());
  const addColumnTypes = this.getColumnTypes(addColumns);
  const alterColumnTypes = this.getColumnTypes(alterColumns);

  this.addColumns(addColumnTypes);
  this.alterColumns(alterColumnTypes, alterColBuilders);
  this.columnQueries(addColumns);
  this.columnQueries(alterColumns);
  this.alterTable();
};

TableCompiler.prototype.foreign = function(foreignData) {
  if (foreignData.inTable && foreignData.references) {
    const keyName = foreignData.keyName
      ? this.formatter.wrap(foreignData.keyName)
      : this._indexCommand('foreign', this.tableNameRaw, foreignData.column);
    const column = this.formatter.columnize(foreignData.column);
    const references = this.formatter.columnize(foreignData.references);
    const inTable = this.formatter.wrap(foreignData.inTable);
    const onUpdate = foreignData.onUpdate
      ? (this.lowerCase ? ' on update ' : ' ON UPDATE ') + foreignData.onUpdate
      : '';
    const onDelete = foreignData.onDelete
      ? (this.lowerCase ? ' on delete ' : ' ON DELETE ') + foreignData.onDelete
      : '';
    if (this.lowerCase) {
      this.pushQuery(
        (!this.forCreate ? `alter table ${this.tableName()} add ` : '') +
          'constraint ' +
          keyName +
          ' ' +
          'foreign key (' +
          column +
          ') references ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    } else {
      this.pushQuery(
        (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : '') +
          'CONSTRAINT ' +
          keyName +
          ' ' +
          'FOREIGN KEY (' +
          column +
          ') REFERENCES ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    }
  }
};

// Get all of the column sql & bindings individually for building the table queries.
TableCompiler.prototype.getColumnTypes = (columns) =>
  reduce$2(
    map$2(columns, first),
    function(memo, column) {
      memo.sql.push(column.sql);
      memo.bindings.concat(column.bindings);
      return memo;
    },
    { sql: [], bindings: [] }
  );

// Adds all of the additional queries from the "column"
TableCompiler.prototype.columnQueries = function(columns) {
  const queries = reduce$2(
    map$2(columns, tail$2),
    function(memo, column) {
      if (!isEmpty$4(column)) return memo.concat(column);
      return memo;
    },
    []
  );
  for (const q of queries) {
    this.pushQuery(q);
  }
};

// Add a new column.
TableCompiler.prototype.addColumnsPrefix = 'add column ';

// All of the columns to "add" for the query
TableCompiler.prototype.addColumns = function(columns, prefix) {
  prefix = prefix || this.addColumnsPrefix;

  if (columns.sql.length > 0) {
    const columnSql = map$2(columns.sql, (column) => {
      return prefix + column;
    });
    this.pushQuery({
      sql:
        (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
        this.tableName() +
        ' ' +
        columnSql.join(', '),
      bindings: columns.bindings,
    });
  }
};

// Alter column
TableCompiler.prototype.alterColumnsPrefix = 'alter column ';

TableCompiler.prototype.alterColumns = function(columns, colBuilders) {
  if (columns.sql.length > 0) {
    this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
  }
};

// Compile the columns as needed for the current create or alter table
TableCompiler.prototype.getColumns = function(method) {
  const columns = this.grouped.columns || [];
  method = method || 'add';

  const queryContext = this.tableBuilder.queryContext();

  return columns
    .filter((column) => column.builder._method === method)
    .map((column) => {
      // pass queryContext down to columnBuilder but do not overwrite it if already set
      if (
        !isUndefined$8(queryContext) &&
        isUndefined$8(column.builder.queryContext())
      ) {
        column.builder.queryContext(queryContext);
      }
      return this.client.columnCompiler(this, column.builder);
    });
};

TableCompiler.prototype.tableName = function() {
  const name = this.schemaNameRaw
    ? `${this.schemaNameRaw}.${this.tableNameRaw}`
    : this.tableNameRaw;

  return this.formatter.wrap(name);
};

// Generate all of the alter column statements necessary for the query.
TableCompiler.prototype.alterTable = function() {
  const alterTable = this.grouped.alterTable || [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (this[statement.method]) {
      this[statement.method].apply(this, statement.args);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  for (const item in this.single) {
    if (typeof this[item] === 'function') this[item](this.single[item]);
  }
};

TableCompiler.prototype.alterTableForCreate = function(columnTypes) {
  this.forCreate = true;
  const savedSequence = this.sequence;
  const alterTable = this.grouped.alterTable || [];
  this.grouped.alterTable = [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
      this.grouped.alterTable.push(statement);
      continue;
    }
    if (this[statement.method]) {
      this.sequence = [];
      this[statement.method].apply(this, statement.args);
      columnTypes.sql.push(this.sequence[0].sql);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  this.sequence = savedSequence;
  this.forCreate = false;
};

// Drop the index on the current table.
TableCompiler.prototype.dropIndex = function(value) {
  this.pushQuery(`drop index${value}`);
};

// Drop the unique
TableCompiler.prototype.dropUnique = TableCompiler.prototype.dropForeign = function() {
  throw new Error('Method implemented in the dialect driver');
};

TableCompiler.prototype.dropColumnPrefix = 'drop column ';
TableCompiler.prototype.dropColumn = function() {
  const columns = helpers.normalizeArr.apply(null, arguments);
  const drops = map$2(isArray$1(columns) ? columns : [columns], (column) => {
    return this.dropColumnPrefix + this.formatter.wrap(column);
  });
  this.pushQuery(
    (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
      this.tableName() +
      ' ' +
      drops.join(', ')
  );
};

// If no name was specified for this index, we will create one using a basic
// convention of the table name, followed by the columns, followed by an
// index type, such as primary or index, which makes the index unique.
TableCompiler.prototype._indexCommand = function(type, tableName, columns) {
  if (!isArray$1(columns)) columns = columns ? [columns] : [];
  const table = tableName.replace(/\.|-/g, '_');
  const indexName = (
    table +
    '_' +
    columns.join('_') +
    '_' +
    type
  ).toLowerCase();
  return this.formatter.wrap(indexName);
};

var tablecompiler = TableCompiler;

const { extend: extend$2, each: each$4, toArray: toArray$3 } = lodash;
const { addQueryContext: addQueryContext$2 } = helpers;

// The chainable interface off the original "column" method.
function ColumnBuilder(client, tableBuilder, type, args) {
  this.client = client;
  this._method = 'add';
  this._single = {};
  this._modifiers = {};
  this._statements = [];
  this._type = columnAlias[type] || type;
  this._args = args;
  this._tableBuilder = tableBuilder;

  // If we're altering the table, extend the object
  // with the available "alter" methods.
  if (tableBuilder._method === 'alter') {
    extend$2(this, AlterMethods$1);
  }
}

// All of the modifier methods that can be used to modify the current query.
const modifiers = [
  'default',
  'defaultsTo',
  'defaultTo',
  'unsigned',
  'nullable',
  'first',
  'after',
  'comment',
  'collate',
];

// Aliases for convenience.
const aliasMethod = {
  default: 'defaultTo',
  defaultsTo: 'defaultTo',
};

// If we call any of the modifiers (index or otherwise) on the chainable, we pretend
// as though we're calling `table.method(column)` directly.
each$4(modifiers, function(method) {
  const key = aliasMethod[method] || method;
  ColumnBuilder.prototype[method] = function() {
    this._modifiers[key] = toArray$3(arguments);
    return this;
  };
});

addQueryContext$2(ColumnBuilder);

ColumnBuilder.prototype.notNull = ColumnBuilder.prototype.notNullable = function notNullable() {
  return this.nullable(false);
};

each$4(['index', 'primary', 'unique'], function(method) {
  ColumnBuilder.prototype[method] = function() {
    if (this._type.toLowerCase().indexOf('increments') === -1) {
      this._tableBuilder[method].apply(
        this._tableBuilder,
        [this._args[0]].concat(toArray$3(arguments))
      );
    }
    return this;
  };
});

// Specify that the current column "references" a column,
// which may be tableName.column or just "column"
ColumnBuilder.prototype.references = function(value) {
  return this._tableBuilder.foreign
    .call(this._tableBuilder, this._args[0], undefined, this)
    ._columnBuilder(this)
    .references(value);
};

const AlterMethods$1 = {};

// Specify that the column is to be dropped. This takes precedence
// over all other rules for the column.
AlterMethods$1.drop = function() {
  this._single.drop = true;

  return this;
};

// Specify the "type" that we're looking to set the
// Knex takes no responsibility for any data-loss that may
// occur when changing data types.
AlterMethods$1.alterType = function(type) {
  this._statements.push({
    grouping: 'alterType',
    value: type,
  });

  return this;
};

// Set column method to alter (default is add).
AlterMethods$1.alter = function() {
  this._method = 'alter';

  return this;
};

// Alias a few methods for clarity when processing.
const columnAlias = {
  float: 'floating',
  enum: 'enu',
  boolean: 'bool',
  string: 'varchar',
  bigint: 'bigInteger',
};

var columnbuilder = ColumnBuilder;

// Column Compiler
// Used for designating column definitions
// during the table "create" / "alter" statements.
// -------

const {
  groupBy: groupBy$2,
  first: first$1,
  tail: tail$3,
  has: has$1,
  isObject: isObject$2,
} = lodash;

function ColumnCompiler(client, tableCompiler, columnBuilder) {
  this.client = client;
  this.tableCompiler = tableCompiler;
  this.columnBuilder = columnBuilder;
  this._commonBuilder = this.columnBuilder;
  this.args = columnBuilder._args;
  this.type = columnBuilder._type.toLowerCase();
  this.grouped = groupBy$2(columnBuilder._statements, 'grouping');
  this.modified = columnBuilder._modifiers;
  this.isIncrements = this.type.indexOf('increments') !== -1;
  this.formatter = client.formatter(columnBuilder);
  this.sequence = [];
  this.modifiers = [];
}

ColumnCompiler.prototype.pushQuery = helpers$1.pushQuery;

ColumnCompiler.prototype.pushAdditional = helpers$1.pushAdditional;

ColumnCompiler.prototype.unshiftQuery = helpers$1.unshiftQuery;

ColumnCompiler.prototype._defaultMap = {
  columnName: function() {
    if (!this.isIncrements) {
      throw new Error(
        `You did not specify a column name for the ${this.type} column.`
      );
    }
    return 'id';
  },
};

ColumnCompiler.prototype.defaults = function(label) {
  if (Object.prototype.hasOwnProperty.call(this._defaultMap, label)) {
    return this._defaultMap[label].bind(this)();
  } else {
    throw new Error(
      `There is no default for the specified identifier ${label}`
    );
  }
};

// To convert to sql, we first go through and build the
// column as it would be in the insert statement
ColumnCompiler.prototype.toSQL = function() {
  this.pushQuery(this.compileColumn());
  if (this.sequence.additional) {
    this.sequence = this.sequence.concat(this.sequence.additional);
  }
  return this.sequence;
};

// Compiles a column.
ColumnCompiler.prototype.compileColumn = function() {
  return (
    this.formatter.wrap(this.getColumnName()) +
    ' ' +
    this.getColumnType() +
    this.getModifiers()
  );
};

// Assumes the autoincrementing key is named `id` if not otherwise specified.
ColumnCompiler.prototype.getColumnName = function() {
  const value = first$1(this.args);
  return value || this.defaults('columnName');
};

ColumnCompiler.prototype.getColumnType = function() {
  const type = this[this.type];
  return typeof type === 'function'
    ? type.apply(this, tail$3(this.args))
    : type;
};

ColumnCompiler.prototype.getModifiers = function() {
  const modifiers = [];

  for (let i = 0, l = this.modifiers.length; i < l; i++) {
    const modifier = this.modifiers[i];

    //Cannot allow 'nullable' modifiers on increments types
    if (!this.isIncrements || (this.isIncrements && modifier === 'comment')) {
      if (has$1(this.modified, modifier)) {
        const val = this[modifier].apply(this, this.modified[modifier]);
        if (val) modifiers.push(val);
      }
    }
  }

  return modifiers.length > 0 ? ` ${modifiers.join(' ')}` : '';
};

// Types
// ------

ColumnCompiler.prototype.increments =
  'integer not null primary key autoincrement';
ColumnCompiler.prototype.bigincrements =
  'integer not null primary key autoincrement';
ColumnCompiler.prototype.integer = ColumnCompiler.prototype.smallint = ColumnCompiler.prototype.mediumint =
  'integer';
ColumnCompiler.prototype.biginteger = 'bigint';
ColumnCompiler.prototype.varchar = function(length) {
  return `varchar(${this._num(length, 255)})`;
};
ColumnCompiler.prototype.text = 'text';
ColumnCompiler.prototype.tinyint = 'tinyint';
ColumnCompiler.prototype.floating = function(precision, scale) {
  return `float(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
};
ColumnCompiler.prototype.decimal = function(precision, scale) {
  if (precision === null) {
    throw new Error(
      'Specifying no precision on decimal columns is not supported for that SQL dialect.'
    );
  }
  return `decimal(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
};
ColumnCompiler.prototype.binary = 'blob';
ColumnCompiler.prototype.bool = 'boolean';
ColumnCompiler.prototype.date = 'date';
ColumnCompiler.prototype.datetime = 'datetime';
ColumnCompiler.prototype.time = 'time';
ColumnCompiler.prototype.timestamp = 'timestamp';
ColumnCompiler.prototype.enu = 'varchar';

ColumnCompiler.prototype.bit = ColumnCompiler.prototype.json = 'text';

ColumnCompiler.prototype.uuid = 'char(36)';
ColumnCompiler.prototype.specifictype = (type) => type;

// Modifiers
// -------

ColumnCompiler.prototype.nullable = (nullable) =>
  nullable === false ? 'not null' : 'null';
ColumnCompiler.prototype.notNullable = function() {
  return this.nullable(false);
};
ColumnCompiler.prototype.defaultTo = function(value) {
  if (value === void 0) {
    return '';
  } else if (value === null) {
    value = 'null';
  } else if (value instanceof raw) {
    value = value.toQuery();
  } else if (this.type === 'bool') {
    if (value === 'false') value = 0;
    value = `'${value ? 1 : 0}'`;
  } else if (
    (this.type === 'json' || this.type === 'jsonb') &&
    isObject$2(value)
  ) {
    value = `'${JSON.stringify(value)}'`;
  } else {
    value = `'${value}'`;
  }
  return `default ${value}`;
};
ColumnCompiler.prototype._num = function(val, fallback) {
  if (val === undefined || val === null) return fallback;
  const number = parseInt(val, 10);
  return isNaN(number) ? fallback : number;
};

var columncompiler = ColumnCompiler;

var TimeoutError_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  class TimeoutError extends Error {}
  exports.TimeoutError = TimeoutError;
});

unwrapExports(TimeoutError_1);
var TimeoutError_2 = TimeoutError_1.TimeoutError;

var PromiseInspection_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  class PromiseInspection {
    constructor(args) {
      this._value = args.value;
      this._error = args.error;
    }
    value() {
      return this._value;
    }
    reason() {
      return this._error;
    }
    isRejected() {
      return !!this._error;
    }
    isFulfilled() {
      return !!this._value;
    }
  }
  exports.PromiseInspection = PromiseInspection;
});

unwrapExports(PromiseInspection_1);
var PromiseInspection_2 = PromiseInspection_1.PromiseInspection;

var utils = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });

  function defer() {
    let resolve = null;
    let reject = null;
    const promise = new Promise((resolver, rejecter) => {
      resolve = resolver;
      reject = rejecter;
    });
    return {
      promise,
      resolve,
      reject,
    };
  }
  exports.defer = defer;
  function now() {
    return Date.now();
  }
  exports.now = now;
  function duration(t1, t2) {
    return Math.abs(t2 - t1);
  }
  exports.duration = duration;
  function checkOptionalTime(time) {
    if (typeof time === 'undefined') {
      return true;
    }
    return checkRequiredTime(time);
  }
  exports.checkOptionalTime = checkOptionalTime;
  function checkRequiredTime(time) {
    return typeof time === 'number' && time === Math.round(time) && time > 0;
  }
  exports.checkRequiredTime = checkRequiredTime;
  function delay(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }
  exports.delay = delay;
  function reflect(promise) {
    return promise
      .then((value) => {
        return new PromiseInspection_1.PromiseInspection({ value });
      })
      .catch((error) => {
        return new PromiseInspection_1.PromiseInspection({ error });
      });
  }
  exports.reflect = reflect;
  function tryPromise(cb) {
    try {
      const result = cb();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  exports.tryPromise = tryPromise;
});

unwrapExports(utils);
var utils_1 = utils.defer;
var utils_2 = utils.now;
var utils_3 = utils.duration;
var utils_4 = utils.checkOptionalTime;
var utils_5 = utils.checkRequiredTime;
var utils_6 = utils.delay;
var utils_7 = utils.reflect;
var utils_8 = utils.tryPromise;

var PendingOperation_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });

  class PendingOperation {
    constructor(timeoutMillis) {
      this.timeoutMillis = timeoutMillis;
      this.deferred = utils.defer();
      this.possibleTimeoutCause = null;
      this.promise = timeout(this.deferred.promise, timeoutMillis).catch(
        (err) => {
          if (err instanceof TimeoutError_1.TimeoutError) {
            if (this.possibleTimeoutCause) {
              err = new TimeoutError_1.TimeoutError(
                this.possibleTimeoutCause.message
              );
            } else {
              err = new TimeoutError_1.TimeoutError(
                'operation timed out for an unknown reason'
              );
            }
          }
          return Promise.reject(err);
        }
      );
    }
    abort() {
      this.reject(new Error('aborted'));
    }
    reject(err) {
      this.deferred.reject(err);
    }
    resolve(value) {
      this.deferred.resolve(value);
    }
  }
  exports.PendingOperation = PendingOperation;
  function timeout(promise, time) {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(
        () => reject(new TimeoutError_1.TimeoutError()),
        time
      );
      promise
        .then((result) => {
          clearTimeout(timeoutHandle);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timeoutHandle);
          reject(err);
        });
    });
  }
});

unwrapExports(PendingOperation_1);
var PendingOperation_2 = PendingOperation_1.PendingOperation;

var Resource_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });

  class Resource {
    constructor(resource) {
      this.resource = resource;
      this.resource = resource;
      this.timestamp = utils.now();
      this.deferred = utils.defer();
    }
    get promise() {
      return this.deferred.promise;
    }
    resolve() {
      this.deferred.resolve(undefined);
      return new Resource(this.resource);
    }
  }
  exports.Resource = Resource;
});

unwrapExports(Resource_1);
var Resource_2 = Resource_1.Resource;

var Pool_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });

  class Pool {
    constructor(opt) {
      this.destroyed = false;
      this.emitter = new events.EventEmitter();
      opt = opt || {};
      if (!opt.create) {
        throw new Error('Tarn: opt.create function most be provided');
      }
      if (!opt.destroy) {
        throw new Error('Tarn: opt.destroy function most be provided');
      }
      if (
        typeof opt.min !== 'number' ||
        opt.min < 0 ||
        opt.min !== Math.round(opt.min)
      ) {
        throw new Error('Tarn: opt.min must be an integer >= 0');
      }
      if (
        typeof opt.max !== 'number' ||
        opt.max <= 0 ||
        opt.max !== Math.round(opt.max)
      ) {
        throw new Error('Tarn: opt.max must be an integer > 0');
      }
      if (opt.min > opt.max) {
        throw new Error('Tarn: opt.max is smaller than opt.min');
      }
      if (!utils.checkOptionalTime(opt.acquireTimeoutMillis)) {
        throw new Error(
          'Tarn: invalid opt.acquireTimeoutMillis ' +
            JSON.stringify(opt.acquireTimeoutMillis)
        );
      }
      if (!utils.checkOptionalTime(opt.createTimeoutMillis)) {
        throw new Error(
          'Tarn: invalid opt.createTimeoutMillis ' +
            JSON.stringify(opt.createTimeoutMillis)
        );
      }
      if (!utils.checkOptionalTime(opt.destroyTimeoutMillis)) {
        throw new Error(
          'Tarn: invalid opt.destroyTimeoutMillis ' +
            JSON.stringify(opt.destroyTimeoutMillis)
        );
      }
      if (!utils.checkOptionalTime(opt.idleTimeoutMillis)) {
        throw new Error(
          'Tarn: invalid opt.idleTimeoutMillis ' +
            JSON.stringify(opt.idleTimeoutMillis)
        );
      }
      if (!utils.checkOptionalTime(opt.reapIntervalMillis)) {
        throw new Error(
          'Tarn: invalid opt.reapIntervalMillis ' +
            JSON.stringify(opt.reapIntervalMillis)
        );
      }
      if (!utils.checkOptionalTime(opt.createRetryIntervalMillis)) {
        throw new Error(
          'Tarn: invalid opt.createRetryIntervalMillis ' +
            JSON.stringify(opt.createRetryIntervalMillis)
        );
      }
      const allowedKeys = {
        create: true,
        validate: true,
        destroy: true,
        log: true,
        min: true,
        max: true,
        acquireTimeoutMillis: true,
        createTimeoutMillis: true,
        destroyTimeoutMillis: true,
        idleTimeoutMillis: true,
        reapIntervalMillis: true,
        createRetryIntervalMillis: true,
        propagateCreateError: true,
      };
      for (let key of Object.keys(opt)) {
        if (!allowedKeys[key]) {
          throw new Error(`Tarn: unsupported option opt.${key}`);
        }
      }
      this.creator = opt.create;
      this.destroyer = opt.destroy;
      this.validate =
        typeof opt.validate === 'function' ? opt.validate : () => true;
      this.log = opt.log || (() => {});
      this.acquireTimeoutMillis = opt.acquireTimeoutMillis || 30000;
      this.createTimeoutMillis = opt.createTimeoutMillis || 30000;
      this.destroyTimeoutMillis = opt.destroyTimeoutMillis || 5000;
      this.idleTimeoutMillis = opt.idleTimeoutMillis || 30000;
      this.reapIntervalMillis = opt.reapIntervalMillis || 1000;
      this.createRetryIntervalMillis = opt.createRetryIntervalMillis || 200;
      this.propagateCreateError = !!opt.propagateCreateError;
      this.min = opt.min;
      this.max = opt.max;
      this.used = [];
      this.free = [];
      this.pendingCreates = [];
      this.pendingAcquires = [];
      this.pendingDestroys = [];
      this.destroyed = false;
      this.interval = null;
      this.eventId = 1;
    }
    numUsed() {
      return this.used.length;
    }
    numFree() {
      return this.free.length;
    }
    numPendingAcquires() {
      return this.pendingAcquires.length;
    }
    numPendingCreates() {
      return this.pendingCreates.length;
    }
    acquire() {
      const eventId = this.eventId++;
      this._executeEventHandlers('acquireRequest', eventId);
      const pendingAcquire = new PendingOperation_1.PendingOperation(
        this.acquireTimeoutMillis
      );
      this.pendingAcquires.push(pendingAcquire);
      // If the acquire fails for whatever reason
      // remove it from the pending queue.
      pendingAcquire.promise = pendingAcquire.promise
        .then((resource) => {
          this._executeEventHandlers('acquireSuccess', eventId, resource);
          return resource;
        })
        .catch((err) => {
          this._executeEventHandlers('acquireFail', eventId, err);
          remove(this.pendingAcquires, pendingAcquire);
          return Promise.reject(err);
        });
      this._tryAcquireOrCreate();
      return pendingAcquire;
    }
    release(resource) {
      this._executeEventHandlers('release', resource);
      for (let i = 0, l = this.used.length; i < l; ++i) {
        const used = this.used[i];
        if (used.resource === resource) {
          this.used.splice(i, 1);
          this.free.push(used.resolve());
          this._tryAcquireOrCreate();
          return true;
        }
      }
      return false;
    }
    isEmpty() {
      return (
        [
          this.numFree(),
          this.numUsed(),
          this.numPendingAcquires(),
          this.numPendingCreates(),
        ].reduce((total, value) => total + value) === 0
      );
    }
    check() {
      const timestamp = utils.now();
      const newFree = [];
      const minKeep = this.min - this.used.length;
      const maxDestroy = this.free.length - minKeep;
      let numDestroyed = 0;
      this.free.forEach((free) => {
        if (
          utils.duration(timestamp, free.timestamp) >= this.idleTimeoutMillis &&
          numDestroyed < maxDestroy
        ) {
          numDestroyed++;
          this._destroy(free.resource);
        } else {
          newFree.push(free);
        }
      });
      this.free = newFree;
      // Pool is completely empty, stop reaping.
      // Next .acquire will start reaping interval again.
      if (this.isEmpty()) {
        this._stopReaping();
      }
    }
    destroy() {
      const eventId = this.eventId++;
      this._executeEventHandlers('poolDestroyRequest', eventId);
      this._stopReaping();
      this.destroyed = true;
      // First wait for all the pending creates get ready.
      return utils
        .reflect(
          Promise.all(
            this.pendingCreates.map((create) => utils.reflect(create.promise))
          )
            .then(() => {
              // Wait for all the used resources to be freed.
              return Promise.all(
                this.used.map((used) => utils.reflect(used.promise))
              );
            })
            .then(() => {
              // Abort all pending acquires.
              return Promise.all(
                this.pendingAcquires.map((acquire) => {
                  acquire.abort();
                  return utils.reflect(acquire.promise);
                })
              );
            })
            .then(() => {
              // Now we can destroy all the freed resources.
              return Promise.all(
                this.free.map((free) =>
                  utils.reflect(this._destroy(free.resource))
                )
              );
            })
            .then(() => {
              // Also wait rest of the pending destroys to finish
              return Promise.all(this.pendingDestroys.map((pd) => pd.promise));
            })
            .then(() => {
              this.free = [];
              this.pendingAcquires = [];
            })
        )
        .then((res) => {
          this._executeEventHandlers('poolDestroySuccess', eventId);
          this.emitter.removeAllListeners();
          return res;
        });
    }
    on(event, listener) {
      this.emitter.on(event, listener);
    }
    removeListener(event, listener) {
      this.emitter.removeListener(event, listener);
    }
    removeAllListeners(event) {
      this.emitter.removeAllListeners(event);
    }
    _tryAcquireOrCreate() {
      if (this.destroyed) {
        return;
      }
      if (this._hasFreeResources()) {
        this._doAcquire();
      } else if (this._shouldCreateMoreResources()) {
        this._doCreate();
      }
    }
    _hasFreeResources() {
      return this.free.length > 0;
    }
    _doAcquire() {
      let didDestroyResources = false;
      while (this._canAcquire()) {
        const pendingAcquire = this.pendingAcquires[0];
        const free = this.free[this.free.length - 1];
        if (!this._validateResource(free.resource)) {
          this.free.pop();
          this._destroy(free.resource);
          didDestroyResources = true;
          continue;
        }
        this.pendingAcquires.shift();
        this.free.pop();
        this.used.push(free.resolve());
        //At least one active resource, start reaping
        this._startReaping();
        pendingAcquire.resolve(free.resource);
      }
      // If we destroyed invalid resources, we may need to create new ones.
      if (didDestroyResources) {
        this._tryAcquireOrCreate();
      }
    }
    _canAcquire() {
      return this.free.length > 0 && this.pendingAcquires.length > 0;
    }
    _validateResource(resource) {
      try {
        return !!this.validate(resource);
      } catch (err) {
        // There's nothing we can do here but log the error. This would otherwise
        // leak out as an unhandled exception.
        this.log(
          'Tarn: resource validator threw an exception ' + err.stack,
          'warn'
        );
        return false;
      }
    }
    _shouldCreateMoreResources() {
      return (
        this.used.length + this.pendingCreates.length < this.max &&
        this.pendingCreates.length < this.pendingAcquires.length
      );
    }
    _doCreate() {
      const pendingAcquiresBeforeCreate = this.pendingAcquires.slice();
      const pendingCreate = this._create();
      pendingCreate.promise
        .then(() => {
          // Not returned on purpose.
          this._tryAcquireOrCreate();
          return null;
        })
        .catch((err) => {
          if (this.propagateCreateError && this.pendingAcquires.length !== 0) {
            // If propagateCreateError is true, we don't retry the create
            // but reject the first pending acquire immediately. Intentionally
            // use `this.pendingAcquires` instead of `pendingAcquiresBeforeCreate`
            // in case some acquires in pendingAcquiresBeforeCreate have already
            // been resolved.
            this.pendingAcquires[0].reject(err);
          }
          // Save the create error to all pending acquires so that we can use it
          // as the error to reject the acquire if it times out.
          pendingAcquiresBeforeCreate.forEach((pendingAcquire) => {
            pendingAcquire.possibleTimeoutCause = err;
          });
          // Not returned on purpose.
          utils
            .delay(this.createRetryIntervalMillis)
            .then(() => this._tryAcquireOrCreate());
        });
    }
    _create() {
      const eventId = this.eventId++;
      this._executeEventHandlers('createRequest', eventId);
      const pendingCreate = new PendingOperation_1.PendingOperation(
        this.createTimeoutMillis
      );
      this.pendingCreates.push(pendingCreate);
      callbackOrPromise(this.creator)
        .then((resource) => {
          remove(this.pendingCreates, pendingCreate);
          this.free.push(new Resource_1.Resource(resource));
          // Not returned on purpose.
          pendingCreate.resolve(resource);
          this._executeEventHandlers('createSuccess', eventId, resource);
          return null;
        })
        .catch((err) => {
          remove(this.pendingCreates, pendingCreate);
          // Not returned on purpose.
          pendingCreate.reject(err);
          this._executeEventHandlers('createFail', eventId, err);
          return null;
        });
      return pendingCreate;
    }
    _destroy(resource) {
      const eventId = this.eventId++;
      this._executeEventHandlers('destroyRequest', eventId, resource);
      // this.destroyer can be both synchronous and asynchronous.
      // so we wrap it to promise to get all exceptions through same pipeline
      const pendingDestroy = new PendingOperation_1.PendingOperation(
        this.destroyTimeoutMillis
      );
      const retVal = Promise.resolve().then(() => this.destroyer(resource));
      retVal
        .then(() => {
          pendingDestroy.resolve(resource);
        })
        .catch((err) => {
          pendingDestroy.reject(err);
        });
      this.pendingDestroys.push(pendingDestroy);
      // In case of an error there's nothing we can do here but log it.
      return pendingDestroy.promise
        .then((res) => {
          this._executeEventHandlers('destroySuccess', eventId, resource);
          return res;
        })
        .catch((err) => this._logDestroyerError(eventId, resource, err))
        .then((res) => {
          const index = this.pendingDestroys.findIndex(
            (pd) => pd === pendingDestroy
          );
          this.pendingDestroys.splice(index, 1);
          return res;
        });
    }
    _logDestroyerError(eventId, resource, err) {
      this._executeEventHandlers('destroyFail', eventId, resource, err);
      this.log(
        'Tarn: resource destroyer threw an exception ' + err.stack,
        'warn'
      );
    }
    _startReaping() {
      if (!this.interval) {
        this._executeEventHandlers('startReaping');
        this.interval = setInterval(
          () => this.check(),
          this.reapIntervalMillis
        );
      }
    }
    _stopReaping() {
      if (this.interval !== null) {
        this._executeEventHandlers('stopReaping');
        clearInterval(this.interval);
      }
      this.interval = null;
    }
    _executeEventHandlers(eventName, ...args) {
      const listeners = this.emitter.listeners(eventName);
      // just calling .emit() would stop running rest of the listeners if one them fails
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (err) {
          // There's nothing we can do here but log the error. This would otherwise
          // leak out as an unhandled exception.
          this.log(
            `Tarn: event handler "${eventName}" threw an exception ${err.stack}`,
            'warn'
          );
        }
      });
    }
  }
  exports.Pool = Pool;
  function remove(arr, item) {
    var idx = arr.indexOf(item);
    if (idx === -1) {
      return false;
    } else {
      arr.splice(idx, 1);
      return true;
    }
  }
  function callbackOrPromise(func) {
    return new Promise((resolve, reject) => {
      const callback = (err, resource) => {
        if (err) {
          reject(err);
        } else {
          resolve(resource);
        }
      };
      utils
        .tryPromise(() => func(callback))
        .then((res) => {
          // If the result is falsy, we assume that the callback will
          // be called instead of interpreting the falsy value as a
          // result value.
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
});

unwrapExports(Pool_1);
var Pool_2 = Pool_1.Pool;

var tarn = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, '__esModule', { value: true });

  exports.Pool = Pool_1.Pool;

  exports.TimeoutError = TimeoutError_1.TimeoutError;
  module.exports = {
    Pool: Pool_1.Pool,
    TimeoutError: TimeoutError_1.TimeoutError,
  };
});

unwrapExports(tarn);
var tarn_1 = tarn.Pool;
var tarn_2 = tarn.TimeoutError;

/*eslint max-len: 0, no-var:0 */

const charsRegex = /[\0\b\t\n\r\x1a"'\\]/g; // eslint-disable-line no-control-regex
const charsMap = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\',
};

function wrapEscape(escapeFn) {
  return function finalEscape(val, ctx = {}) {
    return escapeFn(val, finalEscape, ctx);
  };
}

function makeEscape(config = {}) {
  const finalEscapeDate = config.escapeDate || dateToString;
  const finalEscapeArray = config.escapeArray || arrayToList;
  const finalEscapeBuffer = config.escapeBuffer || bufferToString;
  const finalEscapeString = config.escapeString || escapeString;
  const finalEscapeObject = config.escapeObject || escapeObject;
  const finalWrap = config.wrap || wrapEscape;

  function escapeFn(val, finalEscape, ctx) {
    if (val === undefined || val === null) {
      return 'NULL';
    }
    switch (typeof val) {
      case 'boolean':
        return val ? 'true' : 'false';
      case 'number':
        return val + '';
      case 'object':
        if (val instanceof Date) {
          val = finalEscapeDate(val, finalEscape, ctx);
        } else if (Array.isArray(val)) {
          return finalEscapeArray(val, finalEscape, ctx);
        } else if (Buffer.isBuffer(val)) {
          return finalEscapeBuffer(val, finalEscape, ctx);
        } else {
          return finalEscapeObject(val, finalEscape, ctx);
        }
    }
    return finalEscapeString(val, finalEscape, ctx);
  }

  return finalWrap ? finalWrap(escapeFn) : escapeFn;
}

function escapeObject(val, finalEscape, ctx) {
  if (val && typeof val.toSQL === 'function') {
    return val.toSQL(ctx);
  } else {
    return JSON.stringify(val);
  }
}

function arrayToList(array, finalEscape, ctx) {
  let sql = '';
  for (let i = 0; i < array.length; i++) {
    const val = array[i];
    if (Array.isArray(val)) {
      sql +=
        (i === 0 ? '' : ', ') + '(' + arrayToList(val, finalEscape, ctx) + ')';
    } else {
      sql += (i === 0 ? '' : ', ') + finalEscape(val, ctx);
    }
  }
  return sql;
}

function bufferToString(buffer) {
  return 'X' + escapeString(buffer.toString('hex'));
}

function escapeString(val, finalEscape, ctx) {
  let chunkIndex = (charsRegex.lastIndex = 0);
  let escapedVal = '';
  let match;

  while ((match = charsRegex.exec(val))) {
    escapedVal += val.slice(chunkIndex, match.index) + charsMap[match[0]];
    chunkIndex = charsRegex.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}

function dateToString(date, finalEscape, ctx = {}) {
  const timeZone = ctx.timeZone || 'local';

  const dt = new Date(date);
  let year;
  let month;
  let day;
  let hour;
  let minute;
  let second;
  let millisecond;

  if (timeZone === 'local') {
    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
    hour = dt.getHours();
    minute = dt.getMinutes();
    second = dt.getSeconds();
    millisecond = dt.getMilliseconds();
  } else {
    const tz = convertTimezone(timeZone);

    if (tz !== false && tz !== 0) {
      dt.setTime(dt.getTime() + tz * 60000);
    }

    year = dt.getUTCFullYear();
    month = dt.getUTCMonth() + 1;
    day = dt.getUTCDate();
    hour = dt.getUTCHours();
    minute = dt.getUTCMinutes();
    second = dt.getUTCSeconds();
    millisecond = dt.getUTCMilliseconds();
  }

  // YYYY-MM-DD HH:mm:ss.mmm
  return (
    zeroPad(year, 4) +
    '-' +
    zeroPad(month, 2) +
    '-' +
    zeroPad(day, 2) +
    ' ' +
    zeroPad(hour, 2) +
    ':' +
    zeroPad(minute, 2) +
    ':' +
    zeroPad(second, 2) +
    '.' +
    zeroPad(millisecond, 3)
  );
}

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}

function convertTimezone(tz) {
  if (tz === 'Z') {
    return 0;
  }
  const m = tz.match(/([+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (
      (m[1] == '-' ? -1 : 1) *
      (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) *
      60
    );
  }
  return false;
}

var string = {
  arrayToList,
  bufferToString,
  dateToString,
  escapeString,
  charsRegex,
  charsMap,
  escapeObject,
  makeEscape,
};

let enabled =
  !('NO_COLOR' in process.env) &&
  process.env.FORCE_COLOR !== '0' &&
  (process.platform === 'win32' ||
    (process.stdout != null &&
      process.stdout.isTTY &&
      process.env.TERM &&
      process.env.TERM !== 'dumb'));

const rawInit = (open, close, searchRegex, replaceValue) => (s) =>
  enabled
    ? open +
      (~(s += '').indexOf(close, 4) // skip opening \x1b[
        ? s.replace(searchRegex, replaceValue)
        : s) +
      close
    : s;

const init = (open, close) => {
  return rawInit(
    `\x1b[${open}m`,
    `\x1b[${close}m`,
    new RegExp(`\\x1b\\[${close}m`, 'g'),
    `\x1b[${open}m`
  );
};

var colorette = {
  options: Object.defineProperty({}, 'enabled', {
    get: () => enabled,
    set: (value) => (enabled = value),
  }),
  reset: init(0, 0),
  bold: rawInit('\x1b[1m', '\x1b[22m', /\x1b\[22m/g, '\x1b[22m\x1b[1m'),
  dim: rawInit('\x1b[2m', '\x1b[22m', /\x1b\[22m/g, '\x1b[22m\x1b[2m'),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49),
};

/* eslint no-console:0 */

const { inspect } = util;
const {
  isFunction: isFunction$4,
  isNil: isNil$1,
  isString: isString$4,
} = lodash;

class Logger {
  constructor(config) {
    const {
      log: {
        debug,
        warn,
        error,
        deprecate,
        inspectionDepth,
        enableColors,
      } = {},
    } = config;
    this._inspectionDepth = inspectionDepth || 5;
    this._enableColors = resolveIsEnabledColors(enableColors);
    this._debug = debug;
    this._warn = warn;
    this._error = error;
    this._deprecate = deprecate;
  }

  _log(message, userFn, colorFn) {
    if (!isNil$1(userFn) && !isFunction$4(userFn)) {
      throw new TypeError('Extensions to knex logger must be functions!');
    }

    if (isFunction$4(userFn)) {
      userFn(message);
      return;
    }

    if (!isString$4(message)) {
      message = inspect(message, {
        depth: this._inspectionDepth,
        colors: this._enableColors,
      });
    }

    console.log(colorFn ? colorFn(message) : message);
  }

  debug(message) {
    this._log(message, this._debug);
  }

  warn(message) {
    this._log(message, this._warn, colorette.yellow);
  }

  error(message) {
    this._log(message, this._error, colorette.red);
  }

  deprecate(method, alternative) {
    const message = `${method} is deprecated, please use ${alternative}`;

    this._log(message, this._deprecate, colorette.yellow);
  }
}

function resolveIsEnabledColors(enableColorsParam) {
  if (!isNil$1(enableColorsParam)) {
    return enableColorsParam;
  }

  if (process && process.stdout) {
    return process.stdout.isTTY;
  }

  return false;
}

var logger = Logger;

const { Pool, TimeoutError } = tarn;

const { EventEmitter: EventEmitter$5 } = events;
const { promisify: promisify$3 } = util;

const { makeEscape: makeEscape$1 } = string;
const { uniqueId: uniqueId$1, cloneDeep, defaults } = lodash;

const { KnexTimeoutError: KnexTimeoutError$3 } = timeout_1;

const debug$1 = src('knex:client');
const _debugQuery = src('knex:query');
const debugBindings$2 = src('knex:bindings');

const debugQuery = (sql, txId) => _debugQuery(sql.replace(/%/g, '%%'), txId);

const { POOL_CONFIG_OPTIONS: POOL_CONFIG_OPTIONS$1 } = constants;

// The base client provides the general structure
// for a dialect specific client object.
function Client(config = {}) {
  this.config = config;
  this.logger = new logger(config);

  //Client is a required field, so throw error if it's not supplied.
  //If 'this.dialect' is set, then this is a 'super()' call, in which case
  //'client' does not have to be set as it's already assigned on the client prototype.

  if (this.dialect && !this.config.client) {
    this.logger.warn(
      `Using 'this.dialect' to identify the client is deprecated and support for it will be removed in the future. Please use configuration option 'client' instead.`
    );
  }
  const dbClient = this.config.client || this.dialect;
  if (!dbClient) {
    throw new Error(`knex: Required configuration option 'client' is missing.`);
  }

  if (config.version) {
    this.version = config.version;
  }

  if (config.connection && config.connection instanceof Function) {
    this.connectionConfigProvider = config.connection;
    this.connectionConfigExpirationChecker = () => true; // causes the provider to be called on first use
  } else {
    this.connectionSettings = cloneDeep(config.connection || {});
    this.connectionConfigExpirationChecker = null;
  }
  if (this.driverName && config.connection) {
    this.initializeDriver();
    if (!config.pool || (config.pool && config.pool.max !== 0)) {
      this.initializePool(config);
    }
  }
  this.valueForUndefined = this.raw('DEFAULT');
  if (config.useNullAsDefault) {
    this.valueForUndefined = null;
  }
}

inherits(Client, EventEmitter$5);

Object.assign(Client.prototype, {
  formatter(builder) {
    return new formatter(this, builder);
  },

  queryBuilder() {
    return new builder(this);
  },

  queryCompiler(builder) {
    return new compiler(this, builder);
  },

  schemaBuilder() {
    return new builder$1(this);
  },

  schemaCompiler(builder) {
    return new compiler$1(this, builder);
  },

  tableBuilder(type, tableName, fn) {
    return new tablebuilder(this, type, tableName, fn);
  },

  tableCompiler(tableBuilder) {
    return new tablecompiler(this, tableBuilder);
  },

  columnBuilder(tableBuilder, type, args) {
    return new columnbuilder(this, tableBuilder, type, args);
  },

  columnCompiler(tableBuilder, columnBuilder) {
    return new columncompiler(this, tableBuilder, columnBuilder);
  },

  runner(builder) {
    return new runner(this, builder);
  },

  transaction(container, config, outerTx) {
    return new transaction(this, container, config, outerTx);
  },

  raw() {
    return new raw(this).set(...arguments);
  },

  ref() {
    return new ref(this, ...arguments);
  },

  _formatQuery(sql, bindings, timeZone) {
    bindings = bindings == null ? [] : [].concat(bindings);
    let index = 0;
    return sql.replace(/\\?\?/g, (match) => {
      if (match === '\\?') {
        return '?';
      }
      if (index === bindings.length) {
        return match;
      }
      const value = bindings[index++];
      return this._escapeBinding(value, { timeZone });
    });
  },

  _escapeBinding: makeEscape$1({
    escapeString(str) {
      return `'${str.replace(/'/g, "''")}'`;
    },
  }),

  query(connection, obj) {
    if (typeof obj === 'string') obj = { sql: obj };
    obj.bindings = this.prepBindings(obj.bindings);

    const { __knexUid, __knexTxId } = connection;

    this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
    debugQuery(obj.sql, __knexTxId);
    debugBindings$2(obj.bindings, __knexTxId);

    obj.sql = this.positionBindings(obj.sql);

    return this._query(connection, obj).catch((err) => {
      err.message =
        this._formatQuery(obj.sql, obj.bindings) + ' - ' + err.message;
      this.emit(
        'query-error',
        err,
        Object.assign({ __knexUid, __knexTxId }, obj)
      );
      throw err;
    });
  },

  stream(connection, obj, stream, options) {
    if (typeof obj === 'string') obj = { sql: obj };
    obj.bindings = this.prepBindings(obj.bindings);

    const { __knexUid, __knexTxId } = connection;

    this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
    debugQuery(obj.sql, __knexTxId);
    debugBindings$2(obj.bindings, __knexTxId);

    obj.sql = this.positionBindings(obj.sql);

    return this._stream(connection, obj, stream, options);
  },

  prepBindings(bindings) {
    return bindings;
  },

  positionBindings(sql) {
    return sql;
  },

  postProcessResponse(resp, queryContext) {
    if (this.config.postProcessResponse) {
      return this.config.postProcessResponse(resp, queryContext);
    }
    return resp;
  },

  wrapIdentifier(value, queryContext) {
    return this.customWrapIdentifier(
      value,
      this.wrapIdentifierImpl,
      queryContext
    );
  },

  customWrapIdentifier(value, origImpl, queryContext) {
    if (this.config.wrapIdentifier) {
      return this.config.wrapIdentifier(value, origImpl, queryContext);
    }
    return origImpl(value);
  },

  wrapIdentifierImpl(value) {
    return value !== '*' ? `"${value.replace(/"/g, '""')}"` : '*';
  },

  initializeDriver() {
    try {
      this.driver = this._driver();
    } catch (e) {
      const message = `Knex: run\n$ npm install ${this.driverName} --save`;
      this.logger.error(`${message}\n${e.message}\n${e.stack}`);
      throw new Error(`${message}\n${e.message}`);
    }
  },

  poolDefaults() {
    return { min: 2, max: 10, propagateCreateError: true };
  },

  getPoolSettings(poolConfig) {
    poolConfig = defaults({}, poolConfig, this.poolDefaults());

    POOL_CONFIG_OPTIONS$1.forEach((option) => {
      if (option in poolConfig) {
        this.logger.warn(
          [
            `Pool config option "${option}" is no longer supported.`,
            `See https://github.com/Vincit/tarn.js for possible pool config options.`,
          ].join(' ')
        );
      }
    });

    const timeouts = [
      this.config.acquireConnectionTimeout || 60000,
      poolConfig.acquireTimeoutMillis,
    ].filter((timeout) => timeout !== undefined);

    // acquire connection timeout can be set on config or config.pool
    // choose the smallest, positive timeout setting and set on poolConfig
    poolConfig.acquireTimeoutMillis = Math.min(...timeouts);

    const updatePoolConnectionSettingsFromProvider = async () => {
      if (!this.connectionConfigProvider) {
        return; // static configuration, nothing to update
      }
      if (
        !this.connectionConfigExpirationChecker ||
        !this.connectionConfigExpirationChecker()
      ) {
        return; // not expired, reuse existing connection
      }
      const providerResult = await this.connectionConfigProvider();
      if (providerResult.expirationChecker) {
        this.connectionConfigExpirationChecker =
          providerResult.expirationChecker;
        delete providerResult.expirationChecker; // MySQL2 driver warns on receiving extra properties
      } else {
        this.connectionConfigExpirationChecker = null;
      }
      this.connectionSettings = providerResult;
    };

    return Object.assign(poolConfig, {
      create: async () => {
        await updatePoolConnectionSettingsFromProvider();
        const connection = await this.acquireRawConnection();
        connection.__knexUid = uniqueId$1('__knexUid');
        if (poolConfig.afterCreate) {
          await promisify$3(poolConfig.afterCreate)(connection);
        }
        return connection;
      },

      destroy: (connection) => {
        if (connection !== void 0) {
          return this.destroyRawConnection(connection);
        }
      },

      validate: (connection) => {
        if (connection.__knex__disposed) {
          this.logger.warn(`Connection Error: ${connection.__knex__disposed}`);
          return false;
        }

        return this.validateConnection(connection);
      },
    });
  },

  initializePool(config = this.config) {
    if (this.pool) {
      this.logger.warn('The pool has already been initialized');
      return;
    }

    const tarnPoolConfig = {
      ...this.getPoolSettings(config.pool),
    };
    // afterCreate is an internal knex param, tarn.js does not support it
    if (tarnPoolConfig.afterCreate) {
      delete tarnPoolConfig.afterCreate;
    }

    this.pool = new Pool(tarnPoolConfig);
  },

  validateConnection(connection) {
    return true;
  },

  // Acquire a connection from the pool.
  async acquireConnection() {
    if (!this.pool) {
      throw new Error('Unable to acquire a connection');
    }
    try {
      const connection = await this.pool.acquire().promise;
      debug$1('acquired connection from pool: %s', connection.__knexUid);
      return connection;
    } catch (error) {
      let convertedError = error;
      if (error instanceof TimeoutError) {
        convertedError = new KnexTimeoutError$3(
          'Knex: Timeout acquiring a connection. The pool is probably full. ' +
            'Are you missing a .transacting(trx) call?'
        );
      }
      throw convertedError;
    }
  },

  // Releases a connection back to the connection pool,
  // returning a promise resolved when the connection is released.
  releaseConnection(connection) {
    debug$1('releasing connection to pool: %s', connection.__knexUid);
    const didRelease = this.pool.release(connection);

    if (!didRelease) {
      debug$1('pool refused connection: %s', connection.__knexUid);
    }

    return Promise.resolve();
  },

  // Destroy the current connection pool for the client.
  destroy(callback) {
    const maybeDestroy = this.pool && this.pool.destroy();

    return Promise.resolve(maybeDestroy)
      .then(() => {
        this.pool = void 0;

        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch((err) => {
        if (typeof callback === 'function') {
          callback(err);
        }

        return Promise.reject(err);
      });
  },

  // Return the database being used by this client.
  database() {
    return this.connectionSettings.database;
  },

  toString() {
    return '[object KnexClient]';
  },

  canCancelQuery: false,

  assertCanCancelQuery() {
    if (!this.canCancelQuery) {
      throw new Error('Query cancelling not supported for this dialect');
    }
  },

  cancelQuery() {
    throw new Error('Query cancelling not supported for this dialect');
  },
});

var client = Client;

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License

//parses a connection string
function parse$2(str) {
  //unix socket
  if (str.charAt(0) === '/') {
    var config = str.split(' ');
    return { host: config[0], database: config[1] };
  }

  // url parse expects spaces encoded as %20
  var result = url.parse(
    / |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)
      ? encodeURI(str).replace(/\%25(\d\d)/g, '%$1')
      : str,
    true
  );
  var config = result.query;
  for (var k in config) {
    if (Array.isArray(config[k])) {
      config[k] = config[k][config[k].length - 1];
    }
  }

  var auth = (result.auth || ':').split(':');
  config.user = auth[0];
  config.password = auth.splice(1).join(':');

  config.port = result.port;
  if (result.protocol == 'socket:') {
    config.host = decodeURI(result.pathname);
    config.database = result.query.db;
    config.client_encoding = result.query.encoding;
    return config;
  }
  if (!config.host) {
    // Only set the host if there is no equivalent query param.
    config.host = result.hostname;
  }

  // If the host is missing it might be a URL-encoded path to a socket.
  var pathname = result.pathname;
  if (!config.host && pathname && /^%2f/i.test(pathname)) {
    var pathnameSplit = pathname.split('/');
    config.host = decodeURIComponent(pathnameSplit[0]);
    pathname = pathnameSplit.splice(1).join('/');
  }
  // result.pathname is not always guaranteed to have a '/' prefix (e.g. relative urls)
  // only strip the slash if it is present.
  if (pathname && pathname.charAt(0) === '/') {
    pathname = pathname.slice(1) || null;
  }
  config.database = pathname && decodeURI(pathname);

  if (config.ssl === 'true' || config.ssl === '1') {
    config.ssl = true;
  }

  if (config.ssl === '0') {
    config.ssl = false;
  }

  if (config.sslcert || config.sslkey || config.sslrootcert) {
    config.ssl = {};
  }

  if (config.sslcert) {
    config.ssl.cert = fs.readFileSync(config.sslcert).toString();
  }

  if (config.sslkey) {
    config.ssl.key = fs.readFileSync(config.sslkey).toString();
  }

  if (config.sslrootcert) {
    config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
  }

  return config;
}

var pgConnectionString = parse$2;

parse$2.parse = parse$2;

const { parse: parse$3 } = pgConnectionString;
const parsePG = parse$3;
const isWindows = process && process.platform && process.platform === 'win32';

var parseConnection = function parseConnectionString(str) {
  const parsed = url.parse(str, true);
  let { protocol } = parsed;
  const isDriveLetter = isWindows && protocol && protocol.length === 2;
  if (protocol === null || isDriveLetter) {
    return {
      client: 'sqlite3',
      connection: {
        filename: str,
      },
    };
  }
  if (protocol.slice(-1) === ':') {
    protocol = protocol.slice(0, -1);
  }

  const isPG = ['postgresql', 'postgres'].includes(protocol);

  return {
    client: protocol,
    connection: isPG ? parsePG(str) : connectionObject(parsed),
  };
};

function connectionObject(parsed) {
  const connection = {};
  let db = parsed.pathname;
  if (db[0] === '/') {
    db = db.slice(1);
  }

  connection.database = db;

  if (parsed.hostname) {
    if (parsed.protocol.indexOf('mssql') === 0) {
      connection.server = parsed.hostname;
    } else {
      connection.host = parsed.hostname;
    }
  }
  if (parsed.port) {
    connection.port = parsed.port;
  }
  if (parsed.auth) {
    const idx = parsed.auth.indexOf(':');
    if (idx !== -1) {
      connection.user = parsed.auth.slice(0, idx);
      if (idx < parsed.auth.length - 1) {
        connection.password = parsed.auth.slice(idx + 1);
      }
    } else {
      connection.user = parsed.auth;
    }
  }
  if (parsed.query) {
    for (const key in parsed.query) {
      connection[key] = parsed.query[key];
    }
  }
  return connection;
}

const fakeClient = {
  formatter(builder) {
    return new formatter(fakeClient, builder);
  },
};

var fakeClient_1 = fakeClient;

const { KnexTimeoutError: KnexTimeoutError$4 } = timeout_1;

const { SUPPORTED_CLIENTS: SUPPORTED_CLIENTS$1 } = constants;
const {
  resolveClientNameWithAliases: resolveClientNameWithAliases$1,
} = helpers;

function Knex(config) {
  // If config is a string, try to parse it
  if (typeof config === 'string') {
    const parsedConfig = Object.assign(parseConnection(config), arguments[2]);
    return new Knex(parsedConfig);
  }

  let Dialect;
  // If user provided no relevant parameters, use generic client
  if (arguments.length === 0 || (!config.client && !config.dialect)) {
    Dialect = client;
  }

  // If user provided Client constructor as a parameter, use it
  else if (
    typeof config.client === 'function' &&
    config.client.prototype instanceof client
  ) {
    Dialect = config.client;
  }

  // If neither applies, let's assume user specified name of a client or dialect as a string
  else {
    const clientName = config.client || config.dialect;
    if (!SUPPORTED_CLIENTS$1.includes(clientName)) {
      throw new Error(
        `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
      );
    }

    const resolvedClientName = resolveClientNameWithAliases$1(clientName);
    Dialect = commonjsRequire();
  }

  // If config connection parameter is passed as string, try to parse it
  if (typeof config.connection === 'string') {
    config = Object.assign({}, config, {
      connection: parseConnection(config.connection).connection,
    });
  }
  const newKnex = makeKnex_1(new Dialect(config));
  if (config.userParams) {
    newKnex.userParams = config.userParams;
  }
  return newKnex;
}

// Expose Client on the main Knex namespace.
Knex.Client = client;

Knex.KnexTimeoutError = KnexTimeoutError$4;

Knex.QueryBuilder = {
  extend: function(methodName, fn) {
    builder.extend(methodName, fn);
    methods.push(methodName);
  },
};

/* eslint no-console:0 */

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = (sql, bindings) => {
  console.warn(
    'global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)'
  );
  return new raw(fakeClient_1).set(sql, bindings);
};

var knex = Knex;

var lib = knex;

// Knex.js
// --------------
//     (c) 2013-present Tim Griesser
//     Knex may be freely distributed under the MIT license.
//     For details and documentation:
//     http://knexjs.org

var knex$1 = lib;

export default knex$1;
