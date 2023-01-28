import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Drawer, Divider} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import FastImage from 'react-native-fast-image';

// Apis
import {getUserDeliveryLists} from '../Apis/lists';
// My Context
import {AuthContext} from '../contexts/sessionContex';

const DrawerContainer = ({navigation}) => {
  const [active, setActive] = useState('home');
  const [charger, setCharger] = React.useState(true);
  const [activeEvent, setActiveEvent] = useState('home');
  const profile =
    'https://banner2.cleanpng.com/20180714/ro/kisspng-computer-icons-user-membership-vector-5b498fc76f2a07.4607730515315475914553.jpg';

  const {signOut, state, listEvents, handleEvents, handleList, handleStudent, sum} =
    React.useContext(AuthContext);

  const handleScreen = (screen, list) => {
    setActive(screen);
    if (list !== undefined) {
      handleList(list);
      navigation.navigate('listsModal');
    } else {
      setActiveEvent(screen);
      navigation.navigate(screen);
    }
  };

  const handleEvent = screen => {
    setActiveEvent(screen);
    setActive(screen);
  };
  useEffect(() => {
    const talk = async () => {
      let ls;
      ls = await getUserDeliveryLists(state.userData);
      handleEvents(ls);
      setCharger(false);
    };
    talk();
  }, [sum]);
  return (
    <DrawerContentScrollView>
      <SafeAreaView
        style={{
          elevation: 10,
          borderRadius: 25,
          width: '80%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}>
        <Image
          style={{width: '100%', height: 100, borderRadius: 10}}
          source={require('../../assets/Beneficios.jpg')}
        />
      </SafeAreaView>
      <View style={styles.viewAvatar}>
        <FastImage
          style={{width: 120, height: 120, borderRadius: 25}}
          source={{
            uri: state.photoUrl ? state.photoUrl : profile,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={{fontSize: 17, marginTop: 12}}>
          {state.userData.curp}
        </Text>
      </View>

      <Drawer.Section
        style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
        <Text>Menu Principal</Text>
        <Drawer.Item
          active={active === 'home'}
          icon="home"
          label="inicio"
          onPress={() => handleScreen('home')}
        />
        {/* <Drawer.Item
          active={active === 'foto'}
          icon="camera"
          label="Toma de Fotos"
          onPress={() => handleScreen('foto')}
        /> */}

        <Text>Eventos</Text>
        {charger ? (
          <ActivityIndicator animating={true} color="blue" />
        ) : listEvents.length !== 0 ? (
          <>
            {listEvents.map((event, indexEvent) => (
              <View key={`Event${indexEvent}`}>
                <Drawer.Item
                  active={activeEvent === `events/${indexEvent}`}
                  icon="calendar-check"
                  label={event[0].event_name}
                  onPress={() => handleEvent(`events/${indexEvent}`)}
                />
                {event.map((list, indexList) => (
                  <View
                    key={`list${indexList}`}
                    style={{
                      display:
                        `events/${indexEvent}` === activeEvent
                          ? 'flex'
                          : 'none',
                      right: -30,
                    }}>
                    {/* <Text>Listas de Evento</Text> */}
                    <Drawer.Item
                      active={
                        active ===
                        `events/${indexEvent}/deliveries/${indexList}`
                      }
                      // style={{display:'flex', right:-30}}
                      icon="clipboard-list-outline"
                      label={list.name}
                      onPress={() => {
                        handleStudent({}),
                          handleScreen(
                            `events/${indexEvent}/deliveries/${indexList}`,
                            list,
                          );
                      }}
                    />
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.noEvents}>
              {' '}
              No Tienes enventos de entrega ni listas{' '}
            </Text>
          </>
        )}

        <Divider style={{marginTop: 30}} />
        <Drawer.Item
          icon="logout"
          onPress={() => signOut()}
          label="Cerrar sesion"
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  viewAvatar: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    elevation: 5,
    height: 200,
    borderRadius: 30,
  },
  container: {
    margin: 30,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  noEvents: {
    marginTop: 20,
    color: 'blue',
  },
});

export default DrawerContainer;
