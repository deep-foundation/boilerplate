import { ApolloProvider } from '@apollo/react-hooks';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@deepcase/auth';
import { generateApolloClient } from './hasura/client';
import { ApolloClient } from 'apollo-boost';

export interface IWrapOptions {
  Component: React.ComponentType<any>;
}

export function wrap(options: IWrapOptions) {
  return (props) => {
    const auth = useAuth();
    const [client, setClient] = useState<ApolloClient<any> | void>(generateApolloClient({
      initialStore: {},
      token: auth?.token || 'anonymous',
    }));
    const [lastToken, setLastToken] = useState(auth?.token);

    const updateClient = () => {
      setClient(generateApolloClient({
        initialStore: {},
        token: auth?.token || 'anonymous',
      }));
    };

    useEffect(
      () => {
        if (lastToken !== auth?.token) {
          setLastToken(auth?.token);
          updateClient();
        }
      },
      [auth],
    );

    return <>
      {/* @ts-ignore */}
      <ApolloProvider client={client}>
        <options.Component {...props}/>
      </ApolloProvider>
    </>;
  };
}
