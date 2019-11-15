const handleModelErrors = (err) => {
  const modelError = {
    statusCode: 404,
    errorMessage: err.message,
  };

  throw modelError;
};

const handleApiErrors = (res) => {
  return (err) => {
    res.status(err.statusCode).json(err);
  }
};

const handleReadFileErrors = (err) => {
  const readFileError = {
    statusCode: 500,
    errorMessage: err.message,
  };

  throw readFileError;
};

module.exports = {
  handleModelErrors,
  handleApiErrors,
  handleReadFileErrors,
};
