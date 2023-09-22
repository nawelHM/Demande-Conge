import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image  ,TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
export default function AboutStack({navigation}) {
  return (
    <View style={styles.container}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 0,
              marginTop:30
            }}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={'#151530'}
            />
          </TouchableOpacity>
  
      <Text style={styles.title}>Déroulement des congés</Text>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.description}>
        Le déroulement des congés dans notre entreprise suit les dispositions de la convention d'électronique et électricité.
      </Text>
      <Text style={styles.description}>
        Les cadres et dirigeants bénéficient de <Text style={styles.boldText}>21 jours ouvrables de congés payés</Text>, tandis que le personnel d'exécution a droit à <Text style={styles.boldText}>15 jours ouvrables</Text>.
      </Text>
      <Text style={styles.description}>
        Les nouveaux employés sont éligibles aux congés payés <Text style={styles.boldText}>six mois après leur date de prise de fonction</Text>.
      </Text>
      <Text style={styles.description}>
        Les jours fériés conformes à la convention de l'électricité couvrent l'activité de l'entreprise, et en cas de nécessité de service, les travailleurs peuvent bénéficier d'une <Text style={styles.boldText}>majoration de salaire de 100%</Text> pour ces jours.
      </Text>
      <Text style={styles.description}>
        Par ailleurs, des congés spéciaux sont accordés pour des raisons familiales:
      </Text>
      <View style={styles.specialDescriptionContainer}>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Naissance d'un enfant:</Text>
          <Text style={styles.boldText}>2 jours ouvrables</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Décès d'un conjoint:</Text>
          <Text style={styles.boldText}>3 jours ouvrables</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Décès d'un parent (père, mère, fils):</Text>
          <Text style={styles.boldText}>3 jours ouvrables</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Décès d'un frère, d'une sœur, d'un petit-fils, d'une petite-fille, d'un grand-père ou d'une grand-mère:</Text>
          <Text style={styles.boldText}>2 jours ouvrables</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Mariage de l'employé:</Text>
          <Text style={styles.boldText}>3 jours ouvrables</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Mariage d'un enfant:</Text>
          <Text style={styles.boldText}>1 jour ouvrable</Text>
        </View>
        <View style={styles.specialDescriptionItem}>
          <Text style={styles.specialDescriptionItemText}>- Circoncision d'un enfant:</Text>
          <Text style={styles.boldText}>1 jour ouvrable</Text>
        </View>
      </View>
      <Text style={styles.description}>
        En cas de congés spéciaux, l'employé doit fournir les justificatifs de ces événements.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginTop:15
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  specialDescriptionContainer: {
    width: '100%',
    marginTop: 10,
  },
  specialDescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  specialDescriptionItemText: {
    flex: 1,
    fontSize: 18,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  logo: {
    //height: 50,
    //width: 50,
  },
  imageContainer: {
    marginBottom: 20,
    padding: 15,
  },
});
