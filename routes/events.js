const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Event = require("../models/event");
const { eventSchema } = require('../schema.js')
const events = require('../controllers/events')
const { isLoggedIn, isAuthor, validateEvent } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });



router.get('/', catchAsync(events.index))

router.get('/new', isLoggedIn, events.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateEvent, catchAsync(events.createEvent))

router.get('/:id', catchAsync(events.showEvent))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(events.renderEditForm));

router.put('/:id', isLoggedIn, upload.array('image'), validateEvent, catchAsync(events.updateEvent));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(events.deleteEvent));

module.exports = router;

