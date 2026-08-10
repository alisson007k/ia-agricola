// ==========================================
// TRATOR IA
// SISTEMA DE MANUTENÇÃO PREDITIVA
// ==========================================


// ==========================================
// SISTEMA DE ABAS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const botoes = document.querySelectorAll(".botao-aba");

    const abas = document.querySelectorAll(".aba");


    botoes.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const nomeAba = botao.dataset.aba;


            // Esconde todas as abas
            abas.forEach(function (aba) {

                aba.classList.remove("ativa");

            });


            // Remove destaque dos botões
            botoes.forEach(function (b) {

                b.classList.remove("ativo");

            });


            // Mostra a aba escolhida
            const abaEscolhida =
                document.getElementById(nomeAba);


            if (abaEscolhida) {

                abaEscolhida.classList.add("ativa");

                botao.classList.add("ativo");

            }


            // Volta para o topo
            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    });


    // ==========================================
    // BOTÕES DE ANÁLISE
    // ==========================================

    const botoesAnalise =
        document.querySelectorAll(".botao-analisar");


    botoesAnalise.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const idInput =
                botao.dataset.input;

            const limite =
                Number(botao.dataset.limite);

            const idResultado =
                botao.dataset.resultado;


            analisarPeca(
                idInput,
                limite,
                idResultado
            );

        });

    });


    // ==========================================
    // BOTÃO DA PREVISÃO
    // ==========================================

    const botaoPrevisao =
        document.getElementById("botaoPrevisao");


    if (botaoPrevisao) {

        botaoPrevisao.addEventListener(
            "click",
            preverManutencao
        );

    }


    // ==========================================
    // BOTÃO DO HISTÓRICO
    // ==========================================

    const botaoHistorico =
        document.getElementById("botaoHistorico");


    if (botaoHistorico) {

        botaoHistorico.addEventListener(
            "click",
            adicionarHistorico
        );

    }


    // Mostra o histórico
    mostrarHistorico();


    // Ativa o botão Início
    const inicio =
        document.querySelector(
            '.botao-aba[data-aba="inicio"]'
        );


    if (inicio) {

        inicio.classList.add("ativo");

    }

});


// ==========================================
// ANÁLISE DE UMA PEÇA
// ==========================================

function analisarPeca(
    idInput,
    limite,
    idResultado
) {

    const campo =
        document.getElementById(idInput);

    const resultado =
        document.getElementById(idResultado);


    if (!campo || !resultado) {

        console.error(
            "Elemento não encontrado."
        );

        return;

    }


    const horas =
        Number(campo.value);


    if (isNaN(horas) || horas < 0) {

        resultado.innerHTML =
            "⚠️ Digite uma quantidade válida de horas.";

        return;

    }


    const porcentagem =
        horas / limite;


    if (porcentagem >= 1) {

        resultado.innerHTML = `

            🔴 <strong>ATENÇÃO</strong>

            <br><br>

            O intervalo de referência foi atingido.

            <br>

            Recomenda-se realizar uma inspeção
            e consultar as recomendações do fabricante.

        `;

    }


    else if (porcentagem >= 0.75) {

        const restante =
            Math.max(
                0,
                Math.round(limite - horas)
            );


        resultado.innerHTML = `

            🟡 <strong>ATENÇÃO MODERADA</strong>

            <br><br>

            A peça está se aproximando
            do intervalo de manutenção.

            <br>

            Estimativa de aproximadamente:

            <strong>
                ${restante} horas
            </strong>

            para nova avaliação.

        `;

    }


    else {

        const restante =
            Math.max(
                0,
                Math.round(limite - horas)
            );


        resultado.innerHTML = `

            🟢 <strong>RISCO BAIXO</strong>

            <br><br>

            A peça está dentro do intervalo
            de referência utilizado pelo sistema.

            <br>

            Estimativa de aproximadamente:

            <strong>
                ${restante} horas
            </strong>

            para nova avaliação.

        `;

    }

}


// ==========================================
// PREVISÃO PRINCIPAL
// ==========================================

