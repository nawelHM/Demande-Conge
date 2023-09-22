import { createStackNavigator } from 'react-navigation-stack';
import Notifuser from '../screen/Notifuser';

const screens = {
  Notifuser: {
    screen: Notifuser,
  }
};

// home stack navigator screens
const NotifStack = createStackNavigator(screens);

export default NotifStack;
