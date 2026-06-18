// server.ts
import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// api-src/app.ts
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// api-src/middleware/errorHandler.ts
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  if (statusCode === 500) {
    console.error("[ERROR]", err);
  }
  res.status(statusCode).json({
    error: message,
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
}
function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Resource not found" });
}

// api-src/routes/auth.routes.ts
import { Router } from "express";
import { v4 as uuid } from "uuid";

// api-src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
});
var prisma_default = prisma;

// api-src/models/user.model.ts
async function findUserById(id) {
  return prisma_default.user.findUnique({
    where: { id },
    include: { interests: { select: { interest: true } } }
  });
}
async function findUserByName(name) {
  const users = await prisma_default.user.findMany({
    where: { name: { equals: name, mode: "insensitive" } },
    include: { interests: { select: { interest: true } } }
  });
  return users;
}
async function findUserByContact(telegram, instagram) {
  if (!telegram && !instagram) return null;
  const or = [];
  if (telegram) {
    const tg = telegram.replace(/^@/, "");
    or.push({ telegram: { equals: tg, mode: "insensitive" } });
    or.push({ telegram: { equals: `@${tg}`, mode: "insensitive" } });
  }
  if (instagram) {
    const ig = instagram.replace(/^@/, "");
    or.push({ instagram: { equals: ig, mode: "insensitive" } });
    or.push({ instagram: { equals: `@${ig}`, mode: "insensitive" } });
  }
  const user = await prisma_default.user.findFirst({
    where: { OR: or },
    include: { interests: { select: { interest: true } } }
  });
  return user;
}
async function findUserByPhone(phone) {
  const normalized = phone.replace(/\s+/g, "");
  const user = await prisma_default.user.findFirst({
    where: {
      OR: [
        { phone: { equals: phone, mode: "insensitive" } },
        { phone: { equals: normalized, mode: "insensitive" } }
      ]
    },
    include: { interests: { select: { interest: true } } }
  });
  return user;
}
async function checkDuplicate(field, value, excludeId) {
  if (!value) return false;
  let where;
  if (field === "phone") {
    where = { phone: { equals: value, mode: "insensitive" } };
  } else if (field === "telegram" || field === "instagram") {
    const val = value.replace(/^@/, "");
    where = {
      OR: [
        { [field]: { equals: val, mode: "insensitive" } },
        { [field]: { equals: `@${val}`, mode: "insensitive" } }
      ]
    };
  } else {
    where = { [field]: value };
  }
  if (excludeId) {
    where = { ...where, id: { not: excludeId } };
  }
  const count = await prisma_default.user.count({ where });
  return count > 0;
}
function toProfileDoc(doc) {
  const interests = doc.interests?.map((i) => i.interest) ?? [];
  return {
    id: doc.id,
    _id: doc.id,
    name: doc.name,
    age: doc.age ?? null,
    city: doc.city ?? null,
    address: doc.address ?? null,
    bio: doc.bio ?? null,
    gender: doc.gender,
    lookingFor: doc.lookingFor ?? null,
    image: doc.image ?? null,
    status: doc.status ?? "Offline",
    relationshipIntent: doc.relationshipIntent ?? null,
    interests,
    verified: doc.verified === true,
    phone: doc.phone ?? null,
    telegram: doc.telegram ?? null,
    instagram: doc.instagram ?? null,
    email: doc.email ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
var cachedAllProfiles = null;
var cacheTimer = null;
async function refreshProfileCache() {
  try {
    const rows = await prisma_default.user.findMany({
      orderBy: { id: "desc" },
      take: 1e3,
      include: { interests: { select: { interest: true } } }
    });
    const total = rows.length;
    cachedAllProfiles = { rows: rows.map(toProfileDoc), total };
    console.log("[profile-cache] refreshed: %d profiles", total);
  } catch (err) {
    console.error("[profile-cache] refresh error:", err?.message || err);
  }
}
function startProfileCache(intervalMs = 6e4) {
  if (cacheTimer) clearInterval(cacheTimer);
  refreshProfileCache();
  cacheTimer = setInterval(refreshProfileCache, intervalMs);
}
async function getAllProfiles() {
  if (cachedAllProfiles) {
    return { profiles: cachedAllProfiles.rows, total: cachedAllProfiles.total };
  }
  await refreshProfileCache();
  return { profiles: cachedAllProfiles?.rows ?? [], total: cachedAllProfiles?.total ?? 0 };
}
async function createUser(data) {
  const {
    id,
    name,
    age,
    city,
    address,
    bio,
    gender,
    lookingFor,
    image,
    status,
    relationshipIntent,
    interests,
    phone,
    telegram,
    instagram,
    email
  } = data;
  const user = await prisma_default.user.create({
    data: {
      id,
      name,
      age,
      city,
      address,
      bio,
      gender,
      lookingFor: lookingFor ?? void 0,
      image: image ?? void 0,
      status: status || "Online",
      relationshipIntent: relationshipIntent ?? void 0,
      phone: phone || void 0,
      telegram: telegram || void 0,
      instagram: instagram || void 0,
      email: email || void 0,
      interests: interests?.length ? {
        create: interests.map((interest) => ({ interest }))
      } : void 0
    },
    include: { interests: { select: { interest: true } } }
  });
  return user;
}
async function updateUser(id, data) {
  const existing = await prisma_default.user.findUnique({
    where: { id },
    include: { interests: { select: { interest: true } } }
  });
  if (!existing) return null;
  const updateData = {};
  const allowed = [
    "name",
    "age",
    "city",
    "address",
    "bio",
    "lookingFor",
    "image",
    "status",
    "relationshipIntent",
    "phone",
    "telegram",
    "instagram",
    "email"
  ];
  for (const key of allowed) {
    if (data[key] !== void 0) {
      if (["phone", "telegram", "instagram", "email"].includes(key) && (data[key] === "" || data[key] === null)) {
        updateData[key] = null;
      } else {
        updateData[key] = data[key];
      }
    }
  }
  if (data.interests !== void 0) {
    await prisma_default.userInterest.deleteMany({ where: { userId: id } });
    if (Array.isArray(data.interests) && data.interests.length > 0) {
      await prisma_default.userInterest.createMany({
        data: data.interests.map((interest) => ({ userId: id, interest }))
      });
    }
  }
  const user = await prisma_default.user.update({
    where: { id },
    data: updateData,
    include: { interests: { select: { interest: true } } }
  });
  return user;
}
async function verifyUser(userId) {
  await prisma_default.user.update({ where: { id: userId }, data: { verified: true } });
}
async function toggleUserVerification(userId) {
  const user = await prisma_default.user.findUnique({ where: { id: userId }, select: { verified: true } });
  if (!user) return null;
  const newVal = !user.verified;
  await prisma_default.user.update({ where: { id: userId }, data: { verified: newVal } });
  return { verified: newVal };
}
async function countUsers() {
  return prisma_default.user.count();
}
async function deleteUser(id) {
  const existing = await prisma_default.user.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return null;
  await prisma_default.userInterest.deleteMany({ where: { userId: id } });
  return prisma_default.user.delete({ where: { id } });
}
async function countUsersByGender(gender) {
  return prisma_default.user.count({ where: { gender } });
}
async function countVerifiedUsers() {
  return prisma_default.user.count({ where: { verified: true } });
}

// api-src/middleware/auth.ts
import jwt from "jsonwebtoken";
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable must be set in production!");
    }
    console.warn("WARNING: JWT_SECRET environment variable is not set. Using a temporary fallback secret for development.");
    return "whaatachi-default-secret";
  }
  return secret;
}
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, getSecret());
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next();
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, getSecret());
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
  } catch {
  }
  next();
}
function adminOnly(req, res, next) {
  if (!req.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
function generateToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

// api-src/middleware/validate.ts
function isPresent(val) {
  return val !== void 0 && val !== null && val !== "";
}
function validateRegister(req, res, next) {
  const { name, gender } = req.body;
  const errors = [];
  if (!isPresent(name)) errors.push("Name is required");
  if (!isPresent(gender)) errors.push("Gender is required");
  if (gender && !["Male", "Female"].includes(gender)) errors.push("Gender must be Male or Female");
  if (errors.length) {
    res.status(400).json({ error: errors.join("; ") });
    return;
  }
  next();
}
function validateLogin(req, res, next) {
  const { name, phone, telegram, instagram } = req.body;
  if (!isPresent(name) && !isPresent(phone) && !isPresent(telegram) && !isPresent(instagram)) {
    res.status(400).json({ error: "Name, phone, telegram, or instagram is required" });
    return;
  }
  next();
}
function validatePayment(req, res, next) {
  const { profileId, senderName, senderPhone, transactionId, method } = req.body;
  const errors = [];
  if (!isPresent(profileId)) errors.push("profileId is required");
  if (!isPresent(senderName)) errors.push("senderName is required");
  if (!isPresent(senderPhone)) errors.push("senderPhone is required");
  if (!isPresent(transactionId)) errors.push("transactionId is required");
  if (!isPresent(method)) errors.push("method is required");
  if (method && !["Telebirr", "CBE Birr"].includes(method)) errors.push("method must be Telebirr or CBE Birr");
  if (errors.length) {
    res.status(400).json({ error: errors.join("; ") });
    return;
  }
  next();
}
function validateAdminLogin(req, res, next) {
  const { passcode } = req.body;
  if (!isPresent(passcode)) {
    res.status(400).json({ error: "Passcode is required" });
    return;
  }
  next();
}
function validatePasscodeUpdate(req, res, next) {
  const { newPasscode } = req.body;
  if (!isPresent(newPasscode) || String(newPasscode).length < 4) {
    res.status(400).json({ error: "Passcode must be at least 4 characters" });
    return;
  }
  next();
}

// api-src/utils/transform.ts
function userRowToProfile(row) {
  return {
    id: row.id || row._id,
    name: row.name,
    age: row.age ?? 0,
    city: row.city ?? "",
    address: row.address ?? void 0,
    bio: row.bio ?? "",
    gender: row.gender,
    lookingFor: row.lookingFor ?? void 0,
    image: row.image ?? "",
    status: row.status ?? "Offline",
    relationshipIntent: row.relationshipIntent ?? "Friendship",
    interests: row.interests ?? [],
    verified: row.verified === true,
    contactInfo: {
      phone: row.phone ?? "",
      telegram: row.telegram ?? "",
      instagram: row.instagram ?? "",
      email: row.email ?? ""
    }
  };
}
function paymentRowToPayment(row) {
  return {
    id: row.id || row._id,
    userId: row.userId,
    profileId: row.profileId,
    profileName: row.profileName,
    profileImage: row.profileImage ?? "",
    senderName: row.senderName,
    senderPhone: row.senderPhone,
    transactionId: row.transactionId,
    method: row.method,
    amount: row.amount,
    timestamp: row.createdAt,
    status: row.status,
    receiptImage: row.receiptImage ?? void 0
  };
}

// api-src/routes/auth.routes.ts
var router = Router();
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email } = req.body;
    const conflicts = [];
    if (email && await checkDuplicate("email", email)) conflicts.push("email");
    if (phone && await checkDuplicate("phone", phone)) conflicts.push("phone");
    if (telegram && await checkDuplicate("telegram", telegram)) conflicts.push("telegram");
    if (instagram && await checkDuplicate("instagram", instagram)) conflicts.push("instagram");
    if (conflicts.length > 0) {
      res.status(409).json({ error: `A user with this ${conflicts.join(", ")} already exists` });
      return;
    }
    const id = uuid();
    const created = await createUser({
      id,
      name,
      age,
      city,
      address,
      bio,
      gender,
      lookingFor,
      image,
      status,
      relationshipIntent,
      interests,
      phone,
      telegram,
      instagram,
      email
    });
    if (!created) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    const token = generateToken({ id });
    res.status(201).json({ token, user: userRowToProfile(created) });
  } catch (err) {
    console.error("Register error:", err);
    if (err?.code === 11e3) {
      res.status(409).json({ error: "A user with this information already exists" });
      return;
    }
    res.status(500).json({ error: "Registration failed" });
  }
});
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { name, phone, telegram, instagram } = req.body;
    let found = null;
    if (phone) {
      found = await findUserByPhone(phone);
    }
    if (!found && (telegram || instagram)) {
      found = await findUserByContact(telegram || null, instagram || null);
    }
    if (!found && name) {
      const users = await findUserByName(name);
      if (users.length > 0) {
        found = users[0];
        if (phone) {
          const normalizedPhone = phone.replace(/\s/g, "");
          const exact = users.find(
            (u) => u.phone?.replace(/\s/g, "") === normalizedPhone
          );
          if (exact) found = exact;
        }
      }
    }
    if (!found) {
      res.status(401).json({ error: "Invalid login credentials" });
      return;
    }
    const token = generateToken({ id: found._id });
    res.json({ token, user: userRowToProfile(found) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});
