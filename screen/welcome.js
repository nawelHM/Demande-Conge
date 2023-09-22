import { StyleSheet, Text, View , Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const welcome = () => {
  return (
   <SafeAreaView style={{ flex:1 , backgroundColor:'#fff'}}>
    <View style={{height:.400}}>
        <Image style={{width:"90%" , resizeMode:'center' , resizeMode:'contain', top:-300,}} source={require('../assets/welcome.jpg')}/>
    </View>
    <View>
        <Text style={{fontSize:32 , fontWeight:'bold' , textAlign:'left'}}>Bienvenue</Text>
    </View>
    <Text style={{marginTop:20 }}>We helpp you to get fast service</Text>
   </SafeAreaView>
  );
};

export default welcome;

const styles = StyleSheet.create({});