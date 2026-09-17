import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';

/* ------------------------------------------------------------------
 * Design System — Fera Custom
 * Tokens centralizados. Qualquer ajuste de marca acontece só aqui.
 * ------------------------------------------------------------------ */

const colors = {
  primary: '#D50000',
  secondary: '#111111',
  neutral: '#6E6E6E',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E6E6E6',
  success: '#2E7D32',
  warning: '#B26A00',
};

// Poppins = títulos e números. Inter = texto corrido e rótulos.
// Carregue as famílias com expo-font (ou react-native.config.js) antes de montar a tela.
const fonts = {
  displayBold: 'Poppins-Bold',
  displaySemiBold: 'Poppins-SemiBold',
  displayMedium: 'Poppins-Medium',
  bodyRegular: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
};

// Escala de espaçamento: múltiplos de 8 (com o 4 para ajustes finos).
const space = { xxs: 4, xs: 8, sm: 16, md: 24, lg: 32, xl: 48 };

const radius = { sm: 8, md: 12, pill: 999 };

const shadowSmall = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: { elevation: 2 },
});

/* ------------------------------------------------------------------ */

const MOCK_PRODUTOS = [
  {
    id_produto: 'p0000000-0000-0000-0000-000000000002',
    nome: 'Nissan Skyline GT-R R34',
    modelo: 'Fast & Furious Series',
    cor: 'Azul Bayside',
    preco: 89.9,
    estoque: 15,
    limitado: true,
    ativo: true,
    imagem_produto: null,
  },
  {
    id_produto: 'p0000000-0000-0000-0000-000000000003',
    nome: 'Nissan Skyline GT-R R34',
    modelo: 'Fast & Furious Series',
    cor: 'Azul Bayside',
    preco: 89.9,
    estoque: 3,
    limitado: true,
    ativo: true,
    imagem_produto:
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200',
  },
  {
    id_produto: 'p0000000-0000-0000-0000-000000000004',
    nome: 'Ford Mustang Boss 302',
    modelo: 'Muscle Mania',
    cor: 'Amarelo Racing',
    preco: 59.9,
    estoque: 42,
    limitado: false,
    ativo: true,
    imagem_produto: null,
  },
  {
    id_produto: 'p0000000-0000-0000-0000-000000000005',
    nome: 'Lamborghini Huracán',
    modelo: 'Exotic Line',
    cor: 'Verde Neon',
    preco: 74.5,
    estoque: 0,
    limitado: true,
    ativo: false,
    imagem_produto: null,
  },
];

const LOW_STOCK_THRESHOLD = 5;

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function StatusEstoque({ estoque }) {
  let label = 'Em estoque';
  let color = colors.success;

  if (estoque === 0) {
    label = 'Esgotado';
    color = colors.primary;
  } else if (estoque <= LOW_STOCK_THRESHOLD) {
    label = 'Estoque baixo';
    color = colors.warning;
  }

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function ProdutoCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, !item.ativo && styles.cardInativo]}
      activeOpacity={0.9}
      onPress={() => onPress && onPress(item)}
    >
      <View style={styles.thumbWrapper}>
        {item.imagem_produto ? (
          <Image source={{ uri: item.imagem_produto }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Text style={styles.thumbPlaceholderText}>🏎️</Text>
          </View>
        )}
        {item.limitado ? (
          <View style={styles.limitedTag}>
            <Text style={styles.limitedTagText}>Ltd</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardNome} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.cardModelo} numberOfLines={1}>
          {item.modelo}, {item.cor}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.cardPreco}>{formatarPreco(item.preco)}</Text>
          <StatusEstoque estoque={item.estoque} />
        </View>
      </View>

      <View style={styles.qtyWrapper}>
        <Text style={styles.qtyValue}>{item.estoque}</Text>
        <Text style={styles.qtyLabel}>un.</Text>
      </View>
    </TouchableOpacity>
  );
}

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'baixo', label: 'Estoque baixo' },
  { key: 'esgotado', label: 'Esgotados' },
  { key: 'limitado', label: 'Edição limitada' },
];

