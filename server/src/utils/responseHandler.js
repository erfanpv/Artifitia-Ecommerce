const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  token = null
) => {
  const response = {
    success,
    message,
  };

  if (data) response.data = data;
  if (token) response.token = token;

  res.status(statusCode).json(response);
};

export default sendResponse;
