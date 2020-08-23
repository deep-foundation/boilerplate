import { withPassport } from '@deepcase/auth/passport';
import { Handler } from '@deepcase/auth/handler';
import { initPassport } from '../../../../imports/passport';

initPassport();
export default withPassport(Handler({
  failureRedirect: '/auth',
  successRedirect: '/',
}));
