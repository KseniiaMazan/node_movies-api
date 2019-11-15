const assertData = () => {
  const err = {
    statusCode: 404,
    errorMessage: 'Not found',
  }

  throw err;
};

module.exports = assertData;
