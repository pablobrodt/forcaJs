var arrayJogadores;

function carregarJogadores(){
	$.get('http://localhost:3000/usuarios').done(function(data){
  		arrayJogadores = data;
  	});
}


function obterJogador(nome){
  if (typeof arrayJogadores !== 'undefined'){
	  var user = arrayJogadores.filter(function(elem){
	        return elem.nome === nome;});

	  if (typeof user !== 'undefined')
	  	return user[0];
   }
};

function obterJogadorId(id){
  console.log(arrayJogadores);
  var user = arrayJogadores.filter(function(elem){
        return elem.id === id;});

  if (typeof user !== 'undefined')
  	return user[0];
};

function atualizarUser(id, atributos){
  $.ajax({
    url: 'http://localhost:3000/usuarios/'+id,
    type:'PATCH',
    data: atributos
  });

  setTimeout('atualizarUser', 1000);
};

function inserirUsuario(nome, radio, valor){
    localStorage.setItem('dificuldade', radio);
		var usuario = JSON.parse(localStorage.getItem(nome));
		if(usuario === null){
			localStorage.setItem(nome, JSON.stringify({"palavras":[]}));
		}
    $.post('http://localhost:3000/usuarios',
    {
      "nome": nome,
      "pontos":valor
    });

    setTimeout(function(){
      $('reload-json').load('server.json', function (err, data) {
      });

    	$.get('http://localhost:3000/usuarios').done(function(data){
	    	var user = data.filter(function(elem){
	    		return elem.nome === nome;
	    	});

	    	location.replace('home.html?nome='+nome+'&dificuldade='+radio+'&id='+user[0].id+'&pontos='+valor);
        threadSleepAfeterRedirect('home.html', 1000);
   		});
   	}, 1000);
};
