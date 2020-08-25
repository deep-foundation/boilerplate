import React, { useContext } from 'react';
import nextCookie from 'next-cookies';
import redirect from './redirect';
import NextApp, { AppInitialProps, AppContext } from 'next/app';
import { NextPageContext } from 'next';

export interface IAuth {
  id: number;
}
type IdentityProviderProps = Readonly<AppInitialProps> & {
  session: IAuth;
};

const AuthContext = React.createContext<IAuth>(
  (null as unknown) as IAuth,
);

export const redirectToLogin = (ctx: NextPageContext, loginPage: string = process.env.AUTH_LOGIN) => {
  if (
    (ctx && ctx.pathname === loginPage) ||
    (typeof window !== 'undefined' && window.location.pathname === loginPage)
  ) {
    return;
  }

  redirect(ctx, loginPage);
};

export const defaultConfig = {
  handleUser: (user: IAuth, ctx) => {
    if (!user) redirectToLogin(ctx.ctx);
  },
  handleSession: (session: any, ctx) => {
    if (!session) {
      redirectToLogin(ctx.ctx);
      return Promise.resolve({
        pageProps: null,
        session: (null as unknown) as IAuth,
      });
    }
  },
};

// any is needed to use as JSX element
const withAuth = (App: NextApp | any, config: {
  handleUser: (user: IAuth, ctx) => any;
  handleSession: (session: any, ctx) => any;
} = defaultConfig) => {
  const _config = { ...defaultConfig, ...config };
  return class IdentityProvider extends React.Component<IdentityProviderProps> {
    static displayName = process.env.APP_NAME;
    static async getInitialProps(
      ctx: AppContext,
    ): Promise<IdentityProviderProps> {
      // Get inner app's props
      let appProps: AppInitialProps;
      if (NextApp.getInitialProps) {
        appProps = await NextApp.getInitialProps(ctx);
      } else {
        appProps = { pageProps: {} };
      }

      const { passportSession } = nextCookie(ctx.ctx);

      const handledSession = _config.handleSession(passportSession, ctx);
      if (handledSession) return handledSession;

      const serializedCookie = Buffer.from(passportSession, 'base64').toString();

      const {
        passport: { user },
      }: {
        passport: { user: IAuth },
      } = JSON.parse(serializedCookie);

      _config.handleUser(user, ctx);

      const session: IAuth = user;

      return {
        ...appProps,
        session,
      };
    }

    render() {
      const { session, ...appProps } = this.props;

      return (
        <AuthContext.Provider value={session}>
          <App {...appProps} />
        </AuthContext.Provider>
      );
    }
  };
};

export default withAuth;

export const useAuth = (): IAuth => useContext(AuthContext);
