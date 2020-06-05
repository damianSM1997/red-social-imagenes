const fs = require('fs-extra');
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const handlebars = require('handlebars');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');


//const { Image } = require('../models/index');
const { Image, Comment } = require('../models');

const ctrl = {};


ctrl.index = async(req, res) => {
    //viewModel se cancargara de englobar las imagenes y los comentarios
    let viewModel = { image: {}, comments: [] };
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });

    if (image) {
        image.views = image.views + 1;
        viewModel.image = image;
        image.save();
        //console.log(image);
        //traera todos lso comentarios de dicha imagen
        const comments = await Comment.find({ image_id: image._id })
            .sort({ 'timestamp': 1 });
        viewModel.comments = comments;
        await sidebar(viewModel);


        res.render('image', viewModel);
    } else {
        res.redirect('/');
    }


};

ctrl.create = (req, res) => {

    const saveImage = async() => {
        //imgURL nos dara uan secuencia de caracteres aleatorio
        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl });
        if (images.length > 0) {
            saveImage();
        } else {
            console.log(imgUrl);
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

            if (ext === '.png' || ext === '.jpg' || ext === 'jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImg = new Image({
                    title: req.body.title,
                    filename: imgUrl + ext,
                    description: req.body.description
                });
                const imagenSaved = await newImg.save();
                console.log(newImg);
                res.redirect(/images/ + imgUrl);
                res.send(`works! Para ver la imagen ingresa: https://social-red-img.herokuapp.com/public/upload/${imgUrl}${ext}`)

            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only images are alloed' });
            }

        }

    };

    saveImage();

};

ctrl.like = async(req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } })
    if (image) {
        image.likes = image.likes + 1;
        await image.save();
        //pinta todos los like que les pase
        res.json({ likes: image.likes });
    } else {
        res.status(500).json({ erro: 'Internal error' });
    }

};

ctrl.comment = async(req, res) => {
    //console.log(req.params.image_id);//puedo ver el id de la img
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } })
        //creacion de mi objeto comentario
    if (image) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        console.log(newComment);
        res.redirect('/images/' + image.uniqueId);
    } else {
        res.redirect('/');
    }



};

ctrl.remove = async(req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } })

    if (image) {
        //se coloca la direccion para borrar la imagen
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
        await Comment.deleteOne({ image_id: image._id });
        await image.remove();
        res.json(true);
    }
};

module.exports = ctrl;