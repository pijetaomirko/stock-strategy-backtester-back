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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelExtractor = void 0;
var csv_parser_1 = __importDefault(require("csv-parser"));
var fs_1 = require("fs");
var yml_1 = require("../yml/yml");
var vertical_slice_1 = require("../model/price/vertical-slice");
var stock_data_1 = require("../model/price/stock-data");
var ExcelExtractor = /** @class */ (function () {
    function ExcelExtractor() {
    }
    ExcelExtractor.prototype.getFileNames = function (dirPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1.readdir(dirPath, function (err, files) {
                            if (err)
                                reject("Unable to scan directory: " + err);
                            resolve(files);
                        });
                    })];
            });
        });
    };
    ExcelExtractor.prototype.extractCsvData = function (path, withPointers) {
        if (withPointers === void 0) { withPointers = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, rej) {
                        var stockData = new stock_data_1.StockData();
                        var slice = new vertical_slice_1.VerticalSlice(new Date(), 0, 0, 0, 0);
                        fs_1.createReadStream(path)
                            .pipe(csv_parser_1.default({}))
                            .on("data", function (data) {
                            stockData.append(data, withPointers);
                        })
                            .on("end", function () {
                            resolve(stockData);
                        });
                    })];
            });
        });
    };
    ExcelExtractor.prototype.readPriceData = function (withPointers) {
        var _this = this;
        if (withPointers === void 0) { withPointers = true; }
        return new Promise(function (resolve, rej) { return __awaiter(_this, void 0, void 0, function () {
            var fileNames, stocksData, i, extractedStockData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileNames(yml_1.yml.excelPath)];
                    case 1:
                        fileNames = _a.sent();
                        stocksData = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < fileNames.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractCsvData(yml_1.yml.excelPath + "/" + fileNames[i], withPointers)];
                    case 3:
                        extractedStockData = _a.sent();
                        stocksData.push(extractedStockData);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        resolve(stocksData);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ExcelExtractor;
}());
exports.ExcelExtractor = ExcelExtractor;
