"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("next/router"));
exports.default = (context, target) => {
    if (context.res) {
        context.res.writeHead(303, { Location: target });
        context.res.end();
    }
    else {
        router_1.default.replace(target);
    }
};
//# sourceMappingURL=redirect.js.map