var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports2, module2) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/vary/index.js
var require_vary = __commonJS({
  "node_modules/vary/index.js"(exports2, module2) {
    "use strict";
    module2.exports = vary;
    module2.exports.append = append;
    var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    function append(header, field) {
      if (typeof header !== "string") {
        throw new TypeError("header argument is required");
      }
      if (!field) {
        throw new TypeError("field argument is required");
      }
      var fields = !Array.isArray(field) ? parse(String(field)) : field;
      for (var j = 0; j < fields.length; j++) {
        if (!FIELD_NAME_REGEXP.test(fields[j])) {
          throw new TypeError("field argument contains an invalid header name");
        }
      }
      if (header === "*") {
        return header;
      }
      var val = header;
      var vals = parse(header.toLowerCase());
      if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
        return "*";
      }
      for (var i = 0; i < fields.length; i++) {
        var fld = fields[i].toLowerCase();
        if (vals.indexOf(fld) === -1) {
          vals.push(fld);
          val = val ? val + ", " + fields[i] : fields[i];
        }
      }
      return val;
    }
    function parse(header) {
      var end = 0;
      var list = [];
      var start = 0;
      for (var i = 0, len = header.length; i < len; i++) {
        switch (header.charCodeAt(i)) {
          case 32:
            if (start === end) {
              start = end = i + 1;
            }
            break;
          case 44:
            list.push(header.substring(start, end));
            start = end = i + 1;
            break;
          default:
            end = i + 1;
            break;
        }
      }
      list.push(header.substring(start, end));
      return list;
    }
    function vary(res, field) {
      if (!res || !res.getHeader || !res.setHeader) {
        throw new TypeError("res argument is required");
      }
      var val = res.getHeader("Vary") || "";
      var header = Array.isArray(val) ? val.join(", ") : String(val);
      if (val = append(header, field)) {
        res.setHeader("Vary", val);
      }
    }
  }
});

// node_modules/cors/lib/index.js
var require_lib = __commonJS({
  "node_modules/cors/lib/index.js"(exports2, module2) {
    (function() {
      "use strict";
      var assign = require_object_assign();
      var vary = require_vary();
      var defaults = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
      };
      function isString(s) {
        return typeof s === "string" || s instanceof String;
      }
      function isOriginAllowed(origin, allowedOrigin) {
        if (Array.isArray(allowedOrigin)) {
          for (var i = 0; i < allowedOrigin.length; ++i) {
            if (isOriginAllowed(origin, allowedOrigin[i])) {
              return true;
            }
          }
          return false;
        } else if (isString(allowedOrigin)) {
          return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        } else {
          return !!allowedOrigin;
        }
      }
      function configureOrigin(options, req) {
        var requestOrigin = req.headers.origin, headers = [], isAllowed;
        if (!options.origin || options.origin === "*") {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: "*"
          }]);
        } else if (isString(options.origin)) {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: options.origin
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        } else {
          isAllowed = isOriginAllowed(requestOrigin, options.origin);
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: isAllowed ? requestOrigin : false
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        }
        return headers;
      }
      function configureMethods(options) {
        var methods = options.methods;
        if (methods.join) {
          methods = options.methods.join(",");
        }
        return {
          key: "Access-Control-Allow-Methods",
          value: methods
        };
      }
      function configureCredentials(options) {
        if (options.credentials === true) {
          return {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          };
        }
        return null;
      }
      function configureAllowedHeaders(options, req) {
        var allowedHeaders = options.allowedHeaders || options.headers;
        var headers = [];
        if (!allowedHeaders) {
          allowedHeaders = req.headers["access-control-request-headers"];
          headers.push([{
            key: "Vary",
            value: "Access-Control-Request-Headers"
          }]);
        } else if (allowedHeaders.join) {
          allowedHeaders = allowedHeaders.join(",");
        }
        if (allowedHeaders && allowedHeaders.length) {
          headers.push([{
            key: "Access-Control-Allow-Headers",
            value: allowedHeaders
          }]);
        }
        return headers;
      }
      function configureExposedHeaders(options) {
        var headers = options.exposedHeaders;
        if (!headers) {
          return null;
        } else if (headers.join) {
          headers = headers.join(",");
        }
        if (headers && headers.length) {
          return {
            key: "Access-Control-Expose-Headers",
            value: headers
          };
        }
        return null;
      }
      function configureMaxAge(options) {
        var maxAge = (typeof options.maxAge === "number" || options.maxAge) && options.maxAge.toString();
        if (maxAge && maxAge.length) {
          return {
            key: "Access-Control-Max-Age",
            value: maxAge
          };
        }
        return null;
      }
      function applyHeaders(headers, res) {
        for (var i = 0, n = headers.length; i < n; i++) {
          var header = headers[i];
          if (header) {
            if (Array.isArray(header)) {
              applyHeaders(header, res);
            } else if (header.key === "Vary" && header.value) {
              vary(res, header.value);
            } else if (header.value) {
              res.setHeader(header.key, header.value);
            }
          }
        }
      }
      function cors2(options, req, res, next) {
        var headers = [], method = req.method && req.method.toUpperCase && req.method.toUpperCase();
        if (method === "OPTIONS") {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options, req));
          headers.push(configureMethods(options, req));
          headers.push(configureAllowedHeaders(options, req));
          headers.push(configureMaxAge(options, req));
          headers.push(configureExposedHeaders(options, req));
          applyHeaders(headers, res);
          if (options.preflightContinue) {
            next();
          } else {
            res.statusCode = options.optionsSuccessStatus;
            res.setHeader("Content-Length", "0");
            res.end();
          }
        } else {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options, req));
          headers.push(configureExposedHeaders(options, req));
          applyHeaders(headers, res);
          next();
        }
      }
      function middlewareWrapper(o) {
        var optionsCallback = null;
        if (typeof o === "function") {
          optionsCallback = o;
        } else {
          optionsCallback = function(req, cb) {
            cb(null, o);
          };
        }
        return function corsMiddleware(req, res, next) {
          optionsCallback(req, function(err, options) {
            if (err) {
              next(err);
            } else {
              var corsOptions = assign({}, defaults, options);
              var originCallback = null;
              if (corsOptions.origin && typeof corsOptions.origin === "function") {
                originCallback = corsOptions.origin;
              } else if (corsOptions.origin) {
                originCallback = function(origin, cb) {
                  cb(null, corsOptions.origin);
                };
              }
              if (originCallback) {
                originCallback(req.headers.origin, function(err2, origin) {
                  if (err2 || !origin) {
                    next(err2);
                  } else {
                    corsOptions.origin = origin;
                    cors2(corsOptions, req, res, next);
                  }
                });
              } else {
                next();
              }
            }
          });
        };
      }
      module2.exports = middlewareWrapper;
    })();
  }
});

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.7",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs4 = require("fs");
    var path6 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs4.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path6.resolve(process.cwd(), ".env.vault");
      }
      if (fs4.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path6.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path6.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path7 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs4.readFileSync(path7, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path7} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports2) {
    "use strict";
    exports2.parse = parse;
    exports2.serialize = serialize;
    var __toString = Object.prototype.toString;
    var __hasOwnProperty = Object.prototype.hasOwnProperty;
    var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    function parse(str, opt) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var len = str.length;
      if (len < 2) return obj;
      var dec = opt && opt.decode || decode;
      var index = 0;
      var eqIdx = 0;
      var endIdx = 0;
      do {
        eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) break;
        endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = len;
        } else if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var keyStartIdx = startIndex(str, index, eqIdx);
        var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        var key = str.slice(keyStartIdx, keyEndIdx);
        if (!__hasOwnProperty.call(obj, key)) {
          var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          var valEndIdx = endIndex(str, endIdx, valStartIdx);
          if (str.charCodeAt(valStartIdx) === 34 && str.charCodeAt(valEndIdx - 1) === 34) {
            valStartIdx++;
            valEndIdx--;
          }
          var val = str.slice(valStartIdx, valEndIdx);
          obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        var code = str.charCodeAt(index);
        if (code !== 32 && code !== 9) return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        var code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9) return index + 1;
      }
      return min;
    }
    function serialize(name, val, opt) {
      var enc = opt && opt.encode || encodeURIComponent;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (!opt) return str;
      if (null != opt.maxAge) {
        var maxAge = Math.floor(opt.maxAge);
        if (!isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + maxAge;
      }
      if (opt.domain) {
        if (!domainValueRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!pathValueRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.partitioned) {
        str += "; Partitioned";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// node_modules/cookie-signature/index.js
var require_cookie_signature = __commonJS({
  "node_modules/cookie-signature/index.js"(exports2) {
    var crypto = require("crypto");
    exports2.sign = function(val, secret) {
      if ("string" != typeof val) throw new TypeError("Cookie value must be provided as a string.");
      if ("string" != typeof secret) throw new TypeError("Secret string must be provided.");
      return val + "." + crypto.createHmac("sha256", secret).update(val).digest("base64").replace(/\=+$/, "");
    };
    exports2.unsign = function(val, secret) {
      if ("string" != typeof val) throw new TypeError("Signed cookie string must be provided.");
      if ("string" != typeof secret) throw new TypeError("Secret string must be provided.");
      var str = val.slice(0, val.lastIndexOf(".")), mac = exports2.sign(str, secret);
      return sha1(mac) == sha1(val) ? str : false;
    };
    function sha1(str) {
      return crypto.createHash("sha1").update(str).digest("hex");
    }
  }
});

// node_modules/cookie-parser/index.js
var require_cookie_parser = __commonJS({
  "node_modules/cookie-parser/index.js"(exports2, module2) {
    "use strict";
    var cookie = require_cookie();
    var signature = require_cookie_signature();
    module2.exports = cookieParser2;
    module2.exports.JSONCookie = JSONCookie;
    module2.exports.JSONCookies = JSONCookies;
    module2.exports.signedCookie = signedCookie;
    module2.exports.signedCookies = signedCookies;
    function cookieParser2(secret, options) {
      var secrets = !secret || Array.isArray(secret) ? secret || [] : [secret];
      return function cookieParser3(req, res, next) {
        if (req.cookies) {
          return next();
        }
        var cookies = req.headers.cookie;
        req.secret = secrets[0];
        req.cookies = /* @__PURE__ */ Object.create(null);
        req.signedCookies = /* @__PURE__ */ Object.create(null);
        if (!cookies) {
          return next();
        }
        req.cookies = cookie.parse(cookies, options);
        if (secrets.length !== 0) {
          req.signedCookies = signedCookies(req.cookies, secrets);
          req.signedCookies = JSONCookies(req.signedCookies);
        }
        req.cookies = JSONCookies(req.cookies);
        next();
      };
    }
    function JSONCookie(str) {
      if (typeof str !== "string" || str.substr(0, 2) !== "j:") {
        return void 0;
      }
      try {
        return JSON.parse(str.slice(2));
      } catch (err) {
        return void 0;
      }
    }
    function JSONCookies(obj) {
      var cookies = Object.keys(obj);
      var key;
      var val;
      for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = JSONCookie(obj[key]);
        if (val) {
          obj[key] = val;
        }
      }
      return obj;
    }
    function signedCookie(str, secret) {
      if (typeof str !== "string") {
        return void 0;
      }
      if (str.substr(0, 2) !== "s:") {
        return str;
      }
      var secrets = !secret || Array.isArray(secret) ? secret || [] : [secret];
      for (var i = 0; i < secrets.length; i++) {
        var val = signature.unsign(str.slice(2), secrets[i]);
        if (val !== false) {
          return val;
        }
      }
      return false;
    }
    function signedCookies(obj, secret) {
      var cookies = Object.keys(obj);
      var dec;
      var key;
      var ret = /* @__PURE__ */ Object.create(null);
      var val;
      for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = obj[key];
        dec = signedCookie(val, secret);
        if (val !== dec) {
          ret[key] = dec;
          delete obj[key];
        }
      }
      return ret;
    }
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/jws/lib/data-stream.js
var require_data_stream = __commonJS({
  "node_modules/jws/lib/data-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = require("stream");
    var util = require("util");
    function DataStream(data) {
      this.buffer = null;
      this.writable = true;
      this.readable = true;
      if (!data) {
        this.buffer = Buffer2.alloc(0);
        return this;
      }
      if (typeof data.pipe === "function") {
        this.buffer = Buffer2.alloc(0);
        data.pipe(this);
        return this;
      }
      if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick(function() {
          this.emit("end", data);
          this.readable = false;
          this.emit("close");
        }.bind(this));
        return this;
      }
      throw new TypeError("Unexpected data type (" + typeof data + ")");
    }
    util.inherits(DataStream, Stream);
    DataStream.prototype.write = function write(data) {
      this.buffer = Buffer2.concat([this.buffer, Buffer2.from(data)]);
      this.emit("data", data);
    };
    DataStream.prototype.end = function end(data) {
      if (data)
        this.write(data);
      this.emit("end", data);
      this.emit("close");
      this.writable = false;
      this.readable = false;
    };
    module2.exports = DataStream;
  }
});

// node_modules/buffer-equal-constant-time/index.js
var require_buffer_equal_constant_time = __commonJS({
  "node_modules/buffer-equal-constant-time/index.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require("buffer").Buffer;
    var SlowBuffer = require("buffer").SlowBuffer;
    module2.exports = bufferEq;
    function bufferEq(a, b) {
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      var c = 0;
      for (var i = 0; i < a.length; i++) {
        c |= a[i] ^ b[i];
      }
      return c === 0;
    }
    bufferEq.install = function() {
      Buffer2.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
      };
    };
    var origBufEqual = Buffer2.prototype.equal;
    var origSlowBufEqual = SlowBuffer.prototype.equal;
    bufferEq.restore = function() {
      Buffer2.prototype.equal = origBufEqual;
      SlowBuffer.prototype.equal = origSlowBufEqual;
    };
  }
});

// node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js
var require_param_bytes_for_alg = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js"(exports2, module2) {
    "use strict";
    function getParamSize(keySize) {
      var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }
    var paramBytesForAlg = {
      ES256: getParamSize(256),
      ES384: getParamSize(384),
      ES512: getParamSize(521)
    };
    function getParamBytesForAlg(alg) {
      var paramBytes = paramBytesForAlg[alg];
      if (paramBytes) {
        return paramBytes;
      }
      throw new Error('Unknown algorithm "' + alg + '"');
    }
    module2.exports = getParamBytesForAlg;
  }
});

// node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js
var require_ecdsa_sig_formatter = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var getParamBytesForAlg = require_param_bytes_for_alg();
    var MAX_OCTET = 128;
    var CLASS_UNIVERSAL = 0;
    var PRIMITIVE_BIT = 32;
    var TAG_SEQ = 16;
    var TAG_INT = 2;
    var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
    var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
    function base64Url(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function signatureAsBuffer(signature) {
      if (Buffer2.isBuffer(signature)) {
        return signature;
      } else if ("string" === typeof signature) {
        return Buffer2.from(signature, "base64");
      }
      throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
    }
    function derToJose(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var maxEncodedParamLength = paramBytes + 1;
      var inputLength = signature.length;
      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }
      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }
      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }
      var rLength = signature[offset++];
      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }
      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var rOffset = offset;
      offset += rLength;
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }
      var sLength = signature[offset++];
      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }
      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var sOffset = offset;
      offset += sLength;
      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }
      var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
      var dst = Buffer2.allocUnsafe(rPadding + rLength + sPadding + sLength);
      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
      offset = paramBytes;
      for (var o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
      dst = dst.toString("base64");
      dst = base64Url(dst);
      return dst;
    }
    function countPadding(buf, start, stop) {
      var padding = 0;
      while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
      }
      var needsSign = buf[start + padding] >= MAX_OCTET;
      if (needsSign) {
        --padding;
      }
      return padding;
    }
    function joseToDer(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var signatureBytes = signature.length;
      if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
      }
      var rPadding = countPadding(signature, 0, paramBytes);
      var sPadding = countPadding(signature, paramBytes, signature.length);
      var rLength = paramBytes - rPadding;
      var sLength = paramBytes - sPadding;
      var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
      var shortLength = rsBytes < MAX_OCTET;
      var dst = Buffer2.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
      var offset = 0;
      dst[offset++] = ENCODED_TAG_SEQ;
      if (shortLength) {
        dst[offset++] = rsBytes;
      } else {
        dst[offset++] = MAX_OCTET | 1;
        dst[offset++] = rsBytes & 255;
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = rLength;
      if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
      } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = sLength;
      if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
      } else {
        signature.copy(dst, offset, paramBytes + sPadding);
      }
      return dst;
    }
    module2.exports = {
      derToJose,
      joseToDer
    };
  }
});

