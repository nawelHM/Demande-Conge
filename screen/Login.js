import React, { useState } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../redux/user/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from '../axios';

const Login = () => {
  const navigation = useNavigation();
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  const [incorrectLogin, setIncorrectLogin] = useState(false); // New state for incorrect login

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (form.email === '') {
      isValid = false;
      errors.email = 'L\'adresse e-mail est requise.';
    } else if (!isValidEmail(form.email)) {
      isValid = false;
      errors.email = 'Veuillez entrer une adresse e-mail valide.';
    }

    if (form.password === '') {
      isValid = false;
      errors.password = 'Le mot de passe est requis.';
    } else if (form.password.length < 8) {
      isValid = false;
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    setError(errors);
    return isValid;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginPress = () => {
    if (!validateForm()) {
      return;
    }

    setIncorrectLogin(false); // Reset incorrectLogin state

    axios
      .post('login', form)
      .then(({ data }) => {
        console.log('Réponse de l\'API de connexion :', data);

        // Enregistrer le jeton d'accès dans AsyncStorage
        AsyncStorage.setItem('access_token', data.access_token)
          .then(() => {
            // Récupérer le jeton d'accès depuis AsyncStorage pour vérification
            AsyncStorage.getItem('access_token')
              .then((accessToken) => {
                console.log('Jeton d\'accès enregistré avec succès :', accessToken);
                // Maintenant, naviguer vers l'écran d'accueil
                navigation.navigate(' '); 
              })
              .catch((error) => {
                console.error('Erreur lors de la récupération du jeton d\'accès :', error.message);
              });
          })
          .catch((error) => {
            console.error('Erreur lors de l\'enregistrement du jeton d\'accès :', error.message);
          });
      })
      .catch((err) => {
        console.error('Erreur lors de la requête API de connexion :', err.message);
        setIncorrectLogin(true); // Set incorrectLogin to true on error
      });
  };

  const handleRegisterPress = () => {
    // Effectuer la logique d'inscription ici

    // Naviguer vers le composant d'inscription
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <View style={styles.inputContainer}>
            <Text>Adresse e-mail :</Text>
            <TextInput
              onChangeText={(text) => setForm((prevForm) => ({ ...prevForm, email: text }))}
              placeholder="Adresse e-mail"
              style={styles.input}
            />
            <Text style={{ color: 'red' }}>{error.email}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text>Mot de passe :</Text>
            <TextInput
              onChangeText={(text) => setForm((prevForm) => ({ ...prevForm, password: text }))}
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
            />
            <Text style={{ color: 'red' }}>{error.password}</Text>
          </View>

          {incorrectLogin && ( // Display error message for incorrect login
            <Text style={{ color: 'red', textAlign: 'center' }}>
              L'adresse e-mail ou le mot de passe est incorrect.
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegisterPress} style={styles.register}>
              <Text style={styles.regis}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  register: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  regis: {
    fontWeight: 'bold',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    backgroundColor: '#e6e6e6',
    padding: 7,
    borderRadius: 6,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#151530',
    padding: 7,
    borderRadius: 6,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {},
});

export default Login;
