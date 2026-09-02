// Error & 404 middleware: intercepts unhandled exceptions (formatting ApiError instances)
// and handles requests targeting undefined API routes.
export const errorHandler = (err, req, res, next) => {
  console.error('💥 Server Error:', err.message || err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
};
