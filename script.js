const clientes = JSON.parse(localStorage.getItem("clientes_db")) || []
const nomePessoa = localStorage.getItem("nomePessoa")

const modal = document.getElementById("modalBoasVindas")
const formBoasVindas = document.getElementById("formBoasVindas")
const nomeUsuarioInput = document.getElementById("nomeUsuario")
const btnIniciar = document.getElementById("btnIniciar")
const saudacaoTopo = document.getElementById("saudacaoTopo")

const containerFormulario = document.getElementById("formulario-cliente")
const formCadastroCliente = document.getElementById("cadastro-cliente")
const btnCadastrarCliente = document.getElementById("btnCadastrarCliente")
const listaClientes = document.querySelector("#lista-clientes ul")
const campoBuscaCliente = document.getElementById("busca-cliente")
const campoEmail = document.getElementById("email")

const classeCampoInvalido = "input-aviso"

function atualizarEstadoBotaoIniciar() {
  if (!btnIniciar || !nomeUsuarioInput) {
    return
  }

  const nomePreenchido = nomeUsuarioInput.value.trim().length > 0
  btnIniciar.disabled = !nomePreenchido
}

function salvarClientes() {
  localStorage.setItem("clientes_db", JSON.stringify(clientes))
}

function obterClassePlanoCliente(tipoPlano) {
  const classesPorPlano = {
    ouro: "cliente-card--ouro",
    prata: "cliente-card--prata",
    bronze: "cliente-card--bronze",
  }

  return classesPorPlano[tipoPlano.trim().toLowerCase()] || ""
}

function criarTextoElemento(tag, texto) {
  const elemento = document.createElement(tag)
  elemento.textContent = texto
  return elemento
}

function criarBotaoExcluir(indice) {
  const botao = document.createElement("button")
  botao.type = "button"
  botao.className = "cliente-card__excluir"
  botao.setAttribute("aria-label", "Excluir cliente")
  botao.textContent = "X"

  botao.addEventListener("click", function () {
    clientes.splice(indice, 1)
    salvarClientes()
    renderizarClientes()
  })

  return botao
}

function renderizarClientes() {
  if (!listaClientes) {
    return
  }

  const termoBusca = campoBuscaCliente ? campoBuscaCliente.value.trim().toLowerCase() : ""

  listaClientes.innerHTML = ""

  clientes.forEach(function (cliente, indice) {
    const nomeCliente = cliente.nome.toLowerCase()

    if (!nomeCliente.includes(termoBusca)) {
      return
    }

    const item = document.createElement("li")
    item.className = `cliente-card ${obterClassePlanoCliente(cliente.tipoPlano)}`

    item.appendChild(criarBotaoExcluir(indice))
    item.appendChild(criarTextoElemento("h3", cliente.nome))
    item.appendChild(criarTextoElemento("p", `Email: ${cliente.email}`))
    item.appendChild(criarTextoElemento("p", `Plano: ${cliente.tipoPlano}`))

    listaClientes.appendChild(item)
  })
}

function validarEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regexEmail.test(email)
}

if (!nomePessoa) {
  modal.style.display = "flex" // abre o modal
  containerFormulario.classList.add("desfocado") // desfoca o formulário
} else {
  saudacaoTopo.textContent = `Bem-vindo, ${nomePessoa}`
  modal.style.display = "none"
  containerFormulario.classList.remove("desfocado")
}

atualizarEstadoBotaoIniciar()

renderizarClientes()

if (campoBuscaCliente) {
  campoBuscaCliente.addEventListener("input", renderizarClientes)
}

if (campoEmail) {
  campoEmail.addEventListener("blur", function () {
    const email = campoEmail.value.trim()
    const emailPreenchido = email.length > 0
    const emailValido = validarEmail(email)

    campoEmail.classList.toggle(classeCampoInvalido, emailPreenchido && !emailValido)
  })

  campoEmail.addEventListener("input", function () {
    const email = campoEmail.value.trim()
    const emailValido = email.length === 0 || validarEmail(email)

    campoEmail.classList.toggle(classeCampoInvalido, !emailValido)
  })
}

if (nomeUsuarioInput) {
  nomeUsuarioInput.addEventListener("input", atualizarEstadoBotaoIniciar)
}

if (formBoasVindas) {
  formBoasVindas.addEventListener("submit", (event) => {
    event.preventDefault()

    const nomeDigitado = nomeUsuarioInput.value.trim()

    if (!nomeDigitado) {
      nomeUsuarioInput.focus()
      atualizarEstadoBotaoIniciar()
      return
    }

    localStorage.setItem("nomePessoa", nomeDigitado)
    saudacaoTopo.textContent = `Bem-vindo, ${nomeDigitado}`
    modal.style.display = "none"
    containerFormulario.classList.remove("desfocado")
  })
}

if (formCadastroCliente) {
  formCadastroCliente.addEventListener("submit", function (event) {
    event.preventDefault()
    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const tipoPlano = document.getElementById("tipoPlano").value

    const novoCliente = {
      nome: nome,
      email: email,
      tipoPlano: tipoPlano,
    }

    clientes.push(novoCliente)
    salvarClientes()

    renderizarClientes()
    formCadastroCliente.reset()
  })
}
