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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPassport = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const cookie_session_1 = __importDefault(require("cookie-session"));
const url_1 = __importDefault(require("url"));
const micro_redirect_1 = __importDefault(require("micro-redirect"));
const github_1 = __importDefault(require("./github"));
passport_1.default.use(github_1.default);
passport_1.default.serializeUser((user, done) => {
    const { id, displayName, username, profileUrl, photos } = user;
    console.log('serializeUser', user);
    done(null, { id, displayName, username, profileUrl, photos });
});
passport_1.default.deserializeUser((serializedUser, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('deserializeUser', serializedUser);
    if (!serializedUser) {
        return done(new Error(`User not found: ${serializedUser}`));
    }
    done(null, serializedUser);
}));
exports.withPassport = fn => (req, res) => {
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
//# sourceMappingURL=index.js.map