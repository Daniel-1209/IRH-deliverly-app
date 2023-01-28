import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Views
import Lists from '../views/Dashboard/Lists.js';
import Photo from '../views/Dashboard/Modals/Photo';
import Signature from '../views/Dashboard/Modals/Signature';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      defaultScreenOptions="lists"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="lists"
        component={Lists}
        options={{
          title: 'Usuarios Para Entrega de Beneficio',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="photo"
        component={Photo}
        options={{title: 'Foto de Validacion', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        name="signature"
        component={Signature}
        options={{title: 'Firma del Beneficiario', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
