const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const Group = require("../models/group");
const auth = require("../middlewares/auth");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'obiwan98@cj.net'
 *               password:
 *                 type: string
 *                 example: '070404'
 *               role:
 *                 type: string
 *                 example: '66a0bbfe8d7e45a08668b311'
 *               group:
 *                 type: string
 *                 example: '66a0b1bd8d7e45a08668b300'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Failed to create user
 */
// 회원가입 엔드포인트
router.post("/api/users/signup", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '회원가입'
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
          schema: { $ref: "#/components/schemas/userSignupExample" },
            example: { 
              $ref: "#/components/examples/userSignupExample"
            }
          }
        }
      }
  */
  const { email, name, password, role, group } = req.body;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      role: role,
      group: group,
      signupDate: Date.now(),
    });

    // 사용자 저장
    await user.save();
    res.status(201).send({ message: "회원가입이 성공하였습니다" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'obiwan98@cj.net'
 *               password:
 *                 type: string
 *                 example: '070404'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

// 로그인 엔드포인트
router.post("/api/users/login", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '로그인'
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
          schema: { $ref: "#/components/schemas/userLoginExample" },
            example: { 
              $ref: "#/components/examples/userLoginExample"
            }
          }
        }
      }
  */
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate("group")
      .populate("role");
    if (!user) {
      console.error("User not found:", email);
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password for user:", email);
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role, group: user.group },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 현재 로그인 회원 정보
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// 사용자 정보 조회 엔드포인트 (인증 필요)
router.get("/api/users/me", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '현재 로그인 회원 정보'
  try {
    const user = await User.findOne({ email: req.email })
      .populate("group")
      .populate("role");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 회원 리스트 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
// 모든 사용자 목록 조회 엔드포인트 (인증 필요, 관리자만)
router.get("/api/users/", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '모든 회원 리스트 조회'
  try {
    const users = await User.find().populate("group").populate("role");
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: _id로 특정 회원 정보 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User _id
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// 특정 사용자 정보 조회 엔드포인트 (인증 필요)
router.get("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 정보 조회'

  try {
    const user = await User.findById(req.params.id)
      .populate("group")
      .populate("role");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: _id로 특정 회원 정보 업데이트
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User _id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: '66a0bbfe8d7e45a08668b30f'
 *               group:
 *                 type: string
 *                 example: '66a0b1bd8d7e45a08668b2fe'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Failed to update user
 *       404:
 *         description: User not found
 */
// 사용자 정보 수정 엔드포인트 (인증 필요)
router.put("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 정보 업데이트'
  const { role, group } = req.body;

  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.role = role;
    user.group = group;

    await user.save();
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send({ error: "Failed to update user" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: _id로 특정 회원 삭제
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User _id
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// 사용자 삭제 엔드포인트 (인증 필요)
router.delete("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 삭제'
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
