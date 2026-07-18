/*import {Vibration, Platform} from 'react-native';


export const vibrate = () => {
  // Simple haptic feedback duration
  const DURATION = 400;

  if (Platform.OS === 'android') {
    Vibration.vibrate(DURATION);
  } else {
    Vibration.vibrate();
  }
};*/
import {Vibration, Platform} from 'react-native';

export const vibrate = () => {
  const DURATION = 400;
  if (Platform.OS === 'android') {
    Vibration.vibrate(DURATION);
  } else {
    Vibration.vibrate();
  }
};

export default vibrate; // ✅ Add this line
