const taskService = require("../services/taskService");
const userService = require("../services/userService");
const { AppError } = require("../utils/AppError");

const parseName = (value) => String(value || "").trim();
const parseEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const shouldIncludeTask = (req) => req.query.includeTask === "true";

exports.list = (req, res, next) => {
  try {
    const users = userService.list().map((user) => ({
      ...user,
      tasks: taskService.findByUserId(user.id),
    }));
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.detail = (req, res, next) => {
  try {
    const user = userService.findById(req.params.id);
    if (!user) throw new AppError(404, "User tidak ditemukan");

    if (shouldIncludeTask(req)) {
      const tasks = taskService.findByUserId(user.id);
      res.json({ data: { ...user, tasks } });
      return;
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const name = parseName(req.body.name);
    const email = parseEmail(req.body.email);

    if (!name) throw new AppError(400, "name wajib diisi");
    if (name.length > 120)
      throw new AppError(400, "name maksimal 120 karakter");
    if (!email) throw new AppError(400, "email wajib diisi");
    if (!validateEmail(email)) throw new AppError(400, "email tidak valid");
    if (userService.findByEmail(email))
      throw new AppError(409, "email sudah digunakan");

    const user = userService.create({ name, email });
    res
      .status(201)
      .location(`/api/users/${user.id}`)
      .json({ message: "User dibuat", data: user });
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const payload = {};

    if (req.body.name !== undefined) {
      const name = parseName(req.body.name);
      if (!name) throw new AppError(400, "name wajib diisi");
      if (name.length > 120)
        throw new AppError(400, "name maksimal 120 karakter");
      payload.name = name;
    }

    if (req.body.email !== undefined) {
      const email = parseEmail(req.body.email);
      if (!email) throw new AppError(400, "email wajib diisi");
      if (!validateEmail(email)) throw new AppError(400, "email tidak valid");

      const existingUser = userService.findByEmail(email);
      if (existingUser && existingUser.id !== req.params.id) {
        throw new AppError(409, "email sudah digunakan");
      }

      payload.email = email;
    }

    if (Object.keys(payload).length === 0) {
      throw new AppError(400, "Tidak ada data yang diupdate");
    }

    const user = userService.update(req.params.id, payload);
    if (!user) throw new AppError(404, "User tidak ditemukan");

    res.json({ message: "User diupdate", data: user });
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res, next) => {
  try {
    const user = userService.remove(req.params.id);
    if (!user) throw new AppError(404, "User tidak ditemukan");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
