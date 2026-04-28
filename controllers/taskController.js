const taskService = require("../services/taskService");
const userService = require("../services/userService");
const { AppError } = require("../utils/AppError");

const parseAge = (value) => {
 if (value === undefined || value === null || value === "") return null;
 return Number(value);
};

const validateAge = (age) => age === null || (Number.isInteger(age) && age >= 0);
const shouldIncludeUser = (req) => req.query.includeUser === "true";

exports.list = (req, res, next) => {
 try {
  const tasks = taskService.list({ includeUser: shouldIncludeUser(req) });
  res.json({ data: tasks });
 } catch (err) {
  next(err);
 }
};

exports.detail = (req, res, next) => {
 try {
  const task = taskService.findById(req.params.id, { includeUser: shouldIncludeUser(req) });
  if (!task) throw new AppError(404, "Task tidak ditemukan");
  res.json({ data: task });
 } catch (err) {
  next(err);
 }
};

exports.create = (req, res, next) => {
 try {
  const title = String(req.body.title || "").trim();
  const userId = req.body.userId ? String(req.body.userId).trim() : null;
  const age = parseAge(req.body.age);
  if (!title) throw new AppError(400, "title wajib diisi");
  if (title.length > 120) throw new AppError(400, "title maksimal 120 karakter");
  if (!validateAge(age)) throw new AppError(400, "age harus angka bulat minimal 0");
  if (userId && !userService.findById(userId)) {
   throw new AppError(404, "User pemilik task tidak ditemukan");
  }

  const task = taskService.create({ title, userId, age });
  res.status(201).json({ message: "Task dibuat", data: task });
 } catch (err) {
    
  next(err);
 }
};

exports.update = (req, res, next) => {
 try {
  const payload = {};

  if (req.body.title !== undefined) {
   const title = String(req.body.title).trim();
   if (!title) throw new AppError(400, "title wajib diisi");
   if (title.length > 120) throw new AppError(400, "title maksimal 120 karakter");
   payload.title = title;
  }

  if (req.body.done !== undefined) {
   if (typeof req.body.done !== "boolean") {
    throw new AppError(400, "done harus boolean");
   }
   payload.done = req.body.done;
  }

  if (req.body.userId !== undefined) {
   const userId = req.body.userId ? String(req.body.userId).trim() : null;
   if (userId && !userService.findById(userId)) {
    throw new AppError(404, "User pemilik task tidak ditemukan");
   }
   payload.userId = userId;
  }

  if (req.body.age !== undefined) {
   const age = parseAge(req.body.age);
   if (!validateAge(age)) throw new AppError(400, "age harus angka bulat minimal 0");
   payload.age = age;
  }

  if (Object.keys(payload).length === 0) {
   throw new AppError(400, "Tidak ada data yang diupdate");
  }

  const task = taskService.update(req.params.id, payload);
  if (!task) throw new AppError(404, "Task tidak ditemukan");

  res.json({ message: "Task diupdate", data: task });
 } catch (err) {
  next(err);
 }
};

exports.remove = (req, res, next) => {
 try {
  const task = taskService.remove(req.params.id);
  if (!task) throw new AppError(404, "Task tidak ditemukan");

  res.json({ message: "Task dihapus", data: task });
 } catch (err) {
  next(err);
 }
};
