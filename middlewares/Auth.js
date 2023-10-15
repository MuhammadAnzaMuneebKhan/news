/** @format */

const { validateToken } = require('../service/Auth');

function checkAuthCookie(CookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[CookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}
module.exports = {
  checkAuthCookie,
};
