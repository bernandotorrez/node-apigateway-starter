module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      res.status(400).send({
        code: 400,
        success: false,
        message: err.name,
        data: null
      });
      next(err);
    }
  };
};
