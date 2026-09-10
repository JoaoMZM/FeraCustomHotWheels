import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';

// Se você usa navegação (React Navigation), receba a prop navigation
export default function ConifgUsuario({ navigation }) {
  // ---- Estado do perfil ----
  const [nome, setNome] = useState('Meu Nome');
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(nome);

  // ---- Estado dos endereços ----
  const [enderecos, setEnderecos] = useState([
    { id: '1', descricao: 'Rua Exemplo, 123 - Centro' },
  ]);
  const [novoEndereco, setNovoEndereco] = useState('');
  const [editandoEnderecoId, setEditandoEnderecoId] = useState(null);
  const [enderecoTemp, setEnderecoTemp] = useState('');

  // ---- Controle de alterações não salvas ----
  const [hasChanges, setHasChanges] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // ---- Funções: Nome ----
  function salvarNome() {
    if (nomeTemp.trim().length === 0) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    setNome(nomeTemp.trim());
    setEditandoNome(false);
    setHasChanges(true);
  }

  // ---- Funções: Endereços ----
  function adicionarEndereco() {
    if (novoEndereco.trim().length === 0) return;
    const novo = { id: Date.now().toString(), descricao: novoEndereco.trim() };
    setEnderecos((atual) => [...atual, novo]);
    setNovoEndereco('');
    setHasChanges(true);
  }

  function iniciarEdicaoEndereco(item) {
    setEditandoEnderecoId(item.id);
    setEnderecoTemp(item.descricao);
  }

  function salvarEdicaoEndereco(id) {
    if (enderecoTemp.trim().length === 0) {
      Alert.alert('Atenção', 'O endereço não pode ficar vazio.');
      return;
    }
    setEnderecos((atual) =>
      atual.map((e) => (e.id === id ? { ...e, descricao: enderecoTemp.trim() } : e))
    );
    setEditandoEnderecoId(null);
    setHasChanges(true);
  }

  function removerEndereco(id) {
    Alert.alert('Remover endereço', 'Tem certeza que deseja remover este endereço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          setEnderecos((atual) => atual.filter((e) => e.id !== id));
          setHasChanges(true);
        },
      },
    ]);
  }

  // ---- Função: Voltar ----
  function voltar() {
    if (hasChanges) {
      Alert.alert(
        'Alterações não salvas',
        'Você tem alterações não salvas. Deseja sair sem salvar?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          {
            text: 'Sair sem salvar',
            style: 'destructive',
            onPress: () => navigation && navigation.goBack(),
          },
        ]
      );
      return;
    }
    if (navigation) {
      navigation.goBack();
    }
  }

  // ---- Função: Salvar tudo e voltar ----
  async function salvarESairTela() {
    setSalvando(true);
    try {
      // TODO: chame aqui suas APIs reais de persistência, por exemplo:
      // await api.put('/usuario/nome', { nome });
      // await api.put('/usuario/enderecos', { enderecos });

      setHasChanges(false);
      if (navigation) {
        navigation.goBack();
      }
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  // ---- Função: Logout ----
  function sairDaConta() {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          // TODO: limpar token/dados do usuário (ex: AsyncStorage.removeItem('token'))
          // TODO: navegar para tela de login
          if (navigation) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* ---- Cabeçalho com botão Voltar ---- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text style={styles.botaoVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Configurações do Usuário</Text>
        <View style={styles.headerEspaco} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ---- Seção: Nome do Perfil ---- */}
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>Nome de Perfil</Text>

          {editandoNome ? (
            <View style={styles.linha}>
              <TextInput
                style={styles.input}
                value={nomeTemp}
                onChangeText={setNomeTemp}
                placeholder="Digite seu nome"
                placeholderTextColor="#888"
                autoFocus
              />
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarNome}>
                <Text style={styles.botaoTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.linha}>
              <Text style={styles.valorTexto}>{nome}</Text>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => {
                  setNomeTemp(nome);
                  setEditandoNome(true);
                }}
              >
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ---- Seção: Endereços ---- */}
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>Meus Endereços</Text>

          <FlatList
            data={enderecos}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.enderecoItem}>
                {editandoEnderecoId === item.id ? (
                  <View style={styles.linha}>
                    <TextInput
                      style={styles.input}
                      value={enderecoTemp}
                      onChangeText={setEnderecoTemp}
                      autoFocus
                    />
                    <TouchableOpacity
                      style={styles.botaoSalvar}
                      onPress={() => salvarEdicaoEndereco(item.id)}
                    >
                      <Text style={styles.botaoTexto}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.linha}>
                    <Text style={styles.valorTexto}>{item.descricao}</Text>
                    <View style={styles.acoes}>
                      <TouchableOpacity
                        style={styles.botaoEditar}
                        onPress={() => iniciarEdicaoEndereco(item)}
                      >
                        <Text style={styles.botaoTexto}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.botaoRemover}
                        onPress={() => removerEndereco(item.id)}
                      >
                        <Text style={styles.botaoTexto}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>Nenhum endereço cadastrado.</Text>
            }
          />

          <View style={styles.linhaAdicionar}>
            <TextInput
              style={styles.input}
              value={novoEndereco}
              onChangeText={setNovoEndereco}
              placeholder="Adicionar novo endereço"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarEndereco}>
              <Text style={styles.botaoTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Botão de Sair da Conta ---- */}
        <TouchableOpacity style={styles.botaoSair} onPress={sairDaConta}>
          <Text style={styles.botaoSairTexto}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---- Barra inferior: só aparece se houver alterações não salvas ---- */}
      {hasChanges && (
        <View style={styles.barraSalvar}>
          <TouchableOpacity
            style={styles.botaoSalvarTudo}
            onPress={salvarESairTela}
            disabled={salvando}
          >
            <Text style={styles.botaoSalvarTudoTexto}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  botaoVoltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  botaoVoltarTexto: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  headerEspaco: {
    width: 36,
  },
  titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linhaAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
    color: '#222',
  },
  valorTexto: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  acoes: {
    flexDirection: 'row',
  },
  botaoEditar: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoRemover: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  botaoAdicionar: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  enderecoItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  vazioTexto: {
    color: '#999',
    fontStyle: 'italic',
  },
  botaoSair: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoSairTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  barraSalvar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  botaoSalvarTudo: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoSalvarTudoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});