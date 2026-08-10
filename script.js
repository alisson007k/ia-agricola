```javascript
// ==========================================
// SISTEMA TRATOR IA
// ==========================================


// TROCA DE ABA
function mostrarAba(nome) {

    const abas = document.querySelectorAll(".aba");

    abas.forEach(function(aba) {
        aba.classList.remove("ativa");
    });

    document.getElementById(nome).classList.add("ativa");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// ANÁLISE INDIVIDUAL DAS PEÇAS
// ==========================================

function analisarPeca(idInput, limite, idResultado) {

    const horas = Number(document.getElementById(idInput).value);

    const resultado = document.getElementById(idResultado);

    if (horas < 0 || isNaN(horas)) {

        resultado.innerHTML =
            "⚠️ Informe um número válido de horas.";

        return;
    }


    const percentual = horas / limite;


    if (percentual >= 1) {

        resultado.innerHTML = `
            🔴 <strong>Alta prioridade</strong><br>
            O intervalo de referência foi atingido.
            Recomenda-se realizar uma inspeção e consultar
            o manual do fabricante.
        `;

    } else if (percentual >= 0.75) {

        const restante = Math.round(limite - horas);

        resultado.innerHTML = `
            🟡 <strong>Atenção</strong><br>
            A peça está próxima do intervalo de manutenção.
            Estimativa: aproximadamente
            <strong>${restante} horas</strong> restantes.
        `;

    } else {

        const restante = Math.round(limite - horas);

        resultado.innerHTML = `
            🟢 <strong>Baixo risco</strong><br>
            Dentro do intervalo de referência.
            Estimativa: aproximadamente
            <strong>${restante} horas</strong> restantes.
        `;
    }
}


// ==========================================
// PREVISÃO PRINCIPAL
// ==========================================

function preverManutencao() {

    const horas = Number(
        document.getElementById("horasTrator").value
    );

    const intensidade = Number(
        document.getElementById("intensidade").value
    );

    const ambiente = Number(
        document.getElementById("ambiente").value
    );

    const resultado = document.getElementById("resultadoIA");


    if (horas < 0 || isNaN(horas)) {

        resultado.innerHTML =
            "⚠️ Informe corretamente as horas do trator.";

        return;
    }


    /*
        MODELO EXPERIMENTAL

        Quanto maior a intensidade e a agressividade
        do ambiente, maior o fator de desgaste.
    */

    const fatorDesgaste =
        intensidade * ambiente;


    let indice = horas * fatorDesgaste;


    let nivel;
    let mensagem;


    if (indice < 1500) {

        nivel = "🟢 BAIXO";
        mensagem =
            "O desgaste estimado está relativamente baixo.";

    } else if (indice < 3000) {

        nivel = "🟡 MÉDIO";
        mensagem =
            "Alguns componentes podem estar se aproximando da manutenção.";

    } else {

        nivel = "🔴 ALTO";
        mensagem =
            "O nível de desgaste estimado está elevado. Uma inspeção é recomendada.";
    }


    /*
        Estimativa simples de horas restantes.

        Esta parte será substituída futuramente
        por um modelo de Machine Learning.
    */

    const vidaReferencia = 5000;

    let horasRestantes =
        Math.max(
            0,
            Math.round(
                (vidaReferencia - indice) /
                fatorDesgaste
            )
        );


    resultado.innerHTML = `

        <h3>🤖 Resultado da previsão</h3>

        <p>
            <strong>Nível estimado:</strong>
            ${nivel}
        </p>

        <p>
            <strong>Índice de desgaste:</strong>
            ${Math.round(indice)}
        </p>

        <p>
            <strong>Estimativa:</strong>
            aproximadamente
            <strong>${horasRestantes} horas</strong>
            até uma nova avaliação.
        </p>

        <p>
            ${mensagem}
        </p>

        <hr>

        <small>
            Esta é uma demonstração de um modelo preditivo.
            Não representa diagnóstico mecânico e deve ser
            validada com dados reais e recomendações do fabricante.
        </small>
    `;


    // Atualiza o painel inicial

    document.getElementById("horasPainel").innerText =
        horas + " h";
}


// ==========================================
// HISTÓRICO
// ==========================================

let historico =
    JSON.parse(
        localStorage.getItem("historicoTrator")
    ) || [];


function adicionarHistorico() {

    const peca =
        document.getElementById("pecaHistorico").value;

    const horas =
        Number(
            document.getElementById("horasHistorico").value
        );


    if (!horas || horas < 0) {

        alert("Informe as horas do trator.");

        return;
    }


    const registro = {

        peca: peca,

        horas: horas,

        data: new Date().toLocaleDateString("pt-BR")

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


function mostrarHistorico() {

    const lista =
        document.getElementById("listaHistorico");


    if (historico.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma manutenção registrada.</p>";

        return;
    }


    lista.innerHTML = "";


    historico
        .slice()
        .reverse()
        .forEach(function(registro) {

            const div =
                document.createElement("div");

            div.className =
                "historico-item";


            div.innerHTML = `

                <strong>
                    ${registro.peca}
                </strong>

                <br>

                🚜 Horas:
                ${registro.horas}

                <br>

                📅 Data:
                ${registro.data}

            `;


            lista.appendChild(div);

        });
}


// Inicializar histórico
mostrarHistorico();
```
