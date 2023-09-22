import { createStackNavigator } from 'react-navigation-stack';
import Profileuser from '../screen/Profileuser';

const screens = {
  Profileuser: {
    screen: Profileuser,
  }
};

// home stack navigator screens
const profileStack = createStackNavigator(screens);

export default profileStack;
