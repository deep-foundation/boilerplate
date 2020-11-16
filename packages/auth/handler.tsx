import { NextApiResponse, NextApiRequest } from 'next';
import { passport } from './passport/index';
import Debug from 'debug';

const debug = Debug('deepcase:auth:handler');

export const Handler = (options?: any) => (req: any, res: any) => {
  const { provider, id, token } = req.query;
  console.log(req.query);
  debug('handle', { provider, id, token });
  if (!provider) return { statusCode: 404 };
  if (provider === 'logout') {
    // @ts-ignore
    req?.logout && req?.logout();
    // @ts-ignore
    res?.redirect('/');
    return;
  }

  if (provider === 'bearer') {
    passport.authenticate('bearer', { session: false, ...options })(req, res, () => {
      res.json(req?.user);
    });
  } else {
    passport.authenticate(provider, options)(req, res, () => {
      debug('authenticate');
      if (options) return true;
      // @ts-ignore
      res?.redirect('/');
    });
  }
};
