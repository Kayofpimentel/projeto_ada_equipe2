// Modal de boas-vindas
const modal = document.getElementById('modalBoasVindas');
const btnIniciar = document.getElementById('btnIniciar');
const nomeUsuarioInput = document.getElementById('nomeUsuario');
const saudacaoTopo = document.getElementById('saudacaoTopo');
const containerFormulario = document.getElementById('containerFormulario');

// Verifica se já existe nome salvo na sessão
let nomePessoa = sessionStorage.getItem('nomePessoa');

if (!nomePessoa) {
    modal.style.display = 'flex'; // abre o modal
    containerFormulario.classList.add('desfocado'); // desfoca o formulário
} else {
    saudacaoTopo.textContent = `Olá, ${nomePessoa}`;
}

// Quando clicar em iniciar
btnIniciar.addEventListener('click', () => {
    const nomeDigitado = nomeUsuarioInput.value.trim();

    if (nomeDigitado === "") {
        alert("Digite seu nome antes de continuar");
        return;
    }

    sessionStorage.setItem('nomePessoa', nomeDigitado);
    saudacaoTopo.textContent = `Olá, ${nomeDigitado}`;
    modal.style.display = 'none';

    modal.style.display = 'none';
    containerFormulario.classList.remove('desfocado');
});




const form = document.getElementById('formCadastro');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const cep = document.getElementById('cep');
const plano = document.getElementById('plano');
const listaUl = document.querySelector('#listaClientes');
const btnSalvar = document.querySelector('#formCadastro button[type="submit"]');

function validarEmail(email) {
    return email.includes('@');
}

email.addEventListener('blur', function() {
    const emailValue = email.value;
    if (emailValue !== "" && !validarEmail(emailValue)) {
        email.classList.add('invalid');
    } else {
        email.classList.remove('invalid');
    }
});

async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep.length !== 8) {
        alert('CEP inválido. Digite um CEP com 8 dígitos.');
        return;
    }

    const msg = document.getElementById("mensagemCEP");
    msg.style.display = "block"; // mostra a mensagem imediatamente

    // espera 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(dados => {
            msg.style.display = "none"; // esconde a mensagem
            if (dados.erro) {
                alert('CEP não encontrado');
                return;
            }
            document.getElementById("rua").value = dados.logradouro;
            document.getElementById("bairro").value = dados.bairro;
            document.getElementById("cidade").value = dados.localidade;
            document.getElementById("estado").value = dados.uf;
        })
        .catch(() => alert("Erro ao buscar CEP"))
        };    


function filtrarClientes() {
    const termo = document.getElementById('campoBusca').value.toLowerCase();
    const itens = document.querySelectorAll('#listaClientes li');

    itens.forEach(li => {
        const texto = li.innerText.toLowerCase();
        li.style.display = texto.includes(termo) ? 'flex' : 'none';
    });
}


function renderizarUsuarios() {
    listaUl.innerHTML = ''; 
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    usuarios.forEach(usuario => {
        const li = document.createElement('li');

    let classePlano = '';
        if (usuario.plano === 'gold') classePlano = 'plano-gold';
        if (usuario.plano === 'silver') classePlano = 'plano-silver';
        if (usuario.plano === 'bronze') classePlano = 'plano-bronze';
        
        li.innerHTML = `<strong>Nome: ${usuario.nome}</strong>
                        <span>Email: ${usuario.email}</span>
                        <span>CEP: ${usuario.cep}</span>
                        <span>Número: ${usuario.numero}</span>
                        <span>Complemento: ${usuario.complemento}</span>
                        <span>Plano:  ${usuario.plano}</span>
                        <button class="btn-excluir">Excluir</button>`;
        const botaoExcluir = li.querySelector('.btn-excluir');

        botaoExcluir.addEventListener('click', function () {
            excluirUsuario(usuario.id);
});

        li.classList.add(classePlano);
        listaUl.appendChild(li);
    });
}

function excluirUsuario(idUsuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    usuarios = usuarios.filter(u => u.id !== idUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    renderizarUsuarios();
}


 form.addEventListener('submit', async function(event) {
    event.preventDefault();

    btnSalvar.disabled = true; // desabilita o botão para evitar múltiplos cliques
    btnSalvar.textContent = 'Salvando...'; // muda o texto do botão para indicar que está salvando

    let dadosUsuario;

    try {   
        await new Promise(resolve => setTimeout(resolve, 2000)); // simula um atraso de 2 segundos  
        dadosUsuario = { 
            id: Date.now(),
            nome: nome.value, 
            email: email.value,
            cep: cep.value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,  
            plano: plano.value 
    }} finally {
        btnSalvar.disabled = false; // reabilita o botão
        btnSalvar.textContent = 'Salvar'; // restaura o texto original do botão
    }


    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    listaUsuarios.push(dadosUsuario);
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

    console.log('Dados do usuário:', dadosUsuario);
    alert('Cadastrado com sucesso!');
    
    form.reset(); // Limpa os campos
    renderizarUsuarios(); // Atualiza a lista na tela
}); 

// 4. Chamada inicial para carregar dados ao abrir a página
renderizarUsuarios();

// teste da Lia
