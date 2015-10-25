var erros;
var palavra;
var insert;
var palavraString;
var jogavel;
var numJogadas;
var letrasJogadas;
var muted;
var pontos;
var dificuldadeAtual;
var user = {};

function inicializar(){
	palavraString = palavra;
	pontos = 0;
	erros = 0;
	insert = '';
	jogavel = true;
	numJogadas = 0;
	letrasJogadas = [];
	muted = false;
	getDica();
	palavra = palavra.split('');
	user.nome = getURLParameter('nome');
	dificuldadeAtual = getURLParameter('dificuldade');
	user = obterJogador(user.nome);

	palavra.forEach(function(char) {
		if (char !== ' '){
			insert += '*';
		}else{
			insert += ' ';
		}
	});

	limiteErros = ( dificuldadeAtual === 'nunez' ) ? 2 : 5;
	palavra = palavra.join('');
	$('body').append($('h2').html(insert));
};

function jogada (letra) {
	var i = 0;
	var erro = true;
	var music = new Audio();
	letrasJogadas[numJogadas] = letra;
	palavra = palavra.split('');
	insert = insert.split('');

	palavra.forEach(function (let) {
		if (let === letra){
			user.pontos += dificuldadeAtual === 'nunez' ? 2 : 1;
			music.src = 'resources/coin.mp3';
			if(muted !== true)
				music.play();
			insert[i] = letra;
			erro = false;
		}

		i++;
	});

	if(erro === true){
		music.src = 'resources/error.mp3';
		if(muted !== true)
			music.play();
	    erros++;
	  	$('p').append($('#err').html(erros));
	}

	numJogadas++;
	insert = insert.join('');
	palavra = palavra.join('');
	$('h2').empty();
	$('body').append($('h2').html(insert));
	$('label').append($('h1').html(letrasJogadas + ''));
	$('#btnDica').disabled = true;
	verifica();
};



function verifica () {
	var audio = new Audio();
	if(erros === limiteErros){
		audio.src = 'resources/youlose.mp3';
		if(muted !== true)
			audio.play();
		fimDeJogo('derrota');
	}

	if (palavra === insert){
		fimDeJogo('vitoria');
	}
};

function eliminaPalavraAcertada(pala){

	palavrasDisponiveis = palavrasDisponiveis.filter(function(elem){
		return elem.texto !== pala;
	});

	var palavrasAcertadas = JSON.parse(localStorage.getItem(user.nome));
	palavrasAcertadas.palavras.push(pala);
	localStorage.setItem(user.nome, JSON.stringify(palavrasAcertadas));
}

function getDica(){
	var index = parseInt(Math.random() * palavra.length);
	$('#dicaModal').append($('<a>').html('A palavra contém a letra: ' + palavra[index]));
};

function fimDeJogo(tipo){
	atualizarUser(user.id, { "pontos":user.pontos });

	if (tipo === 'vitoria'){
		eliminaPalavraAcertada(palavra);
		location.replace('home.html?nome='+user.nome+'&dificuldade='+dificuldadeAtual+'&id='+user.id+'&pontos='+user.pontos);
		threadSleepAfeterRedirect('home.html');
	}

	if (tipo === 'derrota'){
		threadSleepAfeterRedirect('gameOver.html');
	}
};

$('#btnChute').click(function(){
	var chute = $('#txtChute').val();
	var audio = new Audio();
	if (chute !== ''){
		if (chute === palavra){
			user.pontos += dificuldadeAtual === 'nunez' ? 20 : 10;
			audio.src = 'resources/chuteCerteiro.mp3';
			if(muted !== true){
				audio.play();
			}
			fimDeJogo('vitoria');
		}else{
			audio.src = 'resources/chutefail.mp3';
			if(muted !== true)
				audio.play();
			fimDeJogo('derrota');
		}
	}
})

$('#btnDica').click(function(){ if(muted !== true) btnSound(); });
$('#txtChute').focus(function(){jogavel = false;});
$('#txtChute').blur(function(){jogavel = true;});

$('body').keypress(function(e){
	if(jogavel === true){
		var letra = String.fromCharCode(e.which);
		letra = letra.toLowerCase();
		if(!letra.search(/^[a-z]+$/)){
			if (letrasJogadas.indexOf(letra) === -1){
				jogada(letra);
			}
		}
	}
});
$('body').keyup(function(e){
    console.log('keyup', String.fromCharCode( e.which ));
});
