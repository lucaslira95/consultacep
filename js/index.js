document.getElementById("consultar").addEventListener("click", consultar, false);

async function consultar() {
    enableSpinner();
    let cep = $('#cep').val();
    await $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
        if (dados.cep == undefined) {
            alert("CEP não existente");
        }
        else {
            let thead = $("#tabela thead");
            if (thead.children().length == 0) {
                $("#tabela thead").append(
                    "<tr>" +
                    "<th scope='col'>CEP</th>" +
                    "<th scope='col'>Logradouro</th>" +
                    "<th scope='col'>Bairro</th>" +
                    "<th scope='col'>Localidade</th>" +
                    "</tr>"
                );
            }
            $("#tabela tbody").append(
                "<tr>" +
                "<td>" + dados.cep + "</td>" +
                "<td>" + dados.logradouro + "</td>" +
                "<td>" + dados.bairro + "</td>" +
                "<td>" + dados.localidade + "</td>" +
                "</tr>"
            );
        }
    });
    disableSpinner();
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

