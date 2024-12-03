async function enviaFormulario() {
    // recuperar as informações do formulário e colocar em objeto JSON
    const carroDTO = {
        "marca": document.querySelectorAll("input")[0].value,
        "modelo": document.querySelectorAll("input")[1].value,
        "ano": Number(document.querySelectorAll("input")[2].value),
        "cor": document.querySelectorAll("input")[3].value
    }

    try {
        const respostaServidor = await fetch("http://localhost:3333/novo/carro", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carroDTO)
        });
    
        if(!respostaServidor.ok) {
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema");
        }
    
        alert("Carro cadastrado com sucesso!");
    } catch (error) {
        console.log(error);
        alert(`Erro ao se comunicar com o servidor. ${error}`);
    }
}

// Responsável por recuperar as informações do servidor
async function recuperarListaCarros() {
    try {
        const respostaServidor = await fetch('http://localhost:3333/lista/carros');

        if(respostaServidor.ok) {
            const listaCarros = await respostaServidor.json();
            criarTabelaCarros(listaCarros);
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Responsável por criar a tabela
async function criarTabelaCarros(carros) {
    try {
        const tBody = document.querySelector(`tbody`);

        carros.map(carro => {
            const tr = document.createElement('tr');

            const tdIdCarro = document.createElement('td');
            tdIdCarro.textContent = carro.idCarro;
            tr.appendChild(tdIdCarro);

            const tdModelo = document.createElement('td');
            tdModelo.innerText = carro.modelo;
            tr.appendChild(tdModelo);

            const tdMarca = document.createElement('td');
            tdMarca.innerText = carro.marca;
            tr.appendChild(tdMarca);

            const tdAno = document.createElement('td');
            tdAno.innerText = carro.ano;
            tr.appendChild(tdAno);

            const tdCor = document.createElement('td');
            tdCor.innerText = carro.cor;
            tr.appendChild(tdCor);

            const tdAcoes = document.createElement('td');
            const imgEditar = document.createElement('img');
            imgEditar.src = "./assets/icons/pencil-square.svg";
            imgEditar.alt = "Editar";
            tdAcoes.appendChild(imgEditar);

            const imgDeletar = document.createElement('img');
            imgDeletar.src = "./assets/icons/trash-fill.svg";
            imgDeletar.alt = "Deletar";
            tdAcoes.appendChild(imgDeletar);

            tr.appendChild(tdAcoes);

            tBody.append(tr);
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}