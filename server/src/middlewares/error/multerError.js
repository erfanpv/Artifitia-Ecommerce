import multer from "multer";

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 5 files",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
    });
  }

  next();
};

export const generalErrorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};