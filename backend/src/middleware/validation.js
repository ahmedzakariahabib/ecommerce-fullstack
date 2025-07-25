import { AppError } from "../utils/AppError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let filter = {};
    if (req.file) {
      filter = { image: req.file, ...req.params, ...req.body, ...req.query };
    } else if (req.files) {
      const files = {
        imageCover: req.files.imgCover,
        images: req.files.images,
      };
      filter = { ...files, ...req.body, ...req.params, ...req.query };
      // filter = { ...req.files, ...req.params, ...req.body, ...req.query };
    } else {
      filter = { ...req.params, ...req.body, ...req.query };
    }
    const { error } = schema.validate(filter, { abortEarly: false });
    if (!error) {
      next();
    } else {
      let errMsg = [];
      error.details.forEach((val) => {
        errMsg.push(val.message);
      });
      next(new AppError(errMsg, 401));
    }
  };
};
