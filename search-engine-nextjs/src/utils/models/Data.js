"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var DataSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    about: { type: String, required: true },
    textSnippet: { type: String, required: true },
    fetchedAt: { type: Date, default: Date.now },
    relatedUrls: { type: [String], default: [] }, // 追加したフィールド
    favicon: { type: String, default: '' } // 追加したフィールド
});
exports.default = mongoose_1.default.models.Data || mongoose_1.default.model('Data', DataSchema);
