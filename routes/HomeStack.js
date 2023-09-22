import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screen/Home';
import RestRequirment from '../screen/RestRequirment';
import Calenderup from '../screen/Calenderup'; // Fix the import statement
import Notifuser from '../screen/Notifuser';
import Profileuser from '../screen/Profileuser';

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
    }
  },
  RestRequirment: {
    screen: RestRequirment,
    navigationOptions: {
      title: 'Demande de congé',
    }
  },
  Calenderup: {
    screen: Calenderup,
    navigationOptions: {
      title: 'Calendrier des jours férier',
    }
  },
  Notifuser: {
    screen: Notifuser,
    navigationOptions: {
      title: 'Notification',
    }
  },
  Profileuser: {
    screen: Profileuser,
    navigationOptions: {
      title: 'Profile',
    }
  }
};

// home stack navigator screens
const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#eee', height: 60 }
  }
});

export default HomeStack;
