const express = require('express');
const Book = require('../models/book');
const Group = require('../models/group');
const auth = require('../middlewares/auth');
const axios = require('axios');
const router = express.Router();

const ALADIN_API_URL = 'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx';
const TTB_KEY = 'ttbfunkholics1613001';

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /api/books/aladinSearch:
 *   get:
 *     summary: aladin api 검색
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: query
 *         schema:
 *           type: string
 *           example : 'java'
 *         required: true
 *         description: 검색어
 *     responses:
 *       200:
 *         description: search successful
 *       400:
 *         description: Invalid query
 *       500:
 *         description: Internal server error
 */

// 도서 검색 API 라우터
router.get('/aladinSearch', async (req, res) => {
  const { query, queryType = 'Keyword', maxResults = 10, start = 1 } = req.query;

  if (!query) {
    return res.status(400).json({ error: '검색어(제목 또는 저자)를 입력해주세요.' });
  }

  try {
    const response = await axios.get(ALADIN_API_URL, {
      params: {
        ttbkey: TTB_KEY,
        Query: query,
        QueryType: queryType,
        MaxResults: maxResults,
        start: start,
        SearchTarget: 'Book',
        output: 'js', // JSON 형식으로 출력
        Version: '20131101',
      },
    });

    // 응답에서 필요한 데이터 추출
    const books = response.data.item.map((item) => ({
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      pubDate: item.pubDate,
      description: item.description,
      cover: item.cover,
      isbn13: item.isbn13,
      link: item.link,
    }));

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
