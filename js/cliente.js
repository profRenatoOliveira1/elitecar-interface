async function recuperaListaClientes() {
    try {
        // faz a requisição no servidor e armazena a resposta
        const respostaServidor = await fetch('http://localhost:3333/lista/clientes');

        // verifica se a reposta foi bem sucedida (true)
        if(respostaServidor.ok) {
            // armazenar a lista de clientes
            const listaDeClientes = await respostaServidor.json();
            // chama a função de criar tabela passando a lista como parâmetro
            criarTabelaClientes(listaDeClientes);
        }

        // se a reposta for false, retorna um valor nulo
        return null;
    } catch (error) {
        // em caso de erro, lança o erro no console
        console.error(error);
        // retorna um valor nulo
        return null;
    }
}

function criarTabelaClientes(clientes) {
    try {
        // recuperar o elemento tbody
        const tBody = document.querySelector(`tbody`);

        // percorro o array de clientes
        clientes.map(cliente => {
            // criar a estrutura da tabela
            // cria o tr (table row)
            const tr = document.createElement('tr');

            // cria os td (table data) para popular a tabela
            const tdIdCliente = document.createElement('td');
            // insere o id do cliente no tdIdCliente
            tdIdCliente.textContent = cliente.id;
            // inserindo tdIdCliente na estrutura do tr
            tr.appendChild(tdIdCliente);

            // cria o td para o nome do cliente
            const tdNomeCliente = document.createElement('td');
            // insere o nome do cliente
            tdNomeCliente.textContent = cliente.nome;
            // insiro tdNomeCliente como filho de tr
            tr.appendChild(tdNomeCliente);

            // cria o td para o CPF do cliente
            const tdCpfCliente = document.createElement('td');
            // insere o cpf do cliente
            tdCpfCliente.textContent = cliente.cpf;
            // insere tdCpfCliente como filho de tr
            tr.appendChild(tdCpfCliente);

            // cria o td para o email do cliente
            const tdCelular = document.createElement('td');
            // insere o email do cliente
            tdCelular.textContent = cliente.celular;
            // insere tdEmail como filho de tr
            tr.appendChild(tdCelular);

            // cria o td para as ações
            const tdAcoes = document.createElement('td');
            // cria a imagem de editar
            const imgEditar = document.createElement('img');
            // insere o caminho da imagem
            imgEditar.src = './assets/icons/pencil-square.svg';
            // insere o texto alternativo
            imgEditar.alt = 'Editar';
            // insere a imagem como filho de tdAcoes
            tdAcoes.appendChild(imgEditar);

            // cria a imagem de deletar
            const imgDeletar = document.createElement('img');
            // insere o caminho da imagem
            imgDeletar.src = './assets/icons/trash-fill.svg';
            // insere o texto alternativo
            imgDeletar.alt = 'Deletar';
            // insere a imagem como filho de tdAcoes
            tdAcoes.appendChild(imgDeletar);

            // insere tdAcoes como filho de tr
            tr.appendChild(tdAcoes);

            // insere tr como filho de tBody
            tBody.appendChild(tr);
        });
    } catch (error) {
        // em caso de erro, imprime no console
        console.error(error);
        // retorna um valor nulo
        return null;
    }
}