// @flow

import React from 'react';
import _ from 'lodash';

import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';

import CleanCSS from 'clean-css';
import autoprefixer from "autoprefixer";
import postcss from 'postcss';

import { theme } from '../imports/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="maximum-scale=1, minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            key='viewport'
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={theme.palette.primary.main}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

if (!_.get(process, 'browser')) {
  MyDocument.getInitialProps = async ctx => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    const css = sheets.toString();
    const _prefixedCss = await postcss([
      autoprefixer({ overrideBrowserslist: ['last 100 version'] }),
    ]).process(css, { from: 'css.css', to: 'prefixedCss.css' });

    let prefixedCss = _prefixedCss.css;
    _prefixedCss.warnings().forEach(warn => {
      prefixedCss = css;
      console.warn(warn.toString());
    });

    return {
      ...initialProps,
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          <style id="jss-server-size" dangerouslySetInnerHTML={{ __html: prefixedCss }}/>
        </React.Fragment>,
      ],
    };
  };
}