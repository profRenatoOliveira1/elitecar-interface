/**
 * Envia os dados do formulário de cadastro de carro para o servidor.
 * 
 * Recupera as informações do formulário, cria um objeto JSON com os dados
 * e envia uma requisição POST para o servidor.
 * 
 * Essa função deverá ser vinculada ao evento de clique do botão de envio.
 * 
 * @async
 * @function enviaFormulario
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a operação é concluída.
 * @throws {Error} Lança um erro se a comunicação com o servidor falhar.
 */
async function enviaFormulario() {
    const carroDTO = { // recuperar as informações do formulário e colocar em objeto JSON
        "marca": document.querySelectorAll("input")[0].value, // recuperar a marca do carro
        "modelo": document.querySelectorAll("input")[1].value, // recuperar o modelo do carro
        "ano": Number(document.querySelectorAll("input")[2].value), // recuperar o ano do carro
        "cor": document.querySelectorAll("input")[3].value // recuperar a cor do carro
    }

    const validacaoCarro = validacaoFormularioCarro(carroDTO); // validar os dados do carro

    if (!validacaoCarro) { // verificar se os dados do carro são válidos
        return; // retornar em caso de dados inválidos
    }

    try { // tentar enviar os dados para o servidor
        const respostaServidor = await fetch("http://localhost:3333/novo/carro", { // enviar os dados para o servidor
            method: 'POST', // configuração da requisição
            headers: { // configuração do cabeçalho da requisição
                'Content-Type': 'application/json' // informar que o corpo da requisição é um JSON
            },
            body: JSON.stringify(carroDTO) // configuração do corpo da requisição
        });

        // verificar se a resposta do servidor foi bem sucedida
        if (!respostaServidor.ok) { // verificar se a resposta do servidor não foi bem-sucedida
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema"); // lançar um erro
        }

        alert("Carro cadastrado com sucesso!"); // exibir mensagem de sucesso
        window.location.href = "lista-carros.html"; // redirecionar o usuário para a página de lista de carros  

    } catch (error) { // tratar erros de comunicação com o servidor
        console.log(error); // exibir erro no console
        alert(`Erro ao se comunicar com o servidor. ${error}`); // exibir mensagem de erro para o usuário
    }
}

/**
 * Valida os dados de um objeto carro.
 *
 * @param {Object} carro - O objeto carro a ser validado.
 * @param {string} carro.marca - A marca do carro.
 * @param {string} carro.modelo - O modelo do carro.
 * @param {number} carro.ano - O ano de fabricação do carro.
 * @param {string} carro.cor - A cor do carro.
 * @returns {boolean} Retorna true se todos os campos do formulário forem válidos, caso contrário, retorna false.
 */
function validacaoFormularioCarro(carro) {
    if (carro.marca === "" || carro.modelo === "" || carro.ano === "" || carro.cor === "") {
        alert("Preencha todos os campos do formulário");
        return false;
    }

    if (typeof carro.ano !== "number") {
        alert("O ano do carro deve ser um número");
        return false;
    }

    if (carro.ano < 1980 || carro.ano > new Date().getFullYear()) {
        alert("O ano do carro deve ser maior que 1980 e menor ou igual que o ano atual");
        return false;
    }

    if (carro.cor.length < 3 || carro.marca.length < 3 || carro.modelo.length < 3 || carro.cor.length > 20 || carro.marca.length > 20 || carro.modelo.length > 20) {
        alert("Os atributos cor, marca e modelo do carro devem ter entre 3 e 20 caracteres");
        return false;
    }

    return true;
}

/**
 * Recupera a lista de carros do servidor e cria uma tabela com os dados.
 * 
 * Faz uma requisição HTTP para o endpoint '/lista/carros' e, se a resposta for bem-sucedida,
 * converte a resposta em JSON e chama a função `criarTabelaCarros` com a lista de carros.
 * 
 * Essa função deverá ser invocada ao carregar a página de lista de carros.
 * 
 * @async
 * @function recuperarListaCarros
 * @returns {Promise<null>} Retorna null em caso de sucesso ou erro.
 * @throws {Error} Lança um erro se a requisição falhar.
 */
async function recuperarListaCarros() {
    try { // tenta fazer a requisição para o servidor
        const respostaServidor = await fetch('http://localhost:3333/lista/carros'); // faz a requisição para o servidor e armazena o resultado em uma variável

        if (respostaServidor.ok) { // verifica se a resposta do servidor foi bem-sucedida
            const listaCarros = await respostaServidor.json(); // converte a resposta do servidor em JSON
            criarTabelaCarros(listaCarros); // chama a função para criar a tabela com os carros
        }

        return null; // retorna null em caso de sucesso
    } catch (error) { // trata erros de comunicação com o servidor
        console.error(error); // exibe o erro no console
        return null; // retorna null em caso de erro
    }
}

