"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github_1 = require("passport-github");
const getOAuthUrls = (hostName, app) => ({
    callbackURL: `${hostName}/api/auth/callback/${app}`,
});
const strategy = new passport_github_1.Strategy(Object.assign(Object.assign({ passReqToCallback: false, clientID: process.env.GITHUB_CLIENTID, clientSecret: process.env.GITHUB_CLIENTSECRET }, getOAuthUrls(process.env.HOST_URL, 'github')), { scope: 'user:email' }), (accessToken, refreshToken, githubProfile, cb) => {
    console.log({ accessToken, refreshToken, githubProfile });
    cb(null, githubProfile);
});
exports.default = strategy;
//# sourceMappingURL=github.js.map