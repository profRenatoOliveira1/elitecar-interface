/**
 * Envia o formulário de cadastro de cliente.
 * 
 * Cria um objeto com os dados do cliente a partir dos valores dos inputs do formulário,
 * valida os campos e envia uma requisição POST para o servidor com os dados do cliente.
 * 
 * @async
 * @function enviarFormularioCadastro
 * @returns {Promise<null>} Retorna null se houver algum erro ou se os campos não estiverem preenchidos corretamente.
 * @throws {Error} Lança um erro se a requisição ao servidor falhar.
 */
async function enviarFormularioCadastro() {
    const clienteDTO = { // cria um objeto com os dados do cliente
        nome: document.querySelector('input[name="input-nome-cliente"]').value, // recupera o valor do input com name "nome"
        cpf: document.querySelector('input[name="input-cpf-cliente"]').value.replace(/\D/g, ''), // recupera o valor do input com name "cpf"
        telefone: document.querySelector('input[name="input-telefone-cliente"]').value.replace(/\D/g, '') // recupera o valor do input com name "telefone"
    }

    const validacao = validacaoFormularioCliente(clienteDTO); // valida os campos do formulário

    if (!validacao) { // verifica se a validação é falsa
        return null; // retorna um valor nulo
    }

    try { // tenta executar o bloco de código
        const respostaServidor = await fetch('http://localhost:3333/novo/cliente', { // faz a requisição no servidor
            method: 'POST', // configura o método da requisição
            headers: { // configuira os cabeçalhos da requisição
                'Content-Type': 'application/json'  // configura o tipo de conteúdo da requisição para JSON
            },
            body: JSON.stringify(clienteDTO) // converte o objeto clienteDTO em JSON e envia no corpo da requisição
        });

        // verificar se a resposta do servidor foi bem sucedida
        if (!respostaServidor.ok) { // verificar se a resposta do servidor não foi bem-sucedida
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema"); // lançar um erro
        }

        alert('Cliente cadastrado com sucesso!'); // exibe um alerta com a mensagem de sucesso
        window.location.href = 'lista-clientes.html'; // redireciona para a página de clientes

    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}

/**
 * Formata um número de CPF (Cadastro de Pessoas Físicas) brasileiro.
 *
 * Esta função remove todos os caracteres não numéricos do valor de entrada,
 * limita o número de dígitos a 11 e formata o CPF no formato padrão
 * brasileiro (000.000.000-00).
 *
 * @param {string} cpfValue - O valor do CPF a ser formatado.
 * @returns {string} O valor do CPF formatado.
 */
function formatarCPF(cpfValue) {
    let value = cpfValue.replace(/\D/g, ""); // Remove tudo que não for número

    // Limita o número de dígitos a 11
    if (value.length > 11) {
        value = value.slice(0, 11); // Trunca o valor para os primeiros 11 dígitos
    }

    // Formata o CPF (000.000.000-00)
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2"); // Adiciona o primeiro ponto
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3"); // Adiciona o segundo ponto
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4"); // Adiciona o traço

    return value; // Retorna o valor formatado
}

/**
 * Adiciona uma máscara ao campo de CPF do cliente.
 * 
 * Adiciona um event listener ao campo de telefone do cliente que, a cada só aceitará números e irá aplicar uma máscara para que
 * o CPD do cliente esteja sempre no formato 000.000.000-00
 */
document.querySelector('input[name="input-cpf-cliente"]').addEventListener("input", function (event) {
    const input = event.target; // Recupera o elemento que disparou o evento
    input.value = formatarCPF(input.value); // Aplica a máscara ao valor digitado
});


/**
 * Função para formatar o telefone.
 * 
 * Recebe o valor do campo, remove caracteres não numéricos e aplica a máscara
 * para que o telefone esteja sempre no formato (00) 00000-0000 ou (00) 0000-0000.
 */
function formatarTelefone(telefoneValue) {
    let value = telefoneValue.replace(/\D/g, ""); // Remove tudo que não for número

    // Limita o número de dígitos a 11 (DDD + 9 dígitos)
    if (value.length > 11) {
        value = value.slice(0, 11); // Trunca o valor para os primeiros 11 dígitos
    }

    // Formata o telefone
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2"); // Adiciona o DDD
    if (value.length > 6) value = value.replace(/(\(\d{2}\)\s\d{5})(\d)/, "$1-$2"); // Para números com 9 dígitos
    if (value.length <= 10) value = value.replace(/(\(\d{2}\)\s\d{4})(\d)/, "$1-$2"); // Para números com 8 dígitos

    return value; // Retorna o valor formatado
}

/**
 * Adiciona uma máscara ao campo de telefone do cliente.
 * 
 * Adiciona um event listener ao campo de telefone do cliente que, a cada só aceitará números e irá aplicar uma máscara para que
 * o telefone do cliente esteja sempre no formato (00) 00000-0000
 */
document.querySelector('input[name="input-telefone-cliente"]').addEventListener("input", function (event) {
    const input = event.target; // Recupera o elemento que disparou o evento
    input.value = formatarTelefone(input.value); // Aplica a máscara ao valor digitado
});

/**
 * Valida os dados do formulário do cliente.
 *
 * @param {Object} cliente - Objeto contendo os dados do cliente.
 * @param {string} cliente.nome - Nome do cliente.
 * @param {string} cliente.cpf - CPF do cliente (deve ter 11 dígitos).
 * @param {string} cliente.telefone - Telefone do cliente (deve ter pelo menos 10 dígitos).
 * @returns {boolean} Retorna true se todos os campos forem válidos, caso contrário, retorna false.
 */
function validacaoFormularioCliente(cliente) {
    if (!cliente.nome || !cliente.cpf || !cliente.telefone) { // verifica se os campos estão vazios
        alert('Preencha todos os campos!'); // exibe um alerta com a mensagem
        return false; // retorna false
    }

    if (cliente.cpf.length !== 11) { // verifica se o cpf tem 11 dígitos
        alert('CPF inválido!'); // exibe um alerta com a mensagem
        return false; // retorna false
    }

    if (cliente.telefone.length < 10) { // verifica se o telefone tem pelo menos 10 dígitos
        alert('Telefone inválido!'); // exibe um alerta com a mensagem
        return false; // retorna false
    }

    return true; // se todas as validações forem verdadeiras, retorna true
}

/**
 * Recupera a lista de clientes do servidor e cria uma tabela com os dados.
 * 
 * Faz uma requisição para o endpoint 'http://localhost:3333/lista/clientes' e, 
 * se a resposta for bem-sucedida, converte a resposta em JSON e chama a função 
 * `criarTabelaClientes` com a lista de clientes. Em caso de erro ou resposta 
 * não bem-sucedida, retorna null.
 * 
 * Essa função deve ser chamada no carregamento da página.
 * 
 * @returns {Promise<null>} Retorna null em caso de erro ou resposta não bem-sucedida.
 */
async function recuperaListaClientes() {
    try { // tenta executar o bloco de código
        const respostaServidor = await fetch('http://localhost:3333/lista/clientes'); // faz a requisição no servidor e armazena a resposta

        if (respostaServidor.ok) { // verifica se a reposta foi bem sucedida (true)            
            const listaDeClientes = await respostaServidor.json(); // armazenar a lista de clientes
            criarTabelaClientes(listaDeClientes); // chama a função de criar tabela passando a lista como parâmetro
        }

        return null; // se a reposta for false, retorna um valor nulo
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, lança o erro no console
        return null; // retorna um valor nulo
    }
}

/**
 * Cria uma tabela de clientes e insere no elemento tbody do documento.
 *
 * @param {Array} clientes - Array de objetos representando os clientes.
 * @param {number} clientes[].id - ID do cliente.
 * @param {string} clientes[].nome - Nome do cliente.
 * @param {string} clientes[].cpf - CPF do cliente.
 * @param {string} clientes[].celular - Celular do cliente.
 */
function criarTabelaClientes(clientes) {
    try { // tenta executar o bloco de código 
        const tBody = document.querySelector(`tbody`); // recuperar o elemento tbody

        clientes.map(cliente => { // percorre o array de clientes
            // criar a estrutura da tabela
            const tr = document.createElement('tr'); // cria o tr (table row)

            const tdIdCliente = document.createElement('td'); // cria os td (table data) para popular a tabela
            tdIdCliente.textContent = cliente.idCliente; // insere o id do cliente no tdIdCliente
            tr.appendChild(tdIdCliente); // inserindo tdIdCliente na estrutura do tr

            const tdNomeCliente = document.createElement('td'); // cria o td para o nome do cliente
            tdNomeCliente.textContent = cliente.nome; // insere o nome do cliente
            tr.appendChild(tdNomeCliente); // insiro tdNomeCliente como filho de tr

            const tdCpfCliente = document.createElement('td'); // cria o td para o CPF do cliente
            tdCpfCliente.textContent = cliente.cpf; // insere o cpf do cliente
            tr.appendChild(tdCpfCliente); // insere tdCpfCliente como filho de tr

            const tdCelular = document.createElement('td'); // cria o td para o email do cliente
            tdCelular.textContent = cliente.telefone; // insere o email do cliente
            tr.appendChild(tdCelular); // insere tdEmail como filho de tr

            const tdAcoes = document.createElement('td'); // cria o td para as ações
            const imgEditar = document.createElement('img'); // cria a imagem de editar
            imgEditar.src = './assets/icons/pencil-square.svg'; // insere o caminho da imagem
            imgEditar.alt = 'Editar'; // insere o texto alternativo
            imgEditar.addEventListener('click', () => enviarInforParaAtualizacao(cliente)); // adiciona um event listener para editar o cliente
            tdAcoes.appendChild(imgEditar); // insere a imagem como filho de tdAcoes

            const imgDeletar = document.createElement('img'); // cria a imagem de deletar
            imgDeletar.src = './assets/icons/trash-fill.svg'; // insere o caminho da imagem
            imgDeletar.alt = 'Deletar'; // insere o texto alternativo
            imgDeletar.addEventListener('click', () => removerCliente(cliente.idCliente)); // adiciona um event listener para deletar o cliente
            tdAcoes.appendChild(imgDeletar); // insere a imagem como filho de tdAcoes

            tr.appendChild(tdAcoes); // insere tdAcoes como filho de tr
            tBody.appendChild(tr); // insere tr como filho de tBody
        });
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}

/**
 * Remove um cliente pelo ID.
 *
 * Esta função solicita a confirmação do usuário antes de enviar uma requisição DELETE
 * para remover o cliente especificado pelo ID. Se a remoção for bem-sucedida, uma mensagem
 * de sucesso é exibida e a página é recarregada.
 *
 * @async
 * @function removerCliente
 * @param {number} idCliente - O ID do cliente a ser removido.
 * @returns {Promise<boolean|null>} Retorna false se a remoção for cancelada pelo usuário,
 *                                  null se ocorrer um erro, ou nada se a remoção for bem-sucedida.
 */
async function removerCliente(idCliente) {
    try { // tenta executar o bloco de código
        const confirmacaoUsuario = confirm('Deseja realmente remover o cliente?'); // exibe um alerta de confirmação

        if (!confirmacaoUsuario) { // verifica se a confirmação é falsa
            return false;  // retorna false
        }

        const respostaServidor = await fetch(`http://localhost:3333/delete/cliente/${idCliente}`, { // faz a requisição no servidor
            method: 'DELETE' // configura o método da requisição
        });

        if (respostaServidor.ok) { // verifica se a resposta foi bem sucedida (true)
            alert('Cliente removido com sucesso!'); // exibe um alerta com a mensagem de sucesso
            window.location.reload(); // recarrega a página
        }
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}

/**
 * Redireciona o usuário para a página de atualização do cliente com as informações do cliente na URL.
 *
 * Essa função deve ser chamada ao clicar no botão de editar de um cliente na tabela.
 * 
 * @param {Object} cliente - Objeto contendo as informações do cliente a serem atualizadas.
 */
function enviarInforParaAtualizacao(cliente) {
    const urlUpdate = `atualizar-cliente.html?cliente=${JSON.stringify(cliente)}`; // monta a URL com as informações do carro
    window.location.href = urlUpdate; // redireciona o usuário para a página de atualização
}

/**
 * Carrega os dados do formulário com as informações do cliente a partir da URL.
 * 
 * A função recupera a URL da página atual, extrai o objeto JSON do cliente dos parâmetros da URL,
 * e preenche os campos do formulário com os dados do cliente.
 * 
 * Essa função deve ser chamada no carregamento da página.
 * 
 * @function carregarDadosFormulario
 */
function carregarDadosFormulario() {
    const url = new URL(window.location.href);  // recupera a URL da página
    const cliente = JSON.parse(url.searchParams.get("cliente")); // recupera o objeto JSON da URL

    document.querySelectorAll("input")[0].value = cliente.idCliente; // preenche o campo de idCliente
    document.querySelectorAll("input")[1].value = cliente.nome; // preenche o campo de nome
    document.querySelectorAll("input")[2].value = formatarCPF(cliente.cpf); // preenche o campo de cpf
    document.querySelectorAll("input")[3].value = formatarTelefone(cliente.telefone); // preenche o campo de telefone
}

/**
 * Atualiza os dados de um cliente.
 * 
 * Esta função recupera os dados do cliente a partir dos inputs do formulário,
 * valida os dados e envia uma requisição para atualizar o cliente no servidor.
 * 
 * Essa função deve ser chamada ao clicar no botão de atualizar do formulário.
 * 
 * @async
 * @function atualizarCliente
 * @returns {Promise<void|null>} Retorna null se a validação falhar ou se ocorrer um erro.
 */
async function atualizarCliente() {
    const clienteDTO = { // cria um objeto com os dados do cliente
        idCliente: document.querySelector('input[name="input-id-cliente"]').value, // recupera o valor do input com name "id"
        nome: document.querySelector('input[name="input-nome-cliente"]').value, // recupera o valor do input com name "nome"
        cpf: document.querySelector('input[name="input-cpf-cliente"]').value.replace(/\D/g, ''), // recupera o valor do input com name "cpf" e remove a máscara
        telefone: document.querySelector('input[name="input-telefone-cliente"]').value.replace(/\D/g, '') // recupera o valor do input com name "telefone" e remove a máscara
    }

    const validacao = validacaoFormularioCliente(clienteDTO); // valida os campos do formulário

    if (!validacao) { // verifica se a validação é falsa
        return null; // retorna um valor nulo
    }

    try { // tenta executar o bloco de código
        const respostaServidor = await fetch(`http://localhost:3333/atualizar/cliente/${clienteDTO.idCliente}`, { // faz a requisição no servidor
            method: 'PUT', // configura o método da requisição
            headers: { // configuira os cabeçalhos da requisição
                'Content-Type': 'application/json'  // configura o tipo de conteúdo da requisição para JSON
            },
            body: JSON.stringify(clienteDTO) // converte o objeto clienteDTO em JSON e envia no corpo da requisição
        });

        if (respostaServidor.ok) { // verifica se a resposta foi bem sucedida (true)
            alert('Cliente atualizado com sucesso!'); // exibe um alerta com a mensagem de sucesso
            window.location.href = 'lista-clientes.html'; // redireciona para a página de clientes
        }
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}