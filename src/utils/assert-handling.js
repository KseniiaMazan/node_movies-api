const assertData = (data, res) => {
  if (!data) {
    const err = {
      statusCode: 404,
      errorMessage: 'Not found',
    }

    throw err;
  }

  res.json(data);
};

module.exports = assertData;
