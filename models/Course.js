const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const courseSchema = new Schema({
    title: { type: String, require: true, unique: true, minlenght: [4, 'Title must be atleast 4 charakters!'] },
    description: { type: String, require: true, minlenght: [20, 'Description must be atleast 20 charakters!'], maxlenght: [50, 'Description shouldn\'t be more than 50 charakters'] },
    imgUrl: { type: String, require: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid URL'
    }},
    duration: { type: String, require: true },
    createdAt: { type: String, require: true, default: () => (new Date()).toISOString().slice(0, 10) },
    users: { type: [Types.ObjectId], ref:'User', defauth: [] },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
});

courseSchema.index({ name: 1 }, {
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Course = model('Course', courseSchema);

module.exports = Course;