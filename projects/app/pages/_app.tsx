import App from 'next/app';
import React from 'react';
import withAuth from '@deepcase/auth';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default withAuth(MyApp);
