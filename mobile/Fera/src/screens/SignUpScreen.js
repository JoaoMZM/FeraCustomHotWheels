import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

export default function SignUpScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  function handleCriarConta() {
    if (!nome || !email || !senha) {
      alert('Preencha todos os campos');
      return;
    }

    if (!aceitouTermos) {
      alert('Você precisa aceitar os Termos de Uso e a Política de Privacidade');
      return;
    }

    console.log('Cadastro:', nome, email, senha);

    Alert.alert('Sucesso', 'Conta cadastrada com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../screens/assets/pjj.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.titulo}>FeraCustom</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#6E6E6E"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#6E6E6E"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#6E6E6E"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={aceitouTermos}
          onValueChange={setAceitouTermos}
          color={aceitouTermos ? '#D50000' : undefined}
          style={styles.checkbox}
        />
        <Text style={styles.checkboxTexto}>
          Eu concordo com os Termos de Uso e Política de Privacidade
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleCriarConta} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111111',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6E6E6E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111111',
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
    marginTop: 2,
  },
  checkboxTexto: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#111111',
  },
  botao: {
    backgroundColor: '#D50000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  textoBotao: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  link: {
    color: '#D50000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});