function preverManutencao() {

    const horas =
        Number(
            document.getElementById(
                "horasTrator"
            ).value
        );


    const intensidade =
        Number(
            document.getElementById(
                "intensidade"
            ).value
        );


    const ambiente =
        Number(
            document.getElementById(
                "ambiente"
            ).value
        );


    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (
        isNaN(horas) ||
        horas < 0
    ) {

        resultado.innerHTML =
            "⚠️ Informe corretamente as horas do trator.";

        return;

    }


    // ======================================
    // MODELO PREDITIVO EXPERIMENTAL
    // ======================================

    const fatorDesgaste =
        intensidade * ambiente;


    const indice =
        horas * fatorDesgaste;


    let nivel;

    let mensagem;


    if (indice < 1500) {

        nivel = "🟢 BAIXO";

        mensagem =
            "O desgaste estimado está relativamente baixo.";

    }


    else if (indice < 3000) {

        nivel = "🟡 MÉDIO";

        mensagem =
            "Alguns componentes podem estar se aproximando da manutenção.";

    }


    else {

        nivel = "🔴 ALTO";

        mensagem =
            "O desgaste estimado está elevado. Recomenda-se uma inspeção.";

    }


    // Estimativa experimental
    const vidaReferencia = 5000;


    const horasRestantes =
        Math.max(

            0,

            Math.round(

                (vidaReferencia - indice)
                /
                fatorDesgaste

            )

        );


    resultado.innerHTML = `

        <h3>🤖 Resultado da previsão</h3>

        <br>

        <strong>Nível de desgaste:</strong>

        ${nivel}

        <br><br>

        <strong>Índice calculado:</strong>

        ${Math.round(indice)}

        <br><br>

        <strong>Estimativa:</strong>

        aproximadamente

        <strong>
            ${horasRestantes} horas
        </strong>

        para uma nova avaliação.

        <br><br>

        ${mensagem}

        <hr>

        <small>

            ⚠️ Este é um modelo experimental.
            A previsão não representa um diagnóstico
            mecânico e deve ser comparada com dados
            reais e recomendações do fabricante.

        </small>

    `;


    // Atualiza o painel
    const painel =
        document.getElementById(
            "horasPainel"
        );


    if (painel) {

        painel.textContent =
            horas + " h";

    }

}


// ==========================================
// HISTÓRICO
// ==========================================

let historico = [];


try {

    historico =
        JSON.parse(
            localStorage.getItem(
                "historicoTrator"
            )
        ) || [];

}
catch (erro) {

    historico = [];

}


// ==========================================
// ADICIONAR MANUTENÇÃO
// ==========================================

function adicionarHistorico() {

    const peca =
        document.getElementById(
            "pecaHistorico"
        ).value;


    const horas =
        Number(
            document.getElementById(
                "horasHistorico"
            ).value
        );


    if (
        isNaN(horas) ||
        horas < 0
    ) {

        alert(
            "Digite corretamente as horas do trator."
        );

        return;

    }


    const registro = {

        peca: peca,

        horas: horas,

        data:
            new Date()
                .toLocaleDateString(
                    "pt-BR"
                )

    };


    historico.push(registro);


    localStorage.setItem(

        "historicoTrator",

        JSON.stringify(historico)

    );


    document.getElementById(
        "horasHistorico"
    ).value = "";


    mostrarHistorico();

}


// ==========================================
// MOSTRAR HISTÓRICO
// ==========================================

function mostrarHistorico() {

    const lista =
        document.getElementById(
            "listaHistorico"
        );


    if (!lista) {

        return;

    }


    if (historico.length === 0) {

        lista.innerHTML = `

            <div class="informacao">

                📋 Nenhuma manutenção
                registrada ainda.

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    historico
        .slice()
        .reverse()
        .forEach(function (registro) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "historico-item";


            div.innerHTML = `

                🔧 <strong>
                    ${registro.peca}
                </strong>

                <br>

                🚜 Horas do trator:
                ${registro.horas}

                <br>

                📅 Data:
                ${registro.data}

            `;


            lista.appendChild(div);

        });

}
