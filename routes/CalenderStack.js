import { createStackNavigator } from 'react-navigation-stack';
import {Calenderup} from '../screen/Calenderup';


const screens = {
  
  Calenderup: {
    screen: Calenderup,
    navigationOptions: {
      title: ' Calendrier',
    }
    
  }
  
};

// home stack navigator screens
const CalenderStack = createStackNavigator(screens);

export default CalenderStack;