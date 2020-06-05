const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const ImageSchema = new Schema({
    title: { type: String },
    description: { type: String },
    filename: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});
//esta variable no se creara en la DB pero si cuando se mande a llamar
ImageSchema.virtual('uniqueId')
    .get(function() {
        return this.filename.replace(path.extname(this.filename), '');
    })
    //forma de esportar un modelo
module.exports = mongoose.model('Image', ImageSchema)