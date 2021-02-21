module.exports = (err, req, res, next) => {
  if (!err) next();
  let statusCode = 500;
  let errorMessage = "Server Error";

  switch (err.name) {
    default:
      console.log("name ->", err.name);
      console.log("error ->", err);
  }
  res.status(statusCode).json({ message: errorMessage });
};
