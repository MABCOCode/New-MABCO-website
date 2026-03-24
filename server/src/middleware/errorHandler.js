function notFound(req, res) {
  console.error(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // Log the error with full details
  console.error(`[${new Date().toISOString()}] ${status} Error:`, {
    message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
