const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // anytime a post/put/patch req (with a body) comes in,
  // the body-parser middleware will parse that
  // and assign it to req.body property
  // app.post('/composition/save', requireLogin, async (req, res) => {
  app.post('/composition/save', async (req, res) => {

    console.log('post/save req', req.query)
      // receiving params as req.query works for get, not post...

    // when we are using passport, and the user is signed in, we can get the user model on the request object:
    // req.user.credits += 5;
    // const user =  await req.user.save();
    //
    // res.send(user);
    res.set('Content-Type', 'text/html');
    res.send(req.query)
  });

  app.get(
    // '/composition/load/:id', (req, res) => {
    //     console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>get/load req', req.params.id)
    '/composition/load', (req, res) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>get/load req', req.query)

      // passport automatically attaches .logout to req object
      // this takes the cookie that containers user.id, and kills the id

      // res.send(req.user); // inform the user that they are no longer signed in

      res.set('Content-Type', 'text/html');
      // res.send(['load stuff'])
      res.send(req.query)
    }
  )
}
