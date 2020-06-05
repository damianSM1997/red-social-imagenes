const { Comment, Image } = require('../models');

module.exports = {
    async newest() {

        const comments = await Comment.find()
            .limit(5)
            .sort({ timestamp: -1 })
            //este es un for medio extraño xd
        for (const comment of comments) {
            //Esto se manda a yumar porque se requiere guardar la imagen 
            //con un comentario en particular
            const image = await Image.findOne({ _id: comment.image_id });
            comment.image = image;
        }

        return comments;
    }
};