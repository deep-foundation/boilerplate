import React, { useState, useEffect, useCallback } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthClientProvider, IAuthResult, useAuth } from '@deepcase/auth';
import { generateApolloClient } from './hasura/client';
import { ApolloClient } from 'apollo-boost';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';

function useStoreWrapped(defaultResult?: IAuthResult): [IAuthResult, (result: IAuthResult) => void] {
  const [result, setResult] = useCapacitorStore('deepcase-auth', defaultResult);
  return [result, setResult];
}

export interface IWrapOptions {
  Component: React.ComponentType<any>;
}

const AuthLayer = ({ children }: { children: any; }) => {
  return <AuthClientProvider useState={useStoreWrapped}>
    {children}
  </AuthClientProvider>;
}

const ApolloLayer = ({ children }: { children: any; }) => {
  const auth = useAuth();

  const [client, setClient] = useState<ApolloClient<any> | void>(generateApolloClient({
    initialStore: {},
    token: auth?.result?.token || 'anonymous',
  }));
  const [lastToken, setLastToken] = useState(auth?.result?.token);

  const updateClient = () => {
    setClient(generateApolloClient({
      initialStore: {},
      token: auth?.result?.token || 'anonymous',
    }));
  };

  useEffect(
    () => {
      if (lastToken !== auth?.result?.token) {
        setLastToken(auth?.result?.token);
        updateClient();
      }
    },
    [auth],
  );

  return <>
    {/* @ts-ignore */}
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  </>;
}

export function wrap(options: IWrapOptions) {
  return (props) => {
    return <>
      <CapacitorStoreProvider>
        <AuthLayer>
          <ApolloLayer>
            <options.Component {...props}/>
          </ApolloLayer>
        </AuthLayer>
      </CapacitorStoreProvider>
    </>;
  };
}
