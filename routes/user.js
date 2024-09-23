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

router.post("/api/users/signup", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '회원가입'
  /*  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "example": "obiwan98@cj.net"
                },
                "name": {
                  "example": "박광연"
                },
                "password": {
                  "example": "070404"
                },
                "role": {
                  "example": "66a0bbfe8d7e45a08668b311"
                },
                "group": {
                  "example": "66a0b1bd8d7e45a08668b300"
                }
              }
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
    res.status(200).send({ message: "회원가입이 성공하였습니다." });
  } catch (error) {
    res.status(400).send({ errorCode: error.code, error: "회원가입이 실패하였습니다." });
  }
});

router.post("/api/users/login", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '로그인'
  /*  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "example": "obiwan98@cj.net"
                },
                "password": {
                  "example": "070404"
                }
              }
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
      return res.status(400).send({ errorCode: error.code, error: "이메일 또는 패스워드가 틀렸습니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ errorCode: error.code, error: "이메일 또는 패스워드가 틀렸습니다." });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role, group: user.group },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({ token, message: "로그인이 성공하였습니다." });
  } catch (error) {
    res.status(500).send({ error: "로그인 시도 중 오류가 발생했습니다." });
  }
});

router.get("/api/users/me", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '현재 로그인 회원 정보'
  try {
    const user = await User.findOne({ email: req.email })
      .populate("group")
      .populate("role");
    if (!user) {
      return res.status(404).send({ error: "이메일 정보가 틀렸습니다." });
    }
    res.status(200).send({user, message: "회원 정보 조회가 성공하였습니다."});
  } catch (error) {
    res.status(500).send({ error: "회원 정보 조회 중 오류가 발생했습니다." });
  }
});

router.get("/api/users/", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '모든 회원 리스트 조회'
  try {
    const users = await User.find().populate("group").populate("role");
    res.status(200).send({users, message: "회원 리스트 조회가 성공하였습니다."});
  } catch (error) {
    res.status(500).send({ error: "회원 리스트 조회 중 오류가 발생했습니다." });
  }
});

router.get("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 정보 조회'

  try {
    const user = await User.findById(req.params.id)
      .populate("group")
      .populate("role");
    if (!user) {
      return res.status(404).send({ error: "회원을 찾을 수 없습니다." });
    }
    res.status(200).send({user, message: "회원 정보 조회가 성공하였습니다."});
  } catch (error) {
    res.status(500).send({ error: "회원 정보 조회 중 오류가 발생했습니다." });
  }
});

router.put("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 정보 업데이트'
  /*  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "role": {
                  "example": "66a0bbfe8d7e45a08668b311"
                },
                "group": {
                  "example": "66a0b1bd8d7e45a08668b300"
                }
              }
            }
          }
        }
      }
    */
  const { role, group } = req.body;

  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "회원을 찾을 수 없습니다." });
    }

    user.role = role;
    user.group = group;

    await user.save();
    res.status(200).send({ message: "회원 정보 변경이 완료되었습니다." });
  } catch (error) {
    res.status(400).send({ error: "회원 정보 변경이 실패하였습니다." });
  }
});

router.delete("/api/users/:id", auth, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = '_id로 특정 회원 삭제'
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "회원을 찾을 수 없습니다." });
    }
    res.status(200).send({ message: "회원 정보 삭제가 성공하였습니다." });
  } catch (error) {
    res.status(500).send({ error: "회원 정보 삭제 중 오류가 발생했습니다." });
  }
});

router.get('/api/roles', async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'User 역할 목록 조회'
  try {
    const roles = await Role.find();
    res.status(200).send({roles, message: "역할 목록 조회가 성공하였습니다."});
  } catch (error) {
    res.status(500).send({ error: '역할 목록 조회 중 오류가 발생했습니다.' });
  }
});

router.get('/api/groups', async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'User 그룹 목록 조회'
  try {
    const groups = await Group.find();
    res.status(200).send({groups, message: "그룹 목록 조회가 성공하였습니다."});
  } catch (error) {
    res.status(500).send({ error: '그룹 목록 조회 중 오류가 발생했습니다.' });
  }
});
module.exports = router;
