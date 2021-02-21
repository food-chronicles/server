module.exports = (err, req, res, next) => {
  if (!err) next();
  let statusCode = 500;
  let errorMessage = "Server Error";

  switch (err.name) {
    case "Unauthorized":
      statusCode = 401;
      errorMessage = "Please login / register first";
      break;

    case "ProductNotFound":
      statusCode = 404;
      errorMessage = "Product not found";
      break;

    default:
      console.log("name ->", err.name);
      console.log("error ->", err);
  }
  res.status(statusCode).json({ message: errorMessage });
};
