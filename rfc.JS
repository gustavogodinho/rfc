  function focusFunctionRFC() {

            if (sessionStorage.getItem("Idioma") != "es-MX")
                return false;

            var primeiroNome = document.getElementById('ctl00_ContentBody_txtPrimeiroNome').value;
            var segundoNome = document.getElementById('ctl00_ContentBody_txtSegundoNome').value;
            var terceiroNome = document.getElementById('ctl00_ContentBody_txtTerceiroNome').value;
            var DtNascimento = document.getElementById('ctl00_ContentBody_txtDataNascimento').value.split('/');

            if (validaDadosRFC(primeiroNome, segundoNome, DtNascimento)) {
                var rfc = gerarRFC(primeiroNome, segundoNome, terceiroNome, DtNascimento[0], DtNascimento[1], DtNascimento[2]);

                document.getElementById('ctl00_ContentBody_txtCNPJCPF').value = rfc.substr(0,10);
                document.getElementById('ctl00_ContentBody_txtRFCHomoclave').value = rfc.substr(10,3);
            }
        }


function validaDadosRFC(primeiroNome, segundoNome, DtNascimento) {
    if (primeiroNome == "") {
        return false;
    } else if (segundoNome == "") {
        return false;
    }
    else if (DtNascimento == "") {
        return false;
    }

    return true;
}






function gerarRFC(primeiroNome, segundoNome, terceiroNome, nascDia, nascMes, nascAno) {

    var Nombre = this.removeCommonNames(this.removePrefixes(clearString(primeiroNome.toUpperCase())));
    var ApellidoPaterno = this.removePrefixes(clearString(segundoNome.toUpperCase()));
    var ApellidoMaterno = this.removePrefixes(clearString(terceiroNome.toUpperCase()));
    var NacimientoDia = clearString(nascDia);
    var NacimientoMes = clearString(nascMes);
    var NacimientoAno = clearString(nascAno);

    rfc = this.gerarParteComum(Nombre, ApellidoPaterno, ApellidoMaterno, NacimientoDia, NacimientoMes, NacimientoAno);
    homoclave = this.HomoclaveRFC(removeAccents(primeiroNome.toUpperCase()) + ' ' + removeAccents(segundoNome.toUpperCase().replace("'", '')) + ' ' + removeAccents(terceiroNome.toUpperCase()));
    digito = this.DigitoVerificadorRFC(rfc + homoclave);

    return rfc + homoclave + digito;
}

