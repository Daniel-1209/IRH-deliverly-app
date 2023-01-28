import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import modalsList from './ModalsList';
import DrawerContainer from './DrawerContainer';
// Vistas
import Home from '../views/Dashboard/Home';
import Lists from '../views/Dashboard/Lists.js';
import Login from '../views/Login/Login';
import {AuthContext} from '../contexts/sessionContex';
import TakePhoto from '../views/Dashboard/TakePhoto';
import FaceId from '../views/FaceId';

const Drawer = createDrawerNavigator();

const Navigation = () => {
  const {state, faceId} = React.useContext(AuthContext);

  // console.log(state);

  return (
    <>
      {
        state.userToken == null ? (
          <Login />
        ) : (
          //   faceId ? (
          <Drawer.Navigator
            drawerContent={props => <DrawerContainer {...props} />}>
            {/* 
          <Drawer.Screen
            name="indexOne"
            component={StackNavigation}
            options={{
              headerTitle: 'Entregas De Beneficio',
              headerTitleAlign: 'center',
            }}
            
          /> */}

            <Drawer.Screen
              name="home"
              component={Home}
              options={{
                title: 'Entrega De Beneficios',
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#633fa2'},
              }}
            />

            <Drawer.Screen
              name="foto"
              component={TakePhoto}
              options={{
                title: 'Toma De Fotos',
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#633fa2'},
              }}
            />
            {/* <Drawer.Screen
            name="lists"
            component={Lists}
            options={{
              title: 'Alumnos Para Entrega de Becas',
              headerTintColor: 'white',
              headerTitleAlign: 'center',
              headerStyle: {backgroundColor: '#001a71'},
            }}
          /> */}
            {/* Modals */}
            <Drawer.Screen
              name="listsModal"
              component={modalsList}
              options={{
                headerTitle: 'Entrega De Beneficios',
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#633fa2'},
              }}
            />
          </Drawer.Navigator>
        )
        // ) :(<FaceId />)
      }
    </>
  );
};

export default Navigation;
