export const flash = (req, res, next) => {
  res.locals.flash = req.session.flash || {};
  req.session.flash = {};
  next();
};

export const setFlash = (req, type, message) => {
  req.session.flash = req.session.flash || {};
  req.session.flash[type] = message;
};
