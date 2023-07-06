const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const EventSchema = new Schema({

    title: {
        type: String
    },
    image: [
        {
            url: String,
            filename: String
        }
    ],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

EventSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Event', EventSchema);

