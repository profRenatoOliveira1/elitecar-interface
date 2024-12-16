/**
 * Recupera informações dos clientes a partir de uma API.
 *
 * @async
 * @function recuperaInformacoesCliente
 * @returns {Promise<Object|null>} Retorna um objeto com as informações dos clientes ou null em caso de erro.
 * @throws {Error} Lança um erro se a requisição falhar.
 */
async function recuperaInformacoesCliente() {
    try { // Tenta fazer a requisição
        const response = await fetch('http://localhost:3333/lista/clientes'); // Faz a requisição
        const data = await response.json(); // Converte a resposta para JSON
        return data; // Retorna os dados
    } catch (error) { // Se ocorrer um erro
        console.error(error); // Exibe o erro no console
        return null; // Retorna null
    }
}

/**
 * Recupera informações dos carros a partir de uma API.
 *
 * @async
 * @function recuperaInformacoesCarro
 * @returns {Promise<Object|null>} Retorna um objeto com as informações dos carros ou null em caso de erro.
 * @throws {Error} Lança um erro se a requisição falhar.
 */
async function recuperaInformacoesCarro() {
    try { // Tenta fazer a requisição
        const response = await fetch('http://localhost:3333/lista/carros'); // Faz a requisição
        const data = await response.json(); // Converte a resposta para JSON 
        return data; // Retorna os dados
    } catch (error) { // Se ocorrer um erro
        console.error(error); // Exibe o erro no console
        return null; // Retorna null
    }
}

/**
 * Função assíncrona que cria e popula selects de formulário com informações de carros e clientes.
 * 
 * Recupera informações dos carros e clientes através de funções assíncronas e, em seguida,
 * cria elementos <option> para cada carro e cliente, adicionando-os aos selects correspondentes
 * no DOM.
 * 
 * @async
 * @function criaSelectFormulario
 * @returns {Promise<void>} Uma promessa que é resolvida quando os selects são populados.
 */
async function criaSelectFormulario() {
    const carros = await recuperaInformacoesCarro(); // Recupera informações dos carros
    const clientes = await recuperaInformacoesCliente(); // Recupera informações dos clientes

    const selectCliente = document.querySelector("#select-cliente"); //recupera o elemento select do cliente
    clientes.forEach(cliente => { // itera o array de clientes, para cada iteração dá o apelido de cliente
        const option = document.createElement("option"); // criar um elemento option
        option.value = cliente.idCliente; // Valor do option
        option.textContent = cliente.nome; // Texto visível do option
        selectCliente.appendChild(option); // anexa o option dentro do select de clientes
    });

    const selectCarro = document.querySelector("#select-carro"); //recupera o elemento select do carro
    carros.forEach(carro => { // itera o array de carros, para cada iteração dá o apelido de carro
        const option = document.createElement("option"); // criar um elemento option
        option.value = carro.idCarro; // Valor do option
        option.textContent = `${carro.marca} ${carro.modelo}`; // Texto visível do option
        selectCarro.appendChild(option); // anexa o option dentro do select de carros
    });
}


/**
 * Envia o formulário de pedido para o servidor.
 * 
 * Esta função coleta os dados do formulário, valida-os e, se válidos, envia-os para o servidor.
 * Em caso de sucesso, exibe uma mensagem de sucesso e redireciona para a página de lista de pedidos.
 * Em caso de erro, exibe uma mensagem de erro no console.
 * 
 * @async
 * @function enviarFormulario
 * @returns {Promise<void|null>} Retorna null em caso de erro, ou nada em caso de sucesso.
 */
