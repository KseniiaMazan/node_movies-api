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

module.exports = {
  handleModelErrors,
  handleApiErrors,
};
