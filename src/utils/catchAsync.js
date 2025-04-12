const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => {
        // Log the error
        console.error('Error occurred:', err);
  
        // Pass the error to the next middleware
        next(err);
      });
  };
  
  module.exports = catchAsync;
  