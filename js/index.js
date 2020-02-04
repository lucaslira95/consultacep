document.getElementById("consultar").addEventListener("click", consultar);
document.getElementById("cep").addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#consultar').click();
    }
});

async function consultar() {
    enableSpinner();
    buttonSwitch("consultar", false);
    let cep = $('#cep').val().replace(/\D/g, '');
    var validacep = /^[0-9]{8}$/;

    if (!validacep.test(cep)) {
        disableSpinner();
        insertAlert('#cep', 'inválido');
        buttonSwitch("consultar", true);
        $('#cep').val('');
        $('#cep').focus();
        $('.alert').on('close.bs.alert', function () {
            $('#cep').focus();
        })
    }
    else {
        await $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
            if (dados.cep == undefined) {
                disableSpinner();
                insertAlert('#cep', 'não existe');
                buttonSwitch("consultar", true);
                $('#cep').val('');
                $('#cep').focus();
                $('.alert').on('close.bs.alert', function () {
                    $('#cep').focus();
                })
            }
            else {

                insertAdress(dados);
                buttonSwitch("consultar", true);
                disableSpinner();
                $('#cep').val('');
                $('#cep').focus();
            }
        });
    }
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

function insertAlert(tagId, suffixMessage) {
    $("<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
        "CEP " + $(tagId).val() + " " + suffixMessage + "." +
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