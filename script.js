// Modal de boas-vindas
const modal = document.getElementById('modalBoasVindas');
const btnIniciar = document.getElementById('btnIniciar');
const nomeUsuarioInput = document.getElementById('nomeUsuario');
const saudacaoTopo = document.getElementById('saudacaoTopo');

// Verifica se já existe nome salvo na sessão
let nomePessoa = sessionStorage.getItem('nomePessoa');

if (!nomePessoa) {
    modal.style.display = 'flex'; // abre o modal
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
});




const form = document.getElementById('formCadastro');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const plano = document.getElementById('plano');
const listaUl = document.querySelector('#listaClientes');

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


function renderizarUsuarios() {
    listaUl.innerHTML = ''; 
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    usuarios.forEach(usuario => {
        const li = document.createElement('li');

    let classePlano = '';
        if (usuario.plano === 'gold') classePlano = 'plano-gold';
        if (usuario.plano === 'silver') classePlano = 'plano-silver';
        if (usuario.plano === 'bronze') classePlano = 'plano-bronze';
        
        li.innerHTML = `<strong>${usuario.nome}</strong> - ${usuario.email} - Plano  ${usuario.plano} <button class="btn-excluir">Excluir</button>`;
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


form.addEventListener('submit', function(event) {
    console.log('Formulário enviado');
    event.preventDefault();

    const dadosUsuario = { 
        id: Date.now(),
        nome: nome.value, 
        email: email.value, 
        plano: plano.value 
    };


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