// node_modules/jwa/index.js
var require_jwa = __commonJS({
  "node_modules/jwa/index.js"(exports2, module2) {
    var bufferEqual = require_buffer_equal_constant_time();
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var formatEcdsa = require_ecdsa_sig_formatter();
    var util = require("util");
    var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
    var MSG_INVALID_SECRET = "secret must be a string or buffer";
    var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
    var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
    var supportsKeyObjects = typeof crypto.createPublicKey === "function";
    if (supportsKeyObjects) {
      MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
      MSG_INVALID_SECRET += "or a KeyObject";
    }
    function checkIsPublicKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
    }
    function checkIsPrivateKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (typeof key === "object") {
        return;
      }
      throw typeError(MSG_INVALID_SIGNER_KEY);
    }
    function checkIsSecretKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return key;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (key.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
      }
    }
    function fromBase64(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function toBase64(base64url) {
      base64url = base64url.toString();
      var padding = 4 - base64url.length % 4;
      if (padding !== 4) {
        for (var i = 0; i < padding; ++i) {
          base64url += "=";
        }
      }
      return base64url.replace(/\-/g, "+").replace(/_/g, "/");
    }
    function typeError(template) {
      var args = [].slice.call(arguments, 1);
      var errMsg = util.format.bind(util, template).apply(null, args);
      return new TypeError(errMsg);
    }
    function bufferOrString(obj) {
      return Buffer2.isBuffer(obj) || typeof obj === "string";
    }
    function normalizeInput(thing) {
      if (!bufferOrString(thing))
        thing = JSON.stringify(thing);
      return thing;
    }
    function createHmacSigner(bits) {
      return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac("sha" + bits, secret);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
      };
    }
    function createHmacVerifier(bits) {
      return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return bufferEqual(Buffer2.from(signature), Buffer2.from(computedSig));
      };
    }
    function createKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
      };
    }
    function createKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
      };
    }
    function createPSSKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
      };
    }
    function createPSSKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
      };
    }
    function createECDSASigner(bits) {
      var inner = createKeySigner(bits);
      return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
      };
    }
    function createECDSAVerifer(bits) {
      var inner = createKeyVerifier(bits);
      return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
      };
    }
    function createNoneSigner() {
      return function sign() {
        return "";
      };
    }
    function createNoneVerifier() {
      return function verify(thing, signature) {
        return signature === "";
      };
    }
    module2.exports = function jwa(algorithm) {
      var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
      };
      var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
      };
      var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
      if (!match)
        throw typeError(MSG_INVALID_ALGORITHM, algorithm);
      var algo = (match[1] || match[3]).toLowerCase();
      var bits = match[2];
      return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
      };
    };
  }
});

// node_modules/jws/lib/tostring.js
var require_tostring = __commonJS({
  "node_modules/jws/lib/tostring.js"(exports2, module2) {
    var Buffer2 = require("buffer").Buffer;
    module2.exports = function toString(obj) {
      if (typeof obj === "string")
        return obj;
      if (typeof obj === "number" || Buffer2.isBuffer(obj))
        return obj.toString();
      return JSON.stringify(obj);
    };
  }
});

// node_modules/jws/lib/sign-stream.js
var require_sign_stream = __commonJS({
  "node_modules/jws/lib/sign-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util = require("util");
    function base64url(string, encoding) {
      return Buffer2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function jwsSecuredInput(header, payload, encoding) {
      encoding = encoding || "utf8";
      var encodedHeader = base64url(toString(header), "binary");
      var encodedPayload = base64url(toString(payload), encoding);
      return util.format("%s.%s", encodedHeader, encodedPayload);
    }
    function jwsSign(opts) {
      var header = opts.header;
      var payload = opts.payload;
      var secretOrKey = opts.secret || opts.privateKey;
      var encoding = opts.encoding;
      var algo = jwa(header.alg);
      var securedInput = jwsSecuredInput(header, payload, encoding);
      var signature = algo.sign(securedInput, secretOrKey);
      return util.format("%s.%s", securedInput, signature);
    }
    function SignStream(opts) {
      var secret = opts.secret || opts.privateKey || opts.key;
      var secretStream = new DataStream(secret);
      this.readable = true;
      this.header = opts.header;
      this.encoding = opts.encoding;
      this.secret = this.privateKey = this.key = secretStream;
      this.payload = new DataStream(opts.payload);
      this.secret.once("close", function() {
        if (!this.payload.writable && this.readable)
          this.sign();
      }.bind(this));
      this.payload.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.sign();
      }.bind(this));
    }
    util.inherits(SignStream, Stream);
    SignStream.prototype.sign = function sign() {
      try {
        var signature = jwsSign({
          header: this.header,
          payload: this.payload.buffer,
          secret: this.secret.buffer,
          encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    SignStream.sign = jwsSign;
    module2.exports = SignStream;
  }
});

// node_modules/jws/lib/verify-stream.js
var require_verify_stream = __commonJS({
  "node_modules/jws/lib/verify-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util = require("util");
    var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
    function isObject(thing) {
      return Object.prototype.toString.call(thing) === "[object Object]";
    }
    function safeJsonParse(thing) {
      if (isObject(thing))
        return thing;
      try {
        return JSON.parse(thing);
      } catch (e) {
        return void 0;
      }
    }
    function headerFromJWS(jwsSig) {
      var encodedHeader = jwsSig.split(".", 1)[0];
      return safeJsonParse(Buffer2.from(encodedHeader, "base64").toString("binary"));
    }
    function securedInputFromJWS(jwsSig) {
      return jwsSig.split(".", 2).join(".");
    }
    function signatureFromJWS(jwsSig) {
      return jwsSig.split(".")[2];
    }
    function payloadFromJWS(jwsSig, encoding) {
      encoding = encoding || "utf8";
      var payload = jwsSig.split(".")[1];
      return Buffer2.from(payload, "base64").toString(encoding);
    }
    function isValidJws(string) {
      return JWS_REGEX.test(string) && !!headerFromJWS(string);
    }
    function jwsVerify(jwsSig, algorithm, secretOrKey) {
      if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
      }
      jwsSig = toString(jwsSig);
      var signature = signatureFromJWS(jwsSig);
      var securedInput = securedInputFromJWS(jwsSig);
      var algo = jwa(algorithm);
      return algo.verify(securedInput, signature, secretOrKey);
    }
    function jwsDecode(jwsSig, opts) {
      opts = opts || {};
      jwsSig = toString(jwsSig);
      if (!isValidJws(jwsSig))
        return null;
      var header = headerFromJWS(jwsSig);
      if (!header)
        return null;
      var payload = payloadFromJWS(jwsSig);
      if (header.typ === "JWT" || opts.json)
        payload = JSON.parse(payload, opts.encoding);
      return {
        header,
        payload,
        signature: signatureFromJWS(jwsSig)
      };
    }
    function VerifyStream(opts) {
      opts = opts || {};
      var secretOrKey = opts.secret || opts.publicKey || opts.key;
      var secretStream = new DataStream(secretOrKey);
      this.readable = true;
      this.algorithm = opts.algorithm;
      this.encoding = opts.encoding;
      this.secret = this.publicKey = this.key = secretStream;
      this.signature = new DataStream(opts.signature);
      this.secret.once("close", function() {
        if (!this.signature.writable && this.readable)
          this.verify();
      }.bind(this));
      this.signature.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.verify();
      }.bind(this));
    }
    util.inherits(VerifyStream, Stream);
    VerifyStream.prototype.verify = function verify() {
      try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    VerifyStream.decode = jwsDecode;
    VerifyStream.isValid = isValidJws;
    VerifyStream.verify = jwsVerify;
    module2.exports = VerifyStream;
  }
});

// node_modules/jws/index.js
var require_jws = __commonJS({
  "node_modules/jws/index.js"(exports2) {
    var SignStream = require_sign_stream();
    var VerifyStream = require_verify_stream();
    var ALGORITHMS = [
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512"
    ];
    exports2.ALGORITHMS = ALGORITHMS;
    exports2.sign = SignStream.sign;
    exports2.verify = VerifyStream.verify;
    exports2.decode = VerifyStream.decode;
    exports2.isValid = VerifyStream.isValid;
    exports2.createSign = function createSign(opts) {
      return new SignStream(opts);
    };
    exports2.createVerify = function createVerify(opts) {
      return new VerifyStream(opts);
    };
  }
});

// node_modules/jsonwebtoken/decode.js
var require_decode = __commonJS({
  "node_modules/jsonwebtoken/decode.js"(exports2, module2) {
    var jws = require_jws();
    module2.exports = function(jwt3, options) {
      options = options || {};
      var decoded = jws.decode(jwt3, options);
      if (!decoded) {
        return null;
      }
      var payload = decoded.payload;
      if (typeof payload === "string") {
        try {
          var obj = JSON.parse(payload);
          if (obj !== null && typeof obj === "object") {
            payload = obj;
          }
        } catch (e) {
        }
      }
      if (options.complete === true) {
        return {
          header: decoded.header,
          payload,
          signature: decoded.signature
        };
      }
      return payload;
    };
  }
});

// node_modules/jsonwebtoken/lib/JsonWebTokenError.js
var require_JsonWebTokenError = __commonJS({
  "node_modules/jsonwebtoken/lib/JsonWebTokenError.js"(exports2, module2) {
    var JsonWebTokenError = function(message, error) {
      Error.call(this, message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "JsonWebTokenError";
      this.message = message;
      if (error) this.inner = error;
    };
    JsonWebTokenError.prototype = Object.create(Error.prototype);
    JsonWebTokenError.prototype.constructor = JsonWebTokenError;
    module2.exports = JsonWebTokenError;
  }
});

// node_modules/jsonwebtoken/lib/NotBeforeError.js
var require_NotBeforeError = __commonJS({
  "node_modules/jsonwebtoken/lib/NotBeforeError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = function(message, date) {
      JsonWebTokenError.call(this, message);
      this.name = "NotBeforeError";
      this.date = date;
    };
    NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
    NotBeforeError.prototype.constructor = NotBeforeError;
    module2.exports = NotBeforeError;
  }
});

// node_modules/jsonwebtoken/lib/TokenExpiredError.js
var require_TokenExpiredError = __commonJS({
  "node_modules/jsonwebtoken/lib/TokenExpiredError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var TokenExpiredError = function(message, expiredAt) {
      JsonWebTokenError.call(this, message);
      this.name = "TokenExpiredError";
      this.expiredAt = expiredAt;
    };
    TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
    TokenExpiredError.prototype.constructor = TokenExpiredError;
    module2.exports = TokenExpiredError;
  }
});

// node_modules/jsonwebtoken/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/jsonwebtoken/node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
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
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/jsonwebtoken/lib/timespan.js
var require_timespan = __commonJS({
  "node_modules/jsonwebtoken/lib/timespan.js"(exports2, module2) {
    var ms = require_ms();
    module2.exports = function(time, iat) {
      var timestamp = iat || Math.floor(Date.now() / 1e3);
      if (typeof time === "string") {
        var milliseconds = ms(time);
        if (typeof milliseconds === "undefined") {
          return;
        }
        return Math.floor(timestamp + milliseconds / 1e3);
      } else if (typeof time === "number") {
        return timestamp + time;
      } else {
        return;
      }
    };
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports2, module2) {
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports2, module2) {
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports2, module2) {
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports2, module2) {
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports2, module2) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports2, module2) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, safeSrc: src, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const r = new RegExp(`^${this.options.loose ? src[t.PRERELEASELOOSE] : src[t.PRERELEASE]}$`);
            const match = `-${identifier}`.match(r);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports2, module2) {
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports2, module2) {
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module2.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports2, module2) {
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports2, module2) {
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports2, module2) {
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module2.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports2, module2) {
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module2.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports2, module2) {
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module2.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports2, module2) {
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module2.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports2, module2) {
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports2, module2) {
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports2, module2) {
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module2.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports2, module2) {
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module2.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports2, module2) {
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports2, module2) {
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module2.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports2, module2) {
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module2.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports2, module2) {
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports2, module2) {
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports2, module2) {
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports2, module2) {
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports2, module2) {
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports2, module2) {
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports2, module2) {
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports2, module2) {
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports2, module2) {
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports2, module2) {
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports2, module2) {
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports2, module2) {
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports2, module2) {
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module2.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports2, module2) {
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports2, module2) {
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports2, module2) {
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module2.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports2, module2) {
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module2.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports2, module2) {
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module2.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports2, module2) {
    var satisfies = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports2, module2) {
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module2.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports2, module2) {
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module2.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js
var require_asymmetricKeyDetailsSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=15.7.0");
  }
});

// node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js
var require_rsaPssKeyDetailsSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=16.9.0");
  }
});

// node_modules/jsonwebtoken/lib/validateAsymmetricKey.js
var require_validateAsymmetricKey = __commonJS({
  "node_modules/jsonwebtoken/lib/validateAsymmetricKey.js"(exports2, module2) {
    var ASYMMETRIC_KEY_DETAILS_SUPPORTED = require_asymmetricKeyDetailsSupported();
    var RSA_PSS_KEY_DETAILS_SUPPORTED = require_rsaPssKeyDetailsSupported();
    var allowedAlgorithmsForKeys = {
      "ec": ["ES256", "ES384", "ES512"],
      "rsa": ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    };
    var allowedCurves = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
    module2.exports = function(algorithm, key) {
      if (!algorithm || !key) return;
      const keyType = key.asymmetricKeyType;
      if (!keyType) return;
      const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
      if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
      }
      if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
      }
      if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch (keyType) {
          case "ec":
            const keyCurve = key.asymmetricKeyDetails.namedCurve;
            const allowedCurve = allowedCurves[algorithm];
            if (keyCurve !== allowedCurve) {
              throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
            }
            break;
          case "rsa-pss":
            if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
              const length = parseInt(algorithm.slice(-3), 10);
              const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
              if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
              }
              if (saltLength !== void 0 && saltLength > length >> 3) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
              }
            }
            break;
        }
      }
    };
  }
});

// node_modules/jsonwebtoken/lib/psSupported.js
var require_psSupported = __commonJS({
  "node_modules/jsonwebtoken/lib/psSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");
  }
});

