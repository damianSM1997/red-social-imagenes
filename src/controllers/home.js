//exporta una funcion que mostrara un mensaje por 
//pantall
const sidebar = require('../helpers/sidebar');
const { Image } = require('../models');

const ctrl = {};

ctrl.index = async(req, res) => {
    const images = await Image
        .find()
        .sort({ timestamp: -1 });
    let viewModel = { images: [] };
    //la linea de abajo se hace con la finalidad de pasarselo a sidebar
    viewModel.images = images;
    //sidebar ahora tendra las propiedades de viewModel
    viewModel = await sidebar(viewModel);
    //console.log(viewModel);
    //res.render('index', viewModel);
    res.render('index', viewModel);
    console.log(viewModel);
};

module.exports = ctrl;