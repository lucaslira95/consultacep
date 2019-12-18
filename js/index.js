document.getElementById("consultar").addEventListener("click", consultar, false);

async function consultar() {
    enableSpinner();
    let cep = $('#cep').val().replace(/\D/g, '');
    var validacep = /^[0-9]{8}$/;
    if (!validacep.test(cep)) {
        disableSpinner();
        $("<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
            "CEP " + $('#cep').val() + " inválido." +
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
            "<span aria-hidden='true'>&times;</span>" +
            "</button>" +
            "</div>").insertAfter('#cep-input');
        $('#cep').val('');

    }
    else {
        await $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
            if (dados.cep == undefined) {
                disableSpinner();
                $("<div class='alert alert-warning alert-dismissible fade show' role='alert'>" +
                    "CEP " + $('#cep').val() + " não existe." +
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<span aria-hidden='true'>&times;</span>" +
                    "</button>" +
                    "</div>").insertAfter('#cep-input');
                $('#cep').val('');
            }
            else {
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
                disableSpinner();
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

