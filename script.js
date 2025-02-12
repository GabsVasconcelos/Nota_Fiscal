function formatarCpfCnpj(valor) {
    valor = valor.replace(/\D/g, ""); 
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,4})$/, "$1/$2");
        valor = valor.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
    return valor;
}

const cpfCnpjField = document.getElementById("cpf");
cpfCnpjField.addEventListener("input", (e) => {
    e.target.value = formatarCpfCnpj(e.target.value);
});

function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, ""); 
    if (valor.length > 10) {
        return valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
        return valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
        return valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else {
        return valor.replace(/^(\d{0,2}).*/, "($1");
    }
}

const telefoneField = document.getElementById("Telefone");
telefoneField.addEventListener("input", (e) => {
    e.target.value = formatarTelefone(e.target.value);
});

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function calcularTotalLinha(linha) {
    const quantidade = parseFloat(linha.querySelector(".quantidade").value) || 0;
    const valorUnitario = parseFloat(
        linha.querySelector(".valor").value
            .replace(/[^\d.-]/g, "") 
            
    ) || 0;

    const total = quantidade * valorUnitario;
    linha.querySelector(".total").value = total.toFixed(2); 
    calcularTotalFinal();
}


function calcularTotalFinal() {
    let totalFinal = 0;

    document.querySelectorAll(".produto-linha .total").forEach((input) => {
        const total = parseFloat(
            input.value.replace(/[^\d.-]/g, "").replace(",", ".") 
        ) || 0;

        totalFinal += total;
    });

    
    document.getElementById("TotalFinal").value = formatarMoeda(totalFinal);
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    });
}


document.getElementById("adicionar-produto").addEventListener("click", () => {
    const container = document.getElementById("produtos-container");
    const novaLinha = document.createElement("div");
    novaLinha.classList.add("produto-linha");
    novaLinha.innerHTML = `
        <div class="form-group">
            <label>Produto:</label>
            <input type="text" class="produto" name="Produto" placeholder="Insira o serviço" required>
        </div>
        <div class="form-group">
            <label>Quantidade:</label>
            <input type="number" class="quantidade" name="Quantidade" placeholder="Selecione" required>
        </div>
        <div class="form-group">
            <label>Valor Unitário (R$):</label>
            <input type="text" class="valor" name="Valor" placeholder="R$ 0,00" required>
        </div>
        <div class="form-group">
            <label>Total (R$):</label>
            <input type="text" class="total" name="Total" placeholder="R$ 0,00" readonly>
            <hr>
        </div>
    `;
    container.appendChild(novaLinha);

    novaLinha.querySelector(".quantidade").addEventListener("input", () => calcularTotalLinha(novaLinha));
    novaLinha.querySelector(".valor").addEventListener("input", () => calcularTotalLinha(novaLinha));

    calcularTotalLinha(novaLinha);
});

document.querySelectorAll(".produto-linha").forEach(linha => {
    calcularTotalLinha(linha);
});


document.getElementById("imprimir").addEventListener("click", () => {
    const cliente = document.getElementById("cliente").value;
    const cpfCnpj = cpfCnpjField.value;
    const email = document.getElementById("email").value;
    const telefone = telefoneField.value;
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    let produtosHTML = "";
    document.querySelectorAll(".produto-linha").forEach((linha) => {
        const produto = linha.querySelector(".produto").value;
        const quantidade = linha.querySelector(".quantidade").value;
        const valor = linha.querySelector(".valor").value;
        const total = linha.querySelector(".total").value;
        produtosHTML += `
            <tr>
                <td>${quantidade}</td>
                <td>${produto}</td>
                <td>${valor}</td>
                <td>${total}</td>
            </tr>
        `;
    });

    const conteudo = `
    <div style="font-family: Arial, sans-serif; margin: 20px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <img src="images/logo1.png" alt="Logomarca" style="height: 90px;">
        </div>
        
        
        
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>CPF/CNPJ:</strong> ${cpfCnpj}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        
        <h3 style="text-align: center;">ORÇAMENTO</h3>

        <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                    <th>Qtd.</th>
                    <th>Produto</th>
                    <th>Valor Unitário</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${produtosHTML}
            </tbody>
        </table>
        
        
        <p style="margin-top: 20px;"><strong>Total Final:</strong> ${document.getElementById("TotalFinal").value}</p>
         <div style="text-align: right;">
                
                
            </div>
   
<div style="margin-top: 40px;">
    <div style="text-align: right;">
        
        <p style="margin: 0; font-size: 14px; font-weight: bold;">Campina Grande, ${dataAtual}</p>
    </div>
    
    <hr style="border: 1px solid #000;">

    <div style="text-align: center; margin-top: 10px;">
        <p style="font-size: 12px; margin: 5px 0;">
            <strong>Av. Ministro José Américo de Almeida, 147 - Santo Antônio - CEP 58406-040</strong>
        </p>
        <p style="font-size: 12px; margin: 5px 0;">
            <strong>Fone: (83) 3342-4072 - E-mail: flamagilbrindes@hotmail.com</strong>
        </p>
        <p style="font-size: 12px; margin: 5px 0;">
            <strong>Campina Grande - PB, 58406-040</strong>
        </p>
    </div>
</div>

`;


    const janela = window.open("", "", "width=800,height=600");
    janela.document.write(conteudo);
    janela.document.close();
    setTimeout(() => {
        janela.print();
      }, 1000); 
});
