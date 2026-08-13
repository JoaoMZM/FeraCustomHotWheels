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
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [contasCadastradas, setContasCadastradas] = useState([]);

  function handleLogin() {
    if (!email || !senha) {
      alert('Preencha e-mail e senha');
      return;
    }
    if (!aceitouTermos) {
      alert('Você precisa aceitar os termos para continuar');
      return;
    }

    const jaExiste = contasCadastradas.includes(email);

    if (!jaExiste) {
      setContasCadastradas((prev) => [...prev, email]);
      Alert.alert('Sucesso', 'Conta cadastrada com sucesso!');
    } else {
      console.log('Login:', email, senha);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../screens/assets/png.jpg')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.titulo}>FeraCustom</Text>

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

      <View style={styles.linhaCheckbox}>
        <Checkbox
          value={aceitouTermos}
          onValueChange={setAceitouTermos}
          color={aceitouTermos ? '#D50000' : undefined}
        />
        <Text style={styles.textoCheckbox}>
          Eu concordo com os Termos de Uso e Política de Privacidade
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkEsqueciSenha}>
        <Text style={styles.textoLink}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <View style={styles.linhaCriarConta}>
        <Text style={styles.textoCriarContaMsg}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.textoCriarConta}>Criar conta</Text>
        </TouchableOpacity>
      </View>
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
    width: 120,
    height: 120,
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
  linhaCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  textoCheckbox: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6E6E6E',
  },
  botao: {
    backgroundColor: '#D50000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
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
  linkEsqueciSenha: {
    marginTop: 16,
    alignItems: 'center',
  },
  textoLink: {
    color: '#D50000',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  linhaCriarConta: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  textoCriarContaMsg: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6E6E6E',
  },
  textoCriarConta: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#D50000',
  },
});