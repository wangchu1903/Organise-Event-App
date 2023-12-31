const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Event = require("../models/event");


mongoose.connect('mongodb://localhost:27017/OrganizeApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongo connection open!!")

    })
    .catch((err) => {
        console.log("oh no mongo connection error!!")
        console.log(err)
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Event.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const event = new Event({
            author: '6464ecb2368b322970c5d6a1',
            location: `${cities[random].city},${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam perspiciatis minus dolor laborum ab nam iusto ullam qui culpa vero, voluptatem deleniti quo veritatis dolores, optio hic atque possimus? Sed?",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwbdr1cx2/image/upload/v1689173811/OrganizeApp/ax8eygxrax3dzpmjczsh.jpg',
                    filename: 'OrganizeApp/ax8eygxrax3dzpmjczsh'
                },
                {
                    url: 'https://res.cloudinary.com/dwbdr1cx2/image/upload/v1689173811/OrganizeApp/yevkrpzls78turmbkmo9.jpg',
                    filename: 'OrganizeApp/yevkrpzls78turmbkmo9'
                },
            ]

        })
        await event.save();
    }


}
seedDB().then(() => {
    mongoose.connection.close()
})

