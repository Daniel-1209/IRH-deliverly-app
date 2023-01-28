import 'react-native-gesture-handler';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './src/contexts/sessionContex';
import Navigation from './src/navigation/Navigation';
import {getBeneficiariesFromDeliveryList} from './src/Apis/lists';
import NetInfo from '@react-native-community/netinfo';

export default function App({navigation}) {
  const [listEvents, setListEvents] = React.useState([]);
  const [list, setList] = React.useState({});
  const [sum, setSum] = React.useState(0);
  const [dataStudent, setDataStudent] = React.useState({});
  const [image, setImage] = React.useState({});
  const [studensList, setStudensList] = React.useState([]);
  const [state, setState] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            userData: action.data,
            photoUrl: action.photoUrl,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userData: action.data,
            photoUrl: action.photoUrl,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );
  const [faceId, setFaceId] = React.useState(false);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let data;

      try {
        data = await AsyncStorage.getItem('@USER_SESSION');
        data = JSON.parse(data);
      } catch (e) {
        // error reading value
        data = null;
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setState({
        type: 'RESTORE_TOKEN',
        token: data?.data.jwt,
        data: data?.data.user,
        photoUrl: data?.photData,
      });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async data => {
      await AsyncStorage.setItem('@USER_SESSION', JSON.stringify(data));
      setState({
        type: 'SIGN_IN',
        token: data?.data.jwt,
        data: data?.data.user,
        photoUrl: data?.photData,
      });
    },
    signOut: async () => {
      const network = await NetInfo.fetch();
      if (network.isConnected) {
        AsyncStorage.removeItem('@USER_SESSION');
        setFaceId(false);
        setState({type: 'SIGN_OUT'});
      }
    },
    state: state,
    faceId: faceId,
    handleFace: val => setFaceId(val),
    sum: sum,
    setSum: val => setSum(val),
    listEvents: listEvents,
    handleEvents: val => setListEvents(val),
    list: list,
    handleList: val => setList(val),
    setStudensList: val => setStudensList(val),
    studensList: studensList,
    reloadStudentsList: async () => {
      const students = await getBeneficiariesFromDeliveryList(list);
      setStudensList(students);
    },
    image: image,
    handleImage: val => {
      setImage(val);
    },
    dataStudent: dataStudent,
    handleStudent: val => {
      setDataStudent(val);
    },
  };

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Navigation />
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