// node_modules/jsonwebtoken/verify.js
var require_verify = __commonJS({
  "node_modules/jsonwebtoken/verify.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = require_NotBeforeError();
    var TokenExpiredError = require_TokenExpiredError();
    var decode = require_decode();
    var timespan = require_timespan();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var PS_SUPPORTED = require_psSupported();
    var jws = require_jws();
    var { KeyObject, createSecretKey, createPublicKey } = require("crypto");
    var PUB_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var EC_KEY_ALGS = ["ES256", "ES384", "ES512"];
    var RSA_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var HS_ALGS = ["HS256", "HS384", "HS512"];
    if (PS_SUPPORTED) {
      PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
      RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    }
    module2.exports = function(jwtString, secretOrPublicKey, options, callback) {
      if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }
      options = Object.assign({}, options);
      let done;
      if (callback) {
        done = callback;
      } else {
        done = function(err, data) {
          if (err) throw err;
          return data;
        };
      }
      if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
      }
      if (options.nonce !== void 0 && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
      }
      if (options.allowInvalidAsymmetricKeyTypes !== void 0 && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
      }
      const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1e3);
      if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
      }
      if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
      }
      const parts = jwtString.split(".");
      if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
      }
      let decodedToken;
      try {
        decodedToken = decode(jwtString, { complete: true });
      } catch (err) {
        return done(err);
      }
      if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
      }
      const header = decodedToken.header;
      let getSecret;
      if (typeof secretOrPublicKey === "function") {
        if (!callback) {
          return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
      } else {
        getSecret = function(header2, secretCallback) {
          return secretCallback(null, secretOrPublicKey);
        };
      }
      return getSecret(header, function(err, secretOrPublicKey2) {
        if (err) {
          return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey2) {
          return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey2) {
          return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
          return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey2 != null && !(secretOrPublicKey2 instanceof KeyObject)) {
          try {
            secretOrPublicKey2 = createPublicKey(secretOrPublicKey2);
          } catch (_) {
            try {
              secretOrPublicKey2 = createSecretKey(typeof secretOrPublicKey2 === "string" ? Buffer.from(secretOrPublicKey2) : secretOrPublicKey2);
            } catch (_2) {
              return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
            }
          }
        }
        if (!options.algorithms) {
          if (secretOrPublicKey2.type === "secret") {
            options.algorithms = HS_ALGS;
          } else if (["rsa", "rsa-pss"].includes(secretOrPublicKey2.asymmetricKeyType)) {
            options.algorithms = RSA_KEY_ALGS;
          } else if (secretOrPublicKey2.asymmetricKeyType === "ec") {
            options.algorithms = EC_KEY_ALGS;
          } else {
            options.algorithms = PUB_KEY_ALGS;
          }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
          return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey2.type !== "secret") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey2.type !== "public") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
          try {
            validateAsymmetricKey(header.alg, secretOrPublicKey2);
          } catch (e) {
            return done(e);
          }
        }
        let valid;
        try {
          valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey2);
        } catch (e) {
          return done(e);
        }
        if (!valid) {
          return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
          if (typeof payload.nbf !== "number") {
            return done(new JsonWebTokenError("invalid nbf value"));
          }
          if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
            return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1e3)));
          }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
          if (typeof payload.exp !== "number") {
            return done(new JsonWebTokenError("invalid exp value"));
          }
          if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1e3)));
          }
        }
        if (options.audience) {
          const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
          const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
          const match = target.some(function(targetAudience) {
            return audiences.some(function(audience) {
              return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
            });
          });
          if (!match) {
            return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
          }
        }
        if (options.issuer) {
          const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
          if (invalid_issuer) {
            return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
          }
        }
        if (options.subject) {
          if (payload.sub !== options.subject) {
            return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
          }
        }
        if (options.jwtid) {
          if (payload.jti !== options.jwtid) {
            return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
          }
        }
        if (options.nonce) {
          if (payload.nonce !== options.nonce) {
            return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
          }
        }
        if (options.maxAge) {
          if (typeof payload.iat !== "number") {
            return done(new JsonWebTokenError("iat required when maxAge is specified"));
          }
          const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
          if (typeof maxAgeTimestamp === "undefined") {
            return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
          }
          if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1e3)));
          }
        }
        if (options.complete === true) {
          const signature = decodedToken.signature;
          return done(null, {
            header,
            payload,
            signature
          });
        }
        return done(null, payload);
      });
    };
  }
});

// node_modules/lodash.includes/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.includes/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var freeParseInt = parseInt;
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeKeys = overArg(Object.keys, Object);
    var nativeMax = Math.max;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
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
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }
    module2.exports = includes;
  }
});

// node_modules/lodash.isboolean/index.js
var require_lodash2 = __commonJS({
  "node_modules/lodash.isboolean/index.js"(exports2, module2) {
    var boolTag = "[object Boolean]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isBoolean(value) {
      return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    module2.exports = isBoolean;
  }
});

// node_modules/lodash.isinteger/index.js
var require_lodash3 = __commonJS({
  "node_modules/lodash.isinteger/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isInteger(value) {
      return typeof value == "number" && value == toInteger(value);
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
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
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = isInteger;
  }
});

// node_modules/lodash.isnumber/index.js
var require_lodash4 = __commonJS({
  "node_modules/lodash.isnumber/index.js"(exports2, module2) {
    var numberTag = "[object Number]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isNumber(value) {
      return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
    }
    module2.exports = isNumber;
  }
});

// node_modules/lodash.isplainobject/index.js
var require_lodash5 = __commonJS({
  "node_modules/lodash.isplainobject/index.js"(exports2, module2) {
    var objectTag = "[object Object]";
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module2.exports = isPlainObject;
  }
});

// node_modules/lodash.isstring/index.js
var require_lodash6 = __commonJS({
  "node_modules/lodash.isstring/index.js"(exports2, module2) {
    var stringTag = "[object String]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var isArray = Array.isArray;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    module2.exports = isString;
  }
});

// node_modules/lodash.once/index.js
var require_lodash7 = __commonJS({
  "node_modules/lodash.once/index.js"(exports2, module2) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function before(n, func) {
      var result;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = void 0;
        }
        return result;
      };
    }
    function once(func) {
      return before(2, func);
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
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
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = once;
  }
});

// node_modules/jsonwebtoken/sign.js
var require_sign = __commonJS({
  "node_modules/jsonwebtoken/sign.js"(exports2, module2) {
    var timespan = require_timespan();
    var PS_SUPPORTED = require_psSupported();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var jws = require_jws();
    var includes = require_lodash();
    var isBoolean = require_lodash2();
    var isInteger = require_lodash3();
    var isNumber = require_lodash4();
    var isPlainObject = require_lodash5();
    var isString = require_lodash6();
    var once = require_lodash7();
    var { KeyObject, createSecretKey, createPrivateKey } = require("crypto");
    var SUPPORTED_ALGS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (PS_SUPPORTED) {
      SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
    }
    var sign_options_schema = {
      expiresIn: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
      notBefore: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
      audience: { isValid: function(value) {
        return isString(value) || Array.isArray(value);
      }, message: '"audience" must be a string or array' },
      algorithm: { isValid: includes.bind(null, SUPPORTED_ALGS), message: '"algorithm" must be a valid string enum value' },
      header: { isValid: isPlainObject, message: '"header" must be an object' },
      encoding: { isValid: isString, message: '"encoding" must be a string' },
      issuer: { isValid: isString, message: '"issuer" must be a string' },
      subject: { isValid: isString, message: '"subject" must be a string' },
      jwtid: { isValid: isString, message: '"jwtid" must be a string' },
      noTimestamp: { isValid: isBoolean, message: '"noTimestamp" must be a boolean' },
      keyid: { isValid: isString, message: '"keyid" must be a string' },
      mutatePayload: { isValid: isBoolean, message: '"mutatePayload" must be a boolean' },
      allowInsecureKeySizes: { isValid: isBoolean, message: '"allowInsecureKeySizes" must be a boolean' },
      allowInvalidAsymmetricKeyTypes: { isValid: isBoolean, message: '"allowInvalidAsymmetricKeyTypes" must be a boolean' }
    };
    var registered_claims_schema = {
      iat: { isValid: isNumber, message: '"iat" should be a number of seconds' },
      exp: { isValid: isNumber, message: '"exp" should be a number of seconds' },
      nbf: { isValid: isNumber, message: '"nbf" should be a number of seconds' }
    };
    function validate(schema, allowUnknown, object, parameterName) {
      if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
      }
      Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
          if (!allowUnknown) {
            throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
          }
          return;
        }
        if (!validator.isValid(object[key])) {
          throw new Error(validator.message);
        }
      });
    }
    function validateOptions(options) {
      return validate(sign_options_schema, false, options, "options");
    }
    function validatePayload(payload) {
      return validate(registered_claims_schema, true, payload, "payload");
    }
    var options_to_payload = {
      "audience": "aud",
      "issuer": "iss",
      "subject": "sub",
      "jwtid": "jti"
    };
    var options_for_objects = [
      "expiresIn",
      "notBefore",
      "noTimestamp",
      "audience",
      "issuer",
      "subject",
      "jwtid"
    ];
    module2.exports = function(payload, secretOrPrivateKey, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
      const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
      const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : void 0,
        kid: options.keyid
      }, options.header);
      function failure(err) {
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
      }
      if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
          secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
          try {
            secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
          } catch (_2) {
            return failure(new Error("secretOrPrivateKey is not valid key material"));
          }
        }
      }
      if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
      } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
          return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== void 0 && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
          return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
      }
      if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
      } else if (isObjectPayload) {
        try {
          validatePayload(payload);
        } catch (error) {
          return failure(error);
        }
        if (!options.mutatePayload) {
          payload = Object.assign({}, payload);
        }
      } else {
        const invalid_options = options_for_objects.filter(function(opt) {
          return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
          return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
      }
      if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
      }
      if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
      }
      try {
        validateOptions(options);
      } catch (error) {
        return failure(error);
      }
      if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
          validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
          return failure(error);
        }
      }
      const timestamp = payload.iat || Math.floor(Date.now() / 1e3);
      if (options.noTimestamp) {
        delete payload.iat;
      } else if (isObjectPayload) {
        payload.iat = timestamp;
      }
      if (typeof options.notBefore !== "undefined") {
        try {
          payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.nbf === "undefined") {
          return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
          payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.exp === "undefined") {
          return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== "undefined") {
          if (typeof payload[claim] !== "undefined") {
            return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
          }
          payload[claim] = options[key];
        }
      });
      const encoding = options.encoding || "utf8";
      if (typeof callback === "function") {
        callback = callback && once(callback);
        jws.createSign({
          header,
          privateKey: secretOrPrivateKey,
          payload,
          encoding
        }).once("error", callback).once("done", function(signature) {
          if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
          }
          callback(null, signature);
        });
      } else {
        let signature = jws.sign({ header, payload, secret: secretOrPrivateKey, encoding });
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
          throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
      }
    };
  }
});

// node_modules/jsonwebtoken/index.js
var require_jsonwebtoken = __commonJS({
  "node_modules/jsonwebtoken/index.js"(exports2, module2) {
    module2.exports = {
      decode: require_decode(),
      verify: require_verify(),
      sign: require_sign(),
      JsonWebTokenError: require_JsonWebTokenError(),
      NotBeforeError: require_NotBeforeError(),
      TokenExpiredError: require_TokenExpiredError()
    };
  }
});

// index.js
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express10 = __toESM(require("express"), 1);
var import_cors = __toESM(require_lib(), 1);
var import_dotenv3 = __toESM(require_main(), 1);
var import_url3 = require("url");
var import_path5 = __toESM(require("path"), 1);
var import_cookie_parser = __toESM(require_cookie_parser(), 1);

// routes/auth.js
var import_express = __toESM(require("express"), 1);
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken2 = __toESM(require_jsonwebtoken(), 1);

// db/index.js
var import_pg = __toESM(require("pg"), 1);
var import_dotenv = __toESM(require_main(), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_meta = {};
var __dirname = import_path.default.dirname((0, import_url.fileURLToPath)(import_meta.url));
import_dotenv.default.config({ path: import_path.default.join(__dirname, "..", ".env") });
var { Pool } = import_pg.default;
var isProduction = process.env.NODE_ENV === "production";
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(`
========== DATABASE CONNECTION ERROR ==========
No PostgreSQL database connection found!

Please create a PostgreSQL database in Replit by:
1. Open a new tab in Replit
2. Type "Database" in the search bar
3. Choose "create a database"
4. Replit will automatically add DATABASE_URL to your Secrets

Your app will not work until you complete these steps.
==============================================
  `);
  process.exit(1);
}
var pool = new Pool({
  connectionString,
  ssl: connectionString.includes(".neon.tech") ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
pool.on("connect", () => {
  console.log("Connected to the database");
});
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
(async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    console.log("Database connected successfully");
    client.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();
var query = (text, params) => pool.query(text, params);
var getClient = async () => {
  const client = await pool.connect();
  return client;
};
var db_default = { query, getClient };

// middleware/authenticate.js
var import_jsonwebtoken = __toESM(require_jsonwebtoken(), 1);
var authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please login" });
    }
    const decoded = import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    const { rows } = await db_default.query(
      "SELECT id, email, first_name, last_name, role, verification_status FROM users WHERE id = $1",
      [decoded.userId]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again" });
    }
    return res.status(401).json({ message: "Not authenticated. Please login" });
  }
};
var authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRole = req.user.role === "stall_organizer" ? "event_organizer" : req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

// routes/auth.js
var import_dotenv2 = __toESM(require_main(), 1);
var import_path2 = __toESM(require("path"), 1);
var import_url2 = require("url");
var import_multer = __toESM(require("multer"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_meta2 = {};
var __dirname2 = import_path2.default.dirname((0, import_url2.fileURLToPath)(import_meta2.url));
import_dotenv2.default.config({ path: import_path2.default.join(__dirname2, "..", ".env") });
var router = import_express.default.Router();
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = "user", phone } = req.body;
    const existingUser = await db_default.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const validRoles = ["user", "event_organizer", "stall_organizer", "stall_manager", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    const hashedPassword = await import_bcrypt.default.hash(password, 10);
    const result = await db_default.query(
      `INSERT INTO users (email, password, first_name, last_name, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, verification_status`,
      [email, hashedPassword, firstName, lastName, role, phone]
    );
    const user = result.rows[0];
    const token = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db_default.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5,
      // 1 hour
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      sameSite: "strict"
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await db_default.query(
      `SELECT id, email, password, first_name, last_name, role, verification_status
       FROM users WHERE email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = result.rows[0];
    const passwordMatch = await import_bcrypt.default.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let rejectionReason = null;
    if (user.role === "event_organizer" && user.verification_status === "rejected") {
      const noteResult = await db_default.query(
        `SELECT note FROM verification_notes 
         WHERE user_id = $1 AND status = 'rejected'
         ORDER BY created_at DESC LIMIT 1`,
        [user.id]
      );
      if (noteResult.rows.length > 0) {
        rejectionReason = noteResult.rows[0].note;
      }
    }
    const token = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db_default.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5,
      // 1 hour
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      sameSite: "strict"
    });
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      },
      rejectionReason
    });
  } catch (error) {
    next(error);
  }
});
router.post("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }
    const tokenResult = await db_default.query(
      `SELECT * FROM refresh_tokens 
       WHERE token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );
    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
    const decoded = import_jsonwebtoken2.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userResult = await db_default.query(
      `SELECT id, email, first_name, last_name, role, verification_status
       FROM users WHERE id = $1`,
      [decoded.userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    const user = userResult.rows[0];
    const newToken = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5,
      // 1 hour
      sameSite: "strict"
    });
    res.json({
      message: "Token refreshed successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    next(error);
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});
router.get("/me", authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role,
      verificationStatus: req.user.verification_status
    }
  });
});
var organizerStorage = import_multer.default.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir3 = import_path2.default.join(__dirname2, "../uploads/organizers");
    if (!import_fs.default.existsSync(uploadDir3)) {
      import_fs.default.mkdirSync(uploadDir3, { recursive: true });
    }
    cb(null, uploadDir3);
  },
  filename: function(req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  }
});
var organizerUpload = (0, import_multer.default)({
  storage: organizerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB limit
  fileFilter: function(req, file, cb) {
    if (file.mimetype === "application/pdf" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, and PNG files are allowed"));
    }
  }
}).fields([
  { name: "panCard", maxCount: 1 },
  { name: "canceledCheck", maxCount: 1 },
  { name: "agreement", maxCount: 1 }
]);
router.post("/register-organizer", organizerUpload, async (req, res, next) => {
  try {
    console.log("Received organizer registration request:", req.body);
    console.log("Files received:", req.files);
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      organizationName,
      website,
      description,
      eventTypes,
      taxId,
      role
    } = req.body;
    const existingUser = await db_default.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    let parsedEventTypes = eventTypes;
    if (typeof eventTypes === "string") {
      try {
        parsedEventTypes = JSON.parse(eventTypes);
      } catch (e) {
        console.error("Error parsing eventTypes:", e);
        parsedEventTypes = [];
      }
    }
    const hashedPassword = await import_bcrypt.default.hash(password, 10);
    await db_default.query("BEGIN");
    const userResult = await db_default.query(
      `INSERT INTO users (email, password, first_name, last_name, role, phone, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, verification_status`,
      [email, hashedPassword, firstName, lastName, "event_organizer", phone, "pending"]
    );
    const user = userResult.rows[0];
    const panCardPath = req.files.panCard ? req.files.panCard[0].filename : null;
    const canceledCheckPath = req.files.canceledCheck ? req.files.canceledCheck[0].filename : null;
    const agreementPath = req.files.agreement ? req.files.agreement[0].filename : null;
    await db_default.query(
      `INSERT INTO organizer_profiles 
       (user_id, organization_name, website, description, event_types, tax_id, pan_card_path, canceled_check_path, agreement_path)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)`,
      [
        user.id,
        organizationName,
        website || null,
        description,
        JSON.stringify(parsedEventTypes),
        // Convert to valid JSON string
        taxId || null,
        panCardPath,
        canceledCheckPath,
        agreementPath
      ]
    );
    await db_default.query("COMMIT");
    const token = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = import_jsonwebtoken2.default.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db_default.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5,
      // 1 hour
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      sameSite: "strict"
    });
    res.status(201).json({
      message: "Organizer registration submitted successfully. Your application is pending review.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    await db_default.query("ROLLBACK");
    console.error("Error in organizer registration:", error);
    next(error);
  }
});
router.put("/reapply-organizer", organizerUpload, async (req, res, next) => {
  try {
    console.log("Received organizer reapplication request:", req.body);
    console.log("Files received for reapplication:", req.files);
    const {
      userId,
      organizationName,
      website,
      description,
      taxId,
      eventTypes
    } = req.body;
    const userResult = await db_default.query(
      "SELECT * FROM users WHERE id = $1 AND verification_status = $2",
      [userId, "rejected"]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found or not eligible for reapplication" });
    }
    await db_default.query("BEGIN");
    await db_default.query(
      "UPDATE users SET verification_status = $1, updated_at = NOW() WHERE id = $2",
      ["pending", userId]
    );
    const panCardPath = req.files.panCard ? req.files.panCard[0].filename : null;
    const canceledCheckPath = req.files.canceledCheck ? req.files.canceledCheck[0].filename : null;
    const agreementPath = req.files.agreement ? req.files.agreement[0].filename : null;
    let parsedEventTypes = eventTypes;
    if (typeof eventTypes === "string") {
      try {
        parsedEventTypes = JSON.parse(eventTypes);
      } catch (e) {
        console.error("Error parsing eventTypes in reapplication:", e);
        parsedEventTypes = [];
      }
    }
    const profileResult = await db_default.query(
      "SELECT * FROM organizer_profiles WHERE user_id = $1",
      [userId]
    );
    if (profileResult.rows.length > 0) {
      await db_default.query(
        `UPDATE organizer_profiles 
         SET organization_name = $1, website = $2, description = $3,
             tax_id = $4, event_types = $5::jsonb, 
             pan_card_path = COALESCE($6, pan_card_path),
             canceled_check_path = COALESCE($7, canceled_check_path),
             agreement_path = COALESCE($8, agreement_path),
             updated_at = NOW()
         WHERE user_id = $9`,
        [
          organizationName,
          website || null,
          description,
          taxId || null,
          JSON.stringify(parsedEventTypes),
          // Convert to valid JSON string
          panCardPath,
          canceledCheckPath,
          agreementPath,
          userId
        ]
      );
    } else {
      await db_default.query(
        `INSERT INTO organizer_profiles 
         (user_id, organization_name, website, description, tax_id, 
          event_types, pan_card_path, canceled_check_path, agreement_path)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)`,
        [
          userId,
          organizationName,
          website || null,
          description,
          taxId || null,
          JSON.stringify(parsedEventTypes),
          // Convert to valid JSON string
          panCardPath,
          canceledCheckPath,
          agreementPath
        ]
      );
    }
    await db_default.query("COMMIT");
    res.status(200).json({
      message: "Organizer reapplication submitted successfully. Your account is pending verification."
    });
  } catch (error) {
    await db_default.query("ROLLBACK");
    console.error("Error in organizer reapplication:", error);
    next(error);
  }
});
var auth_default = router;