export default function EstoqueScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  const produtosFiltrados = useMemo(() => {
    return MOCK_PRODUTOS.filter((p) => {
      const bateBusca =
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.modelo.toLowerCase().includes(busca.toLowerCase());

      if (!bateBusca) return false;

      switch (filtroAtivo) {
        case 'baixo':
          return p.estoque > 0 && p.estoque <= LOW_STOCK_THRESHOLD;
        case 'esgotado':
          return p.estoque === 0;
        case 'limitado':
          return p.limitado;
        default:
          return true;
      }
    });
  }, [busca, filtroAtivo]);

  const totalItens = MOCK_PRODUTOS.reduce((acc, p) => acc + p.estoque, 0);
  const totalEsgotados = MOCK_PRODUTOS.filter((p) => p.estoque === 0).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        {navigation && navigation.goBack ? (
          <TouchableOpacity
            style={styles.botaoVoltar}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text style={styles.botaoVoltarTexto}>←</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.headerTextos}>
          <Text style={styles.headerTitle}>Estoque</Text>
          <Text style={styles.headerSubtitle}>Fera Custom</Text>
        </View>
      </View>

      {/* Resumo rápido */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{MOCK_PRODUTOS.length}</Text>
          <Text style={styles.summaryLabel}>Produtos</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{totalItens}</Text>
          <Text style={styles.summaryLabel}>Unidades</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, totalEsgotados > 0 && styles.summaryAlert]}>
            {totalEsgotados}
          </Text>
          <Text style={styles.summaryLabel}>Esgotados</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou modelo"
          placeholderTextColor={colors.neutral}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const ativo = filtroAtivo === item.key;
            return (
              <TouchableOpacity
                style={[styles.filterChip, ativo && styles.filterChipAtivo]}
                activeOpacity={0.8}
                onPress={() => setFiltroAtivo(item.key)}
              >
                <Text style={[styles.filterChipText, ativo && styles.filterChipTextAtivo]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id_produto}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProdutoCard
            item={item}
            onPress={(produto) =>
              navigation && navigation.navigate
                ? navigation.navigate('EditProduct', { produto })
                : null
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nada por aqui</Text>
            <Text style={styles.emptyStateText}>
              Ajuste a busca ou o filtro para ver outros produtos.
            </Text>
          </View>
        }
      />

      {/* Adicionar produto */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() =>
          navigation && navigation.navigate ? navigation.navigate('EditProduct') : null
        }
        accessibilityRole="button"
        accessibilityLabel="Adicionar produto"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  headerTextos: {
    flex: 1,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.sm,
    ...shadowSmall,
  },
  botaoVoltarTexto: {
    color: colors.secondary,
    fontSize: 20,
    fontFamily: fonts.displayMedium,
    marginTop: -2,
  },
  headerTitle: {
    color: colors.secondary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fonts.displayBold,
  },
  headerSubtitle: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    marginTop: space.xxs,
  },

  /* Resumo */
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: space.md,
    marginTop: space.sm,
    marginBottom: space.md,
    gap: space.xs,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: space.sm,
    alignItems: 'center',
    ...shadowSmall,
  },
  summaryValue: {
    color: colors.secondary,
    fontSize: 24,
    fontFamily: fonts.displaySemiBold,
  },
  summaryAlert: {
    color: colors.primary,
  },
  summaryLabel: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    marginTop: space.xxs,
  },

  /* Busca */
  searchWrapper: {
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm - 2,
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.bodyRegular,
    borderWidth: 1,
    borderColor: colors.border,
  },

  /* Filtros */
  filterWrapper: {
    marginBottom: space.sm,
  },
  filterList: {
    paddingHorizontal: space.md,
    gap: space.xs,
  },
  filterChip: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
  },
  filterChipTextAtivo: {
    color: colors.surface,
    fontFamily: fonts.bodySemiBold,
  },

  /* Lista */
  list: {
    paddingHorizontal: space.md,
    paddingBottom: 96,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.sm,
    marginBottom: space.xs + space.xxs,
    alignItems: 'center',
    ...shadowSmall,
  },
  cardInativo: {
    opacity: 0.5,
  },
  thumbWrapper: {
    position: 'relative',
    marginRight: space.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholderText: {
    fontSize: 24,
  },
  limitedTag: {
    position: 'absolute',
    bottom: -space.xxs,
    right: -space.xxs,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxs + 2,
    paddingVertical: 1,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  limitedTagText: {
    color: colors.surface,
    fontSize: 10,
    fontFamily: fonts.bodySemiBold,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.displayMedium,
  },
  cardModelo: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space.xs,
    gap: space.xs,
  },
  cardPreco: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.displaySemiBold,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: space.xxs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  qtyWrapper: {
    alignItems: 'center',
    marginLeft: space.xs,
    minWidth: 40,
  },
  qtyValue: {
    color: colors.secondary,
    fontSize: 20,
    fontFamily: fonts.displaySemiBold,
  },
  qtyLabel: {
    color: colors.neutral,
    fontSize: 12,
    fontFamily: fonts.bodyRegular,
  },

  /* Estado vazio */
  emptyState: {
    alignItems: 'center',
    marginTop: space.xl,
    paddingHorizontal: space.md,
  },
  emptyStateTitle: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.displayMedium,
  },
  emptyStateText: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    textAlign: 'center',
    marginTop: space.xxs,
  },

  /* Ação principal */
  fab: {
    position: 'absolute',
    right: space.md,
    bottom: space.md,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: {
    color: colors.surface,
    fontSize: 28,
    fontFamily: fonts.displayMedium,
    marginTop: -2,
  },
});