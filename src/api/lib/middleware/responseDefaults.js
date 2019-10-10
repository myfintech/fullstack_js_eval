module.exports = (app) => {
  app.use(function(req, res, next) {
    res
      .set({
        'Content-Type': 'application/json'
      })
      .status(200);
    next();
  });
}
