import { createStackNavigator } from 'react-navigation-stack';
import About from '../screen/About';


const screens = {
  
  About: {
    screen: About,
    navigationOptions: {
      title: ' A propos',
    }
    
  }
  
};

// home stack navigator screens
const AboutStack = createStackNavigator(screens);

export default AboutStack;