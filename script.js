const numeroWhatsApp = "5511976691445";

// Produtos e preços
const produtos = [
    {
        id: "morango",
        nome: "Geladão de Morango",
        preco: 9.00,
        subtotalId: "subtotal-morango"
    },
    {
        id: "nutella",
        nome: "Geladão de Nutella",
        preco: 10.00,
        subtotalId: "subtotal-nutella"
    },
    {
        id: "pudim",
        nome: "Geladão de Pudim",
        preco: 9.00,
        subtotalId: "subtotal-pudim"
    }
];

// Formata os valores em reais
function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza os subtotais e o total do pedido
function atualizarTotal() {
    let total = 0;

    produtos.forEach(produto => {
        const campo = document.getElementById(produto.id);
        const quantidade = campo
            ? Math.max(0, Number(campo.value) || 0)
            : 0;

        const subtotal = quantidade * produto.preco;
        total += subtotal;

        const elementoSubtotal =
            document.getElementById(produto.subtotalId);

        if (elementoSubtotal) {
            elementoSubtotal.textContent =
                formatarDinheiro(subtotal);
        }
    });

    const elementoTotal = document.getElementById("total");

    if (elementoTotal) {
        elementoTotal.textContent = formatarDinheiro(total);
    }

    return total;
}

// Finaliza o pedido e abre o WhatsApp
function finalizarPedido(event) {
    if (event) {
        event.preventDefault();
    }

    const total = atualizarTotal();

    if (total <= 0) {
        alert("Selecione pelo menos um geladão para fazer seu pedido.");
        return;
    }

    const nome =
        document.getElementById("nome")?.value.trim() || "";

    const telefone =
        document.getElementById("telefone")?.value.trim() || "";

    const endereco =
        document.getElementById("endereco")?.value.trim() || "";

    const observacoes =
        document.getElementById("observacoes")?.value.trim() || "";

    if (!nome || !telefone || !endereco) {
        alert("Preencha seu nome, telefone e endereço.");
        return;
    }

    let mensagem = "Olá! Quero fazer um pedido de geladões.\n\n";

    mensagem += "Nome: " + nome + "\n";
    mensagem += "Telefone: " + telefone + "\n";
    mensagem += "Endereço: " + endereco + "\n\n";

    mensagem += "Pedido:\n";

    produtos.forEach(produto => {
        const campo = document.getElementById(produto.id);
        const quantidade = campo
            ? Math.max(0, Number(campo.value) || 0)
            : 0;

        if (quantidade > 0) {
            mensagem +=
                quantidade + "x " + produto.nome + " - " +
                formatarDinheiro(quantidade * produto.preco) +
                "\n";
        }
    });

    mensagem += "\nTotal: " + formatarDinheiro(total);

    if (observacoes) {
        mensagem += "\nObservações: " + observacoes;
    }

    const linkWhatsApp =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensagem);

    window.open(linkWhatsApp, "_blank");
}

// Configura os eventos da página
document.addEventListener("DOMContentLoaded", function () {
    produtos.forEach(produto => {
        const campo = document.getElementById(produto.id);

        if (campo) {
            campo.addEventListener("input", atualizarTotal);
            campo.addEventListener("change", atualizarTotal);
        }
    });

    const botao = document.getElementById("finalizarPedido");

    if (botao) {
        botao.addEventListener("click", finalizarPedido);
    }

    const formulario =
        document.getElementById("formularioPedido");

    if (formulario) {
        formulario.addEventListener("submit", finalizarPedido);
    }

    atualizarTotal();
});