import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  function handleEnviar() {
    console.log('Enviar recuperação para:', email);
    alert('Se o e-mail existir, enviaremos as instruções.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../screens/assets/png.jpg')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.titulo}>Esqueci minha senha</Text>
      <Text style={styles.subtitulo}>
        Digite seu e-mail para receber o link de redefinição
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#6E6E6E"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.botao} onPress={handleEnviar} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Voltar para o login</Text>
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
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6E6E6E',
    textAlign: 'center',
    marginBottom: 24,
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