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
    passport.authenticate('google')
  );

  app.get(
    '/api/logout',
    (req, res) => {
      // passport automatically attaches .logout to req object
        // this takes the cookie that containers user.id, and kills the id
      req.logout();
      // inform the user that they are no longer signed in
      res.send(req.user);
    }
  );

  app.get(
    '/api/current_user',
    (req, res) => {
      // passport automatically attaches .user to req object
      res.send(req.user);
    }
  );

}
