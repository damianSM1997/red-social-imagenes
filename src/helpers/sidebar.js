// el mombre va en mayuscula proque es un modelo
// normal mente los modelos van en mayuscula
const Stats = require('./stats');
const Images = require('./images');
const Comments = require('./comments');
//viewModel esta en images y es el encargado de 
//entregar todos los datos
module.exports = async viewModel => {

    const results = await Promise.all([
        Stats(),
        Images.popular(),
        //se puede ejecutar directa mente porque ya se mando a llamar Stats
        // y no tiene ningun metodo
        Comments.newest()
    ]);

    viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        comments: results[2],
    };
    //a viewModel se le agregaron uans propiedades de silebar
    return viewModel;

};