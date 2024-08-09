const express = require('express');
const Book = require('../models/book');
const Group = require('../models/group');
const auth = require('../middlewares/auth');
const axios = require('axios');
const router = express.Router();

const ALADIN_API_SEARCH_URL = 'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx';
const ALADIN_API_LOOKUP_URL = 'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx';
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
 *   post:
 *     summary: aladin api Search - 검색어로 검색(제목, 작가)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: 'java'
 *               maxResults:
 *                 type: string
 *                 example: '10'
 *               start:
 *                 type: string
 *                 example: '1'
 *             required:
 *               - query
 *     responses:
 *       200:
 *         description: search successful
 *       400:
 *         description: Invalid query
 *       500:
 *         description: Internal server error
 */

// 도서 검색 API 라우터
router.post('/aladinSearch', async (req, res) => {
  const { query, queryType = 'Keyword', maxResults = 10, start = 1 } = req.body;

  if (!query) {
    return res.status(400).json({ error: '검색어(제목 또는 저자)를 입력해주세요.' });
  }

  try {
    const response = await axios.get(ALADIN_API_SEARCH_URL, {
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

    const items = response.data.item;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: '검색 결과를 찾을 수 없습니다.' });
    }

    // 응답에서 필요한 데이터 추출
    const books = items.map((item) => ({
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

/**
 * @swagger
 * /api/books/aladinLookUp:
 *   post:
 *     summary: aladin api LookUp - ISBN 코드번호로 검색
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ItemId:
 *                 type: string
 *                 example: '9788931477139'
 *     responses:
 *       200:
 *         description: lookUp successful
 *       400:
 *         description: Invalid query
 *       500:
 *         description: Internal server error
 */

// 도서 검색 API 라우터 ttbkey=ttbfunkholics1613001&itemIdType=ISBN&ItemId=9788965138068&output=js&Version=20131101
router.post('/aladinLookUp', async (req, res) => {
  const { ItemId } = req.body;

  if (!ItemId) {
    return res.status(400).json({ error: 'ISBN 번호를 입력해주세요.' });
  }

  try {
    const response = await axios.get(ALADIN_API_LOOKUP_URL, {
      params: {
        ttbkey: TTB_KEY,
        itemIdType: 'ISBN',
        ItemId: ItemId,
        output: 'js', // JSON 형식으로 출력
        Version: '20131101',
      },
    });

    // 응답에서 item 배열이 있는지 확인
    const items = response.data.item;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: '해당 ISBN에 대한 결과를 찾을 수 없습니다.' });
    }

    // 응답에서 필요한 데이터 추출
    const books = items.map((item) => ({
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      pubDate: item.pubDate,
      description: item.description,
      cover: item.cover,
      isbn13: item.isbn13,
      link: item.link,
    }));

    res.status(200).json(books[0]);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
