const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /api/books/bookList:
 *   get:
 *     summary: 도서 조회
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Book data
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
// 도서 조회
router.get("/api/books/bookList", async (req, res) => {
  try {
    const { title, group } = req.query;

    const escapeRegExp = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      ...(title && { title: new RegExp(escapeRegExp(title), "i") }),
      ...(group && { group }),
    };

    const books = await Book.find(query);

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching bookList: ", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/books/bookAdd:
 *   post:
 *     summary: 도서 등록
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               registDate:
 *                 type: date
 *     responses:
 *       201:
 *         description: Created response description
 *       400:
 *         description: Bad Request response description
 *       500:
 *         description: Server Error response description
 */
// 도서 등록
router.post("/api/books/bookAdd", upload.single("cover"), async (req, res) => {
  const { title, author, publisher, group, registDate } = req.body;
  const cover = req.file?.filename || "";

  try {
    const book = new Book({
      title,
      cover: cover,
      link: "",
      author,
      categoryName: "",
      publisher,
      group,
      registDate,
    });

    await book.save();

    res.status(200).send({ message: "도서 등록이 완료되었습니다." });
  } catch (error) {
    console.error("Error during bookadd:", error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

/**
 * @swagger
 * /api/books/bookUpdate/{id}:
 *   put:
 *     summary: 도서 정보 변경
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book _id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               registDate:
 *                 type: date
 *     responses:
 *       200:
 *         description: Success response description
 *       400:
 *         description: Bad Request response description
 *       404:
 *         description: Not Found response description
 *       500:
 *         description: Server Error response description
 */
// 도서 정보 변경
router.put("/api/books/bookUpdate/:id", async (req, res) => {
  const { title, author, publisher, group, registDate } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        publisher,
        group,
        registDate,
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    res.status(200).send({ message: "변경이 완료되었습니다." });
  } catch (error) {
    res.status(500).send({ error: "서버 오류. 도서를 변경할 수 없습니다." });
  }
});

/**
 * @swagger
 * /api/books/bookDelete/{id}:
 *   delete:
 *     summary: 도서 삭제
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book _id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response description
 *       400:
 *         description: Bad Request response description
 *       404:
 *         description: Not Found response description
 *       500:
 *         description: Server Error response description
 */
// 도서 삭제
router.delete("/api/books/bookDelete/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) res.status(404).send({ error: "Book not found" });

    res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
