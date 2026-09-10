# 🧩 Diagrama de Classes

Este documento descreve as principais classes do sistema de e-commerce e seus relacionamentos.

---

##  Classe: Clientes

###  Descrição
Representa os clientes cadastrados no sistema, responsáveis por realizar compras e manter seus dados pessoais.

###  Atributos
- id_cliente: number
- nome_cliente: string
- cpf_cliente: string
- email_cliente: string
- senha_cliente: string
- data_cad_cliente: date

### ⚙️ Métodos
- criarCliente()
- editarCliente()
- validarCliente()
- validarCpf()
- validarId()
- validarNome()
- validarEmail()
- validarSenha()

---

## 🏠 Classe: Endereços

### 📌 Descrição
Armazena os endereços associados a cada cliente.

### 🧾 Atributos
- id_endereco: number
- rua_endereco: string
- numero_endereco: string
- bairro_endereco: string
- cidade_endereco: string
- cep_endereco: string
- uf_endereco: string
- complemento_endereco: string
- id_cliente: number

### ⚙️ Métodos
- criarEndereco()
- editarEndereco()
- validarId()
- validarIdCliente()
- validarRua()
- validarNumero()
- validarBairro()
- validarCidade()
- validarCep()
- validaUf()
- validarComplemento()

---

## 📞 Classe: Telefones

### 📌 Descrição
Armazena os números de telefone dos clientes.

### 🧾 Atributos
- id_telefone: number
- numero_telefone: string
- id_cliente: number

### ⚙️ Métodos
- cadastrarTelefone()
- atualizarTelefone()
- validarNumero()
- validarId()
- validarIdCliente()

---

## 🗂️ Classe: Categorias

### 📌 Descrição
Organiza os produtos em categorias.

### 🧾 Atributos
- id_categoria: number
- nome_categoria: string
- descricao_categoria: string

### ⚙️ Métodos
- criarCategoria()
- editarCategoria()
- validarId()
- validarNome()
- validarDescricao()

---

## 📦 Classe: Produtos

### 📌 Descrição
Representa os produtos disponíveis para venda.

### 🧾 Atributos
- id_produto: number
- nome_produto: string
- descricao_produto: string
- preco_produto: number
- estoque_produto: number
- cor: string
- modelo: string
- limitado: boolean
- id_categoria: number

### ⚙️ Métodos
- criarProduto()
- editarProduto()
- validarId()
- validarNome()
- validarDescricao()
- validarPreco()
- validarEstoque()
- validarCor()
- validarModelo()
- validarLimitado()
- validarIdCategoria()

---

## 🛒 Classe: Pedidos

### 📌 Descrição
Representa um pedido realizado por um cliente.

### 🧾 Atributos
- id_pedido: number
- data_pedido: date
- status_pedido: string
- id_cliente: number

### ⚙️ Métodos
- criarPedido()
- cancelarPedido()
- calcularTotal()
- validarId()
- validarStatusPedido()
- validarCliente()

---

## 📄 Classe: Itens_Pedidos

### 📌 Descrição
Representa os produtos incluídos em cada pedido.

### 🧾 Atributos
- id_itens_pedido: number
- id_pedido: number
- id_produto: number
- quantidade: number
- preco_unitario: number

### ⚙️ Métodos
- adicionarItem()
- removerItem()
- calcularSubtotal()
- validarId()
- validarIdPedido()
- validarIdProduto()
- validarQuatidade ()
- validarPrecoUnitario()

---

## 💳 Classe: Cartão

### 📌 Descrição
Armazena os cartões cadastrados pelos clientes.

### 🧾 Atributos
- id_cartao: number
- id_cliente: number
- nome_titular: string
- bandeira_cartao: string
- digitos_cartao: string
- token_gateway: string
- data_cad: date

### ⚙️ Métodos
- criarCartao()
- editarCartao()
- validarId()
- validarIdCliente()
- validarNome()
- validarBandeiraCartão()
- validarDigitosCartao()
- validarTokenGateway()

---

## 💰 Classe: Pagamentos

### 📌 Descrição
Registra as informações de pagamento dos pedidos.

### 🧾 Atributos
- id_pagamento: number
- id_pedido: number
- id_cartao: number
- metodo_pagamento: string
- status_pagamento: string
- valor_pagamento: number
- email_pagador: string
- numero_parcelas: number
- data_pagamento: date

### ⚙️ Métodos
- processarPagamento()
- confirmarPagamento()
- cancelarPagamento()
- validarId()
- validarIdPedido()
- validarIdCartao()
- validarMetodoPagamento()
- validarStatusPagamento()
- validarValorPagamento()
- validarEmailPagamento()
- validarNumeroParcelas()

---

# 🔗 Relacionamento: Clientes x Pedidos

### 📌 Descrição
Um cliente pode realizar vários pedidos.

### 📐 Tipo
- Um para muitos (1:N)

---

# 🔗 Relacionamento: Categorias x Produtos

### 📌 Descrição
Uma categoria pode conter vários produtos.

### 📐 Tipo
- Um para muitos (1:N)

---

# 🔗 Relacionamento: Pedidos x Produtos

### 📌 Descrição
Um pedido pode conter vários produtos, e um produto pode estar em vários pedidos. Esse relacionamento é implementado pela classe Itens_Pedidos.

### 📐 Tipo
- Muitos para muitos (N:N)

---

# 🔗 Relacionamento: Pedidos x Pagamentos

### 📌 Descrição
Cada pedido possui um registro de pagamento.

### 📐 Tipo
- Um para um (1:1)

---

# 🔗 Relacionamento: Clientes x Cartão

### 📌 Descrição
Um cliente pode cadastrar vários cartões para realizar pagamentos.

### 📐 Tipo
- Um para muitos (1:N)