router.post("/logout", (_req, res) => {
  res.json({ success: true });
});
router.get("/me", optionalAuthenticate, async (req, res) => {
  try {
    if (!req.userId) {
      res.json({ user: null });
      return;
    }
    const user = await findUserById(req.userId);
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({ user: userRowToProfile(user) });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
var auth_routes_default = router;

// api-src/routes/profile.routes.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", async (req, res) => {
  try {
    res.json(await getAllProfiles());
  } catch (err) {
    console.error("[profiles] error:", err?.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  }
});
router2.get("/test", (_req, res) => {
  res.json({ ok: true, time: Date.now() });
});
router2.get("/:id", async (req, res) => {
  try {
    const user = await findUserById(String(req.params.id));
    if (!user) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json({ profile: userRowToProfile(user) });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
router2.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.userId !== String(req.params.id) && !req.isAdmin) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }
    const { name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email } = req.body;
    const user = await updateUser(String(req.params.id), {
      name,
      age,
      city,
      address,
      bio,
      lookingFor,
      image,
      status,
      relationshipIntent,
      interests,
      phone,
      telegram,
      instagram,
      email
    });
    if (!user) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json({ user: userRowToProfile(user) });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
var profile_routes_default = router2;

// api-src/routes/payment.routes.ts
import { Router as Router3 } from "express";
import { v4 as uuid2 } from "uuid";

// api-src/models/payment.model.ts
async function createPayment(data) {
  return prisma_default.payment.create({
    data: {
      id: data.id,
      userId: data.userId,
      profileId: data.profileId,
      profileName: data.profileName,
      profileImage: data.profileImage ?? null,
      senderName: data.senderName,
      senderPhone: data.senderPhone,
      transactionId: data.transactionId.toUpperCase(),
      method: data.method,
      amount: data.amount,
      receiptImage: data.receiptImage ?? null,
      status: "Pending"
    }
  });
}
async function findPaymentsByUser(userId) {
  return prisma_default.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}
async function findAllPayments() {
  return prisma_default.payment.findMany({
    orderBy: { createdAt: "desc" }
  });
}
async function updatePaymentStatus(id, status) {
  return prisma_default.payment.update({
    where: { id },
    data: { status }
  });
}
async function hasApprovedPayment(userId) {
  const count = await prisma_default.payment.count({
    where: { userId, status: "Approved" }
  });
  return count > 0;
}
async function countPaymentsByStatus(status) {
  return prisma_default.payment.count({ where: { status } });
}
async function sumApprovedRevenue() {
  const result = await prisma_default.payment.aggregate({
    where: { status: "Approved" },
    _sum: { amount: true }
  });
  return result._sum.amount ?? 0;
}

// api-src/routes/payment.routes.ts
var router3 = Router3();
router3.post("/", authenticate, validatePayment, async (req, res) => {
  try {
    const { profileId, profileName, profileImage, senderName, senderPhone, transactionId, method, amount, receiptImage } = req.body;
    const id = uuid2();
    const created = await createPayment({
      id,
      userId: req.userId,
      profileId,
      profileName,
      profileImage,
      senderName,
      senderPhone,
      transactionId,
      method,
      amount: amount || 200,
      receiptImage
    });
    if (!created) {
      res.status(500).json({ error: "Failed to create payment" });
      return;
    }
    res.status(201).json({ payment: paymentRowToPayment(created) });
  } catch (err) {
    console.error("Submit payment error:", err);
    res.status(500).json({ error: "Failed to submit payment" });
  }
});
router3.get("/", authenticate, async (req, res) => {
  try {
    const rows = req.isAdmin ? await findAllPayments() : await findPaymentsByUser(req.userId);
    const payments = rows.map((r) => paymentRowToPayment(r));
    res.json({ payments });
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});
router3.put("/:id/approve", authenticate, adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);
    const payment = await updatePaymentStatus(id, "Approved");
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    await verifyUser(payment.userId);
    res.json({ payment: paymentRowToPayment(payment) });
  } catch (err) {
    console.error("Approve payment error:", err);
    res.status(500).json({ error: "Failed to approve payment" });
  }
});
router3.put("/:id/reject", authenticate, adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);
    const payment = await updatePaymentStatus(id, "Rejected");
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    res.json({ payment: paymentRowToPayment(payment) });
  } catch (err) {
    console.error("Reject payment error:", err);
    res.status(500).json({ error: "Failed to reject payment" });
  }
});
router3.get("/check", authenticate, async (req, res) => {
  try {
    const hasPaid = await hasApprovedPayment(req.userId);
    res.json({ hasPaid });
  } catch (err) {
    console.error("Check payment error:", err);
    res.status(500).json({ error: "Failed to check payment status" });
  }
});
var payment_routes_default = router3;