// routes/events.js
var import_express2 = __toESM(require("express"), 1);
var import_multer2 = __toESM(require("multer"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var router2 = import_express2.default.Router();
var uploadDir = import_path3.default.join(process.cwd(), "uploads");
if (!import_fs2.default.existsSync(uploadDir)) {
  import_fs2.default.mkdirSync(uploadDir, { recursive: true });
}
var storage = import_multer2.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + import_path3.default.extname(file.originalname));
  }
});
var fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = (0, import_multer2.default)({
  storage,
  fileFilter
  // limits: {
  //   fileSize: 5 * 1024 * 1024 // 5MB file size limit
  // }
});
router2.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      type,
      startDate,
      endDate,
      location
    } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name,
      COUNT(ei.id) as image_count,
      EXISTS(SELECT 1 FROM stalls s WHERE s.event_id = e.id) as has_stalls
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      LEFT JOIN event_images ei ON e.id = ei.event_id
      WHERE e.is_published = true AND e.verification_status = 'verified'
    `;
    const queryParams = [];
    let paramPosition = 1;
    if (search) {
      query2 += ` AND (e.title ILIKE $${paramPosition} OR e.description ILIKE $${paramPosition})`;
      queryParams.push(`%${search}%`);
      paramPosition++;
    }
    if (type) {
      query2 += ` AND e.event_type = $${paramPosition}`;
      queryParams.push(type);
      paramPosition++;
    }
    if (startDate) {
      query2 += ` AND e.start_date >= $${paramPosition}`;
      queryParams.push(startDate);
      paramPosition++;
    }
    if (endDate) {
      query2 += ` AND e.end_date <= $${paramPosition}`;
      queryParams.push(endDate);
      paramPosition++;
    }
    if (location) {
      query2 += ` AND (e.city ILIKE $${paramPosition} OR e.country ILIKE $${paramPosition})`;
      queryParams.push(`%${location}%`);
      paramPosition++;
    }
    query2 += `
      GROUP BY e.id, u.first_name, u.last_name
      ORDER BY e.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM events e
      WHERE e.is_published = true AND e.verification_status = 'verified'
    `;
    let countParams = [];
    let countPosition = 1;
    if (search) {
      countQuery += ` AND (e.title ILIKE $${countPosition} OR e.description ILIKE $${countPosition})`;
      countParams.push(`%${search}%`);
      countPosition++;
    }
    if (type) {
      countQuery += ` AND e.event_type = $${countPosition}`;
      countParams.push(type);
      countPosition++;
    }
    if (startDate) {
      countQuery += ` AND e.start_date >= $${countPosition}`;
      countParams.push(startDate);
      countPosition++;
    }
    if (endDate) {
      countQuery += ` AND e.end_date <= $${countPosition}`;
      countParams.push(endDate);
      countPosition++;
    }
    if (location) {
      countQuery += ` AND (e.city ILIKE $${countPosition} OR e.country ILIKE $${countPosition})`;
      countParams.push(`%${location}%`);
      countPosition++;
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    res.json({
      events: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router2.get("/:id", async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventResult = await db_default.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND (e.is_published = true OR $2 = true)`,
      [eventId, req.user ? true : false]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    const event = eventResult.rows[0];
    const imagesResult = await db_default.query(
      "SELECT id, image_url FROM event_images WHERE event_id = $1",
      [eventId]
    );
    const stallsResult = await db_default.query(
      "SELECT * FROM stalls WHERE event_id = $1",
      [eventId]
    );
    const eventWithImages = {
      ...event,
      images: imagesResult.rows,
      stalls: stallsResult.rows
    };
    res.json({ event: eventWithImages });
  } catch (error) {
    next(error);
  }
});
router2.get("/organiser/myevents/:id", async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventResult = await db_default.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 `,
      [eventId]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    const event = eventResult.rows[0];
    const imagesResult = await db_default.query(
      "SELECT id, image_url FROM event_images WHERE event_id = $1",
      [eventId]
    );
    const stallsResult = await db_default.query(
      "SELECT * FROM stalls WHERE event_id = $1",
      [eventId]
    );
    const eventWithImages = {
      ...event,
      images: imagesResult.rows,
      stalls: stallsResult.rows
    };
    res.json({ event: eventWithImages });
  } catch (error) {
    next(error);
  }
});
router2.post(
  "/",
  authenticate,
  authorize("event_organizer", "admin"),
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  async (req, res, next) => {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);
    if (!req.files || !req.files["bannerImage"]) {
      return res.status(400).json({ message: "Banner image is required" });
    }
    console.log("Full Path:", req.files["bannerImage"][0].path);
    const client = await db_default.getClient();
    try {
      await client.query("BEGIN");
      const userResult = await client.query(
        "SELECT verification_status FROM users WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const { verification_status } = userResult.rows[0];
      if (verification_status !== "verified") {
        return res.status(403).json({ message: "Your account is not verified. You cannot create events." });
      }
      const {
        title,
        description,
        eventType,
        startDate,
        endDate,
        location,
        address,
        city,
        state,
        country,
        zipCode,
        maxCapacity,
        price
      } = req.body;
      if (!title || !description || !eventType || !startDate || !endDate || !location) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const bannerImage = req.files["bannerImage"] ? req.files["bannerImage"][0].filename : null;
      const images = req.files["images"] ? req.files["images"].map((file) => file.filename) : [];
      const eventResult = await client.query(
        `INSERT INTO events (
          title, description, event_type, start_date, end_date,
          location, address, city, state, country, zip_code,
          banner_image, organizer_id, max_capacity, price, 
          verification_status, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          title,
          description,
          eventType,
          startDate,
          endDate,
          location,
          address || "",
          city || "",
          state || "",
          country || "",
          zipCode || "",
          bannerImage,
          req.user.id,
          maxCapacity || null,
          price || 0,
          "pending",
          // default verification status
          false
          // default is_published status
        ]
      );
      const event = eventResult.rows[0];
      if (images.length > 0) {
        const imageValues = images.map(
          (image) => `('${event.id}', '${image}')`
        ).join(", ");
        await client.query(`
          INSERT INTO event_images (event_id, image_url)
          VALUES ${imageValues}
        `);
      }
      if (req.body.stalls) {
        try {
          const stallsData = JSON.parse(req.body.stalls);
          if (Array.isArray(stallsData) && stallsData.length > 0) {
            for (const stall of stallsData) {
              await client.query(
                `INSERT INTO stalls (
                  event_id, name, description, price, size, 
                  location_in_venue, is_available, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
                [
                  event.id,
                  stall.name || stall.type,
                  stall.description || "",
                  stall.price || 0,
                  stall.size || "",
                  stall.locationInVenue || ""
                ]
              );
            }
          }
        } catch (error) {
          console.error("Error processing stalls data:", error);
        }
      }
      await client.query("COMMIT");
      let eventStalls = [];
      if (req.body.stalls) {
        const stallsResult = await db_default.query(
          "SELECT * FROM stalls WHERE event_id = $1",
          [event.id]
        );
        eventStalls = stallsResult.rows;
      }
      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event,
        stalls: eventStalls.length > 0 ? eventStalls : void 0
      });
    } catch (error) {
      console.error("Event Creation Error:", error);
      await client.query("ROLLBACK");
      res.status(500).json({
        success: false,
        message: "Failed to create event",
        error: error.message
      });
    } finally {
      client.release();
    }
  }
);
router2.get("/edit/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventResult = await db_default.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND (e.organizer_id = $2 OR $3 = true)`,
      [eventId, req.user.id, req.user.role === "admin"]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        message: "Event not found or you are not authorized to edit it"
      });
    }
    const event = eventResult.rows[0];
    const imagesResult = await db_default.query(
      "SELECT id, image_url FROM event_images WHERE event_id = $1",
      [eventId]
    );
    const eventWithImages = {
      ...event,
      images: imagesResult.rows
    };
    res.json({
      success: true,
      event: eventWithImages
    });
  } catch (error) {
    console.error("Error fetching event for edit:", error);
    next(error);
  }
});
router2.put(
  "/:id",
  authenticate,
  authorize("event_organizer", "admin"),
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  async (req, res, next) => {
    const eventId = req.params.id;
    const client = await db_default.getClient();
    try {
      await client.query("BEGIN");
      const eventCheck = await client.query(
        "SELECT * FROM events WHERE id = $1 AND organizer_id = $2",
        [eventId, req.user.id]
      );
      if (eventCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Event not found or you do not have permission to update it" });
      }
      const {
        title,
        description,
        eventType,
        startDate,
        endDate,
        location,
        address,
        city,
        state,
        country,
        zipCode,
        maxCapacity,
        price,
        hasStalls
      } = req.body;
      const updateResult = await client.query(
        `UPDATE events
         SET title = $1, description = $2, event_type = $3, start_date = $4, end_date = $5,
             location = $6, address = $7, city = $8, state = $9, country = $10, zip_code = $11,
             max_capacity = $12, price = $13, updated_at = NOW(), 
             verification_status = 'pending', is_published = false
         WHERE id = $14 AND organizer_id = $15
         RETURNING *`,
        [
          title,
          description,
          eventType,
          startDate,
          endDate,
          location,
          address,
          city,
          state,
          country,
          zipCode,
          maxCapacity,
          price,
          eventId,
          req.user.id
        ]
      );
      if (req.files && req.files["bannerImage"]) {
        const bannerImage = req.files["bannerImage"][0];
        const bannerFilename = import_path3.default.basename(bannerImage.path);
        await client.query(
          "UPDATE events SET banner_image = $1 WHERE id = $2",
          [bannerFilename, eventId]
        );
      }
      if (req.files && req.files["images"] && req.files["images"].length > 0) {
        await client.query("DELETE FROM event_images WHERE event_id = $1", [eventId]);
        for (const image of req.files["images"]) {
          const imageFilename = import_path3.default.basename(image.path);
          await client.query(
            "INSERT INTO event_images (event_id, image_url) VALUES ($1, $2)",
            [eventId, imageFilename]
          );
        }
      }
      if (hasStalls === "true") {
        const stalls = JSON.parse(req.body.stalls || "[]");
        await client.query("DELETE FROM stalls WHERE event_id = $1", [eventId]);
        for (const stall of stalls) {
          await client.query(
            `INSERT INTO stalls (
              event_id, 
              name, 
              description, 
              price, 
              size, 
              location_in_venue, 
              is_available
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              eventId,
              stall.type || stall.name,
              stall.description,
              stall.price,
              stall.size,
              stall.locationInVenue || null,
              true
              // Default to available
            ]
          );
        }
      } else {
        await client.query("DELETE FROM stalls WHERE event_id = $1", [eventId]);
      }
      await client.query("COMMIT");
      const updatedEventResult = await db_default.query(
        `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
         FROM events e
         JOIN users u ON e.organizer_id = u.id
         WHERE e.id = $1`,
        [eventId]
      );
      const updatedImagesResult = await db_default.query(
        "SELECT id, image_url FROM event_images WHERE event_id = $1",
        [eventId]
      );
      const updatedStallsResult = await db_default.query(
        "SELECT * FROM stalls WHERE event_id = $1",
        [eventId]
      );
      const updatedEvent = {
        ...updatedEventResult.rows[0],
        images: updatedImagesResult.rows,
        stalls: updatedStallsResult.rows
      };
      res.json({ event: updatedEvent, message: "Event updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating event:", error);
      next(error);
    } finally {
      client.release();
    }
  }
);
router2.delete("/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventCheck = await db_default.query(
      "SELECT * FROM events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)",
      [eventId, req.user.id, req.user.role === "admin"]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: "Event not found or you are not authorized to delete it" });
    }
    const bookingsCheck = await db_default.query(
      "SELECT COUNT(*) FROM bookings WHERE event_id = $1",
      [eventId]
    );
    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete event with active bookings. Cancel all bookings first."
      });
    }
    await db_default.query("DELETE FROM events WHERE id = $1", [eventId]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
});
router2.get("/organizer/myevents", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT e.*, COUNT(b.id) as booking_count, SUM(b.total_price) as total_revenue
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.organizer_id = $1
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND e.verification_status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query2 += `
      GROUP BY e.id
      ORDER BY e.start_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM events
      WHERE organizer_id = $1
    `;
    let countParams = [req.user.id];
    let countPosition = 2;
    if (status) {
      countQuery += ` AND verification_status = $${countPosition}`;
      countParams.push(status);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    res.json({
      events: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router2.post(
  "/verify/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const { status, feedback } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
      }
      const result = await db_default.query(
        `UPDATE events 
         SET verification_status = $1, 
             admin_feedback = $2,
             is_published = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [
          status === "approved" ? "verified" : "rejected",
          feedback || null,
          status === "approved",
          // Set is_published to true if approved
          eventId
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      const organizerQuery = await db_default.query(
        `SELECT u.email, u.first_name
         FROM users u
         JOIN events e ON u.id = e.organizer_id
         WHERE e.id = $1`,
        [eventId]
      );
      if (organizerQuery.rows.length > 0) {
        const { email, first_name } = organizerQuery.rows[0];
        console.log(`Notification would be sent to ${email} with feedback: ${feedback}`);
      }
      res.json({
        message: `Event has been ${status}`,
        event: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);
router2.get("/admin/pending", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query2 = `
      SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE e.verification_status = 'pending'
      ORDER BY e.created_at ASC
      LIMIT $1 OFFSET $2
    `;
    const result = await db_default.query(query2, [parseInt(limit), offset]);
    const events = result.rows;
    for (const event of events) {
      const stallsResult = await db_default.query(
        "SELECT * FROM stalls WHERE event_id = $1",
        [event.id]
      );
      event.stalls = stallsResult.rows;
    }
    const countResult = await db_default.query(
      "SELECT COUNT(*) FROM events WHERE verification_status = $1",
      ["pending"]
    );
    const totalPending = parseInt(countResult.rows[0].count);
    res.json({
      events,
      pagination: {
        total: totalPending,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalPending / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
var events_default = router2;

// routes/bookings.js
var import_express3 = __toESM(require("express"), 1);
var router3 = import_express3.default.Router();
router3.post("/", authenticate, async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const { eventId, stallId, quantity = 1, notes } = req.body;
    if (!eventId && !stallId) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Either eventId or stallId must be provided" });
    }
    if (eventId && stallId) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cannot book both event and stall at the same time" });
    }
    let bookingType, itemId, price, totalPrice, availabilityCheck;
    if (eventId) {
      const eventResult = await client.query(
        `SELECT * FROM events
         WHERE id = $1 AND is_published = true AND verification_status = 'verified'`,
        [eventId]
      );
      if (eventResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Event not found or not available for booking" });
      }
      const event = eventResult.rows[0];
      if (event.max_capacity !== null && event.current_capacity + quantity > event.max_capacity) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Not enough capacity available for this event" });
      }
      bookingType = "event";
      itemId = eventId;
      price = event.price;
      totalPrice = price * quantity;
      await client.query(
        `UPDATE events SET current_capacity = current_capacity + $1 WHERE id = $2`,
        [quantity, eventId]
      );
    } else {
      const stallResult = await client.query(
        "SELECT * FROM stalls WHERE id = $1 AND is_available = true",
        [stallId]
      );
      if (stallResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Stall not found or not available for booking" });
      }
      const stall = stallResult.rows[0];
      bookingType = "stall";
      itemId = stallId;
      price = stall.price;
      totalPrice = price * quantity;
      await client.query(
        "UPDATE stalls SET is_available = false WHERE id = $1",
        [stallId]
      );
    }
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        user_id, ${bookingType}_id, quantity, total_price, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *`,
      [req.user.id, itemId, quantity, totalPrice, notes]
    );
    const booking = bookingResult.rows[0];
    await client.query("COMMIT");
    res.status(201).json({
      message: "Booking created successfully",
      booking,
      paymentUrl: `/payment/${booking.id}`
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router3.get("/my-bookings", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT b.*, 
             e.title as event_title, e.start_date as event_date, e.banner_image as event_image,
             s.name as stall_name, se.title as stall_event_title
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN stall_events se ON s.stall_event_id = se.id
      WHERE b.user_id = $1
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query2 += `
      ORDER BY b.booking_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM bookings WHERE user_id = $1
    `;
    let countParams = [req.user.id];
    let countPosition = 2;
    if (status) {
      countQuery += ` AND status = $${countPosition}`;
      countParams.push(status);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);
    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router3.get("/:id", authenticate, async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const query2 = `
      SELECT b.*, 
             e.title as event_title, e.description as event_description, 
             e.start_date as event_start_date, e.end_date as event_end_date,
             e.location as event_location, e.banner_image as event_image,
             s.name as stall_name, s.description as stall_description,
             se.title as stall_event_title, se.location as stall_event_location,
             p.id as payment_id, p.status as payment_status
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN stall_events se ON s.stall_event_id = se.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.id = $1 AND (b.user_id = $2 OR $3 = true OR 
            (e.organizer_id = $2) OR 
            (se.organizer_id = $2) OR 
            (s.manager_id = $2))
    `;
    const result = await db_default.query(query2, [
      bookingId,
      req.user.id,
      ["admin", "event_organizer"].includes(req.user.role)
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }
    res.json({ booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
router3.put("/:id/cancel", authenticate, async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const bookingId = req.params.id;
    const bookingResult = await client.query(
      `SELECT * FROM bookings
       WHERE id = $1 AND (user_id = $2 OR $3 = true)`,
      [bookingId, req.user.id, req.user.role === "admin"]
    );
    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }
    const booking = bookingResult.rows[0];
    if (booking.status === "cancelled") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Booking is already cancelled" });
    }
    if (booking.status === "completed") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cannot cancel a completed booking" });
    }
    const updateResult = await client.query(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    );
    const updatedBooking = updateResult.rows[0];
    if (booking.event_id) {
      await client.query(
        `UPDATE events
         SET current_capacity = GREATEST(current_capacity - $1, 0)
         WHERE id = $2`,
        [booking.quantity, booking.event_id]
      );
    }
    if (booking.stall_id) {
      await client.query(
        `UPDATE stalls
         SET is_available = true
         WHERE id = $1`,
        [booking.stall_id]
      );
    }
    const paymentResult = await client.query(
      `SELECT * FROM payments WHERE booking_id = $1 AND status = 'completed'`,
      [bookingId]
    );
    if (paymentResult.rows.length > 0) {
      await client.query(
        `UPDATE payments
         SET status = 'refunded', updated_at = NOW()
         WHERE booking_id = $1`,
        [bookingId]
      );
    }
    await client.query("COMMIT");
    res.json({
      message: "Booking cancelled successfully",
      booking: updatedBooking
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router3.get("/organizer", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT b.*, e.title as event_title, u.first_name || ' ' || u.last_name as customer_name
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.organizer_id = $1
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query2 += `
      ORDER BY b.created_at DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) 
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
    `;
    let countParams = [req.user.id];
    if (status) {
      countQuery += ` AND b.status = $2`;
      countParams.push(status);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);
    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router3.get("/event/:eventId", authenticate, authorize("organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const eventCheck = await db_default.query(
      "SELECT * FROM events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)",
      [eventId, req.user.id, req.user.role === "admin"]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(403).json({ message: "Not authorized to view bookings for this event" });
    }
    let query2 = `
      SELECT b.*, u.first_name || ' ' || u.last_name as user_name, u.email as user_email,
             p.status as payment_status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.event_id = $1
    `;
    const queryParams = [eventId];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query2 += `
      ORDER BY b.booking_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM bookings WHERE event_id = $1
    `;
    let countParams = [eventId];
    let countPosition = 2;
    if (status) {
      countQuery += ` AND status = $${countPosition}`;
      countParams.push(status);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);
    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router3.post("/validate-ticket/:id", async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const ticketId = req.params.id;
    const bookingResult = await client.query(
      `SELECT b.*, 
              e.title as event_title, 
              u.first_name || ' ' || u.last_name as attendee_name
       FROM bookings b
       LEFT JOIN events e ON b.event_id = e.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [ticketId]
    );
    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    const booking = bookingResult.rows[0];
    if (booking.is_used === true) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Ticket has already been used",
        ticket: {
          id: booking.id,
          eventTitle: booking.event_title,
          attendeeName: booking.attendee_name,
          isUsed: true,
          scannedAt: booking.scanned_at
        }
      });
    }
    if (booking.status !== "confirmed") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: `Ticket is not valid. Current status: ${booking.status}`,
        ticket: {
          id: booking.id,
          eventTitle: booking.event_title,
          attendeeName: booking.attendee_name,
          status: booking.status
        }
      });
    }
    const updateResult = await client.query(
      `UPDATE bookings 
       SET is_used = true, 
           scanned_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [ticketId]
    );
    const updatedBooking = updateResult.rows[0];
    await client.query("COMMIT");
    res.json({
      success: true,
      message: "Ticket validated successfully",
      ticket: {
        id: updatedBooking.id,
        eventTitle: booking.event_title,
        attendeeName: booking.attendee_name,
        isUsed: true,
        scannedAt: updatedBooking.scanned_at
      }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Ticket validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating ticket",
      error: error.message
    });
  } finally {
    client.release();
  }
});
var bookings_default = router3;

// routes/users.js
var import_express4 = __toESM(require("express"), 1);
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var router4 = import_express4.default.Router();
router4.get("/profile", authenticate, async (req, res, next) => {
  try {
    const result = await db_default.query(
      `SELECT id, email, first_name, last_name, role, verification_status, 
              phone, profile_image, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
router4.put("/profile", authenticate, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, profileImage } = req.body;
    const result = await db_default.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, phone = $3, 
           profile_image = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, first_name, last_name, role, verification_status, 
                 phone, profile_image, created_at`,
      [firstName, lastName, phone, profileImage, req.user.id]
    );
    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});
router4.put("/change-password", authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userResult = await db_default.query(
      "SELECT * FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = userResult.rows[0];
    const passwordMatch = await import_bcrypt2.default.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const hashedPassword = await import_bcrypt2.default.hash(newPassword, 10);
    await db_default.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, req.user.id]
    );
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
});
router4.get("/", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, verificationStatus, search } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT id, email, first_name, last_name, role, verification_status, 
             phone, created_at
      FROM users
      WHERE 1=1
    `;
    const queryParams = [];
    let paramPosition = 1;
    if (role) {
      query2 += ` AND role = $${paramPosition}`;
      queryParams.push(role);
      paramPosition++;
    }
    if (verificationStatus) {
      query2 += ` AND verification_status = $${paramPosition}`;
      queryParams.push(verificationStatus);
      paramPosition++;
    }
    if (search) {
      query2 += ` AND (
        email ILIKE $${paramPosition} OR
        first_name ILIKE $${paramPosition} OR
        last_name ILIKE $${paramPosition} OR
        phone ILIKE $${paramPosition}
      )`;
      queryParams.push(`%${search}%`);
      paramPosition++;
    }
    query2 += `
      ORDER BY created_at DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];
    let countPosition = 1;
    if (role) {
      countQuery += ` AND role = $${countPosition}`;
      countParams.push(role);
      countPosition++;
    }
    if (verificationStatus) {
      countQuery += ` AND verification_status = $${countPosition}`;
      countParams.push(verificationStatus);
      countPosition++;
    }
    if (search) {
      countQuery += ` AND (
        email ILIKE $${countPosition} OR
        first_name ILIKE $${countPosition} OR
        last_name ILIKE $${countPosition} OR
        phone ILIKE $${countPosition}
      )`;
      countParams.push(`%${search}%`);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalUsers = parseInt(countResult.rows[0].count);
    res.json({
      users: result.rows,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router4.put("/verify/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { status, note } = req.body;
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be verified or rejected" });
    }
    await db_default.query("BEGIN");
    const result = await db_default.query(
      `UPDATE users
       SET verification_status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, first_name, last_name, role, verification_status`,
      [status, userId]
    );
    if (result.rows.length === 0) {
      await db_default.query("ROLLBACK");
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];
    if (note) {
      await db_default.query(
        `INSERT INTO verification_notes (user_id, status, note, created_by)
         VALUES ($1, $2, $3, $4)`,
        [userId, status, note, req.user.id]
      );
    }
    let message;
    if (status === "verified") {
      message = `Your account has been verified. You can now access all features.`;
    } else {
      message = note ? `Your account verification was rejected: ${note}` : `Your account verification was rejected. Please contact support for more information.`;
    }
    await db_default.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [userId, `Account ${status.charAt(0).toUpperCase() + status.slice(1)}`, message]
    );
    await db_default.query("COMMIT");
    res.json({
      message: `User ${status} successfully`,
      user
    });
  } catch (error) {
    await db_default.query("ROLLBACK");
    next(error);
  }
});
router4.get("/pending-verification", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query2 = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.created_at,
             op.organization_name, op.website, op.description, op.tax_id, 
             op.event_types, op.pan_card_path, op.canceled_check_path, op.agreement_path
      FROM users u
      LEFT JOIN organizer_profiles op ON u.id = op.user_id
      WHERE u.verification_status = 'pending' AND u.role != 'user'
      ORDER BY u.created_at ASC
      LIMIT $1 OFFSET $2
    `;
    const result = await db_default.query(query2, [parseInt(limit), offset]);
    const countResult = await db_default.query(
      `SELECT COUNT(*) FROM users
       WHERE verification_status = 'pending' AND role != 'user'`
    );
    const totalPending = parseInt(countResult.rows[0].count);
    res.json({
      users: result.rows,
      pagination: {
        total: totalPending,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalPending / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router4.get("/organizer-profile/:id", authenticate, async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access to this profile" });
    }
    const userResult = await db_default.query(
      `SELECT id, email, first_name, last_name, role, phone
       FROM users WHERE id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const profileResult = await db_default.query(
      `SELECT organization_name, website, description, tax_id, event_types,
              pan_card_path, canceled_check_path, agreement_path
       FROM organizer_profiles WHERE user_id = $1`,
      [userId]
    );
    const userData = {
      ...userResult.rows[0],
      ...profileResult.rows[0] || {}
    };
    res.json(userData);
  } catch (error) {
    next(error);
  }
});
var users_default = router4;

// routes/stalls.js
var import_express5 = __toESM(require("express"), 1);
var import_multer3 = __toESM(require("multer"), 1);
var import_path4 = __toESM(require("path"), 1);
var import_fs3 = __toESM(require("fs"), 1);
var router5 = import_express5.default.Router();
var uploadDir2 = import_path4.default.join(process.cwd(), "uploads");
if (!import_fs3.default.existsSync(uploadDir2)) {
  import_fs3.default.mkdirSync(uploadDir2, { recursive: true });
}
var storage2 = import_multer3.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir2);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + import_path4.default.extname(file.originalname));
  }
});
var fileFilter2 = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload2 = (0, import_multer3.default)({
  storage: storage2,
  fileFilter: fileFilter2
});
router5.get("/events", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", startDate, endDate, location } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name,
             COUNT(s.id) as stall_count,
             COUNT(s.id) FILTER (WHERE s.is_available = true) as available_stall_count
      FROM stall_events se
      JOIN users u ON se.organizer_id = u.id
      LEFT JOIN stalls s ON se.id = s.stall_event_id
      WHERE se.is_published = true AND se.verification_status = 'verified'
    `;
    const queryParams = [];
    let paramPosition = 1;
    if (search) {
      query2 += ` AND (se.title ILIKE $${paramPosition} OR se.description ILIKE $${paramPosition})`;
      queryParams.push(`%${search}%`);
      paramPosition++;
    }
    if (startDate) {
      query2 += ` AND se.start_date >= $${paramPosition}`;
      queryParams.push(startDate);
      paramPosition++;
    }
    if (endDate) {
      query2 += ` AND se.end_date <= $${paramPosition}`;
      queryParams.push(endDate);
      paramPosition++;
    }
    if (location) {
      query2 += ` AND (se.city ILIKE $${paramPosition} OR se.country ILIKE $${paramPosition})`;
      queryParams.push(`%${location}%`);
      paramPosition++;
    }
    query2 += `
      GROUP BY se.id, u.first_name, u.last_name
      ORDER BY se.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM stall_events
      WHERE is_published = true AND verification_status = 'verified'
    `;
    let countParams = [];
    let countPosition = 1;
    if (search) {
      countQuery += ` AND (title ILIKE $${countPosition} OR description ILIKE $${countPosition})`;
      countParams.push(`%${search}%`);
      countPosition++;
    }
    if (startDate) {
      countQuery += ` AND start_date >= $${countPosition}`;
      countParams.push(startDate);
      countPosition++;
    }
    if (endDate) {
      countQuery += ` AND end_date <= $${countPosition}`;
      countParams.push(endDate);
      countPosition++;
    }
    if (location) {
      countQuery += ` AND (city ILIKE $${countPosition} OR country ILIKE $${countPosition})`;
      countParams.push(`%${location}%`);
      countPosition++;
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    res.json({
      stallEvents: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router5.get("/myevents", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT se.*, COUNT(s.id) as stall_count, COUNT(sr.id) as request_count
      FROM stall_events se
      LEFT JOIN stalls s ON se.id = s.stall_event_id
      LEFT JOIN stall_requests sr ON se.id = sr.stall_event_id
      WHERE se.organizer_id = $1 
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND se.verification_status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query2 += `
      GROUP BY se.id
      ORDER BY se.start_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM stall_events
      WHERE organizer_id = $1
    `;
    let countParams = [req.user.id];
    let countPosition = 2;
    if (status) {
      countQuery += ` AND verification_status = $${countPosition}`;
      countParams.push(status);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    res.json({
      events: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router5.get("/events/:id", async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventResult = await db_default.query(
      `SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.id = $1 AND (se.is_published = true OR $2 = true)`,
      [eventId, req.user ? true : false]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Stall event not found" });
    }
    const event = eventResult.rows[0];
    const stallsResult = await db_default.query(
      `SELECT * FROM stalls 
       WHERE stall_event_id = $1
       ORDER BY created_at ASC`,
      [eventId]
    );
    const eventWithStalls = {
      ...event,
      stalls: stallsResult.rows
    };
    res.json({ stallEvent: eventWithStalls });
  } catch (error) {
    next(error);
  }
});
router5.get("/organiser/mystall-event/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventResult = await db_default.query(
      `SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.id = $1`,
      [eventId]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Stall event not found" });
    }
    const event = eventResult.rows[0];
    const stallsResult = await db_default.query(
      `SELECT * FROM stalls 
       WHERE stall_event_id = $1
       ORDER BY created_at ASC`,
      [eventId]
    );
    const eventWithStalls = {
      ...event,
      stalls: stallsResult.rows
    };
    res.json({ stallEvent: eventWithStalls });
  } catch (error) {
    next(error);
  }
});
router5.post("/events", authenticate, authorize("event_organizer", "admin"), upload2.single("bannerImage"), async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      "SELECT verification_status FROM users WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User  not found" });
    }
    const { verification_status } = userResult.rows[0];
    if (verification_status !== "verified") {
      return res.status(403).json({
        message: "Your account is not verified. You cannot create stall events."
      });
    }
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      address,
      city,
      state,
      country,
      zipCode
    } = req.body;
    const bannerImage = req.file ? req.file.filename : null;
    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let stalls = [];
    if (req.body.stalls) {
      try {
        stalls = JSON.parse(req.body.stalls);
      } catch (error) {
        return res.status(400).json({ message: "Invalid stalls data" });
      }
    }
    const eventResult = await client.query(
      `INSERT INTO stall_events (
        title, description, start_date, end_date,
        location, address, city, state, country, zip_code,
        banner_image, organizer_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        title,
        description,
        startDate,
        endDate,
        location,
        address,
        city,
        state,
        country,
        zipCode,
        bannerImage,
        req.user.id
      ]
    );
    const event = eventResult.rows[0];
    if (stalls.length > 0) {
      const stallInsertPromises = stalls.map((stall) => {
        return client.query(
          `INSERT INTO stalls (stall_event_id, name, description, price, size, location_in_venue)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [event.id, stall.name, stall.description, stall.price, stall.size, stall.locationInVenue]
        );
      });
      await Promise.all(stallInsertPromises);
    }
    await client.query("COMMIT");
    res.status(201).json({
      message: "Stall event created successfully and pending verification",
      stallEvent: event
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router5.put("/events/:id", authenticate, authorize("event_organizer", "admin"), upload2.single("bannerImage"), async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      address,
      city,
      state,
      country,
      zipCode,
      stalls
    } = req.body;
    console.log("Received date values:", { startDate, endDate });
    console.log("Received ID:", id, "Type:", typeof id);
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Title is required"
      });
    }
    let parsedStartDate, parsedEndDate;
    try {
      parsedStartDate = startDate ? new Date(startDate) : null;
      parsedEndDate = endDate ? new Date(endDate) : null;
      if (parsedStartDate === null || isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid start date format"
        });
      }
      if (parsedEndDate === null || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid end date format"
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format: " + error.message
      });
    }
    const eventCheck = await client.query(
      "SELECT * FROM stall_events WHERE id = $1 AND organizer_id = $2",
      [id, req.user.id]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Stall event not found or you don't have permission to edit it"
      });
    }
    const updateQuery = `
      UPDATE stall_events 
      SET 
        title = $1, 
        description = $2, 
        start_date = $3, 
        end_date = $4, 
        location = $5,
        address = $6,
        city = $7,
        state = $8,
        country = $9,
        zip_code = $10,
        verification_status = 'pending',
        admin_feedback = NULL,
        is_published = false
        ${req.file ? ", banner_image = $11" : ""}
      WHERE id = $${req.file ? "12" : "11"} AND organizer_id = $${req.file ? "13" : "12"}
      RETURNING *
    `;
    const updateValues = [
      title.trim(),
      description || "",
      parsedStartDate,
      parsedEndDate,
      location || "",
      address || "",
      city || "",
      state || "",
      country || "",
      zipCode || ""
    ];
    if (req.file) {
      updateValues.push(req.file.filename);
    }
    updateValues.push(id, req.user.id);
    const updatedEvent = await client.query(updateQuery, updateValues);
    if (stalls) {
      let stallsArray;
      try {
        stallsArray = typeof stalls === "string" ? JSON.parse(stalls) : stalls;
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Invalid stalls data format: " + error.message
        });
      }
      if (stallsArray.some((s) => s.id)) {
        const stallIds = stallsArray.filter((s) => s.id).map((s) => s.id);
        if (stallIds.length > 0) {
          const placeholders = stallIds.map((_, idx) => `$${idx + 2}`).join(",");
          await client.query(
            `DELETE FROM stalls WHERE stall_event_id = $1 AND id NOT IN (${placeholders})`,
            [id, ...stallIds]
          );
        } else {
          await client.query("DELETE FROM stalls WHERE stall_event_id = $1", [id]);
        }
      }
      for (const stall of stallsArray) {
        if (stall.id) {
          await client.query(
            `UPDATE stalls 
             SET name = $1, description = $2, price = $3, size = $4, location_in_venue = $5
             WHERE id = $6 AND stall_event_id = $7`,
            [stall.name, stall.description, stall.price, stall.size, stall.locationInVenue || "", stall.id, id]
          );
        } else {
          await client.query(
            `INSERT INTO stalls (stall_event_id, name, description, price, size, location_in_venue, is_available)
             VALUES ($1, $2, $3, $4, $5, $6, true)`,
            [id, stall.name, stall.description, stall.price, stall.size, stall.locationInVenue || ""]
          );
        }
      }
    }
    await client.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ((SELECT id FROM users WHERE role = 'admin' LIMIT 1), $1, $2)`,
      ["Event Updated", `Event "${title}" has been updated and requires verification.`]
    );
    await client.query("COMMIT");
    res.json({
      success: true,
      message: "Stall event updated successfully and sent for verification",
      stallEvent: updatedEvent.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating stall event:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  } finally {
    client.release();
  }
});
router5.delete("/events/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventCheck = await db_default.query(
      "SELECT * FROM stall_events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)",
      [eventId, req.user.id, req.user.role === "admin"]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Stall event not found or you are not authorized to delete it"
      });
    }
    const bookingsCheck = await db_default.query(
      `SELECT COUNT(*) FROM bookings b
       JOIN stalls s ON b.stall_id = s.id
       WHERE s.stall_event_id = $1`,
      [eventId]
    );
    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete stall event with active bookings. Cancel all bookings first."
      });
    }
    await db_default.query("DELETE FROM stall_events WHERE id = $1", [eventId]);
    res.json({ message: "Stall event deleted successfully" });
  } catch (error) {
    next(error);
  }
});
router5.get("/events/:id/stalls", async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { available = "all" } = req.query;
    let query2 = `SELECT s.*, 
                      u.first_name || ' ' || u.last_name as manager_name
                FROM stalls s
                LEFT JOIN users u ON s.manager_id = u.id
                WHERE s.stall_event_id = $1`;
    const queryParams = [eventId];
    if (available === "true") {
      query2 += " AND s.is_available = true";
    } else if (available === "false") {
      query2 += " AND s.is_available = false";
    }
    query2 += " ORDER BY s.created_at ASC";
    const result = await db_default.query(query2, queryParams);
    res.json({
      stalls: result.rows
    });
  } catch (error) {
    next(error);
  }
});
router5.post("/events/:id/stalls", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventCheck = await db_default.query(
      "SELECT * FROM stall_events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)",
      [eventId, req.user.id, req.user.role === "admin"]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Stall event not found or you are not authorized to add stalls to it"
      });
    }
    const { name, description, price, size, locationInVenue } = req.body;
    const result = await db_default.query(
      `INSERT INTO stalls (
        stall_event_id, name, description, price, size, location_in_venue
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [eventId, name, description, price, size, locationInVenue]
    );
    const stall = result.rows[0];
    res.status(201).json({
      message: "Stall created successfully",
      stall
    });
  } catch (error) {
    next(error);
  }
});
router5.get("/:id", authenticate, authorize("stall_manager", "event_organizer", "admin"), async (req, res, next) => {
  try {
    const stallId = req.params.id;
    const stallResult = await db_default.query(
      `SELECT s.*, 
              se.title as event_title, 
              se.description as event_description,
              se.start_date, 
              se.end_date, 
              se.location,
              se.address,
              se.city,
              se.state,
              se.country,
              se.zip_code,
              u.first_name || ' ' || u.last_name as organizer_name,
              u.email as organizer_email,
              u.phone as organizer_phone
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       JOIN users u ON se.organizer_id = u.id
       WHERE s.id = $1`,
      [stallId]
    );
    if (stallResult.rows.length === 0) {
      return res.status(404).json({ message: "Stall not found" });
    }
    const stall = stallResult.rows[0];
    if (req.user.role === "stall_manager" && stall.manager_id !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to view this stall" });
    }
    if (req.user.role === "event_organizer") {
      const organizerCheck = await db_default.query(
        "SELECT organizer_id FROM stall_events WHERE id = $1",
        [stall.stall_event_id]
      );
      if (organizerCheck.rows[0].organizer_id !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to view this stall" });
      }
    }
    const statsResult = await db_default.query(
      `SELECT 
         COALESCE(SUM(b.stall_price), 0) as revenue,
         COUNT(DISTINCT b.user_id) as visitors
       FROM bookings b
       WHERE b.stall_id = $1 AND b.status = 'confirmed'`,
      [stallId]
    );
    const stats = statsResult.rows[0];
    const stallDetail = {
      ...stall,
      revenue: stats.revenue,
      visitors: parseInt(stats.visitors)
    };
    res.json({ stallDetail });
  } catch (error) {
    next(error);
  }
});
router5.put("/stalls/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const stallId = req.params.id;
    const stallCheck = await db_default.query(
      `SELECT s.* FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1 AND (se.organizer_id = $2 OR $3 = true)`,
      [stallId, req.user.id, req.user.role === "admin"]
    );
    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Stall not found or you are not authorized to edit it"
      });
    }
    const { name, description, price, size, locationInVenue, isAvailable } = req.body;
    const result = await db_default.query(
      `UPDATE stalls
       SET name = $1, description = $2, price = $3,
           size = $4, location_in_venue = $5, is_available = $6,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, price, size, locationInVenue, isAvailable, stallId]
    );
    const updatedStall = result.rows[0];
    res.json({
      message: "Stall updated successfully",
      stall: updatedStall
    });
  } catch (error) {
    next(error);
  }
});
router5.delete("/stalls/:id", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  try {
    const stallId = req.params.id;
    const stallCheck = await db_default.query(
      `SELECT s.* FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1 AND (se.organizer_id = $2 OR $3 = true)`,
      [stallId, req.user.id, req.user.role === "admin"]
    );
    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Stall not found or you are not authorized to delete it"
      });
    }
    const bookingsCheck = await db_default.query(
      "SELECT COUNT(*) FROM bookings WHERE stall_id = $1",
      [stallId]
    );
    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete stall with active bookings. Cancel all bookings first."
      });
    }
    await db_default.query("DELETE FROM stalls WHERE id = $1", [stallId]);
    res.json({ message: "Stall deleted successfully" });
  } catch (error) {
    next(error);
  }
});
router5.get("/admin/pending", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query2 = `
      SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
      FROM stall_events se
      JOIN users u ON se.organizer_id = u.id
      WHERE se.verification_status = 'pending'
      ORDER BY se.created_at ASC
      LIMIT $1 OFFSET $2
    `;
    const result = await db_default.query(query2, [parseInt(limit), offset]);
    const stallEvents = result.rows;
    for (const event of stallEvents) {
      const stallsResult = await db_default.query(
        "SELECT * FROM stalls WHERE stall_event_id = $1",
        [event.id]
      );
      event.stalls = stallsResult.rows;
    }
    const countResult = await db_default.query(
      "SELECT COUNT(*) FROM stall_events WHERE verification_status = $1",
      ["pending"]
    );
    const totalPending = parseInt(countResult.rows[0].count);
    res.json({
      stallEvents,
      pagination: {
        total: totalPending,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalPending / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router5.put("/events/verify/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { status, feedback } = req.body;
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be verified or rejected" });
    }
    const isPublished = status === "verified" ? true : false;
    const result = await db_default.query(
      `UPDATE stall_events
       SET verification_status = $1, is_published = $2, admin_feedback = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [status, isPublished, feedback || null, eventId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stall event not found" });
    }
    const event = result.rows[0];
    const message = status === "verified" ? `Your stall event "${event.title}" has been approved.` : `Your stall event "${event.title}" was not approved. ${feedback || ""}`;
    await db_default.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [event.organizer_id, `Stall Event ${status.charAt(0).toUpperCase() + status.slice(1)}`, message]
    );
    res.json({
      message: `Stall event ${status} successfully`,
      stallEvent: event
    });
  } catch (error) {
    next(error);
  }
});
router5.post("/requests", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { stallId, message } = req.body;
    if (!stallId) {
      return res.status(400).json({ message: "Stall ID is required" });
    }
    const stallCheck = await db_default.query(
      "SELECT * FROM stalls WHERE id = $1 AND is_available = true",
      [stallId]
    );
    if (stallCheck.rows.length === 0) {
      return res.status(404).json({ message: "Stall not found or is not available" });
    }
    const existingRequest = await db_default.query(
      "SELECT * FROM stall_requests WHERE stall_id = $1 AND manager_id = $2 AND status = $3",
      [stallId, req.user.id, "pending"]
    );
    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ message: "You already have a pending request for this stall" });
    }
    const result = await db_default.query(
      `INSERT INTO stall_requests (stall_id, manager_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [stallId, req.user.id, message]
    );
    const request = result.rows[0];
    const organizerInfo = await db_default.query(
      `SELECT se.organizer_id, s.name as stall_name, se.title as event_title
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1`,
      [stallId]
    );
    if (organizerInfo.rows.length > 0) {
      const { organizer_id, stall_name, event_title } = organizerInfo.rows[0];
      await db_default.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
        [
          organizer_id,
          "New Stall Request",
          `A stall manager has requested to manage "${stall_name}" in your event "${event_title}".`
        ]
      );
    }
    res.status(201).json({
      message: "Stall request submitted successfully",
      request
    });
  } catch (error) {
    next(error);
  }
});
router5.get("/requests/manager", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { status } = req.query;
    let query2 = `
      SELECT sr.*, s.name as stall_name, se.title as event_title,
             u.first_name || ' ' || u.last_name as organizer_name
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      JOIN users u ON se.organizer_id = u.id
      WHERE sr.manager_id = $1
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND sr.status = $${paramPosition}`;
      queryParams.push(status);
    }
    query2 += " ORDER BY sr.created_at DESC";
    const result = await db_default.query(query2, queryParams);
    res.json({
      requests: result.rows
    });
  } catch (error) {
    next(error);
  }
});
router5.get("/requests/organizer", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const { status } = req.query;
    let query2 = `
      SELECT sr.*, s.name as stall_name, se.title as event_title,
             u.first_name || ' ' || u.last_name as manager_name
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      JOIN users u ON sr.manager_id = u.id
      WHERE se.organizer_id = $1
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query2 += ` AND sr.status = $${paramPosition}`;
      queryParams.push(status);
    }
    query2 += " ORDER BY sr.created_at DESC";
    const result = await db_default.query(query2, queryParams);
    res.json({
      requests: result.rows
    });
  } catch (error) {
    next(error);
  }
});
router5.put("/requests/:id", authenticate, authorize("event_organizer"), async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const requestId = req.params.id;
    const { status, feedback } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be approved or rejected" });
    }
    const requestCheck = await client.query(
      `SELECT sr.*, s.stall_event_id, s.name as stall_name, se.title as event_title
       FROM stall_requests sr
       JOIN stalls s ON sr.stall_id = s.id
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE sr.id = $1 AND se.organizer_id = $2 AND sr.status = 'pending'`,
      [requestId, req.user.id]
    );
    if (requestCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Request not found, not pending, or you are not authorized to process it"
      });
    }
    const request = requestCheck.rows[0];
    const updateResult = await client.query(
      `UPDATE stall_requests
       SET status = $1, feedback = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, feedback, requestId]
    );
    if (status === "approved") {
      await client.query(
        `UPDATE stalls
         SET manager_id = $1, is_available = false, updated_at = NOW()
         WHERE id = $2`,
        [request.manager_id, request.stall_id]
      );
    }
    const message = status === "approved" ? `Your request to manage stall "${request.stall_name}" in event "${request.event_title}" has been approved.` : `Your request to manage stall "${request.stall_name}" in event "${request.event_title}" has been rejected. ${feedback || ""}`;
    await client.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [request.manager_id, `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`, message]
    );
    await client.query("COMMIT");
    res.json({
      message: `Stall request ${status} successfully`,
      request: updateResult.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router5.get("/available", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, eventId } = req.query;
    const offset = (page - 1) * limit;
    let query2 = `
      SELECT s.*, se.title as event_title, se.start_date, se.end_date,
             se.city, se.country
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.is_available = true 
      AND s.manager_id IS NULL
      AND se.verification_status = 'verified'
      AND se.is_published = true
    `;
    const queryParams = [];
    let paramPosition = 1;
    if (eventId) {
      query2 += ` AND s.stall_event_id = $${paramPosition}`;
      queryParams.push(eventId);
      paramPosition++;
    }
    query2 += `
      ORDER BY se.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db_default.query(query2, queryParams);
    let countQuery = `
      SELECT COUNT(*) FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.is_available = true 
      AND s.manager_id IS NULL
      AND se.verification_status = 'verified'
      AND se.is_published = true
    `;
    const countParams = [];
    let countPosition = 1;
    if (eventId) {
      countQuery += ` AND s.stall_event_id = $${countPosition}`;
      countParams.push(eventId);
    }
    const countResult = await db_default.query(countQuery, countParams);
    const totalStalls = parseInt(countResult.rows[0].count);
    res.json({
      stalls: result.rows,
      pagination: {
        total: totalStalls,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalStalls / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
router5.put("/release/:id", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const stallId = req.params.id;
    const stallCheck = await db_default.query(
      "SELECT * FROM stalls WHERE id = $1 AND manager_id = $2",
      [stallId, req.user.id]
    );
    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Stall not found or you are not managing this stall"
      });
    }
    const bookingsCheck = await db_default.query(
      "SELECT COUNT(*) FROM bookings WHERE stall_id = $1 AND status = 'confirmed'",
      [stallId]
    );
    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot release stall with active bookings. Cancel all bookings first."
      });
    }
    const result = await db_default.query(
      `UPDATE stalls
       SET manager_id = NULL, is_available = true, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [stallId]
    );
    const stall = result.rows[0];
    const organizerInfo = await db_default.query(
      `SELECT se.organizer_id, s.name as stall_name, se.title as event_title
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1`,
      [stallId]
    );
    if (organizerInfo.rows.length > 0) {
      const { organizer_id, stall_name, event_title } = organizerInfo.rows[0];
      await db_default.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
        [
          organizer_id,
          "Stall Released",
          `A stall manager has released "${stall_name}" in your event "${event_title}".`
        ]
      );
    }
    res.json({
      message: "Stall released successfully",
      stall
    });
  } catch (error) {
    next(error);
  }
});
var stalls_default = router5;

// routes/payments.js
var import_express6 = __toESM(require("express"), 1);
var router6 = import_express6.default.Router();
router6.post("/process/:bookingId", authenticate, async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const { bookingId } = req.params;
    const { paymentMethod, transactionId } = req.body;
    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [bookingId, req.user.id]
    );
    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }
    const booking = bookingResult.rows[0];
    if (booking.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }
    const existingPaymentResult = await client.query(
      "SELECT * FROM payments WHERE booking_id = $1",
      [bookingId]
    );
    if (existingPaymentResult.rows.length > 0) {
      const existingPayment = existingPaymentResult.rows[0];
      if (existingPayment.status === "completed") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Payment already completed for this booking" });
      }
    }
    let paymentResult;
    if (existingPaymentResult.rows.length > 0) {
      paymentResult = await client.query(
        `UPDATE payments
         SET amount = $1, payment_date = NOW(), payment_method = $2,
             transaction_id = $3, status = 'completed', updated_at = NOW()
         WHERE booking_id = $4
         RETURNING *`,
        [booking.total_price, paymentMethod, transactionId || "SIMULATED", bookingId]
      );
    } else {
      paymentResult = await client.query(
        `INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, status)
         VALUES ($1, $2, $3, $4, $5, 'completed')
         RETURNING *`,
        [bookingId, req.user.id, booking.total_price, paymentMethod, transactionId || "SIMULATED"]
      );
    }
    const payment = paymentResult.rows[0];
    await client.query(
      `UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
      [bookingId]
    );
    await client.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [
        req.user.id,
        "Payment Successful",
        `Your payment of $${booking.total_price} for booking #${bookingId.substring(0, 8)} has been processed successfully.`
      ]
    );
    await client.query("COMMIT");
    res.json({
      message: "Payment processed successfully",
      payment,
      redirectUrl: `/confirmation/${bookingId}`
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router6.get("/:paymentId", authenticate, async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const query2 = `
      SELECT p.*, b.user_id, b.total_price, b.event_id, b.stall_id, b.quantity,
             e.title as event_title, s.name as stall_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      WHERE p.id = $1 AND (b.user_id = $2 OR $3 = true)
    `;
    const result = await db_default.query(query2, [
      paymentId,
      req.user.id,
      req.user.role === "admin"
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found or unauthorized" });
    }
    res.json({ payment: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
router6.get("/booking/:bookingId", authenticate, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const query2 = `
      SELECT p.*, b.user_id, b.status as booking_status
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = $1 AND (b.user_id = $2 OR $3 = true)
    `;
    const result = await db_default.query(query2, [
      bookingId,
      req.user.id,
      req.user.role === "admin"
    ]);
    if (result.rows.length === 0) {
      const bookingCheck = await db_default.query(
        "SELECT * FROM bookings WHERE id = $1 AND (user_id = $2 OR $3 = true)",
        [bookingId, req.user.id, req.user.role === "admin"]
      );
      if (bookingCheck.rows.length === 0) {
        return res.status(404).json({ message: "Booking not found or unauthorized" });
      }
      return res.json({
        payment: null,
        booking: bookingCheck.rows[0],
        message: "No payment record found for this booking"
      });
    }
    res.json({ payment: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
var payments_default = router6;

// routes/dashboard.js
var import_express7 = __toESM(require("express"), 1);
var router7 = import_express7.default.Router();
router7.get("/admin", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const userStats = await db_default.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);
    const pendingUsers = await db_default.query(`
      SELECT COUNT(*) FROM users
      WHERE verification_status = 'pending' AND role != 'user'
    `);
    const pendingEvents = await db_default.query(`
      SELECT COUNT(*) FROM events
      WHERE verification_status = 'pending'
    `);
    const revenueStats = await db_default.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions,
        AVG(p.amount) as average_transaction
      FROM payments p
      WHERE p.status = 'completed'
    `);
    const eventStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events
      FROM events
      WHERE verification_status = 'verified'
    `);
    const recentTransactions = await db_default.query(`
      SELECT p.id, p.amount, p.payment_date, p.status,
             u.first_name || ' ' || u.last_name as user_name,
             CASE
               WHEN b.event_id IS NOT NULL THEN e.title
               WHEN b.stall_id IS NOT NULL THEN s.name
             END as item_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      ORDER BY p.payment_date DESC
      LIMIT 10
    `);
    res.json({
      userStats: userStats.rows,
      pendingVerifications: {
        users: parseInt(pendingUsers.rows[0].count),
        events: parseInt(pendingEvents.rows[0].count)
      },
      revenueStats: revenueStats.rows[0],
      eventStats: eventStats.rows[0],
      recentTransactions: recentTransactions.rows
    });
  } catch (error) {
    next(error);
  }
});
router7.get("/organizer", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const ticketEventStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_events
      FROM events
      WHERE organizer_id = $1
    `, [req.user.id]);
    const stallEventStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_events
      FROM stall_events
      WHERE organizer_id = $1
    `, [req.user.id]);
    const ticketBookingStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed' AND b.booking_date >= NOW() - INTERVAL '1 month') as last_month_confirmed_bookings
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
    `, [req.user.id]);
    const stallStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE s.is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE s.is_available = false) as booked_stalls,
        COUNT(*) FILTER (WHERE s.manager_id IS NOT NULL) as managed_stalls
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
    `, [req.user.id]);
    const managerStats = await db_default.query(`
      SELECT COUNT(DISTINCT s.manager_id) as total_managers
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND s.manager_id IS NOT NULL
    `, [req.user.id]);
    const ticketRevenueStats = await db_default.query(`
      SELECT 
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COUNT(p.id) as total_transactions,
        COALESCE(SUM(p.amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE)), 0) as this_month_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);
    const stallRevenueStats = await db_default.query(`
      SELECT 
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COUNT(p.id) as total_transactions,
        COALESCE(SUM(p.amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE)), 0) as this_month_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);
    const recentTicketBookings = await db_default.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             e.title as event_title,
             'ticket' as booking_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);
    const recentStallBookings = await db_default.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title,
             'stall' as booking_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);
    const allRecentBookings = [...recentTicketBookings.rows, ...recentStallBookings.rows].sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date)).slice(0, 5);
    const monthlyTicketRevenue = await db_default.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as month,
        SUM(p.amount) as revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1 AND p.status = 'completed'
      AND p.payment_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `, [req.user.id]);
    const monthlyStallRevenue = await db_default.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as month,
        SUM(p.amount) as revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
      AND p.payment_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `, [req.user.id]);
    const monthlyRevenue = {};
    monthlyTicketRevenue.rows.forEach((row) => {
      if (!monthlyRevenue[row.month]) {
        monthlyRevenue[row.month] = { month: row.month, ticket_revenue: 0, stall_revenue: 0 };
      }
      monthlyRevenue[row.month].ticket_revenue = parseFloat(row.revenue);
    });
    monthlyStallRevenue.rows.forEach((row) => {
      if (!monthlyRevenue[row.month]) {
        monthlyRevenue[row.month] = { month: row.month, ticket_revenue: 0, stall_revenue: 0 };
      }
      monthlyRevenue[row.month].stall_revenue = parseFloat(row.revenue);
    });
    const combinedMonthlyRevenue = Object.values(monthlyRevenue).map((item) => ({
      ...item,
      total_revenue: item.ticket_revenue + item.stall_revenue
    }));
    const pendingRequests = await db_default.query(`
      SELECT COUNT(*) as count
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND sr.status = 'pending'
    `, [req.user.id]);
    res.json({
      eventStats: {
        ticketEvents: ticketEventStats.rows[0],
        stallEvents: stallEventStats.rows[0],
        total: {
          total_events: parseInt(ticketEventStats.rows[0].total_events) + parseInt(stallEventStats.rows[0].total_events),
          pending_events: parseInt(ticketEventStats.rows[0].pending_events) + parseInt(stallEventStats.rows[0].pending_events),
          approved_events: parseInt(ticketEventStats.rows[0].approved_events) + parseInt(stallEventStats.rows[0].approved_events),
          upcoming_events: parseInt(ticketEventStats.rows[0].upcoming_events) + parseInt(stallEventStats.rows[0].upcoming_events),
          past_events: parseInt(ticketEventStats.rows[0].past_events) + parseInt(stallEventStats.rows[0].past_events),
          this_month_events: parseInt(ticketEventStats.rows[0].this_month_events) + parseInt(stallEventStats.rows[0].this_month_events)
        }
      },
      bookingStats: ticketBookingStats.rows[0],
      stallStats: stallStats.rows[0],
      managerStats: managerStats.rows[0],
      revenueStats: {
        ticketEvents: ticketRevenueStats.rows[0],
        stallEvents: stallRevenueStats.rows[0],
        total: {
          total_revenue: parseFloat(ticketRevenueStats.rows[0].total_revenue) + parseFloat(stallRevenueStats.rows[0].total_revenue),
          total_transactions: parseInt(ticketRevenueStats.rows[0].total_transactions) + parseInt(stallRevenueStats.rows[0].total_transactions),
          this_month_revenue: parseFloat(ticketRevenueStats.rows[0].this_month_revenue) + parseFloat(stallRevenueStats.rows[0].this_month_revenue)
        }
      },
      recentBookings: allRecentBookings,
      monthlyRevenue: combinedMonthlyRevenue,
      pendingRequests: parseInt(pendingRequests.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});
router7.get("/stall-organizer", authenticate, authorize("stall_organizer"), async (req, res, next) => {
  try {
    const eventStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events
      FROM stall_events
      WHERE organizer_id = $1
    `, [req.user.id]);
    const stallStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE s.is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE s.is_available = false) as booked_stalls,
        COUNT(*) FILTER (WHERE s.manager_id IS NOT NULL) as managed_stalls
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
    `, [req.user.id]);
    const managerStats = await db_default.query(`
      SELECT COUNT(DISTINCT s.manager_id) as total_managers
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND s.manager_id IS NOT NULL
    `, [req.user.id]);
    const revenueStats = await db_default.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);
    const recentBookings = await db_default.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);
    res.json({
      eventStats: eventStats.rows[0],
      stallStats: stallStats.rows[0],
      managerStats: managerStats.rows[0],
      revenueStats: revenueStats.rows[0],
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
});
router7.get("/stall-manager", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const stallStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE is_available = false) as booked_stalls
      FROM stalls
      WHERE manager_id = $1
    `, [req.user.id]);
    const bookingStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings
      FROM bookings b
      JOIN stalls s ON b.stall_id = s.id
      WHERE s.manager_id = $1
    `, [req.user.id]);
    const revenueStats = await db_default.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      WHERE s.manager_id = $1 AND p.status = 'completed'
    `, [req.user.id]);
    const recentBookings = await db_default.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.manager_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);
    res.json({
      stallStats: stallStats.rows[0],
      bookingStats: bookingStats.rows[0],
      revenueStats: revenueStats.rows[0],
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
});
router7.get("/user", authenticate, async (req, res, next) => {
  try {
    const bookingStats = await db_default.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings
      FROM bookings
      WHERE user_id = $1
    `, [req.user.id]);
    const totalSpent = await db_default.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total_spent
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE b.user_id = $1 AND p.status = 'completed'
    `, [req.user.id]);
    const upcomingEvents = await db_default.query(`
      SELECT b.id as booking_id, e.id as event_id, e.title, e.start_date, e.location, e.banner_image
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      AND b.status = 'confirmed'
      AND e.start_date > NOW()
      ORDER BY e.start_date
      LIMIT 5
    `, [req.user.id]);
    const recentBookings = await db_default.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             CASE
               WHEN b.event_id IS NOT NULL THEN e.title
               WHEN b.stall_id IS NOT NULL THEN s.name
             END as item_name,
             p.status as payment_status
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);
    const unreadNotifications = await db_default.query(`
      SELECT COUNT(*) FROM notifications
      WHERE user_id = $1 AND is_read = false
    `, [req.user.id]);
    res.json({
      bookingStats: bookingStats.rows[0],
      totalSpent: parseFloat(totalSpent.rows[0].total_spent),
      upcomingEvents: upcomingEvents.rows,
      recentBookings: recentBookings.rows,
      unreadNotifications: parseInt(unreadNotifications.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});
var dashboard_default = router7;

// routes/stallRequests.js
var import_express8 = __toESM(require("express"), 1);
var router8 = import_express8.default.Router();
router8.get("/:id", authenticate, authorize("stall_manager", "event_organizer", "admin"), async (req, res, next) => {
  try {
    const requestId = req.params.id;
    let query2;
    let params;
    if (req.user.role === "stall_manager") {
      query2 = `
        SELECT sr.*, s.name as stall_name, se.title as event_title
        FROM stall_requests sr
        JOIN stalls s ON sr.stall_id = s.id
        JOIN stall_events se ON s.stall_event_id = se.id
        WHERE sr.id = $1 AND sr.requester_id = $2
      `;
      params = [requestId, req.user.id];
    } else {
      query2 = `
        SELECT sr.*, s.name as stall_name, se.title as event_title,
               u.first_name || ' ' || u.last_name as requester_name
        FROM stall_requests sr
        JOIN stalls s ON sr.stall_id = s.id
        JOIN stall_events se ON s.stall_event_id = se.id
        JOIN users u ON sr.requester_id = u.id
        WHERE sr.id = $1 AND (se.organizer_id = $2 OR $3 = true)
      `;
      params = [requestId, req.user.id, req.user.role === "admin"];
    }
    const result = await db_default.query(query2, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stall request not found or you are not authorized to view it" });
    }
    res.json({ stallRequest: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
router8.post("/", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { stallEventId, eventId, stallId, requestMessage } = req.body;
    if (!stallEventId && !eventId) {
      return res.status(400).json({ message: "Either Stall event ID or Event ID is required" });
    }
    let organizerId;
    if (stallEventId) {
      const eventCheck = await db_default.query(
        "SELECT organizer_id FROM stall_events WHERE id = $1",
        [stallEventId]
      );
      if (eventCheck.rows.length === 0) {
        return res.status(404).json({ message: "Stall event not found" });
      }
      organizerId = eventCheck.rows[0].organizer_id;
      if (stallId) {
        const stallCheck = await db_default.query(
          "SELECT * FROM stalls WHERE id = $1 AND stall_event_id = $2",
          [stallId, stallEventId]
        );
        if (stallCheck.rows.length === 0) {
          return res.status(404).json({ message: "Stall not found or does not belong to this event" });
        }
      }
    } else {
      const eventCheck = await db_default.query(
        "SELECT organizer_id FROM events WHERE id = $1",
        [eventId]
      );
      if (eventCheck.rows.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      organizerId = eventCheck.rows[0].organizer_id;
      if (stallId) {
        const stallCheck = await db_default.query(
          "SELECT * FROM stalls WHERE id = $1 AND event_id = $2",
          [stallId, eventId]
        );
        if (stallCheck.rows.length === 0) {
          return res.status(404).json({ message: "Stall not found or does not belong to this event" });
        }
      }
    }
    const result = await db_default.query(
      `INSERT INTO stall_requests (
          requester_id, stall_event_id, event_id, stall_id, organizer_id, request_message
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [req.user.id, stallEventId || null, eventId || null, stallId, organizerId, requestMessage]
    );
    await db_default.query(
      `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
      [
        organizerId,
        "New Stall Request",
        `A new stall request has been submitted for your event.`
      ]
    );
    res.status(201).json({
      message: "Stall request submitted successfully",
      request: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});
router8.put("/:id/status", authenticate, authorize("event_organizer", "admin"), async (req, res, next) => {
  const client = await db_default.getClient();
  try {
    await client.query("BEGIN");
    const requestId = req.params.id;
    const { status, feedback } = req.body;
    if (!["verified", "rejected"].includes(status)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid status. Must be verified or rejected" });
    }
    const requestExistsQuery = `
            SELECT sr.*, sr.stall_id
            FROM stall_requests sr
            WHERE sr.id = $1 AND (sr.organizer_id = $2 OR $3 = true) AND sr.status = 'pending'
        `;
    const requestExists = await client.query(requestExistsQuery, [requestId, req.user.id, req.user.role === "admin"]);
    if (requestExists.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Stall request not found, not pending, or you are not authorized to manage it"
      });
    }
    const request = requestExists.rows[0];
    let eventTitle, stallName;
    if (request.stall_event_id) {
      const detailsQuery = `
                SELECT s.name as stall_name, se.title as event_title
                FROM stalls s
                JOIN stall_events se ON s.stall_event_id = se.id
                WHERE s.id = $1
            `;
      const details = await client.query(detailsQuery, [request.stall_id]);
      if (details.rows.length > 0) {
        stallName = details.rows[0].stall_name;
        eventTitle = details.rows[0].event_title;
      }
    } else if (request.event_id) {
      const detailsQuery = `
                SELECT s.name as stall_name, e.title as event_title
                FROM stalls s
                JOIN events e ON s.event_id = e.id
                WHERE s.id = $1
            `;
      const details = await client.query(detailsQuery, [request.stall_id]);
      if (details.rows.length > 0) {
        stallName = details.rows[0].stall_name;
        eventTitle = details.rows[0].event_title;
      }
    }
    const updatedRequest = await client.query(
      `UPDATE stall_requests
             SET status = $1, response_message = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
      [status, feedback, requestId]
    );
    if (status === "verified") {
      await client.query(
        `UPDATE stalls
                 SET manager_id = $1, is_available = false, updated_at = NOW()
                 WHERE id = $2`,
        [request.requester_id, request.stall_id]
      );
    }
    const notificationTitle = `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    const notificationMessage = status === "verified" ? `Your request to manage the stall "${stallName || "requested"}" at "${eventTitle || "the event"}" has been approved.` : `Your request to manage the stall "${stallName || "requested"}" at "${eventTitle || "the event"}" has been rejected. ${feedback || ""}`;
    await client.query(
      `INSERT INTO notifications (user_id, title, message)
             VALUES ($1, $2, $3)`,
      [request.requester_id, notificationTitle, notificationMessage]
    );
    await client.query("COMMIT");
    res.json({
      message: `Stall request ${status} successfully`,
      stallRequest: updatedRequest.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});
router8.get("/manager/requests", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { status } = req.query;
    let query2 = `
      SELECT sr.*, s.name as stall_name, 
             se.title as event_title, se.start_date, se.end_date
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE sr.requester_id = $1
    `;
    const queryParams = [req.user.id];
    if (status) {
      query2 += ` AND sr.status = $2`;
      queryParams.push(status);
    }
    query2 += ` ORDER BY sr.created_at DESC`;
    const result = await db_default.query(query2, queryParams);
    res.json({ stallRequests: result.rows });
  } catch (error) {
    next(error);
  }
});
router8.get("/organizer/requests", authenticate, authorize("event_organizer"), async (req, res, next) => {
  try {
    const { status } = req.query;
    let query2 = `
      SELECT sr.*, 
             COALESCE(s.name, 'N/A') as stall_name, 
             COALESCE(se.title, e.title) as event_title,
             u.first_name || ' ' || u.last_name as requester_name,
             CASE 
                WHEN sr.stall_event_id IS NOT NULL THEN 'stall_event'
                WHEN sr.event_id IS NOT NULL THEN 'regular_event'
                ELSE NULL
             END as event_type
      FROM stall_requests sr
      LEFT JOIN stalls s ON sr.stall_id = s.id
      LEFT JOIN stall_events se ON sr.stall_event_id = se.id
      LEFT JOIN events e ON sr.event_id = e.id
      JOIN users u ON sr.requester_id = u.id
      WHERE sr.organizer_id = $1
    `;
    const queryParams = [req.user.id];
    if (status) {
      query2 += ` AND sr.status = $2`;
      queryParams.push(status);
    }
    query2 += ` ORDER BY sr.created_at DESC`;
    const result = await db_default.query(query2, queryParams);
    res.json({ stallRequests: result.rows });
  } catch (error) {
    next(error);
  }
});
var stallRequests_default = router8;

// routes/inventory.js
var import_express9 = __toESM(require("express"), 1);
var router9 = import_express9.default.Router();
router9.get("/categories", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const categories = await db_default.query(`
      SELECT * FROM inventory_categories
      ORDER BY name
    `);
    res.json(categories.rows);
  } catch (error) {
    next(error);
  }
});
router9.get("/stalls/:stallId/products", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { stallId } = req.params;
    const stallAccess = await db_default.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);
    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: "You do not have access to this stall" });
    }
    const products = await db_default.query(`
      SELECT p.*, c.name as category_name
      FROM inventory_products p
      JOIN inventory_categories c ON p.category_id = c.id
      WHERE p.stall_id = $1 AND p.is_active = TRUE
      ORDER BY p.created_at DESC
    `, [stallId]);
    res.json(products.rows);
  } catch (error) {
    next(error);
  }
});
router9.post("/stalls/:stallId/products", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { stallId } = req.params;
    const {
      name,
      category_id,
      price,
      quantity,
      description,
      size,
      color,
      ingredients,
      allergens,
      dietary,
      material,
      weight,
      dimensions,
      image_url
    } = req.body;
    const stallAccess = await db_default.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);
    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: "You do not have access to this stall" });
    }
    if (!name || !category_id || !price || quantity === void 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const client = await db_default.getClient();
    try {
      await client.query("BEGIN");
      const productResult = await client.query(`
        INSERT INTO inventory_products (
          stall_id, category_id, name, description, price, quantity,
          size, color, ingredients, allergens, dietary,
          material, weight, dimensions, image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        stallId,
        category_id,
        name,
        description,
        price,
        quantity,
        size,
        color,
        ingredients,
        allergens,
        dietary,
        material,
        weight,
        dimensions,
        image_url
      ]);
      const product = productResult.rows[0];
      await client.query(`
        INSERT INTO inventory_transactions (
          product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        product.id,
        stallId,
        req.user.id,
        "add",
        quantity,
        0,
        "Initial inventory"
      ]);
      await client.query("COMMIT");
      const categoryResult = await db_default.query(`
        SELECT name FROM inventory_categories WHERE id = $1
      `, [category_id]);
      product.category_name = categoryResult.rows[0]?.name;
      res.status(201).json(product);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});
router9.put("/products/:productId", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      name,
      category_id,
      price,
      quantity,
      description,
      size,
      color,
      ingredients,
      allergens,
      dietary,
      material,
      weight,
      dimensions,
      image_url
    } = req.body;
    const productAccess = await db_default.query(`
      SELECT p.id, p.stall_id, p.quantity FROM inventory_products p
      JOIN stalls s ON p.stall_id = s.id
      WHERE p.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [productId, req.user.id]);
    if (productAccess.rows.length === 0) {
      return res.status(403).json({ message: "You do not have access to this product" });
    }
    const previousQuantity = productAccess.rows[0].quantity;
    const stallId = productAccess.rows[0].stall_id;
    const client = await db_default.getClient();
    try {
      await client.query("BEGIN");
      const productResult = await client.query(`
        UPDATE inventory_products
        SET 
          name = COALESCE($1, name),
          category_id = COALESCE($2, category_id),
          price = COALESCE($3, price),
          quantity = COALESCE($4, quantity),
          description = COALESCE($5, description),
          size = COALESCE($6, size),
          color = COALESCE($7, color),
          ingredients = COALESCE($8, ingredients),
          allergens = COALESCE($9, allergens),
          dietary = COALESCE($10, dietary),
          material = COALESCE($11, material),
          weight = COALESCE($12, weight),
          dimensions = COALESCE($13, dimensions),
          image_url = COALESCE($14, image_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *
      `, [
        name,
        category_id,
        price,
        quantity,
        description,
        size,
        color,
        ingredients,
        allergens,
        dietary,
        material,
        weight,
        dimensions,
        image_url,
        productId
      ]);
      const product = productResult.rows[0];
      if (quantity !== void 0 && quantity !== previousQuantity) {
        await client.query(`
          INSERT INTO inventory_transactions (
            product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          productId,
          stallId,
          req.user.id,
          "update",
          quantity,
          previousQuantity,
          "Inventory update"
        ]);
      }
      await client.query("COMMIT");
      const categoryResult = await db_default.query(`
        SELECT name FROM inventory_categories WHERE id = $1
      `, [product.category_id]);
      product.category_name = categoryResult.rows[0]?.name;
      res.json(product);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});
router9.delete("/products/:productId", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productAccess = await db_default.query(`
      SELECT p.id, p.stall_id, p.quantity FROM inventory_products p
      JOIN stalls s ON p.stall_id = s.id
      WHERE p.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [productId, req.user.id]);
    if (productAccess.rows.length === 0) {
      return res.status(403).json({ message: "You do not have access to this product" });
    }
    const previousQuantity = productAccess.rows[0].quantity;
    const stallId = productAccess.rows[0].stall_id;
    const client = await db_default.getClient();
    try {
      await client.query("BEGIN");
      await client.query(`
        UPDATE inventory_products
        SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [productId]);
      await client.query(`
        INSERT INTO inventory_transactions (
          product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        productId,
        stallId,
        req.user.id,
        "remove",
        0,
        previousQuantity,
        "Product removed"
      ]);
      await client.query("COMMIT");
      res.json({ message: "Product removed successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});
router9.get("/stalls/:stallId/transactions", authenticate, authorize("stall_manager"), async (req, res, next) => {
  try {
    const { stallId } = req.params;
    const stallAccess = await db_default.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);
    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: "You do not have access to this stall" });
    }
    const transactions = await db_default.query(`
      SELECT t.*, p.name as product_name, u.first_name || ' ' || u.last_name as user_name
      FROM inventory_transactions t
      JOIN inventory_products p ON t.product_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.stall_id = $1
      ORDER BY t.created_at DESC
      LIMIT 100
    `, [stallId]);
    res.json(transactions.rows);
  } catch (error) {
    next(error);
  }
});
var inventory_default = router9;

// middleware/errorHandler.js
var errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "production" ? void 0 : err.stack
  });
};

