import React , {useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import Home from './screen/Home';
import Login from './screen/Login';
import RestRequirment from './screen/RestRequirment';
import Calenderup  from './screen/Calenderup';
import 'react-native-gesture-handler';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Details from './src/Stack/Details';
import Home2 from './screen/Home2';
import Notifuser from './screen/Notifuser';
import Profileuser from './screen/Profileuser';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Register from './screen/Register';
import welcome from './screen/welcome';
import ButomNavigation from './ButomNavigation';
import { StatusBar } from 'expo-status-bar';
import {Provider} from 'react-redux';
import { Store, store } from './redux/store';
import Editprofile from './screen/Editprofile';
import {BlurView} from "expo-blur";
import About from './screen/About';
//import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity , ScrollView , View} from 'react-native';
import Header from './screen/Header';
import Settings from './screen/Settings';
import Listuser from './screen/Listuser';
import Role from './screen/Role';
import Historique from './screen/Historique';
import DemandeDetails from './screen/DemandeDetails';
import Repport from './screen/Repport';
import Comment from './screen/Comment';
import ListComment from './screen/ListComment';
const Tab= createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
/* function TabNavigator(){
  return(
    <Tab.Navigator>
      
      <Tab.Screen name='Home' component={StackNavigator}  options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}  />
      
      <Tab.Screen name='home2' component={Home2} />
      <Tab.Screen name='notification' component={Notifuser}  options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications" size={size} color={color} />
          ),
        }} />
      <Tab.Screen
        name='profile'
        component={Profileuser}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
     <Tab.Screen
        name='welcome'
        component={welcome}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
 function StackNavigator(){
  return(
    <Stack.Navigator initialRouteName=" " screenOptions={{headerShown : false}}>
      <Stack.Screen name=" " component={Login}  />
      <Stack.Screen name='Home' component={Home} options={{ tabBarStyme:{display:'none'}}} />
      <Stack.Screen name='Details' component={Details}  />
      <Stack.Screen name="Calenderup" component={Calenderup}  />
      <Stack.Screen name="home2" component={Home2} />
      <Stack.Screen name='notification' component={Notifuser } />
      <Stack.Screen name='profile' component={Profileuser} />

      <Stack.Screen name='Welcome' component={welcome} />
    </Stack.Navigator>
  )
}*/
export default  function App() {
  return (
    <Provider store={store}>
    <NavigationContainer >
  
      <StatusBar backgroundColor='#fff' barStyle="dark-content" />
       <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name=" " component={ButomNavigation}  />
        <Stack.Screen name="RestRequirment" component={RestRequirment} />
        <Stack.Screen name="Calenderup" component={Calenderup} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Editprofile' component={Editprofile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Listuser" component={Listuser} />
        <Stack.Screen name="Role" component={Role} />
        <Stack.Screen name="Historique" component={Historique} />   
        <Stack.Screen name="DemandeDetails" component={DemandeDetails} />  
        <Stack.Screen name="Notifuser" component={Notifuser} />  
        <Stack.Screen name="Repport" component={Repport} />  
        <Stack.Screen name="Comment" component={Comment} />
        <Stack.Screen name="ListComment" component={ListComment} />  
            
      </Stack.Navigator>
      {/* <TabNavigator/>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RestRequirment" component={RestRequirment} />
        <Stack.Screen name="Calenderup" component={Calenderup} />
        
      </Stack.Navigator> */}
    </NavigationContainer>
    </Provider>
  );
}