function HomoclaveRFC(texto) {
    const equivalencia = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var nomeCompleto = texto;
    var caracter;
    var cadenaNums = '';
    var numero1;
    var numero2;
    var suma = 0;
    var homoclave;
    var cociente;
    var residuo;

    for (var i = 0; i <= nomeCompleto.length; i++) {
        caracter = nomeCompleto.substr(i, 1);

        if (caracter == ' ') {
            cadenaNums += '00';
        } else if (caracter == '&') {
            cadenaNums += '10';
        } else if (caracter == 'Ñ') {
            cadenaNums += '10';
        } else if (/[ABCDEFGHI']+/.test(caracter)) {
            cadenaNums += (caracter.charCodeAt(0) - 54).toString();
        } else if (/[JKLMNOPQR]+/.test(caracter)) {
            cadenaNums += (caracter.charCodeAt(0) - 53).toString();
        } else if (/[STUVWXYZ]+/.test(caracter)) {
            cadenaNums += (caracter.charCodeAt(0) - 51).toString();
        }
    }
    cadenaNums = '0' + cadenaNums;

    for (var i = 0; i <= ((cadenaNums).length - 1); i++) {
        numero1 = cadenaNums.substr(i, 2);
        numero2 = cadenaNums.substr(i + 1, 1);

        suma += numero1 * numero2;
    }

    var l = suma.toString().length;
    var rigth = suma.toString().substr(l - 3);

    cociente = parseInt(rigth / 34);
    residuo = rigth % 34;

    homoclave = equivalencia.substr(cociente, 1) + equivalencia.substr(residuo, 1);

    return homoclave;
}

function DigitoVerificadorRFC(texto) {
    var digitoVerificador = '';
    var total = texto.length;
    var caracter;
    var cadenaNums = '';
    var cont = 0;
    var numero;
    var suma = 0;
    var residuo;

    for (var i = 0; i <= total; i++) {
        caracter = texto.substr(i, 1);

        if (caracter == ' ') {
            cadenaNums += '37';
        } else if (caracter == '&') {
            cadenaNums += '24';
        } else if (caracter == 'Ñ') {
            cadenaNums += '38'
        } else if (/[ABCDEFGHIJKLMN]+/.test(caracter)) {
            cadenaNums += (caracter.charCodeAt(0) - 55).toString();
        } else if (/['OPQRSTUVWXYZ']+/.test(caracter)) {
            cadenaNums += (caracter.charCodeAt(0) - 54).toString();
        } else if (/[0-9]+/.test(caracter)) {
            cadenaNums += '0' + caracter;
        }
    }

    for (var y = 0; y <= 23; y += 2) {
        numero = parseInt(cadenaNums.substr(y, 2));
        suma += (numero * (13 - cont));
        cont++;
    }

    residuo = suma % 11;

    if (residuo == 0) {
        digitoVerificador = '0';
    } else if (residuo == 10) {
        digitoVerificador = 'A';
    } else {
        digitoVerificador = (11 - residuo).toString();
    }

    return digitoVerificador;
}

function gerarParteComum(primeiroNome, segundoNome, terceiroNome, nascDia, nascMes, nascAno) {
    x = obterLetrasRFC(segundoNome, terceiroNome, primeiroNome);
    x = this.removeBadWords(x);
    x += nascAno.substring(2);
    x += nascMes;
    x += nascDia;

    return x;
}

function removeCommonNames(name) {
    this.notAcceptedNames.forEach(
        function (notAccepted) {
            name = name.replace(new RegExp('^' + notAccepted), '');
        }
    );

    return name;
}

function removePrefixes(name) {
    this.prefixes.forEach(
        function (notAccepted) {
            name = name.replace(new RegExp('^' + notAccepted), '');
        }
    );

    return name;
}

function removeBadWords(word) {
    badWordsList = this.badWordsRFC

    if (badWordsList[word]) {
        return badWordsList[word]
    }

    return word;
}

var notAcceptedNames = new Array(
    'MARIA DEL ',
    'MARIA DE LOS ',
    'MARIA ',
    'JOSE DE ',
    'JOSE ',
    'MA. ',
    'MA ',
    'M. ',
    'J. ',
    'J '
)

var prefixes = new Array(
    'PARA ',
    'AND ',
    'CON ',
    'DEL ',
    'LAS ',
    'LOS ',
    'MAC ',
    'POR ',
    'SUS ',
    'THE ',
    'VAN ',
    'VON ',
    'AL ',
    'DE ',
    'EL ',
    'EN ',
    'LA ',
    'MC ',
    'MI ',
    'OF ',
    'A ',
    'E ',
    'Y ',
    'DE LOS',
    'LOS '
)

var badWordsRFC = {
    "BUEI": "BUEX",
    "BUEY": "BUEX",
    "CACA": "CACX",
    "CACO": "CACX",
    "CAGA": "CAGX",
    "CAGO": "CAGX",
    "CAKA": "CAKX",
    "COGE": "COGX",
    "COJA": "COJX",
    "COJE": "COJX",
    "COJI": "COJX",
    "COJO": "COJX",
    "CULO": "CULX",
    "FETO": "FETX",
    "GUEY": "GUEX",
    "JOTO": "JOTX",
    "KACA": "KACX",
    "KACO": "KACX",
    "KAGA": "KAGX",
    "KAGO": "KAGX",
    "KOGE": "KOGX",
    "KOJO": "KOJX",
    "KAKA": "KAKX",
    "KULO": "KULX",
    "MAME": "MAMX",
    "MAMO": "MAMX",
    "MEAR": "MEAX",
    "MEON": "MEOX",
    "MION": "MIOX",
    "MOCO": "MOCX",
    "MULA": "MULX",
    "PEDA": "PEDX",
    "PEDO": "PEDX",
    "PENE": "PENX",
    "PUTA": "PUTX",
    "PUTO": "PUTX",
    "QULO": "QULX",
    "RATA": "RATX",
    "RUIN": "RUIX",
}

function obterLetrasRFC(segundoNome, terceiroNome, primeiroNome) {
    var letras = '';

    if (terceiroNome.length == 0) {
        letras = segundoNome.substring(0, 2) + primeiroNome.substring(0, 2);
    } else if (segundoNome.length < 3) {
        letras = segundoNome.substring(0, 1) + terceiroNome.substring(0, 1) +
            primeiroNome.substring(0, 2);
    } else {

        var segundo = ''
        for (var i = 1; i < segundoNome.substring(1).length + 1; i++) {

            segundo = segundoNome.substring(i).match(new RegExp('[AEIOU]'))[0];
            if (segundo != '') {
                break;
            }
        }

        letras = segundoNome[0] + segundo + terceiroNome[0] + primeiroNome[0];
    }
    return letras;
}

function clearString(word) {
    var cleanWord = word.trim();
    cleanWord = cleanWord.replace(/\s/g, ' ');
    cleanWord = this.removeAccents(cleanWord.toUpperCase());
    return cleanWord;
}

function removeAccents(word) {
    accents = {
        'Á': 'A',
        'É': 'E',
        'Í': 'I',
        'Ó': 'O',
        'Ú': 'U'
    }

    for (accented in accents) {
        word = word.replace(new RegExp(accented), accents[accented]);
    }
    return word;
}