// index.js
var import_meta3 = {};
import_dotenv3.default.config();
var app = (0, import_express10.default)();
var PORT = process.env.PORT || 3e3;
var __dirname3 = import_path5.default.dirname((0, import_url3.fileURLToPath)(import_meta3.url));
app.use((0, import_cors.default)({
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:8080",
  credentials: true
}));
app.use(import_express10.default.json());
app.use((0, import_cookie_parser.default)());
app.use("/uploads", import_express10.default.static(import_path5.default.join(__dirname3, "uploads")));
app.use("/api/auth", auth_default);
app.use("/api/events", events_default);
app.use("/api/bookings", bookings_default);
app.use("/api/users", authenticate, users_default);
app.use("/api/stalls", authenticate, stalls_default);
app.use("/api/inventory", inventory_default);
app.use("/api/payments", payments_default);
app.use("/api/dashboard", authenticate, dashboard_default);
app.use("/api/stall-requests", stallRequests_default);
app.get("/api/admin/pending-all", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const eventsPromise = db_default.query(
      `SELECT e.*, 'event' as type, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.verification_status = 'pending'`
    );
    const stallEventsPromise = db_default.query(
      `SELECT se.*, 'stall_event' as type, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.verification_status = 'pending'`
    );
    const [eventsResult, stallEventsResult] = await Promise.all([eventsPromise, stallEventsPromise]);
    res.json({
      pendingItems: [
        ...eventsResult.rows,
        ...stallEventsResult.rows
      ]
    });
  } catch (error) {
    next(error);
  }
});
app.use(errorHandler);
if (process.env.NODE_ENV === "production") {
  app.use(import_express10.default.static(import_path5.default.join(__dirname3, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(import_path5.default.join(__dirname3, "../dist/index.html"));
  });
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
var index_default = app;
/*! Bundled license information:

object-assign/index.js:
  (*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  *)

vary/index.js:
  (*!
   * vary
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

cookie-parser/index.js:
  (*!
   * cookie-parser
   * Copyright(c) 2014 TJ Holowaychuk
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
