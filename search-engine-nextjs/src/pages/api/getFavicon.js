"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var jimp_1 = require("jimp");
function resizeImage(buffer) {
    return __awaiter(this, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jimp_1.default.read(buffer)];
                case 1:
                    image = _a.sent();
                    image.resize(32, 32);
                    return [4 /*yield*/, image.getBufferAsync(jimp_1.default.MIME_PNG)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// BufferからBase64に変換する関数
function toBase64(buffer) {
    return buffer.toString('base64');
}
// faviconを取得し、Base64形式に変換する関数
function getFaviconAsBase64(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, resizedBuffer, error_1, response, $, faviconUrl, faviconResponse, resizedBuffer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 11]);
                    return [4 /*yield*/, axios_1.default.get("".concat(url, "/favicon.ico"), {
                            responseType: 'arraybuffer',
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, resizeImage(Buffer.from(response.data, 'binary'))];
                case 2:
                    resizedBuffer = _a.sent();
                    return [2 /*return*/, "data:image/png;base64,".concat(toBase64(resizedBuffer))];
                case 3:
                    error_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 5:
                    response = _a.sent();
                    $ = cheerio_1.default.load(response.data);
                    faviconUrl = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
                    if (!faviconUrl) return [3 /*break*/, 8];
                    return [4 /*yield*/, axios_1.default.get(faviconUrl, {
                            responseType: 'arraybuffer',
                        })];
                case 6:
                    faviconResponse = _a.sent();
                    return [4 /*yield*/, resizeImage(Buffer.from(faviconResponse.data, 'binary'))];
                case 7:
                    resizedBuffer = _a.sent();
                    return [2 /*return*/, "data:image/png;base64,".concat(toBase64(resizedBuffer))];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_2 = _a.sent();
                    return [2 /*return*/, null];
                case 10: return [3 /*break*/, 11];
                case 11: return [2 /*return*/, null];
            }
        });
    });
}
function getFaviconAltAsBase64(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, $, faviconUrl, faviconResponse, resizedBuffer, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    $ = cheerio_1.default.load(response.data);
                    faviconUrl = $('link[rel="icon"]').attr('href') || $('meta[property="og:image"]').attr('content');
                    // If the favicon URL is not absolute, make it absolute
                    if (faviconUrl && !faviconUrl.startsWith('http')) {
                        faviconUrl = new URL(faviconUrl, url).href;
                    }
                    if (!faviconUrl) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios_1.default.get(faviconUrl, {
                            responseType: 'arraybuffer',
                        })];
                case 2:
                    faviconResponse = _a.sent();
                    return [4 /*yield*/, resizeImage(Buffer.from(faviconResponse.data, 'binary'))];
                case 3:
                    resizedBuffer = _a.sent();
                    return [2 /*return*/, "data:image/png;base64,".concat(toBase64(resizedBuffer))];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
function getFaviconTryAllAsBase64(url) {
    return __awaiter(this, void 0, void 0, function () {
        var favicon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFaviconAsBase64(url)];
                case 1:
                    favicon = _a.sent();
                    if (favicon) {
                        return [2 /*return*/, favicon];
                    }
                    return [2 /*return*/, getFaviconAltAsBase64(url)];
            }
        });
    });
}
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, favicon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = req.query.url;
                    // urlがundefinedまたは空文字列でないことを確認
                    if (!url || typeof url !== 'string') {
                        res.status(400).json({ error: 'Invalid URL' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getFaviconTryAllAsBase64(url)];
                case 1:
                    favicon = _a.sent();
                    if (favicon) {
                        res.status(200).json({ favicon: favicon });
                    }
                    else {
                        res.status(500).json({ error: 'Could not fetch favicon' });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
