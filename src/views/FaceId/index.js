import React, {useState, useContext} from 'react';
import {Text, View, Image, Alert} from 'react-native';
import {Button, ActivityIndicator, Colors} from 'react-native-paper';
import {AuthContext} from '../../contexts/sessionContex';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {compareFaceEncodings} from '../../Apis/faceid';

const FaceId = () => {
  const [image, setImage] = useState(require('../../../assets/sinFoto.jpeg'));
  const [count, setCount] = useState(0);
  const [stateValid, setStateValid] = useState('invalid');
  const {faceId, handleFace, state} = React.useContext(AuthContext);
  console.log('Datos de usuario ', state);

  const takePicture = () => {
    if (count === 0) {
      setCount(count + 1);

      if (!faceId) {
        const options = {
          title: 'Tomar una foto',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          includeBase64: true,
          cameraType: 'front',
          saveToPhotos: true,
        };

        launchCamera(options, async response => {
          if (response.errorCode) {
            console.log(response.errorMessage);
          } else if (response.didCancel) {
            console.log('Usuario Cancelo');
            setStateValid('invalid');
          } else {
            const photo = response.assets[0];
            setImage(photo);
            setStateValid('validing');

            const respnse = await compareFaceEncodings(
              state.userData.face_encodings,
              response.assets[0],
            );
            // console.log('Respondio 01', respnse);
            if (respnse.result) {
              setStateValid('valid');
              console.log('Respondio 02', respnse);
            } else {
              setStateValid('invalid');
              console.log('Respondio 02', respnse);
            }
          }
        });
      }
    }
  };

  const buttonTakePicture = () => {
    if (!faceId) {
      const options = {
        title: 'Tomar una foto',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        includeBase64: true,
        cameraType: 'front',
        saveToPhotos: true,
      };

      launchCamera(options, async response => {
        if (response.errorCode) {
          console.log(response.errorMessage);
        } else if (response.didCancel) {
          console.log('Usuario Cancelo');
          setStateValid('invalid');
        } else {
          const photo = response.assets[0];
          setImage(photo);
          setStateValid('validing');

          const respnse = await compareFaceEncodings(
            state.userData.face_encodings,
            response.assets[0],
          );
          console.log('Respondio 01', respnse);
          if (respnse.result) {
            setStateValid('valid');
            console.log('Respondio 02', respnse);
          } else {
            setStateValid('invalid');
            console.log('Respondio 02', respnse);
          }
        }
      });
    }
  };

  const buttonState = () => {
    if (stateValid === 'validate') {
      return (
        <Button
          style={{backgroundColor: 'blue', width: 300}}
          icon="download"
          mode="contained"
          onPress={() => setStateValid('validing')}>
          Validar
        </Button>
      );
    } else if (stateValid === 'validing') {
      return (
        <>
          <Text style={{paddingBottom: 10}}> Validando... </Text>
          <ActivityIndicator animating={true} color="blue" size="large" />
        </>
      );
    } else if (stateValid === 'invalid') {
      return (
        <Button
          style={{backgroundColor: 'red', width: 300}}
          icon="reload-alert"
          mode="contained"
          onPress={() => {
            buttonTakePicture();
          }}>
          Reintentar
        </Button>
      );
    } else if (stateValid === 'valid') {
      return (
        <Button
          style={{backgroundColor: 'green', width: 300}}
          icon="check-all"
          mode="contained"
          onPress={() => handleFace(true)}>
          Validada
        </Button>
      );
    }
  };

  takePicture();

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e3f2fd',
        height: '100%',
      }}>
      {/* <Text style={{color:'black', fontSize: 20}}>Validando reconocimiento de rostro</÷Text> */}
      <View
        style={{width: '50%', alignContent: 'center', alignItems: 'center'}}>
        <Image
          style={{
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 20,
            marginBottom: 20,
            height: 350,
            width: 350,
          }}
          source={image}
        />

        {buttonState()}
      </View>
    </View>
  );
};

export default FaceId;
