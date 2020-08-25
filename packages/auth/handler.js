"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const index_1 = require("./passport/index");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('deepcase:auth:handler');
exports.Handler = (options) => (req, res) => {
    const { provider } = req.query;
    debug('handle', { provider });
    if (!provider)
        return { statusCode: 404 };
    if (provider === 'logout') {
        (req === null || req === void 0 ? void 0 : req.logout) && (req === null || req === void 0 ? void 0 : req.logout());
        res === null || res === void 0 ? void 0 : res.redirect('/');
        return;
    }
    index_1.passport.authenticate(provider, options)(req, res, () => {
        debug('authenticate');
        if (options)
            return true;
        res === null || res === void 0 ? void 0 : res.redirect('/');
    });
};
//# sourceMappingURL=handler.js.map