module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e)); //lub func(req, res, next).catch(next);
  };
};
