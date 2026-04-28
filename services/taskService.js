const { randomUUID } = require("crypto");
const userService = require("./userService");

const tasks = [];

const formatTask = (task) => ({
  ...task,
  createdAt: new Date(task.createdAt).toISOString(),
  updatedAt: new Date(task.updatedAt).toISOString(),
});

const withUser = (task) => {
  const user = task.userId ? userService.findById(task.userId) : null;

  return {
    ...formatTask(task),
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      : null,
  };
};

exports.list = ({ includeUser = false } = {}) => {
  return includeUser ? tasks.map(withUser) : tasks.map(formatTask);
};

exports.findById = (id, { includeUser = false } = {}) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  return includeUser ? withUser(task) : formatTask(task);
};

exports.findByUserId = (userId) => {
  return tasks.filter((task) => task.userId === userId).map(formatTask);
};

exports.create = ({ title, userId = null, age = null }) => {
  const now = Date.now();
  const task = {
    id: randomUUID(),
    title,
    done: false,
    userId,
    age,
    createdAt: now,
    updatedAt: now,
  };
  tasks.unshift(task);
  return formatTask(task);
};

exports.update = (id, payload) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) return null;

  if (payload.title !== undefined) {
    task.title = payload.title;
  }

  if (payload.done !== undefined) {
    task.done = payload.done;
  }

  if (payload.userId !== undefined) {
    task.userId = payload.userId;
  }

  if (payload.age !== undefined) {
    task.age = payload.age;
  }

  task.updatedAt = Date.now();
  return formatTask(task);
};

exports.remove = (id) => {
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return formatTask(tasks.splice(index, 1)[0]);
};
