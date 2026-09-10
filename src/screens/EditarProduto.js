import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";

// Lista de categorias mockada — depois deve vir da API (tabela Categorias)
const CATEGORIAS_MOCK = ["Miniaturas", "Rodas", "Acessórios", "Customizados"];

export default function EditProductScreen({ navigation, route }) {
  // Produto recebido por navegação (edição) ou objeto vazio (cadastro novo)
  const produtoExistente = route?.params?.produto || null;

  const [nome, setNome] = useState(produtoExistente?.nome_produto || "");
  const [descricao, setDescricao] = useState(
    produtoExistente?.descricao_produto || ""
  );
  const [preco, setPreco] = useState(
    produtoExistente ? String(produtoExistente.preco_produto) : ""
  );
  const [estoque, setEstoque] = useState(
    produtoExistente ? String(produtoExistente.estoque_produto) : ""
  );
  const [categoria, setCategoria] = useState(
    produtoExistente?.categoria || CATEGORIAS_MOCK[0]
  );
  const [cor, setCor] = useState(produtoExistente?.cor || "");
  const [modelo, setModelo] = useState(produtoExistente?.modelo || "");
  const [limitado, setLimitado] = useState(
    produtoExistente?.limitado || false
  );
  const [imagemUrl, setImagemUrl] = useState(produtoExistente?.imagem || "");

  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do produto";
    if (!preco.trim() || isNaN(Number(preco.replace(",", "."))))
      novosErros.preco = "Informe um preço válido";
    if (!estoque.trim() || isNaN(Number(estoque)))
      novosErros.estoque = "Informe uma quantidade válida";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSalvar() {
    if (!validar()) return;

    const produtoAtualizado = {
      id_produto: produtoExistente?.id_produto ?? null,
      nome_produto: nome.trim(),
      descricao_produto: descricao.trim(),
      preco_produto: Number(preco.replace(",", ".")),
      estoque_produto: Number(estoque),
      categoria,
      cor: cor.trim(),
      modelo: modelo.trim(),
      limitado,
      imagem: imagemUrl.trim(),
    };

    console.log("Produto salvo:", produtoAtualizado);

    if (typeof route?.params?.onSalvar === "function") {
      route.params.onSalvar(produtoAtualizado);
    }

    Alert.alert(
      "Sucesso",
      produtoExistente
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!",
      [{ text: "OK", onPress: () => navigation?.goBack() }]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.voltar}>{"< Voltar"}</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>
            {produtoExistente ? "Editar Produto" : "Novo Produto"}
          </Text>
        </View>

        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: imagemUrl || "https://via.placeholder.com/150",
            }}
            style={styles.imagemPreview}
          />
        </View>

        <Text style={styles.label}>URL da imagem</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={COLORS.neutral}
          value={imagemUrl}
          onChangeText={setImagemUrl}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nome do produto *</Text>
        <TextInput
          style={[styles.input, erros.nome && styles.inputErro]}
          placeholder="Ex: Hot Wheels Custom GT"
          placeholderTextColor={COLORS.neutral}
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Detalhes do produto..."
          placeholderTextColor={COLORS.neutral}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
        />

        <View style={styles.linha}>
          <View style={styles.colunaMetade}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <TextInput
              style={[styles.input, erros.preco && styles.inputErro]}
              placeholder="0,00"
              placeholderTextColor={COLORS.neutral}
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
            />
            {erros.preco && (
              <Text style={styles.textoErro}>{erros.preco}</Text>
            )}
          </View>

          <View style={styles.colunaMetade}>
            <Text style={styles.label}>Estoque *</Text>
            <TextInput
              style={[styles.input, erros.estoque && styles.inputErro]}
              placeholder="0"
              placeholderTextColor={COLORS.neutral}
              value={estoque}
              onChangeText={setEstoque}
              keyboardType="number-pad"
            />
            {erros.estoque && (
              <Text style={styles.textoErro}>{erros.estoque}</Text>
            )}
          </View>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriasContainer}>
          {CATEGORIAS_MOCK.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chipCategoria,
                categoria === item && styles.chipCategoriaAtiva,
              ]}
              onPress={() => setCategoria(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipTexto,
                  categoria === item && styles.chipTextoAtivo,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.linha}>
          <View style={styles.colunaMetade}>
            <Text style={styles.label}>Cor</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Vermelho"
              placeholderTextColor={COLORS.neutral}
              value={cor}
              onChangeText={setCor}
            />
          </View>

          <View style={styles.colunaMetade}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: GT-40"
              placeholderTextColor={COLORS.neutral}
              value={modelo}
              onChangeText={setModelo}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxLinha}
          activeOpacity={0.8}
          onPress={() => setLimitado((prev) => !prev)}
        >
          <Checkbox
            value={limitado}
            onValueChange={setLimitado}
            color={limitado ? COLORS.primary : undefined}
          />
          <Text style={styles.checkboxTexto}>Edição limitada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSalvar}
          activeOpacity={0.9}
          onPress={handleSalvar}
        >
          <Text style={styles.botaoSalvarTexto}>
            {produtoExistente ? "Salvar alterações" : "Cadastrar produto"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoCancelar}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: "#D50000",
  secondary: "#111111",
  neutral: "#6E6E6E",
  background: "#F5F5F5",
  white: "#FFFFFF",
  border: "#E0E0E0",
  success: "#2E7D32",
  error: "#D50000",
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
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 17,
  pill: 999,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  voltar: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  titulo: {
    ...TYPOGRAPHY.h3,
    color: COLORS.secondary,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  imagemPreview: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.secondary,
    fontWeight: "600",
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
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
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  inputErro: {
    borderColor: COLORS.error,
  },
  textoErro: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  linha: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  colunaMetade: {
    flex: 1,
  },
  categoriasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  chipCategoria: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  chipCategoriaAtiva: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipTexto: {
    ...TYPOGRAPHY.small,
    color: COLORS.secondary,
  },
  chipTextoAtivo: {
    color: COLORS.white,
    fontWeight: "600",
  },
  checkboxLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  checkboxTexto: {
    ...TYPOGRAPHY.body,
    color: COLORS.secondary,
  },
  botaoSalvar: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md - 2,
    alignItems: "center",
    marginTop: SPACING.xl - 8,
  },
  botaoSalvarTexto: {
    color: COLORS.white,
    ...TYPOGRAPHY.body,
    fontWeight: "700",
  },
  botaoCancelar: {
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  botaoCancelarTexto: {
    color: COLORS.neutral,
    ...TYPOGRAPHY.body,
    fontWeight: "600",
  },
});