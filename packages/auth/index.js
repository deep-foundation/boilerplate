"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.defaultConfig = exports.redirectToLogin = void 0;
const react_1 = __importStar(require("react"));
const next_cookies_1 = __importDefault(require("next-cookies"));
const redirect_1 = __importDefault(require("./redirect"));
const app_1 = __importDefault(require("next/app"));
const AuthContext = react_1.default.createContext(null);
exports.redirectToLogin = (ctx, loginPage = process.env.AUTH_LOGIN) => {
    if ((ctx && ctx.pathname === loginPage) ||
        (typeof window !== 'undefined' && window.location.pathname === loginPage)) {
        return;
    }
    redirect_1.default(ctx, loginPage);
};
exports.defaultConfig = {
    handleUser: (user, ctx) => {
        if (!user)
            exports.redirectToLogin(ctx.ctx);
    },
    handleSession: (session, ctx) => {
        if (!session) {
            exports.redirectToLogin(ctx.ctx);
            return Promise.resolve({
                pageProps: null,
                session: null,
            });
        }
    },
};
const withAuth = (App, config = exports.defaultConfig) => {
    var _a;
    const _config = Object.assign(Object.assign({}, exports.defaultConfig), config);
    return _a = class IdentityProvider extends react_1.default.Component {
            static getInitialProps(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    let appProps;
                    if (app_1.default.getInitialProps) {
                        appProps = yield app_1.default.getInitialProps(ctx);
                    }
                    else {
                        appProps = { pageProps: {} };
                    }
                    const { passportSession } = next_cookies_1.default(ctx.ctx);
                    const handledSession = _config.handleSession(passportSession, ctx);
                    if (handledSession)
                        return handledSession;
                    const serializedCookie = Buffer.from(passportSession, 'base64').toString();
                    const { passport: { user }, } = JSON.parse(serializedCookie);
                    _config.handleUser(user, ctx);
                    const session = user;
                    return Object.assign(Object.assign({}, appProps), { session });
                });
            }
            render() {
                const _a = this.props, { session } = _a, appProps = __rest(_a, ["session"]);
                return (react_1.default.createElement(AuthContext.Provider, { value: session },
                    react_1.default.createElement(App, Object.assign({}, appProps))));
            }
        },
        _a.displayName = process.env.APP_NAME,
        _a;
};
exports.default = withAuth;
exports.useAuth = () => react_1.useContext(AuthContext);
//# sourceMappingURL=index.js.map