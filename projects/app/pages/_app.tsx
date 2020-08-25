import App from 'next/app';
import React from 'react';
import withAuth, { redirectToLogin, IAuth } from '@deepcase/auth';

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
    // if (!user) redirectToLogin(ctx.ctx, process.env.AUTH_LOGIN);
  },
  // redirect if no session
  handleSession: (session: any, ctx) => {
    // if (!session) {
    //   redirectToLogin(ctx.ctx);
    //   return Promise.resolve({
    //     pageProps: null,
    //     session: (null as unknown) as IAuth,
    //   });
    // }
  },
});
