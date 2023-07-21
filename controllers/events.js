const Event = require("../models/event");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
}


module.exports.renderNewForm = (req, res) => {
    res.render('events/new')
}


module.exports.createEvent = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.event.location,
        limit: 1
    }).send()
    const event = new Event(req.body.event);
    event.geometry = geoData.body.features[0].geometry;
    event.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    event.author = req.user._id;
    await event.save();
    console.log(event);
    req.flash('success', 'Successfully created a new Event')
    res.redirect(`/events/${event._id}`)
}

module.exports.showEvent = async (req, res) => {
    const event = await Event.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    console.log(event);
    if (!event) {
        req.flash('error', 'cannot find the event!')
        return res.redirect('/events')
    }
    res.render("events/show", { event })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id)
    if (!event) {
        req.flash('error', 'cannot find event!');
        return res.redirect('/events');
    }
    res.render("events/edit", { event })
}

module.exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    event.image.push(...imgs);
    await event.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await event.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
        console.log(event)
    }
    req.flash('success', "succesfully updated event!!")
    res.redirect(`/events/${event._id}`)
}

module.exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'sucessfully deleted')
    res.redirect('/events')
}

