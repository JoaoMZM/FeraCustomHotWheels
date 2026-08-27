import React, { useState, useMemo } from "react";
import {View,Text,TextInput,FlatList,TouchableOpacity,  Image,StyleSheet,SafeAreaView,} from "react-native";

export default function SalesScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});

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
            activeOpacity={0.85}
            onPress={() => adicionarAoCarrinho(item.id)}
          >
            <Text style={styles.botaoAdicionarTexto}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity
              style={styles.botaoQuantidade}
              activeOpacity={0.7}
              onPress={() => removerDoCarrinho(item.id)}
            >
              <Text style={styles.botaoQuantidadeTexto}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantidadeTexto}>{quantidade}</Text>

            <TouchableOpacity
              style={styles.botaoQuantidade}
              activeOpacity={0.7}
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
        placeholderTextColor={COLORS.neutral}
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
          activeOpacity={0.9}
          onPress={() => navigation?.navigate("Checkout", { carrinho })}
        >
          <View>
            <Text style={styles.rodapeTexto}>
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </Text>
            <Text style={styles.rodapeValor}>
              R$ {totalValor.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <Text style={styles.rodapeFinalizar}>Finalizar venda →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

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

const COLORS = {
  primary: "#D50000",
  secondary: "#111111",
  neutral: "#6E6E6E",
  background: "#F5F5F5",
  white: "#FFFFFF",
  border: "#E0E0E0",
  success: "#2E7D32",
};

const FONTS = {
  primary: "Poppins",
  secondary: "Inter",
};

const TYPOGRAPHY = {
  h1: { fontFamily: FONTS.primary, fontSize: 48, fontWeight: "700" },
  h2: { fontFamily: FONTS.primary, fontSize: 36, fontWeight: "600" },
  h3: { fontFamily: FONTS.primary, fontSize: 28, fontWeight: "500" },
  body: { fontFamily: FONTS.secondary, fontSize: 16, fontWeight: "400" },
  small: { fontFamily: FONTS.secondary, fontSize: 14, fontWeight: "400" },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 17,
  pill: 999,
};

const SHADOW_SMALL = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  titulo: {
    ...TYPOGRAPHY.h3,
    color: COLORS.secondary,
  },
  inputBusca: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listaContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm + 2,
    ...SHADOW_SMALL,
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md - 4,
  },
  nomeProduto: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  precoProduto: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    marginTop: SPACING.xs,
    fontWeight: "600",
  },
  botaoAdicionar: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoAdicionarTexto: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -2,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xs,
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
    color: COLORS.primary,
  },
  quantidadeTexto: {
    minWidth: 22,
    textAlign: "center",
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  vazioTexto: {
    textAlign: "center",
    marginTop: SPACING.xxl - 8,
    color: COLORS.neutral,
    ...TYPOGRAPHY.body,
  },
  rodapeCarrinho: {
    position: "absolute",
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md + 2,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.lg - 6,
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
    color: COLORS.white,
    ...TYPOGRAPHY.small,
    fontWeight: "600",
  },
  rodapeValor: {
    color: COLORS.white,
    ...TYPOGRAPHY.body,
    fontWeight: "700",
    marginTop: 2,
  },
  rodapeFinalizar: {
    color: COLORS.primary,
    ...TYPOGRAPHY.small,
    fontWeight: "bold",
  },
});