/**
 * Cria uma tabela de carros e insere no corpo da tabela (tbody) do documento.
 * 
 * @param {Array} carros - Lista de objetos de carros a serem exibidos na tabela.
 * @param {number} carros[].idCarro - Identificador único do carro.
 * @param {string} carros[].modelo - Modelo do carro.
 * @param {string} carros[].marca - Marca do carro.
 * @param {number} carros[].ano - Ano de fabricação do carro.
 * @param {string} carros[].cor - Cor do carro.
 * 
 * @returns {Promise<void>} - Uma Promise que resolve quando a tabela é criada.
 */
async function criarTabelaCarros(carros) {
    try { // tenta criar a tabela com os carros
        const tBody = document.querySelector(`tbody`); // recupera o corpo da tabela do documento

        carros.map(carro => { // itera sobre a lista de carros
            const tr = document.createElement('tr'); // cria uma nova linha na tabela

            const tdIdCarro = document.createElement('td'); // cria uma nova célula na linha para o id do carro
            tdIdCarro.textContent = carro.idCarro; // insere o id do carro na célula
            tr.appendChild(tdIdCarro); // insere a célula na linha 

            const tdModelo = document.createElement('td'); // cria uma nova célula na linha para o modelo do carro
            tdModelo.innerText = carro.modelo; // insere o modelo do carro na célula
            tr.appendChild(tdModelo); // insere a célula na linha

            const tdMarca = document.createElement('td'); // cria uma nova célula na linha para a marca do carro
            tdMarca.innerText = carro.marca; // insere a marca do carro na célula
            tr.appendChild(tdMarca); // insere a célula na linha

            const tdAno = document.createElement('td'); // cria uma nova célula na linha para o ano do carro
            tdAno.innerText = carro.ano; // insere o ano do carro na célula
            tr.appendChild(tdAno); // insere a célula na linha

            const tdCor = document.createElement('td'); // cria uma nova célula na linha para a cor do carro
            tdCor.innerText = carro.cor; // insere a cor do carro na célula
            tr.appendChild(tdCor); // insere a célula na linha

            const tdAcoes = document.createElement('td'); // cria uma nova célula na linha para as ações do carro
            const imgEditar = document.createElement('img'); // cria um novo elemento de imagem para editar o carro
            imgEditar.src = "./assets/icons/pencil-square.svg"; // configura o caminho da imagem
            imgEditar.alt = "Editar"; // configura o texto alternativo da imagem
            imgEditar.onclick = () => enviarInfoParaAtualizacao(carro); // configura a função de clique da imagem
            tdAcoes.appendChild(imgEditar); // insere a imagem na célula de ações

            const imgDeletar = document.createElement('img'); // cria um novo elemento de imagem para deletar o carro
            imgDeletar.src = "./assets/icons/trash-fill.svg"; // configura o caminho da imagem
            imgDeletar.alt = "Deletar"; // configura o texto alternativo da imagem
            imgDeletar.onclick = () => removerCarro(carro.idCarro); // configura a função de clique da imagem
            tdAcoes.appendChild(imgDeletar); // insere a imagem na célula de ações

            tr.appendChild(tdAcoes); // insere a célula de ações na linha

            tBody.append(tr); // insere a linha no corpo da tabela
        });
    } catch (error) { // trata erros na criação da tabela
        console.error(error); // exibe o erro no console
        return null; // retorna null em caso de erro
    }
}

/**
 * Remove um carro com base no ID fornecido.
 * 
 * Esta função solicita a confirmação do usuário antes de enviar uma requisição
 * DELETE para o servidor. Se a remoção for bem-sucedida, uma mensagem de sucesso
 * é exibida e a página é recarregada.
 * 
 * Essa função deverá ser vinculada ao evento de clique do botão de remoção.
 * 
 * @async
 * @function removerCarro
 * @param {number} idCarro - O ID do carro a ser removido.
 * @returns {Promise<boolean>} Retorna true se o carro foi removido com sucesso, 
 *                             caso contrário, retorna false.
 */