async function enviarFormulario() {
    const pedidoVendaDTO = { // Cria um objeto com os dados do pedido
        "idCliente": document.querySelector('#select-cliente').value, // Recupera o valor do select de clientes
        "idCarro": document.querySelector('#select-carro').value, // Recupera o valor do select de carros
        "dataPedido": document.querySelector('[name="input-data-pedido"]').value, // Recupera o valor do input de data
        "valorPedido": Number(document.querySelector('[name="input-valor-pedido"]').value) // Recupera o valor do input de valor e converte em número
    }

    const formularioValido = validaFormularioPedido(pedidoVendaDTO); // Valida o formulário

    if(!formularioValido) { // Se o formulário não for válido
        return; // Retorna
    }

    try { // Tenta enviar os dados para o servidor
        const repsostaServidor = await fetch('http://localhost:3333/novo/pedido', { // Faz a requisição
            method: 'POST', // Define o método da requisição
            headers: { // Define os cabeçalhos da requisição
                'Content-Type': 'application/json' // Define o tipo de conteúdo da requisição como JSON
            },
            body: JSON.stringify(pedidoVendaDTO) // Converte o objeto para JSON e envia no corpo da requisição
        });

        if(!repsostaServidor.ok) { // Se a resposta do servidor não for ok
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema"); // lançar um erro
        }

        alert('Pedido cadastrado com sucesso!'); // exibe um alerta com a mensagem de sucesso
        window.location.href = 'lista-pedidos.html'; // redireciona para a página de clientes

    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}

/**
 * Valida os campos do formulário de pedido.
 *
 * @param {Object} pedido - Objeto contendo os dados do pedido.
 * @param {number} pedido.idCliente - ID do cliente.
 * @param {number} pedido.idCarro - ID do carro.
 * @param {string} pedido.dataPedido - Data do pedido.
 * @param {number} pedido.valorPedido - Valor do pedido.
 * @returns {boolean} Retorna true se todos os campos forem válidos, caso contrário, retorna false.
 */
function validaFormularioPedido(pedido) {
    if (!pedido.idCliente || !pedido.idCarro || !pedido.dataPedido || !pedido.valorPedido) { // Se algum campo estiver vazio
        alert('Preencha todos os campos do formulário!'); // Exibe um alerta
        return false; // Retorna false
    } 

    if(isNaN(pedido.valorPedido)) { // Se o valor do pedido não for um número
        alert('O campo "Valor do Pedido" deve ser um número!'); // Exibe um alerta
        return false; // Retorna false
    }

    return true; // Retorna true se todas as validações forem atendidas
}

/**
 * Recupera a lista de pedidos do servidor e cria uma tabela com os pedidos.
 * 
 * Faz uma requisição para o servidor na URL 'http://localhost:3333/lista/pedidos' para obter a lista de pedidos.
 * Se a requisição for bem-sucedida, a lista de pedidos é convertida para JSON e passada para a função `criarTabelaPedidos`.
 * Em caso de erro, o erro é registrado no console.
 * 
 * @returns {Promise<null>} Retorna null se a resposta não for bem-sucedida ou se ocorrer um erro.
 */
async function recuperaListaPedidos() {
    try { // tenta executar o bloco de código
        const respostaServidor = await fetch('http://localhost:3333/lista/pedidos'); // faz a requisição no servidor e armazena a resposta

        if (respostaServidor.ok) { // verifica se a reposta foi bem sucedida (true)            
            const listaDePedidos = await respostaServidor.json(); // armazenar a lista de clientes
            criarTabelaPedidos(listaDePedidos); // chama a função de criar tabela passando a lista como parâmetro
        }

        return null; // se a reposta for false, retorna um valor nulo
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, lança o erro no console
        return null; // retorna um valor nulo
    }
}

/**
 * Cria uma tabela de pedidos e insere no elemento tbody do documento.
 * 
 * @param {Array} pedidos - Lista de pedidos a serem exibidos na tabela.
 * @param {number} pedidos[].idPedido - ID do pedido.
 * @param {number} pedidos[].idCliente - ID do cliente.
 * @param {string} pedidos[].nomeCliente - Nome do cliente.
 * @param {number} pedidos[].idCarro - ID do carro.
 * @param {string} pedidos[].marcaCarro - Marca do carro.
 * @param {string} pedidos[].modeloCarro - Modelo do carro.
 * @param {string} pedidos[].dataPedido - Data do pedido.
 * @param {string} pedidos[].valorPedido - Valor do pedido.
 */
function criarTabelaPedidos(pedidos) {
    try { // tenta executar o bloco de código
        const tBody = document.querySelector(`tbody`); // recuperar o elemento tbody

        pedidos.map(pedido => { // mapeia a lista de pedidos
            const tr = document.createElement('tr'); // criar um elemento tr

            const tdIdPedido = document.createElement('td'); // criar um elemento td
            tdIdPedido.innerHTML = pedido.idPedido; // definir o valor do td
            tr.appendChild(tdIdPedido); // adicionar o td ao tr

            const tdIdCliente = document.createElement('td'); // criar um elemento td
            tdIdCliente.innerHTML = pedido.idCliente; // definir o valor do td
            tdIdCliente.setAttribute('hidden', true); // definir o atributo hidden
            tr.appendChild(tdIdCliente); // adicionar o td ao tr

            const tdNomeCliente = document.createElement('td'); // criar um elemento td
            tdNomeCliente.innerHTML = pedido.nomeCliente; // definir o valor do td
            tr.appendChild(tdNomeCliente); // adicionar o td ao tr

            const tdIdCarro = document.createElement('td'); // criar um elemento td
            tdIdCarro.innerHTML = pedido.idCarro; // definir o valor do td
            tdIdCarro.setAttribute('hidden', true); // definir o atributo hidden
            tr.appendChild(tdIdCarro); // adicionar o td ao tr

            const tdCarro = document.createElement('td'); // criar um elemento td
            tdCarro.innerHTML = `${pedido.marcaCarro} ${pedido.modeloCarro}`; // definir o valor do td
            tr.appendChild(tdCarro); // adicionar o td ao tr

            const tdDataPedido = document.createElement('td'); // criar um elemento td
            tdDataPedido.innerHTML = new Date(pedido.dataPedido).toLocaleDateString("pt-br"); // definir o valor do td
            tr.appendChild(tdDataPedido); // adicionar o td ao tr

            const tdValorPedido = document.createElement('td'); // criar um elemento td
            tdValorPedido.innerHTML = `R$ ${pedido.valorPedido.replace('.', ',')}`; // definir o valor do td
            tr.appendChild(tdValorPedido); // adicionar o td ao tr

            const tdAcoes = document.createElement('td'); // cria o td para as ações
            const imgEditar = document.createElement('img'); // cria a imagem de editar
            imgEditar.src = './assets/icons/pencil-square.svg'; // insere o caminho da imagem
            imgEditar.alt = 'Editar'; // insere o texto alternativo
            imgEditar.addEventListener('click', () => enviarInfoParaAtualizacao(pedido))// adiciona um evento de clique na imagem
            tdAcoes.appendChild(imgEditar); // insere a imagem como filho de tdAcoes

            const imgDeletar = document.createElement('img'); // cria a imagem de deletar
            imgDeletar.src = './assets/icons/trash-fill.svg'; // insere o caminho da imagem
            imgDeletar.alt = 'Deletar'; // insere o texto alternativo
            imgDeletar.addEventListener('click', () => removerPedido(pedido.idPedido)) // adiciona um evento de clique na imagem
            tdAcoes.appendChild(imgDeletar); // insere a imagem como filho de tdAcoes

            tr.appendChild(tdAcoes); // insere tdAcoes como filho de tr

            tBody.appendChild(tr); // adicionar o tr ao tbody
        });
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}

/**
 * Remove um pedido do sistema.
 *
 * Esta função solicita a confirmação do usuário antes de enviar uma requisição
 * para deletar o pedido especificado pelo ID. Se a requisição for bem-sucedida,
 * uma mensagem de sucesso é exibida e a página é recarregada. Caso contrário,
 * um erro é lançado e registrado no console.
 *
 * @param {number} idPedido - O ID do pedido a ser removido.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando a operação é concluída.
 */
async function removerPedido(idPedido) {
    try { // tenta executar o bloco de código
        const confirmacaoUsuario = confirm('Deseja realmente deletar o pedido?'); // exibe um alerta de confirmação

        if(!confirmacaoUsuario) { // verifica se o usuário cancelou a ação
            return; // retorna
        }

        const respostaServidor = await fetch(`http://localhost:3333/delete/pedido/${idPedido}`, { // faz a requisição no servidor
            method: 'DELETE' // define o método da requisição
        });

        if (!respostaServidor.ok) { // verifica se a resposta do servidor não foi bem sucedida
            throw new Error('Erro ao deletar o pedido. Contate o administrador do sistema'); // lança um erro
        }

        alert('Pedido deletado com sucesso!'); // exibe um alerta de sucesso
        window.location.reload(); // recarrega a página
    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
    }
}

/**
 * Redireciona o usuário para a página de atualização de pedido com os dados do pedido na URL.
 *
 * @param {Object} pedido - Objeto contendo as informações do pedido a ser atualizado.
 */
function enviarInfoParaAtualizacao(pedido) {
    const urlUpdate = `atualizar-pedido.html?pedido=${JSON.stringify(pedido)}`; // Cria a URL com os dados do pedido
    window.location.href = urlUpdate; // Redireciona para a página de atualização de pedido
}

/**
 * Carrega os dados do formulário de pedido a partir dos parâmetros da URL.
 * 
 * Esta função obtém os dados do pedido a partir dos parâmetros da URL, aguarda o preenchimento dos selects no formulário,
 * e então preenche os campos do formulário com os dados do pedido.
 * 
 * @async
 * @function carregarDadosFormulario
 * @returns {Promise<void>} Uma promessa que é resolvida quando os dados do formulário são carregados.
 */
async function carregarDadosFormulario() {
    const url = new URL(window.location.href); // Cria um objeto URL com a URL da página
    const pedido = JSON.parse(url.searchParams.get("pedido")); // Recupera os dados do pedido da URL

    await criaSelectFormulario(); // Aguarda os selects serem preenchidos

    // Preencher os campos do formulário
    document.querySelector("input[name='id-pedido']").value = pedido.idPedido; // Preenche o id do pedido
    document.querySelector("input[name='input-data-pedido']").value = pedido.dataPedido.split("T")[0]; // Preenche a data do pedido e ajusta o formato da data
    document.querySelector("input[name='input-valor-pedido']").value = pedido.valorPedido; // Preenche o valor do pedido

    // Preencher o cliente selecionado
    const selectCliente = document.querySelector("#select-cliente"); // Recupera o select de clientes
    selectCliente.value = pedido.idCliente; // Preenche o cliente selecionado

    // Preencher o carro selecionado
    const selectCarro = document.querySelector("#select-carro"); // Recupera o select de carros
    selectCarro.value = pedido.idCarro; // Preenche o carro selecionado
}

/**
 * Atualiza um pedido de venda enviando os dados para o servidor.
 * 
 * Cria um objeto com os dados do pedido a partir dos valores dos campos do formulário,
 * valida o formulário e, se válido, envia os dados para o servidor via requisição HTTP PUT.
 * 
 * @async
 * @function atualizarPedido
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a operação é concluída.
 * @throws {Error} Lança um erro se a resposta do servidor não for bem-sucedida.
 */
async function atualizarPedido() {
    const pedidoVendaDTO = { // Cria um objeto com os dados do pedido
        "idPedido": document.querySelector('[name="id-pedido"]').value, // recupera o id do pedido
        "idCliente": document.querySelector('#select-cliente').value, // Recupera o valor do select de clientes
        "idCarro": document.querySelector('#select-carro').value, // Recupera o valor do select de carros
        "dataPedido": document.querySelector('[name="input-data-pedido"]').value, // Recupera o valor do input de data
        "valorPedido": Number(document.querySelector('[name="input-valor-pedido"]').value) // Recupera o valor do input de valor e converte em número
    }

    const formularioValido = validaFormularioPedido(pedidoVendaDTO); // Valida o formulário

    if(!formularioValido) { // Se o formulário não for válido
        return; // Retorna
    }

    try { // Tenta enviar os dados para o servidor
        const respostaServidor = await fetch(`http://localhost:3333/atualizar/pedido/${pedidoVendaDTO.idPedido}`, { // Faz a requisição
            method: 'PUT', // Define o método da requisição
            headers: { // Define os cabeçalhos da requisição
                'Content-Type': 'application/json' // Define o tipo de conteúdo da requisição como JSON
            },
            body: JSON.stringify(pedidoVendaDTO) // Converte o objeto para JSON e envia no corpo da requisição
        });

        if(!respostaServidor.ok) { // Se a resposta do servidor não for ok
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema"); // lançar um erro
        }

        alert('Pedido atualizado com sucesso!'); // exibe um alerta com a mensagem de sucesso
        window.location.href = 'lista-pedidos.html'; // redireciona para a página de clientes

    } catch (error) { // trata qualquer erro que ocorrer no bloco de código
        console.error(error); // em caso de erro, imprime no console
        return null; // retorna um valor nulo
    }
}