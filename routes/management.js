const express = require('express');
const router = express.Router();

const Management = require('./../models/management');

const upload = require('./../middlewares/upload');

// 도서 등록
router.post(
  '/api/management/bookAdd',
  upload.single('cover'),
  async (req, res) => {
    const {
      title,
      author,
      publisher,
      publicationDate,
      count,
      registrationDate,
      group,
      registeredBy,
    } = req.body;
    const cover = req.file?.filename || '';

    try {
      const bookData = new Management({
        title,
        author,
        cover: cover,
        publisher,
        publicationDate,
        count,
        registrationDate,
        group,
        registeredBy,
      });

      await bookData.save();

      res.status(200).send({ message: '도서를 등록하였습니다.' });
    } catch (error) {
      res.status(500).send({ errorCode: error.code, error: error.errmsg });
    }
  }
);

// 도서 조회
router.get('/api/management/bookList', async (req, res) => {
  try {
    const { title, group } = req.query;

    const escapeRegExp = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const query = {
      ...(title && { title: new RegExp(escapeRegExp(title), 'i') }),
      ...(group && { group }),
    };

    const bookList = await Management.find(query);

    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 도서 변경
router.put(
  '/api/management/bookUpdate/:id',
  upload.single('cover'),
  async (req, res) => {
    const { title, author, publisher, publicationDate, count } = req.body;
    const cover = req.file?.filename || '';

    try {
      const bookData = await Management.findByIdAndUpdate(
        req.params.id,
        {
          title,
          author,
          ...(cover && { cover }),
          publisher,
          publicationDate,
          count,
        },
        { new: true, runValidators: true }
      );

      !bookData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

      res.status(200).send({ message: '도서를 변경하였습니다.' });
    } catch (error) {
      res.status(500).send({ errorCode: error.code, error: error.errmsg });
    }
  }
);

// 도서 대여
router.put('/api/management/bookHistory/:id', async (req, res) => {
  const { user, startDate, endDate, registeredBy } = req.body;

  try {
    const historyData = await Management.findByIdAndUpdate(req.params.id, {
      $push: {
        history: {
          user,
          startDate,
          endDate,
          registeredBy
        },
      }
    });

    !historyData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });
    
    res.status(200).send({ message: '도서를 대여하였습니다.' });
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 후기 등록
router.put('/api/management/bookReviewWrite/:id', async (req, res) => {
  const { user, group, rate, tag, comment, registrationDate, registeredBy } =
    req.body;

  try {
    const reviewData = await Management.findByIdAndUpdate(req.params.id, {
      $push: {
        reviews: {
          user,
          group,
          rate,
          tag,
          comment,
          registrationDate,
          registeredBy,
        },
      }
    });

    !reviewData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    res.status(200).send({ message: '후기를 등록하였습니다.' });
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 도서 삭제
router.delete('/api/management/bookDelete/:id', async (req, res) => {
  try {
    const bookData = await Management.findByIdAndDelete(req.params.id);

    !bookData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    res.status(200).send({ message: '도서를 삭제하였습니다.' });
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

module.exports = router;
