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
        
        li.innerHTML = `<strong>${usuario.nome}</strong> - ${usuario.email} - Plano  ${usuario.plano}`;
        li.classList.add(classePlano);
        listaUl.appendChild(li);
    });
}


form.addEventListener('submit', function(event) {
    console.log('Formulário enviado');
    event.preventDefault();

    const dadosUsuario = { 
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
