const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  const redirectUrl = req.url;
  res.redirect(`/auth/sign-in?redirectUrl=${redirectUrl}`);
};

module.exports = isSignedIn;
