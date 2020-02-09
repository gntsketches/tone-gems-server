const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy(['/composition', '/api', '/auth/google'], { target: 'http://localhost:5000' }));
  // app.use(proxy(['/auth/google'], { target: 'http://localhost:5000' }));
  // #60
  // app.use(proxy(['/auth/google'], { target: 'http://localhost:5000' }));
  // app.use(proxy(['/api/**'], { target: 'http://localhost:5000' }));
}

// "/api/*" ? from #82 proxy rule ~9min
