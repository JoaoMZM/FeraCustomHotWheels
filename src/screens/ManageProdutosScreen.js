import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManageProductsScreen({ navigation }) {
  const [produtos, setProdutos] = useState(PRODUTOS_MOCK);

  function irParaNovoProduto() {
    navigation?.navigate("EditProduct", {
      onSalvar: adicionarOuAtualizarProduto,
    });
  }

  function irParaEdicao(produto) {
    navigation?.navigate("EditProduct", {
      produto,
      onSalvar: adicionarOuAtualizarProduto,
    });
  }

  function adicionarOuAtualizarProduto(produto) {
    setProdutos((prev) => {
      const existe = prev.some((p) => p.id_produto === produto.id_produto);
      if (existe) {
        return prev.map((p) =>
          p.id_produto === produto.id_produto ? produto : p
        );
      }
      return [...prev, { ...produto, id_produto: String(Date.now()) }];
    });
  }

  function confirmarExclusao(produto) {
    Alert.alert(
      "Excluir produto",
      `Tem certeza que deseja excluir "${produto.nome_produto}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirProduto(produto.id_produto),
        },
      ]
    );
  }

  function excluirProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id_produto !== id));
  }

  function renderProduto({ item }) {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.imagem || "https://via.placeholder.com/150" }}
          style={styles.imagem}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.nomeProduto}>{item.nome_produto}</Text>
          <Text style={styles.precoProduto}>
            R$ {Number(item.preco_produto).toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.estoqueProduto}>
            Estoque: {item.estoque_produto}
          </Text>
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity
            style={styles.botaoEditar}
            activeOpacity={0.7}
            onPress={() => irParaEdicao(item)}
          >
            <Text style={styles.botaoEditarTexto}>✎</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            activeOpacity={0.7}
            onPress={() => confirmarExclusao(item)}
          >
            <Text style={styles.botaoExcluirTexto}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.voltar}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <View style={styles.headerLinha}>
          <Text style={styles.titulo}>Produtos</Text>
          <TouchableOpacity
            style={styles.botaoNovoProduto}
            activeOpacity={0.85}
            onPress={irParaNovoProduto}
          >
            <Text style={styles.botaoNovoProdutoTexto}>+ Novo produto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id_produto}
        renderItem={renderProduto}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>Nenhum produto cadastrado</Text>
        }
      />
    </SafeAreaView>
  );
}

const PRODUTOS_MOCK = [
  {
    id_produto: "1",
    nome_produto: "Camiseta Básica",
    preco_produto: 49.9,
    estoque_produto: 12,
    categoria: "Acessórios",
    cor: "",
    modelo: "",
    limitado: false,
    imagem: "https://via.placeholder.com/150",
  },
  {
    id_produto: "2",
    nome_produto: "Calça Jeans",
    preco_produto: 129.9,
    estoque_produto: 5,
    categoria: "Acessórios",
    cor: "",
    modelo: "",
    limitado: false,
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
  voltar: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  headerLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    ...TYPOGRAPHY.h3,
    color: COLORS.secondary,
  },
  botaoNovoProduto: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md - 2,
    paddingVertical: SPACING.xs + 2,
  },
  botaoNovoProdutoTexto: {
    color: COLORS.white,
    ...TYPOGRAPHY.small,
    fontWeight: "700",
  },
  listaContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
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
  estoqueProduto: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral,
    marginTop: 2,
  },
  acoesContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  botaoEditar: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEditarTexto: {
    color: COLORS.neutral,
    fontSize: 16,
  },
  botaoExcluir: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.lg,
    backgroundColor: "#FDECEA",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoExcluirTexto: {
    fontSize: 15,
  },
  vazioTexto: {
    textAlign: "center",
    marginTop: SPACING.xxl - 8,
    color: COLORS.neutral,
    ...TYPOGRAPHY.body,
  },
});