// api-src/routes/admin.routes.ts
import { Router as Router4 } from "express";
import bcrypt2 from "bcryptjs";
import { v4 as uuid3 } from "uuid";

// api-src/models/admin.model.ts
import bcrypt from "bcryptjs";
var ADMIN_USERNAME = "admin";
async function findOrCreateAdmin(passcode) {
  let admin = await prisma_default.admin.findUnique({ where: { username: ADMIN_USERNAME } });
  if (!admin) {
    const hashed = await bcrypt.hash(passcode, 10);
    admin = await prisma_default.admin.create({
      data: { username: ADMIN_USERNAME, password: hashed }
    });
  } else {
    const storedMatch = await bcrypt.compare(passcode, admin.password);
    if (!storedMatch) {
      const hashed = await bcrypt.hash(passcode, 10);
      admin = await prisma_default.admin.update({
        where: { id: admin.id },
        data: { password: hashed }
      });
    }
  }
  return {
    id: String(admin.id),
    username: admin.username,
    password: admin.password,
    createdAt: admin.createdAt.toISOString()
  };
}
async function updateAdminPasscode(newPasscode) {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await prisma_default.admin.updateMany({
    where: { username: ADMIN_USERNAME },
    data: { password: hashed }
  });
}

// api-src/routes/admin.routes.ts
var router4 = Router4();
var ENV_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";
router4.post("/login", validateAdminLogin, async (req, res) => {
  try {
    const { passcode } = req.body;
    const admin = await findOrCreateAdmin(ENV_PASSCODE);
    const match = await bcrypt2.compare(passcode, admin.password);
    if (!match) {
      res.status(401).json({ error: "Invalid passcode" });
      return;
    }
    const token = generateToken({ id: String(admin.id), isAdmin: true });
    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Admin login failed" });
  }
});
router4.put("/passcode", authenticate, adminOnly, validatePasscodeUpdate, async (req, res) => {
  try {
    const { newPasscode } = req.body;
    await updateAdminPasscode(newPasscode);
    res.json({ success: true });
  } catch (err) {
    console.error("Update passcode error:", err);
    res.status(500).json({ error: "Failed to update passcode" });
  }
});
router4.get("/stats", authenticate, adminOnly, async (_req, res) => {
  try {
    const stats = {
      totalUsers: await countUsers(),
      maleUsers: await countUsersByGender("Male"),
      femaleUsers: await countUsersByGender("Female"),
      verifiedUsers: await countVerifiedUsers(),
      pendingPayments: await countPaymentsByStatus("Pending"),
      approvedPayments: await countPaymentsByStatus("Approved"),
      revenue: await sumApprovedRevenue()
    };
    res.json({ stats });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
router4.put("/profiles/:id/verify", authenticate, adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);
    const result = await toggleUserVerification(id);
    if (!result) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ verified: result.verified });
  } catch (err) {
    console.error("Toggle verification error:", err);
    res.status(500).json({ error: "Failed to toggle verification" });
  }
});
router4.post("/profiles", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email, verified } = req.body;
    if (!name || !gender) {
      res.status(400).json({ error: "Name and gender are required" });
      return;
    }
    const id = uuid3();
    const created = await createUser({
      id,
      name,
      age,
      city,
      address,
      bio,
      gender,
      lookingFor,
      image,
      status: status || "Online",
      relationshipIntent: relationshipIntent || "Friendship",
      interests: interests || [],
      phone,
      telegram,
      instagram,
      email
    });
    if (!created) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    if (verified) {
      await verifyUser(id);
    }
    const user = await findUserById(id);
    res.status(201).json({ user: userRowToProfile(user) });
  } catch (err) {
    console.error("Admin create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});
router4.delete("/profiles/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteUser(id);
    if (!deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
var admin_routes_default = router4;

// api-src/app.ts
var app = express();
app.set("trust proxy", 1);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    "https://whaatachi.vercel.app",
    "https://whaatachi.lovable.app",
    ...process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []
  ];
  if (origin && (allowed.includes(origin) || /\.vercel\.app$/.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});
app.use(helmet());
app.use(morgan("short"));
app.use(express.json({ limit: "10mb" }));
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" }
});
app.use("/api/", limiter);
var cacheableRoutes = [];
app.use((req, res, next) => {
  if (req.method === "GET" && cacheableRoutes.some((p) => req.path.startsWith(p))) {
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  }
  next();
});
app.use("/api/auth", auth_routes_default);
app.use("/api/profiles", profile_routes_default);
app.use("/api/payments", payment_routes_default);
app.use("/api/admin", admin_routes_default);
app.get("/api/health", async (_req, res) => {
  try {
    await prisma_default.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
app.use(notFoundHandler);
app.use(errorHandler);
var app_default = app;

// api-src/config/seed-data.ts
import { v4 as uuid4 } from "uuid";
var FEMALE_IMAGES = [
  "/assets/One.avif",
  "/assets/two.avif",
  "/assets/three.avif",
  "/assets/four.avif",
  "/assets/One.avif",
  "/assets/two.avif",
  "/assets/three.avif",
  "/assets/four.avif",
  "/assets/One.avif",
  "/assets/two.avif"
];
var MALE_IMAGES = [
  "/assets/1.avif",
  "/assets/2.avif",
  "/assets/3.avif",
  "/assets/1.avif",
  "/assets/2.avif",
  "/assets/3.avif",
  "/assets/1.avif",
  "/assets/2.avif",
  "/assets/3.avif",
  "/assets/1.avif"
];
var CITIES = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar", "Dire Dawa", "Gondar", "Mekelle", "Jimma", "Dessie", "Harar"];
var INTENTS = ["True Relationship", "Friendship", "Friends with Benefits", "Only Sex"];
var INTERESTS_POOL = [
  "Coffee Ceremony",
  "Macchiato",
  "Technology",
  "Literature",
  "Jazz",
  "Hiking",
  "Photography",
  "Art Galleries",
  "Traditional Food",
  "Fitness",
  "Philosophy",
  "Business",
  "Road Trips",
  "Tennis",
  "Volunteering",
  "History",
  "Cooking",
  "Content Creation",
  "Bole Cafes",
  "Design",
  "Lake Walks",
  "Acoustic Music",
  "Family Values",
  "Travel",
  "Music",
  "Dancing",
  "Reading",
  "Movies",
  "Fashion",
  "Sports"
];
var STATUSES = ["Online", "Offline", "Recently Active"];
var femaleNames = [
  "Selamawit Tekle",
  "Kidist Hailu",
  "Helen Gebru",
  "Bethel Elias",
  "Hana Kassa",
  "Martha Tesfaye",
  "Tigist Alene",
  "Eden Girma",
  "Meron Alemu",
  "Tsion Wondimu",
  "Birtukan Desta",
  "Mahlet Ayele",
  "Frehiwot Eshetu",
  "Ruth Getachew",
  "Sosina Tadesse",
  "Likina Amare",
  "Bethlehem Assefa",
  "Mekdes Hailu",
  "Yordanos Mengistu",
  "Hiwot Belay"
];
var maleNames = [
  "Abel Mekonnen",
  "Daniel Tadesse",
  "Nahom Girma",
  "Samuel Solomon",
  "Elias Shiferaw",
  "Yohannes Bekele",
  "Michael Tsegaye",
  "Bereket Kebede",
  "Dawit Haile",
  "Henok Tesfaye",
  "Binyam Alemu",
  "Yonas Gebre",
  "Ermias Wondimu",
  "Mikiyas Tadesse",
  "Nebiyu Fekadu",
  "Kalkidan Hailu",
  "Biruk Assefa",
  "Surafel Girma",
  "Natnael Abebe",
  "Yared Getachew"
];
var additionalFemaleNames = [
  "Bethelihem Alemu",
  "Tsion Abate",
  "Freweyni Assefa",
  "Meklit Worku",
  "Selam Teshome",
  "Eyerusalem Shiferaw",
  "Lensa Tadesse",
  "Yeabsira Nigussie",
  "Edlawit Mulugeta",
  "Bontu Olani"
];
var additionalMaleNames = [
  "Abenezer Wondimu",
  "Yonatan Ayele",
  "Natnael Kebede",
  "Kidus Mesfin",
  "Bemnet Tefera",
  "Eyosias Shibabaw",
  "Mintesinot Ayele",
  "Yisehak Tesfaye",
  "Robel Abate",
  "Liyu Birhane"
];
var femaleBios = [
  "I love exploring new cafes in Addis and meeting genuine people. Looking for someone who values real connection.",
  "Passionate about my career and culture. Looking for a true gentleman who respects traditions.",
  "Coffee lover, book enthusiast, and weekend hiker. Let's share stories over macchiato.",
  "Family-oriented professional looking for a serious relationship built on trust and respect.",
  "Adventurous spirit who loves traveling across Ethiopia's beautiful landscapes. Seeking a partner in crime.",
  "Creative soul who enjoys art, music, and deep conversations. Let's explore Bole together.",
  "Faith-driven woman looking for a God-fearing man for a lasting relationship.",
  "Foodie who loves traditional Ethiopian cuisine and trying new restaurants. Looking for someone to share meals with.",
  "Yoga enthusiast and wellness coach. Seeking a balanced, healthy relationship.",
  "Dedicated professional who also values quality time with family. Looking for my missing piece."
];
var maleBios = [
  "Hardworking professional looking for a genuine connection. I appreciate honesty and good conversation over coffee.",
  "Entrepreneur by day, music lover by night. Seeking a smart, kind woman to share life with.",
  "Sports enthusiast and fitness lover. Looking for someone who values health and happiness.",
  "Engineer with a passion for travel and photography. Let's explore Ethiopia together.",
  "Family man at heart. Looking for a serious relationship that leads to marriage.",
  "Creative professional who enjoys art galleries, live music, and Ethiopian cuisine.",
  "Ambitious and driven, but know how to relax. Looking for a partner who balances work and life.",
  "Simple guy who values loyalty, respect, and good vibes. Let's start with coffee and see where it goes.",
  "Tech startup founder who also loves traditional coffee ceremonies. Seeking a genuine connection.",
  "Adventure seeker who loves road trips to Lalibela and the Northern Mountains. Join me!"
];
var biDirectFemale = [
  "No strings attached. Just two adults who know what they want. Discretion guaranteed.",
  "Looking for a real connection, not games. Let's build something meaningful together.",
  "Straightforward \u2014 I want a genuine relationship with a man who respects me.",
  "Over the fake romances. I'm here for something real, open, and passionate.",
  "Physical chemistry matters. Let's meet if we vibe and keep it honest.",
  "Hoping to find my future husband. Family-oriented woman with traditional values.",
  "I know what I want and I'm not shy about it. Honesty and passion first.",
  "Looking for a serious partner to share life, coffee, and sunsets with.",
  "Let's keep it simple and hot. Mutual respect and good energy required.",
  "Faithful woman seeking a loyal man for a lasting relationship. Let's start with a walk."
];
var biDirectMale = [
  "I don't waste time. If you're direct and know what you want, let's talk.",
  "Looking for a serious woman to settle down with. Old school values, modern mind.",
  "Let's be honest \u2014 physical connection is important. Let's see if we click.",
  "Ready for marriage. Looking for a woman who values family, faith, and loyalty.",
  "No drama, no games. Just good vibes and real physical connection.",
  "Seeking a queen to build a future with. Ambitious, respectful, and romantic.",
  "I'm upfront about what I want \u2014 passionate encounters with no complications.",
  "Traditional guy with a big heart. Looking for my partner for life.",
  "Into fitness and having fun. Not looking for a girlfriend \u2014 looking for a good time.",
  "God-fearing man seeking a wife. Let's build a beautiful future together."
];
function pickAt(arr, index) {
  return arr[index % arr.length];
}
function pickN(arr, startIndex, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[(startIndex + i) % arr.length]);
  }
  return result;
}
function slugify(name) {
  return name.toLowerCase().replace(/\s/g, "");
}
async function seedData(clearFirst = false) {
  if (clearFirst) {
    await prisma_default.payment.deleteMany();
    await prisma_default.userInterest.deleteMany();
    await prisma_default.user.deleteMany();
    console.log("Cleared existing data.");
  }
  const userCount = await prisma_default.user.count();
  if (userCount === 0) {
    async function buildUser(i, name, gender, bioPool, imgPool, phoneBase, lookingFor, intentOverride) {
      const parts = name.split(" ");
      const id = uuid4();
      const interests = pickN(INTERESTS_POOL, i * 3 + (gender === "Female" ? 0 : 1), 3);
      const phoneNum = `+251 91${String(phoneBase + i * 123456).slice(0, 7)}`;
      return prisma_default.user.create({
        data: {
          id,
          name,
          age: gender === "Female" ? 21 + i % 12 : 22 + i % 14,
          city: pickAt(CITIES, i + (gender === "Female" ? 0 : 5)),
          address: "",
          bio: pickAt(bioPool, i),
          gender,
          lookingFor,
          image: pickAt(imgPool, i),
          status: pickAt(STATUSES, i + (gender === "Female" ? 0 : 2)),
          relationshipIntent: intentOverride || pickAt(INTENTS, i),
          phone: phoneNum,
          telegram: `@${parts[0].toLowerCase()}_${i}`,
          instagram: `@${parts[0].toLowerCase()}_eth`,
          email: `${slugify(name)}@whaatachi.com`,
          interests: {
            create: interests.map((interest) => ({ interest }))
          }
        }
      });
    }
    const batchSize = 10;
    const allUsers = [
      ...femaleNames.map((name, i) => buildUser(i, name, "Female", femaleBios, FEMALE_IMAGES, 1e6, "Male")),
      ...maleNames.map((name, i) => buildUser(i, name, "Male", maleBios, MALE_IMAGES, 2e6, "Female")),
      ...additionalFemaleNames.map((name, i) => buildUser(i, name, "Female", biDirectFemale, FEMALE_IMAGES, 3e6, "Male", i < 5 ? "Only Sex" : "True Relationship")),
      ...additionalMaleNames.map((name, i) => buildUser(i, name, "Male", biDirectMale, MALE_IMAGES, 4e6, "Female", i < 5 ? "Only Sex" : "True Relationship"))
    ];
    for (let i = 0; i < allUsers.length; i += batchSize) {
      await Promise.all(allUsers.slice(i, i + batchSize));
    }
    console.log("Seeded 60 users (20 female, 20 male, 10 additional female, 10 additional male).");
  }
  console.log("Seed complete!");
}

// server.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
}
var PORT = parseInt(process.env.PORT || process.env.API_PORT || "3001", 10);
async function start() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }
  await prisma_default.$connect();
  console.log("MySQL connected via Prisma");
  if (process.env.RUN_SEED === "true") {
    await seedData();
  }
  const server = app_default.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
  server.timeout = 35e3;
  server.headersTimeout = 36e3;
  startProfileCache(3e5);
}
start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
