$('#post-comment').hide();
$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
});

//parte para ejecutar la funcion del evento like
$('#btn-like').click(function(e) {
    e.preventDefault();
    //de todo el objeto retorna el id
    let imgId = $(this).data('id');
    //concatena para hacer la teticion post
    $.post('/images/' + imgId + '/like')
        .done(data => {
            console.log(data);
            $('.likes-count').text(data.likes);
        });
});

$('#btn-delete').click(function(e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('¿Estas seguro de querer eliminar esta imagen?');
    if (response) {
        let imgId = $this.data('id');
        $.ajax({
            url: '/images/' + imgId,
            type: 'DELETE'
        }).
        done(function(result) {
            $this.removeClass('btn-danger').addClass('btn-success');
            //remueve la clase y lo remplasa
            $this.find('i').removeClass('fa-times').addClass('fa-check');
            $this.append('<span>Borrado</span>');
        })
    }
})