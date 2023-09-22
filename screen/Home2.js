import React from 'react';
import { SafeAreaView , ScrollView , StatusBar,StyleSheet, Text, View } from 'react-native';

import  Icon from 'react-native-vector-icons/MaterialIcons';
import 'react-native-gesture-handler';
const Home2 = ({navigation}) => {
  return (
    <View>
      <Icon name="favorite" size={30} color="red" />
      <Text>This is a MaterialIcon heart icon.</Text>
    </View>
 
  );
};



const styles = StyleSheet.create({
    header:{
        paddingVertical:15,
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#151530 ', 
    },
    headTitle:{
        color: '#fff',
        fontWeight: 'bold', 
        fontSize:23,
    },
    headTitle1:{
        color: '#fff', 
        fontSize:23,
    },


});
export default Home2;