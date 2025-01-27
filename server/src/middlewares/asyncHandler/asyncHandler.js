const tryCatch = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  };
};

export default tryCatch;
