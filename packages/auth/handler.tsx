import { NextApiResponse, NextApiRequest } from 'next';
import { passport } from './passport/index';
import Debug from 'debug';

const debug = Debug('deepcase:auth:handler');

export const Handler = (options?: any) => (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;
  debug('handle', { provider });
  if (!provider) return { statusCode: 404 };
  if (provider === 'logout') {
    // @ts-ignore
    req?.logout && req?.logout();
    // @ts-ignore
    res?.redirect('/');
    return;
  }

  passport.authenticate(provider, options)(req, res, () => {
    debug('authenticate');
    if (options) return true;
    res?.redirect('/');
  });
};
