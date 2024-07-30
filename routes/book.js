const express = require('express');
const Book = require('../models/book');
const Group = require('../models/group');
const auth = require('../middlewares/auth');
const router = express.Router();

// 도서 목록 조회 (인증 필요)
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().populate('group');
    res.status(200).send(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// 특정 도서 조회 (인증 필요)
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('group');
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// 도서 추가 (인증 필요)
router.post('/', auth, async (req, res) => {
  const { title, author, publisher, group } = req.body;

  try {
    const existingGroup = await Group.findById(group);
    if (!existingGroup) {
      return res.status(400).send({ error: 'Group not found' });
    }

    const book = new Book({ title, author, publisher, group: existingGroup._id });
    await book.save();
    res.status(201).send({ message: 'Book created successfully' });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).send({ error: 'Failed to create book' });
  }
});

// 도서 수정 (인증 필요)
router.put('/:id', auth, async (req, res) => {
  const { title, author, publisher, group } = req.body;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }

    const existingGroup = await Group.findById(group);
    if (!existingGroup) {
      return res.status(400).send({ error: 'Group not found' });
    }

    book.title = title;
    book.author = author;
    book.publisher = publisher;
    book.group = existingGroup._id;

    await book.save();
    res.status(200).send({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).send({ error: 'Failed to update book' });
  }
});

// 도서 삭제 (인증 필요)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
