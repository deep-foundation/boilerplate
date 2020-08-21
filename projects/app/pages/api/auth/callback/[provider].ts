import { withPassport } from '@deepcase/auth/passport';
import { Handler } from '@deepcase/auth/handler';

export default withPassport(Handler({
  failureRedirect: '/auth',
  successRedirect: '/',
}));
