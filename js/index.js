document.getElementById("consultar").addEventListener("click", consultar);
document.getElementById("combolist").addEventListener("change", combolistSwitch);
document.getElementById("cep").addEventListener("keypress", (event) => {checkEnterKey(event)});

function checkEnterKey(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#consultar').click();
    }
}

function combolistSwitch() {
    if ($('#combolist').is(':checked')) {
        enableCombolist();
    }
    else {
        disableCombolist();
        document.getElementById("cep").addEventListener("keypress", (event) => {checkEnterKey(event)});
    }
}

async function consultar() {

    enableSpinner();
    buttonSwitch("consultar", false);
    let cepList = $('#cep').val().split('\n');
    for(let i = 0; i < cepList.length; i++){
        let cep = cepList[i];
        let filteredCep = cep.replace(/\D/g, '');
        const validacep = /^[0-9]{8}$/;

        if (!validacep.test(filteredCep)) {
            insertAlert(cep, 'inválido');
        }
        else {
            await $.getJSON("https://viacep.com.br/ws/" + filteredCep + "/json/?callback=?", function (dados) {
                if (dados.cep == undefined) {
                    insertAlert(cep, 'não existe');
                }
                else {
                    insertAdress(dados);
                }
            });
        }
    }

    buttonSwitch("consultar", true);
    disableSpinner();
    $('#cep').val('');
    $('.alert').on('close.bs.alert', function () {
        $('#cep').focus();
    })
    $('#cep').focus();


}

function enableSpinner() {
    $("#consultar").attr("disabled", true);
    $("#consultar").html('Consultando...');
    $("#consultar").append("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>");
}

function disableSpinner() {
    $("#consultar").empty();
    $("#consultar").attr("disabled", false);
    $("#consultar").html('Consultar');
}

function buttonSwitch(tagId, state) {
    document.getElementById(tagId).enabled = state;
}

function insertAlert(cep, suffixMessage) {
    $("<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
        "CEP " + cep + " " + suffixMessage + "." +
        "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
        "<span aria-hidden='true'>&times;</span>" +
        "</button>" +
        "</div>").insertAfter('#cep-input');
}

function insertAdress(dados) {
    let thead = $("#tabela thead");

    if (thead.children().length == 0) {
        $("#tabela thead").append(
            "<tr>" +
            "<th scope='col'>CEP</th>" +
            "<th scope='col'>Logradouro</th>" +
            "<th scope='col'>Bairro</th>" +
            "<th scope='col'>Cidade</th>" +
            "<th scope='col'>Estado</th>" +
            "</tr>"
        );
    }
    $("#tabela tbody").append(
        "<tr>" +
        "<td>" + dados.cep + "</td>" +
        "<td>" + dados.logradouro + "</td>" +
        "<td>" + dados.bairro + "</td>" +
        "<td>" + dados.localidade + "</td>" +
        "<td>" + dados.uf + "</td>" +
        "</tr>"
    );
}

function disableCombolist() {
    $('#cep').replaceWith(
        "<input type='text' id='cep' class='form-control' placeholder='CEP'" +
        "aria-label='CEP' aria-describedby='cepinput'></input>"
    );
}

function enableCombolist() {
    $('#cep').replaceWith(
        "<textarea type='text' id='cep' class='form-control' placeholder='Lista de CEPs'" +
        "aria-label='CEP' aria-describedby='cepinput'></textarea>"
    );
}