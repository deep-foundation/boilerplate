"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github_1 = require("passport-github");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('deepcase:auth:github');
const getOAuthUrls = (hostName, app) => ({
    callbackURL: `${hostName}/api/auth/callback/${app}`,
});
const strategy = new passport_github_1.Strategy(Object.assign(Object.assign({ passReqToCallback: false, clientID: process.env.GITHUB_CLIENTID, clientSecret: process.env.GITHUB_CLIENTSECRET }, getOAuthUrls(process.env.HOST_URL, 'github')), { scope: 'user:email' }), (accessToken, refreshToken, githubProfile, cb) => {
    debug('strategy', { accessToken, refreshToken, githubProfile });
    cb(null, githubProfile);
});
exports.default = strategy;
//# sourceMappingURL=github.js.map