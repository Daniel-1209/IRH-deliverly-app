import React from 'react';
import {
  View,
  ScrollView,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import {AuthContext} from '../../../contexts/sessionContex';
import {Divider, Button} from 'react-native-paper';
import initialDeliveryLoad from '../../../Apis/localdb/initialDeliveryLoad';
import syncDelivery from '../../../Apis/localdb/syncDelivery';
import syncDeliveryPhotos from '../../../Apis/localdb/syncDeliveryPhotos';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator} from 'react-native-paper';

const Home = () => {
  const {state, sum, setSum} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const [loadingUploadPhotos, setLoadingUploadPhotos] = React.useState(false);
  const profile =
    'https://banner2.cleanpng.com/20180714/ro/kisspng-computer-icons-user-membership-vector-5b498fc76f2a07.4607730515315475914553.jpg';

  const simpleDialog = (title, message) => {
    return Alert.alert(title, message, [
      {
        text: 'OK',
      },
    ]);
  };

  const showConfirmDialog = () => {
    return Alert.alert(
      'Estas seguro?',
      'Esta operación reemplazará toda la información actual en el dispositivo y no se puede deshacer. Estas seguro de continuar?',
      [
        // The "Yes" button
        {
          text: 'SI',
          onPress: async () => {
            setLoading(true);
            if (await initialDeliveryLoad(state.userData)) {
              setSum(sum + 1);
              simpleDialog('Exito', 'Datos cargados correctamente.');
            } else {
              simpleDialog('Error', 'No se pudo cargar los datos.');
            }
            setLoading(false);
          },
        },
        {
          text: 'NO',
        },
      ],
    );
  };

  const showConfirmDialogUpload = () => {
    return Alert.alert(
      'Estas seguro?',
      'Esta operación reemplazará toda la información en el servidor con la del dispositivo y no se puede deshacer. Estas seguro de continuar?',
      [
        {
          text: 'SI',
          onPress: async () => {
            setLoadingUpload(true);
            if (await syncDelivery()) {
              simpleDialog('Exito', 'Datos cargados correctamente.');
            } else {
              simpleDialog('Error', 'No se pudo cargar los datos.');
            }
            setLoadingUpload(false);
          },
        },
        {
          text: 'NO',
        },
      ],
    );
  };

  const showConfirmDialogUploadPhotos = () => {
    return Alert.alert(
      'Estas seguro?',
      'Esta operación reemplazará todas las fotos en el servidor con la del dispositivo y no se puede deshacer. Estas seguro de continuar?',
      [
        {
          text: 'SI',
          onPress: async () => {
            setLoadingUploadPhotos(true);
            if (await syncDeliveryPhotos()) {
              simpleDialog('Exito', 'Datos cargados correctamente.');
            } else {
              simpleDialog('Error', 'No se pudo cargar los datos.');
            }
            setLoadingUploadPhotos(false);
          },
        },
        {
          text: 'NO',
        },
      ],
    );
  };

  return (
    <ScrollView>
      <View style={styles.stylesHeader}>
        <ImageBackground
          style={styles.logo}
          source={require('../../../../assets/portadaQueretaro.jpeg')}>
          <View style={styles.grayBackground} />
        </ImageBackground>

        <View style={styles.textView}>
          <Text style={styles.titleHeader}>
            Bienvenido a la Aplicación Para Entrega De Beneficios
          </Text>
        </View>
      </View>

      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 35}}>
          Bienvenido Repartidor de Ayudas
        </Text>
        <Text style={{color: '#633fa2', marginTop: 10, fontSize: 30}}>
          {`${state?.userData?.first_name} ${state?.userData?.last_name}`}
        </Text>
        <FastImage
          style={{width: 150, height: 150, borderRadius: 25}}
          source={{
            uri: state.photoUrl ? state.photoUrl : profile,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text
          style={{
            marginTop: 10,
            marginBottom: 10,
            color: 'black',
            fontSize: 18,
          }}>
          Para iniciar la entrega de ayudas puedes dar click en la barra de
          navegación para que te lleve a cada uno de los eventos con sus
          respectivas listas.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {loading ? (
          <ActivityIndicator animating={true} color="red" />
        ) : (
          <Button
            icon="download"
            mode="contained"
            onPress={async () => {
              showConfirmDialog();
            }}>
            Descargar Entregas
          </Button>
        )}

        {loadingUpload ? (
          <ActivityIndicator animating={true} color="green" />
        ) : (
          <Button
            icon="upload"
            mode="contained"
            onPress={() => {
              showConfirmDialogUpload();
            }}>
            Subir Entregas
          </Button>
        )}

        {loadingUploadPhotos ? (
          <ActivityIndicator animating={true} color="green" />
        ) : (
          <Button
            icon="upload"
            mode="contained"
            onPress={() => {
              showConfirmDialogUploadPhotos();
            }}>
            Subir Fotos
          </Button>
        )}
      </View>

      <Divider />

      <View style={styles.footer}>
        <Text style={{color: 'white', marginTop: 'auto', marginBottom: 'auto'}}>
          © Todos los Derechos Reservados Revisa nuestros Avisos de Privacidad
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  stylesHeader: {
    flex: 1,
  },
  textView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleHeader: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '900',
    fontSize: 30,
  },
  logo: {
    width: '100%',
    height: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    margin: 30,
  },
  input: {
    marginTop: 20,
  },

  buttonsContainer: {
    marginTop: 50,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
  },

  userNotFound: {
    color: 'red',
    fontSize: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
  },

  footer: {height: 100, alignItems: 'center', backgroundColor: 'black'},
});

export default Home;
