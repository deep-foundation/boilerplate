import React, { useCallback, useContext, useEffect } from 'react';
import nextCookie from 'next-cookies';
import redirect from './redirect';
import NextApp, { AppInitialProps, AppContext } from 'next/app';
import { NextPageContext } from 'next';
import axios from 'axios';
import Debug from 'debug';

const debug = Debug('deepcase:auth');

export interface IAuthResult {
  id?: string;
  token?: string;
  error?: string;
}
export interface IAuthContext {
  result: IAuthResult;
  setResult: (result: IAuthResult) => void;
}
export type AuthProviderProps<IAuth> = Readonly<AppInitialProps> & {
  session: IAuthResult;
};

export const AuthContext = React.createContext<IAuthContext>(
  (null as unknown) as IAuthContext,
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
  handleUser: (user: IAuthResult, ctx) => {
    if (!user) redirectToLogin(ctx.ctx);
  },
  handleSession: (session: any, ctx) => {
    if (!session) {
      redirectToLogin(ctx.ctx);
      return Promise.resolve({
        pageProps: null,
        session: (null as unknown) as IAuthResult,
      });
    }
  },
};

// any is needed to use as JSX element
const withAuth = (App: NextApp | any, config: {
  handleUser: (user: IAuthResult, ctx) => any;
  handleSession: (session: any, ctx) => any;
} = defaultConfig) => {
  const _config = { ...defaultConfig, ...config };
  return class AuthProvider extends React.Component<AuthProviderProps<IAuthResult>> {
    static displayName = process.env.APP_NAME;
    static async getInitialProps(
      ctx: AppContext,
    ): Promise<AuthProviderProps<IAuthResult>> {
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
        passport: { user: IAuthResult },
      } = JSON.parse(serializedCookie);

      _config.handleUser(user, ctx);

      const session: IAuthResult = user;

      return {
        ...appProps,
        session,
      };
    }

    render() {
      const { session, ...appProps } = this.props;

      return (
        <AuthContext.Provider value={{ result: session, setResult: (result: IAuthResult) => null }}>
          <App {...appProps} />
        </AuthContext.Provider>
      );
    }
  };
};

export default withAuth;

export function AuthClientProvider({
  children,
  useState,
}: {
  children: any;
  useState: (defaultValue?: IAuthResult) => [IAuthResult, (result: IAuthResult) => void];
}) {
  const auth = useAuth();
  const [result, _setResult] = useState(auth?.result);
  const setResult = useCallback(
    async (result) => {
      debug('setResult', result);
      if (!result.id || !result.token) {
        _setResult({});
        axios.get('/api/auth/logout').then(() => {}, () => {});
      } else {
        _setResult(result);
        axios.get('/api/auth/token', { params: result }).then(() => {}, () => {});
      }
    },
    [],
  );

  return <>
    <AuthContext.Provider value={{ result, setResult }}>
      {children}
    </AuthContext.Provider>
  </>;
}

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}
