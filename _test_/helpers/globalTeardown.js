module.exports = async function () {
  await global.__MONGO_CONNECTION__.close();
  await global.__MONGO_DB_OBJ__.close();
};
