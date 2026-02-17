const { adminApiKey } = require("../config/env");

function requireAdminKey(req, res, next) {
  if (!adminApiKey) {
    return next();
  }

  const incoming = req.headers["x-admin-key"];
  if (!incoming || incoming !== adminApiKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return next();
}

module.exports = { requireAdminKey };
