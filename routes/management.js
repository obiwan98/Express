const express = require('express');
const Group = require('../models/group');
const router = express.Router();

const Management = require('./../models/management');

const upload = require('./../middlewares/upload');

// 도서 등록
router.post(
  '/api/management/bookAdd',
  upload.single('coverFile'),
  async (req, res) => {
    const {
      title,
      link,
      description,
      author,
      coverUrl,
      isbn,
      publisher,
      publicationDate,
      count,
      registrationDate,
      group,
      registeredBy,
    } = req.body;
    const coverFile = req.file?.filename || '';

    try {
      if (isbn) {
        const query = {
          isbn,
          group,
        };

        const registeredBookData = await Management.findOne(query);

        if (registeredBookData)
          return res.status(400).send({ message: '이미 등록된 도서입니다.' });
      }

      const bookData = new Management({
        title,
        link,
        description,
        author,
        coverUrl,
        coverFile,
        isbn,
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
      res.status(500).send({ message: '도서 등록을 실패하였습니다.' });
    }
  }
);

// 도서 조회
router.get('/api/management/bookList/:id?', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, group } = req.query;

    const escapeRegExp = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const query = {
      ...(title && { title: new RegExp(escapeRegExp(title), 'i') }),
      ...(group && { group }),
    };

    const bookList = id
      ? await Management.findById(id)
      : await Management.find(query);

    !bookList
      ? res.status(404).send({ error: '도서를 찾을 수 없습니다.' })
      : res.status(200).json(bookList);
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 도서 변경
router.put(
  '/api/management/bookUpdate/:id',
  upload.single('coverFile'),
  async (req, res) => {
    const { title, author, publisher, publicationDate, count } = req.body;
    const coverFile = req.file?.filename || '';

    try {
      const bookData = await Management.findByIdAndUpdate(
        req.params.id,
        {
          title,
          author,
          ...(coverFile && { coverFile }),
          publisher,
          publicationDate,
          count,
        },
        { new: true, runValidators: true }
      );

      !bookData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

      res.status(200).send({ message: '도서를 변경하였습니다.' });
    } catch (error) {
      res.status(500).send({ message: '도서 변경을 실패하였습니다.' });
    }
  }
);

// 도서 대여
router.put('/api/management/bookHistory/:id', async (req, res) => {
  const { user, startDate, endDate, registeredBy } = req.body;

  try {
    const bookData = await Management.findById(req.params.id);

    if (!bookData)
      return res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    const { count, rentalCount } = bookData;

    if (count - rentalCount < 1)
      return res
        .status(400)
        .send({ message: '대여 가능한 도서 수가 부족합니다.' });

    const bookHistory = await Management.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { rentalCount: 1 },
        $push: {
          history: {
            user,
            startDate,
            endDate,
            registeredBy,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!bookHistory)
      return res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    res.status(200).send({ message: '도서를 대여하였습니다.' });
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 도서 대여 이력 조회
router.get('/api/management/bookHistory/:id', async (req, res) => {
  try {
    const bookData = await Management.findOne(
      { _id: req.params.id },
      { history: 1 }
    );

    !bookData && res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    res.status(200).json(bookData.history);
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 도서 반납
router.put('/api/management/bookReturn/:id', async (req, res) => {
  const { id, endDate } = req.body;

  const bookHistory = await Management.findOne(
    {
      _id: req.params.id,
    },
    {
      history: { $elemMatch: { _id: id } },
    }
  );

  const isStartDateAfterToday =
    new Date(bookHistory.history[0].startDate) > new Date();

  try {
    const bookData = await Management.findOneAndUpdate(
      { _id: req.params.id, 'history._id': id },
      {
        $inc: {
          rentalCount: -1,
        },
        $set: {
          'history.$.state': 2,
          ...(isStartDateAfterToday && { 'history.$.startDate': endDate }),
          'history.$.endDate': endDate,
        },
      },
      { new: true, runValidators: true }
    );

    if (!bookData)
      return res.status(404).send({ error: '도서를 찾을 수 없습니다.' });

    res.status(200).send({ message: '도서를 반납하였습니다.' });
  } catch (error) {
    res.status(500).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 후기 등록
router.put('/api/management/bookReviewWrite/:id', async (req, res) => {
  const {
    id,
    user,
    group,
    rate,
    tag,
    comment,
    registrationDate,
    registeredBy,
  } = req.body;

  try {
    let reviewData;

    if (id) {
      reviewData = await Management.findOneAndUpdate(
        { _id: req.params.id, 'reviews._id': id },
        {
          $set: {
            'reviews.$.rate': rate,
            'reviews.$.tag': tag,
            'reviews.$.comment': comment,
            'reviews.$.registrationDate': registrationDate,
          },
        },
        { new: true, runValidators: true }
      );
    } else {
      reviewData = await Management.findByIdAndUpdate(req.params.id, {
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
        },
      });
    }

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

// 그룹별 책 개수 카운트 API
router.get('/api/management/group-count', async (req, res) => {
  try {
    const groupCounts = await Management.aggregate([
      {
        $group: {
          _id: '$group',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'groupInfo',
        },
      },
      {
        $unwind: '$groupInfo',
      },
      {
        $project: {
          _id: 0,
          groupName: '$groupInfo.team',
          count: 1,
        },
      },
    ]);

    // 모든 그룹 데이터를 가져와서 책이 없는 그룹도 포함시킴
    const allGroups = await Group.find();
    const resultMap = groupCounts.reduce((acc, item) => {
      acc[item.groupName] = item.count;
      return acc;
    }, {});

    const formattedResult = allGroups.map((group) => ({
      groupName: group.team,
      count: resultMap[group.team] || 0,
    }));

    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: '도서 수 조회가 실패하였습니다.' });
  }
});

module.exports = router;
