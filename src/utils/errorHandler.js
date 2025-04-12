const errorHandler = (error, res) => {
    console.error(error.message); // Log error for debugging
    const statusCode = error.statusCode || 500; // Default to 500 if no status code
    const message = error.message || 'Something went wrong'; // Use the message from the error
    res.status(statusCode).json({ message });
  };
  
  module.exports = errorHandler;
  