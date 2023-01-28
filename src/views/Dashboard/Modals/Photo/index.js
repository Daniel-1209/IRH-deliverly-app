import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {AuthContext} from '../../../../contexts/sessionContex';
import compareFaceStudents from '../../../../Apis/compareFaceStudents';

const Photo = ({navigation}) => {
  const {handleImage, dataStudent} = useContext(AuthContext);

  const [state, setState] = useState('invalid');
  const [imageHere, setImageHere] = React.useState(
    require('../../../../../assets/sinFoto.jpeg'),
  );

  // Seleccionar imagen
  const selectImage = () => {
    const options = {
      title: 'Selecciona una imagen',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      console.log('Ressponse' + response);
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario cancelo');
      } else {
        const paht = response.assets[0].uri;
        handleImage(paht);
      }
    });
  };

  // Tomar Imagen
  const takePicture = () => {
    const options = {
      title: 'Tomar una foto',
      maxWidth: 1500,
      maxHeight: 1500,
      includeBase64: false,
    };

    launchCamera(options, async response => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('Usuario Cancelo');
        setState('invalid');
      } else {
        const uri = response.assets[0];
        setImageHere(uri);
        setState('validing');
        // Implement FaceId of Jose
        // const respnse = await compareFaceStudents(
        //   dataStudent?.attributes?.face_encodings,
        //   uri,
        // );
        // if (respnse.result) {
        handleImage(uri);
        setState('valid');
        // } else {
        //   setState('invalid');
        // }
      }
    });
  };

  const displayState = () => {
    if (state === 'validing') {
      return (
        <View
          style={{
            height: '50%',
            marginVertical: 20,
            alignItems: 'center',
            alignContent: 'center',
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator size={100} animating={true} color="#0017ff" />
          <Text>Validando....</Text>
        </View>
      );
    } else if (state === 'invalid') {
      return (
        <>
          <Image
            style={styles.logo}
            source={require('../../../../../assets/delete-incorrect-invalid.png')}
          />
          <Text>Foto Invalida Intente De Nuevo</Text>
        </>
      );
    } else if (state === 'valid') {
      return (
        <>
          <Image
            style={styles.logo}
            source={require('../../../../../assets/correct-mark-success.png')}
          />
          <Text style={{color: 'green', fontSize: 30}}>Rostro Valido</Text>
        </>
      );
    }
  };

  const buttonState = () => {
    if (state === 'validing') {
      return <></>;
    } else if (state === 'invalid') {
      return (
        <Button
          style={{backgroundColor: 'red', width: 300}}
          icon="reload-alert"
          mode="contained"
          onPress={() => {
            setState('validing');
            takePicture();
          }}>
          Reintentar Validación
        </Button>
      );
    }
  };

  useEffect(() => {
    takePicture();
  }, []);

  return (
    <View style={{backgroundColor: '#fff', padding: 10}}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: '50%',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Image style={styles.imagePerfil} source={{uri: imageHere.uri}} />
        </View>

        <View
          style={{width: '50%', alignContent: 'center', alignItems: 'center'}}>
          <Text style={styles.validPhoto}>Validacion De Foto</Text>
          <View>
            <View style={styles.viewDisplay}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                {displayState()}
              </View>
              {buttonState()}
            </View>
          </View>
          <View style={styles.viewButtons}>
            <Button
              style={styles.buttonCancel}
              icon="account-cancel"
              mode="contained"
              onPress={() => navigation.goBack()}>
              Cancelar
            </Button>
            <Button
              style={{
                backgroundColor: state !== 'valid' ? '#e3f2fd' : 'green',
                width: 200,
                position: 'absolute',
                right: 50,
              }}
              icon="check-all"
              mode="contained"
              disabled={state === 'invalid' ? true : false}
              onPress={() => navigation.navigate('signature')}>
              Siguiente
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
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

  userNotFound: {
    color: 'red',
    fontSize: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
  },
  viewDisplay: {
    height: '50%',
    marginVertical: 20,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  validPhoto: {
    fontSize: 20,
    backgroundColor: '#cde7fc',
    width: '100%',
    height: 30,
    textAlign: 'center',
    color: 'black',
  },
  imagePerfil: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 300,
    width: 300,
  },
  viewButtons: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
  },
  buttonCancel: {
    backgroundColor: 'red',
    width: 200,
    position: 'absolute',
    left: 50,
  },
});

export default Photo;
