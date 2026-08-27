import React, { useState, useMemo } from "react";
import {View,Text,TextInput,FlatList,TouchableOpacity,Image,StyleSheet,SafeAreaView,} from "react-native";

// Dados de exemplo — substitua depois por dados vindos da sua API/banco
const PRODUTOS_MOCK = [
  {
    id: "1",
    nome: "Camiseta Básica",
    preco: 49.9,
    imagem: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    nome: "Calça Jeans",
    preco: 129.9,
    imagem: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    nome: "Tênis Esportivo",
    preco: 199.9,
    imagem: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    nome: "Boné Aba Reta",
    preco: 39.9,
    imagem: "https://via.placeholder.com/150",
  },
];

export default function SalesScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({}); // { [produtoId]: quantidade }

  const produtosFiltrados = useMemo(() => {
    if (!busca.trim()) return PRODUTOS_MOCK;
    return PRODUTOS_MOCK.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);

  function adicionarAoCarrinho(produtoId) {
    setCarrinho((prev) => ({
      ...prev,
      [produtoId]: (prev[produtoId] || 0) + 1,
    }));
  }

  function removerDoCarrinho(produtoId) {
    setCarrinho((prev) => {
      const atual = prev[produtoId] || 0;
      if (atual <= 1) {
        const { [produtoId]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [produtoId]: atual - 1 };
    });
  }

  const totalItens = Object.values(carrinho).reduce((a, b) => a + b, 0);

  const totalValor = Object.entries(carrinho).reduce((soma, [id, qtd]) => {
    const produto = PRODUTOS_MOCK.find((p) => p.id === id);
    return soma + (produto ? produto.preco * qtd : 0);
  }, 0);

  function renderProduto({ item }) {
    const quantidade = carrinho[item.id] || 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imagem }} style={styles.imagem} />

        <View style={styles.infoContainer}>
          <Text style={styles.nomeProduto}>{item.nome}</Text>
          <Text style={styles.precoProduto}>
            R$ {item.preco.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        {quantidade === 0 ? (
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => adicionarAoCarrinho(item.id)}
          >
            <Text style={styles.botaoAdicionarTexto}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity
              style={styles.botaoQuantidade}
              onPress={() => removerDoCarrinho(item.id)}
            >
              <Text style={styles.botaoQuantidadeTexto}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantidadeTexto}>{quantidade}</Text>

            <TouchableOpacity
              style={styles.botaoQuantidade}
              onPress={() => adicionarAoCarrinho(item.id)}
            >
              <Text style={styles.botaoQuantidadeTexto}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Vendas</Text>
      </View>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar produto..."
        placeholderTextColor="#999"
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
        }
      />

      {totalItens > 0 && (
        <TouchableOpacity
          style={styles.rodapeCarrinho}
          onPress={() => navigation?.navigate("Checkout", { carrinho })}
        >
          <Text style={styles.rodapeTexto}>
            {totalItens} {totalItens === 1 ? "item" : "itens"}
          </Text>
          <Text style={styles.rodapeTexto}>
            R$ {totalValor.toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.rodapeFinalizar}>Finalizar venda →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  inputBusca: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  listaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nomeProduto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  precoProduto: {
    fontSize: 14,
    color: "#4caf50",
    marginTop: 4,
    fontWeight: "600",
  },
  botaoAdicionar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoAdicionarTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -2,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 17,
    paddingHorizontal: 4,
  },
  botaoQuantidade: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoQuantidadeTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  quantidadeTexto: {
    minWidth: 22,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  vazioTexto: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
  rodapeCarrinho: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  rodapeTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  rodapeFinalizar: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});