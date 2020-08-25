# deepcase auth

Adapter-wrapper for nextjs.

## Integration

Project config.
```tsx
// imports/passport.ts
import { applyPassport } from '@deepcase/auth/passport/index';
import github from '@deepcase/auth/passport/github';
import LocalStrategy from 'passport-local';
import Debug from 'debug';

const debug = Debug('deepcase:passport');

export const initPassport = () => applyPassport((passport) => {
  passport.use(github);

  passport.use(new LocalStrategy((username, password, done) => {
    debug('LocalStrategy', { username, password });
    if (username === 'abc' && password === 'abc') done(null, { id: 'abc' });
    else done(null, false);
  }));

  passport.serializeUser((user, done) => {
    debug('serializeUser', user);
    done(null, { id: user.id });
  });

  passport.deserializeUser((id, done) => {
    debug('deserializeUser', id);
    done(null, { id });
  });
});
```

App session context wrapper.
```tsx
// pages/_app.tsx
import App from 'next/app';
import React from 'react';
import withAuth, { IAuth } from '@deepcase/auth';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default withAuth(MyApp, {
  // optional handlers (default already defined)

  // redirect if no user
  handleUser: (user: IAuth, ctx) => {
    if (!user) redirectToLogin(ctx.ctx, process.env.AUTH_LOGIN);
  },
  // redirect if no session
  handleSession: (session: any, ctx) => {
    if (!session) {
      redirectToLogin(ctx.ctx);
      return Promise.resolve({
        pageProps: null,
        session: (null as unknown) as IAuth,
      });
    }
  },
});
```

Request route.
```tsx
// pages/[provider].ts
import { withPassport } from '@deepcase/auth/passport';
import { Handler } from '@deepcase/auth/handler';
import { initPassport } from '../../../imports/passport';

initPassport();
export default withPassport(Handler());
```

Callback route.
```tsx
// pages/callback/[provider].ts
import { withPassport } from '@deepcase/auth/passport';
import { Handler } from '@deepcase/auth/handler';
import { initPassport } from '../../../../imports/passport';

initPassport();
export default withPassport(Handler({
  failureRedirect: '/auth',
  successRedirect: '/',
}));
```

Page with auth.
```tsx
// pages/index.tsx
import React from 'react';
import { useAuth } from '@deepcase/auth';

export default function Page() {
  const identity = useAuth();
  return <>
    <div>auth</div>
    <div><a href="/api/auth/logout">logout</a></div>
    <div><a href="/api/auth/github">github</a></div>
    <div><a href="/api/auth/local?username=abc&password=abc">local abc:abc</a></div>
    <div><a href="/api/auth/local?username=qwe&password=qwe">local qwe:qwe</a></div>
    <div>
      <pre><code>
        {JSON.stringify(identity)}
      </code></pre>
    </div>
  </>;
}
```