const { randomUUID } = require("crypto");

const users = [];

const formatUser = (user) => ({
 ...user,
 createdAt: new Date(user.createdAt).toISOString(),
 updatedAt: new Date(user.updatedAt).toISOString(),
});

exports.list = () => users.map(formatUser);

exports.findById = (id) => {
 const user = users.find((item) => item.id === id);
 return user ? formatUser(user) : null;
};

exports.findByEmail = (email) => {
 const user = users.find((item) => item.email === email);
 return user ? formatUser(user) : null;
};

exports.create = ({ name, email }) => {
 const now = Date.now();
 const user = {
  id: randomUUID(),
  name,
  email,
  createdAt: now,
  updatedAt: now,
 };

 users.unshift(user);
 return formatUser(user);
};

exports.update = (id, payload) => {
 const user = users.find((item) => item.id === id);
 if (!user) return null;

 if (payload.name !== undefined) {
  user.name = payload.name;
 }

 if (payload.email !== undefined) {
  user.email = payload.email;
 }

 user.updatedAt = Date.now();
 return formatUser(user);
};

exports.remove = (id) => {
 const index = users.findIndex((item) => item.id === id);
 if (index === -1) return null;
 return formatUser(users.splice(index, 1)[0]);
};
