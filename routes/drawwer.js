import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack from './HomeStack';
import AboutStack from './AboutStack';
import NotifStack from './NotifStack';
import CalenderStack from './CalenderStack'; // Correctly import the component

const RootDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack,
  },
  About: {
    screen: AboutStack,
  },
  Calenderup: {
    screen: CalenderStack, // Use the imported component here
  },
  Notif: {
    screen: NotifStack,
  },
  // ...other routes
});

export default createAppContainer(RootDrawerNavigator);
