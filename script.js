
const WHATSAPP_LOJA = "5511976691445";


const produtos = {
    morango: {
        nome: "Geladão de Morango",
        preco: 9
    },

    nutella: {
        nome: "Geladão de Nutella",
        preco: 10
    },

    pudim: {
        nome: "Geladão de Pudim",
        preco: 9
    }
};

// FORMATA VALORES EM REAIS
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function calcularTotal() {
    let total = 0;

    for (const id in produtos) {
        const campo = document.getElementById(id);
        let quantidade = Number(campo.value);

        if (!Number.isFinite(quantidade) || quantidade < 0) {
            quantidade = 0;
        }

        if (!Number.isInteger(quantidade)) {
            quantidade = Math.floor(quantidade);
        }

        const subtotal = quantidade * produtos[id].preco;
        total += subtotal;

        document.getElementById(
            "subtotal-" + id
        ).textContent = "R$ " + formatarPreco(subtotal);
    }

    document.getElementById("total").textContent =
        formatarPreco(total);

    return total;
}


for (const id in produtos) {
    document.getElementById(id).addEventListener(
        "input",
        calcularTotal
    );
}


document.getElementById("entrega").addEventListener(
    "change",
    function() {
        const campoEndereco = document.getElementById("endereco");

        if (this.value === "Entrega") {
            campoEndereco.required = true;
        } else {
            campoEndereco.required = false;
            campoEndereco.value = "";
        }
    }
);

document.getElementById("formPedido").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const total = calcularTotal();

        if (total <= 0) {
            alert("Escolha pelo menos um geladão!");
            return;
        }

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const data = document.getElementById("data").value;
        const horario = document.getElementById("horario").value;
        const entrega = document.getElementById("entrega").value;
        const endereco = document.getElementById("endereco").value.trim();
        const observacao = document.getElementById("observacao").value.trim();

        if (!nome || !telefone || !data || !horario) {
            alert("Preencha todos os dados obrigatórios.");
            return;
        }

        if (entrega === "Entrega" && !endereco) {
            alert("Informe o endereço para a entrega.");
            return;
        }

        let mensagem = "🍮 *PEDIDO - PUDIM PUDIM* 🍓\n\n";

        mensagem += `👤 Cliente: ${nome}\n`;
        mensagem += `📱 WhatsApp do cliente: ${telefone}\n\n`;
        mensagem += "*PRODUTOS:*\n";

        for (const id in produtos) {
            const quantidade = Math.max(
                0,
                Math.floor(Number(document.getElementById(id).value) || 0)
            );

            if (quantidade > 0) {
                const produto = produtos[id];
                const subtotal = quantidade * produto.preco;

                mensagem +=
                    `${produto.nome}: ${quantidade} unidade(s) - R$ ${formatarPreco(subtotal)}\n`;
            }
        }

        mensagem += `\n💰 *TOTAL: R$ ${formatarPreco(total)}*\n\n`;
        mensagem += `📅 Data: ${data}\n`;
        mensagem += `⏰ Horário: ${horario}\n`;
        mensagem += `📦 Recebimento: ${entrega}\n`;

        if (entrega === "Entrega") {
            mensagem += `📍 Endereço: ${endereco}\n`;
        }

        if (observacao) {
            mensagem += `📝 Observações: ${observacao}\n`;
        }

        const url =
            "https://wa.me/" +
            WHATSAPP_LOJA +
            "?text=" +
            encodeURIComponent(mensagem);

        window.open(url, "_blank");
    }
);

calcularTotal();
