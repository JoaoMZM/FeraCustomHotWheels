# 🗄️ Modelo de Dados
Este documento representa o modelo de dados do sistema de maneira mais detalhada, focando em especificar seus relacionamentos e descre ver entidades.

## 👤 Entidade: Clientes
![Entidade cliente](../assets/clienteEntidade.png)

### 📌 Descrição
Representa os clientes da loja que estão cadastrados no sistema.

### 🧾 Atributos
- id_cliente (PK);
- nome_cliente;
- cpf_cliente;
- email_cliente;
- senha_cliente;
- data_cad_cliente.

### 🔗 Relacionamentos
- Clientes X Endereços;
- Clientes X Telefones;
- Clientes X Cartao;
- Clientes X Pedidos.

## 🛒 Entidade: Produtos
![Entidade produtos](../assets/EnderecosEntidade.png)

### 📌 Descrição
Representa o endereço dos clientes cadastrados na loja.

### 🧾 Atributos
- id_endereco (PK);
- rua_endereco;
- numero_endereco;
- bairro_endereco;
- cidade_endereco;
- cep_endereco;
- UF_endereco;
- complemento_endereco;
- estado_descricao;
- estado_endereco;
- id_cliente (FK);

### 🔗 Relacionamentos
- Endereços X Clientes;

## 📞 Entidade: Telefones
![Entidade telefones](../assets/TelefonesEntidade.png)

### 📌 Descrição
Representa o telefone dos clientes cadastrados na loja.

### 🧾 Atributos
- id_telefone (PK);
- numero_telefone;
- id_cliente (FK).

### 🔗 Relacionamentos
- Telefones X Clientes;

## 📝 Entidade: Pedidos
![Entidade pedidos](../assets/PedidosEntidade.png)

### 📌 Descrição
Representa os pedidos realizados pelos clientes da loja, mais especificamente seus status e data de realização.

### 🧾 Atributos
- id_pedido (PK);
- data_pedido;
- status_pedido;
- id_cliente (FK).

### 🔗 Relacionamentos
- Pedidos X Clientes;
- Pedidos X itens_pedidos.

##  Entidade: Cartao
![Entidade cartão](../assets/CartaoEntidade.png)

### 📌 Descrição
Representa os cartões de crédito/débit

### 🧾 Atributos
- id_pedido (PK);
- data_pedido;
- status_pedido;
- id_cliente (FK).

### 🔗 Relacionamentos
- Pedidos X Clientes;
- Pedidos X itens_pedidos.