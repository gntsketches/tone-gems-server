const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    //#90 .authenticate is a middleware. takes code from URL, fetches profile, then calls callback in GoogleStrategy sends request on to
    // after all that, it passes req to next middleware:
    (req, res) => {
      console.log('/auth/google/callback')
      res.redirect('/compose');
    }
  );

  app.get(
    '/api/logout',
    (req, res) => {
      // passport automatically attaches .logout to req object
        // this takes the cookie that containers user.id, and kills the id
      req.logout();
      // res.send(req.user); // inform the user that they are no longer signed in
      res.redirect('/');
    }
  );

  app.get(
    '/api/current_user',
    (req, res) => {
      // console.log('req', req)
      // console.log('res', res)
      // passport automatically attaches .user to req object
      res.send(req.user);
    }
  );

}
