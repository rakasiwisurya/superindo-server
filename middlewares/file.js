const multer = require("multer");

exports.upload = (imageFile, location) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, location);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg)$/)) {
        req.fileValidationError = "Only images file are allowed";
        return cb(new Error("Only images file are allowed"), false);
      }

      cb(null, true);
    }
  };

  const sizeInMB = 2;
  const maxSize = sizeInMB * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        console.error(req.fileValidationError);
        return res.status(400).send({
          status: "Failed",
          message: req.fileValidationError,
        });
      }

      if (err) {
        console.error(err);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            status: "Failed",
            message: "Max file sized is 2MB",
          });
        }

        return res.status(400).send({
          status: "Failed",
          message: err.message,
        });
      }

      return next();
    });
  };
};