async function removerCarro(idCarro) {
    try { // tenta remover o carro do servidor
        const confirmacaoUsuario = confirm("Deseja realmente remover o carro?"); // solicita a confirmação do usuário

        if (!confirmacaoUsuario) { // verifica se o usuário confirmou a remoção
            return false; // retorna false em caso de cancelamento
        }

        const respostaServidor = await fetch(`http://localhost:3333/delete/carro/${idCarro}`, { // envia a requisição para o servidor
            method: 'DELETE' // configuração do método da requisição
        });

        if (respostaServidor.ok) { // verifica se a remoção foi bem-sucedida
            alert("Carro removido com sucesso!"); // exibe mensagem de sucesso
            window.location.reload(); // recarrega a página
        }

        return true; // retorna true em caso de sucesso
    } catch (error) { // trata erros de comunicação com o servidor
        console.error(error); // exibe o erro no console
        return false; // retorna false em caso de erro
    }
}

/**
 * Redireciona o usuário para a página de atualização de carro com as informações do carro fornecido.
 *
 * @param {Object} carro - Objeto contendo as informações do carro a ser atualizado.
 */
function enviarInfoParaAtualizacao(carro) {
    const urlUpdate = `atualizar-carro.html?carro=${JSON.stringify(carro)}`; // monta a URL com as informações do carro
    window.location.href = urlUpdate; // redireciona o usuário para a página de atualização
}

/**
 * Carrega os dados do formulário com as informações do carro obtidas da URL.
 * A URL deve conter um parâmetro de consulta "carro" com um objeto JSON codificado.
 * Os dados do carro são preenchidos nos campos de entrada do formulário na ordem:
 * idCarro, marca, modelo, ano e cor.
 * 
 * Essa função deverá ser invocada ao carregar a página de atualização de carro.
 */
function carregarDadosFormulario() {
    const url = new URL(window.location.href);  // recupera a URL da página
    const carro = JSON.parse(url.searchParams.get("carro")); // recupera o objeto JSON da URL

    document.querySelectorAll("input")[0].value = carro.idCarro; // preenche o campo de idCarro
    document.querySelectorAll("input")[1].value = carro.marca; // preenche o campo de marca
    document.querySelectorAll("input")[2].value = carro.modelo; // preenche o campo de modelo
    document.querySelectorAll("input")[3].value = carro.ano; // preenche o campo de ano
    document.querySelectorAll("input")[4].value = carro.cor; // preenche o campo de cor
}

/**
 * Atualiza as informações de um carro com base nos dados fornecidos pelo usuário.
 * 
 * Esta função coleta os dados de entrada do usuário, confirma a intenção de atualização,
 * e envia uma requisição PUT para o servidor com os dados do carro. Se a atualização for
 * bem-sucedida, o usuário é redirecionado para a página de lista de carros.
 * 
 * Essa função deverá ser vinculada ao evento de clique do botão de atualização.
 * 
 * @async
 * @function atualizarCarro
 * @returns {Promise<boolean>} Retorna true se a atualização for bem-sucedida, caso contrário, false.
 */
async function atualizarCarro() {
    const carroDTO = {  // recuperar as informações do formulário e colocar em objeto JSON
        "idCarro": document.querySelectorAll("input")[0].value, // recuperar o id do carro
        "marca": document.querySelectorAll("input")[1].value, // recuperar a marca do carro 
        "modelo": document.querySelectorAll("input")[2].value, // recuperar o modelo do carro
        "ano": Number(document.querySelectorAll("input")[3].value), // recuperar o ano do carro 
        "cor": document.querySelectorAll("input")[4].value // recuperar a cor do carro
    }

    try {  // tentar atualizar o carro no servidor
        const confirmacaoUsuario = confirm("Deseja realmente atualizar o carro?"); // solicitar a confirmação do usuário

        if (!confirmacaoUsuario) {   // verificar se o usuário confirmou a atualização
            return false; // retornar false em caso de cancelamento
        }

        const validacaoCarro = validacaoFormularioCarro(carroDTO); // validar os dados do carro

        if (!validacaoCarro) { // verificar se os dados do carro são válidos
            return; // retornar em caso de dados inválidos
        }

        const respostaServidor = await fetch(`http://localhost:3333/atualizar/carro/${carroDTO.idCarro}`, { // enviar os dados para o servidor
            method: 'PUT', // configuração da requisição
            headers: { // configuração do cabeçalho da requisição
                'Content-Type': 'application/json' // informar que o corpo da requisição é um JSON
            },
            body: JSON.stringify(carroDTO) // configuração do corpo da requisição
        });

        if (respostaServidor.ok) { // verificar se a atualização foi bem-sucedida
            alert("Carro atualizado com sucesso!"); // exibir mensagem de sucesso
            window.location.href = "lista-carros.html"; // redirecionar o usuário para a página de lista de carros
        }

        return true; // retornar true em caso de sucesso
    } catch (error) { // tratar erros de comunicação com o servidor
        console.error(error);   // exibir o erro no console
        return false; // retornar false em caso de erro
    }
}