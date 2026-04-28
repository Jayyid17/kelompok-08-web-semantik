const { AppError } = require("../utils/AppError");
exports.notFound = (req, res, next) => {
 next(new AppError(404, "Route tidak ditemukan"));
};
