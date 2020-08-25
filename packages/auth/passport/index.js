"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPassport = exports.applyPassport = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const cookie_session_1 = __importDefault(require("cookie-session"));
const url_1 = __importDefault(require("url"));
const micro_redirect_1 = __importDefault(require("micro-redirect"));
let applied = false;
exports.applyPassport = (applier) => {
    if (!applied) {
        applied = true;
        applier(passport_1.default);
    }
};
exports.withPassport = (fn) => {
    return (req, res) => {
        if (!res.redirect) {
            res.redirect = (location) => micro_redirect_1.default(res, 302, location);
        }
        cookie_session_1.default({
            name: 'passportSession',
            signed: false,
            domain: url_1.default.parse(req.url).host,
            maxAge: 24 * 60 * 60 * 1000,
        })(req, res, () => (passport_1.default.initialize()(req, res, () => (passport_1.default.session()(req, res, () => (fn(req, res)))))));
    };
};
//# sourceMappingURL=index.js.map