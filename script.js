const CHAVE_CADASTROS = "clientes_cadastrados"
const clientes = JSON.parse(localStorage.getItem(CHAVE_CADASTROS)) || []

const form = document.getElementById("cadastro-cliente")
const listaClientes = document.querySelector("#lista-clientes ul")

function salvarClientes() {
  localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(clientes))
}

function criarTextoCard(tag, texto) {
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

  listaClientes.innerHTML = ""

  clientes.forEach(function (cliente, indice) {
    const item = document.createElement("li")
    item.className = "cliente-card"

    item.appendChild(criarBotaoExcluir(indice))
    item.appendChild(criarTextoCard("h3", cliente.nome))
    item.appendChild(criarTextoCard("p", `Email: ${cliente.email}`))
    item.appendChild(criarTextoCard("p", `Plano: ${cliente.tipoPlano}`))

    listaClientes.appendChild(item)
  })
}

renderizarClientes()

form.addEventListener("submit", function (event) {
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
  form.reset()
})
