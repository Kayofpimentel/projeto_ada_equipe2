const formulario = document.getElementById("formulario")
const nome = document.getElementById("nome")
const email = document.getElementById("email")
const plano = document.getElementById("plano")
const cep = document.getElementById("cep")
const rua = document.getElementById("rua")
const bairro = document.getElementById("bairro")
const cidade = document.getElementById("cidade")
const uf = document.getElementById("uf")
const lista = document.getElementById("lista")
const busca = document.getElementById("busca")
const aviso = document.getElementById("aviso")
const salvar = document.getElementById("salvar")
const operador = document.getElementById("operador")

let clientes = JSON.parse(localStorage.getItem("clientes_db")) || []

let nomeOperador = sessionStorage.getItem("operador")

if (!nomeOperador) {
  nomeOperador = prompt("Digite o nome do operador")

  if (!nomeOperador) {
    nomeOperador = "sem nome"
  }

  sessionStorage.setItem("operador", nomeOperador)
}

operador.textContent = "Operador(a) atual: " + nomeOperador

function salvarDados() {
  localStorage.setItem("clientes_db", JSON.stringify(clientes))
}

function mostrarAviso(texto, tipo) {
  aviso.textContent = texto
  aviso.className = ""

  if (tipo === "erro") {
    aviso.classList.add("avisoErro")
  }

  if (tipo === "ok") {
    aviso.classList.add("avisoOk")
  }
}

function limparAviso() {
  aviso.textContent = ""
  aviso.className = ""
}

async function pegarCep() {
  const cepDigitado = cep.value.replace(/\D/g, "")

  if (cepDigitado.length !== 8) {
    return
  }

  try {
    mostrarAviso("Carregando endereço...", "ok")

    rua.value = "Carregando..."
    bairro.value = "Carregando..."
    cidade.value = "Carregando..."
    uf.value = "..."

    const resposta = await fetch("https://viacep.com.br/ws/" + cepDigitado + "/json/")
    const dados = await resposta.json()

    if (dados.erro) {
      throw new Error("CEP não encontrado")
    }

    rua.value = dados.logradouro
    bairro.value = dados.bairro
    cidade.value = dados.localidade
    uf.value = dados.uf

    limparAviso()
  } catch (erro) {
    mostrarAviso("Erro ao consultar CEP", "erro")

    rua.value = ""
    bairro.value = ""
    cidade.value = ""
    uf.value = ""
  }
}

function esperarUmPouco() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, 2000)
  })
}

function criarCards(listaDeClientes = clientes) {
  lista.innerHTML = ""

  listaDeClientes.forEach(function (cliente) {
    const card = document.createElement("div")
    card.classList.add("card")

    if (cliente.plano === "Gold") {
      card.classList.add("gold")
    }

    if (cliente.plano === "Silver") {
      card.classList.add("silver")
    }

    if (cliente.plano === "Bronze") {
      card.classList.add("bronze")
    }

    const titulo = document.createElement("h3")
    titulo.textContent = cliente.nome

    const textoEmail = document.createElement("p")
    textoEmail.textContent = "Email: " + cliente.email

    const textoPlano = document.createElement("p")
    textoPlano.textContent = "Plano: " + cliente.plano

    const textoCep = document.createElement("p")
    textoCep.textContent = "CEP: " + cliente.cep

    const textoEndereco = document.createElement("p")
    textoEndereco.textContent = cliente.rua + " - " + cliente.bairro

    const textoCidade = document.createElement("p")
    textoCidade.textContent = cliente.cidade + " / " + cliente.uf

    const botao = document.createElement("button")
    botao.textContent = "Remover"
    botao.classList.add("botaoRemover")

    botao.addEventListener("click", function () {
      clientes = clientes.filter(function (item) {
        return item.id !== cliente.id
      })

      salvarDados()
      criarCards()
    })

    card.appendChild(titulo)
    card.appendChild(textoEmail)
    card.appendChild(textoPlano)
    card.appendChild(textoCep)
    card.appendChild(textoEndereco)
    card.appendChild(textoCidade)
    card.appendChild(botao)

    lista.appendChild(card)
  })
}

email.addEventListener("blur", function () {
  if (!email.value.includes("@")) {
    email.classList.add("erro")
    email.classList.remove("certo")
  } else {
    email.classList.remove("erro")
    email.classList.add("certo")
  }
})

cep.addEventListener("blur", function () {
  pegarCep()
})

formulario.addEventListener("submit", async function (event) {
  event.preventDefault()

  try {
    limparAviso()

    if (
      nome.value === "" ||
      email.value === "" ||
      plano.value === "" ||
      cep.value === "" ||
      rua.value === "" ||
      bairro.value === "" ||
      cidade.value === "" ||
      uf.value === ""
    ) {
      mostrarAviso("Preencha todos os campos.", "erro")
      return
    }

    if (!email.value.includes("@")) {
      mostrarAviso("Email inválido.", "erro")
      return
    }

    salvar.disabled = true
    salvar.textContent = "Salvando..."

    await esperarUmPouco()

    const cliente = {
      id: Date.now(),
      nome: nome.value,
      email: email.value,
      plano: plano.value,
      cep: cep.value,
      rua: rua.value,
      bairro: bairro.value,
      cidade: cidade.value,
      uf: uf.value
    }

    clientes.push(cliente)
    salvarDados()
    criarCards()

    formulario.reset()
    email.classList.remove("erro")
    email.classList.remove("certo")

    mostrarAviso("Cliente salvo.", "ok")
  } catch (erro) {
    mostrarAviso("Deu erro ao salvar.", "erro")
  } finally {
    salvar.disabled = false
    salvar.textContent = "Salvar"
  }
})

busca.addEventListener("input", function () {
  const texto = busca.value.toLowerCase()

  const resultado = clientes.filter(function (cliente) {
    return cliente.nome.toLowerCase().includes(texto)
  })

  criarCards(resultado)
})

criarCards()
