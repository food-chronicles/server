module.exports = (err, req, res, next) => {
  if (!err) next();
  let statusCode = 500;
  let errorObj = { message: "Server Error" };

  switch (err.name) {
    case "Unauthorized":
      statusCode = 401;
      errorObj.message = "Please login / register first";
      break;

    case "ProductNotFound":
      statusCode = 404;
      errorObj.message = "Product not found";
      break;

    case "ProductValidationError":
      statusCode = 400;
      errorObj.message = "data and name must not empty";
      break;

    case "ProductDataValidationError":
      statusCode = 400;
      errorObj.message = "data must not empty";
      break;

    case "ValidationError":
      statusCode = 400;
      errorObj.message = err.message;
      errorObj.errors = err.errors;
      break;

    default:
      console.log("name ->", err.name);
      console.log("error ->", err);
  }
  res.status(statusCode).json(errorObj);
};
