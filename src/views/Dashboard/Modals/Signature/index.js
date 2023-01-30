import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, Image} from 'react-native';
import Signature from 'react-native-signature-canvas';
import {Button, ActivityIndicator} from 'react-native-paper';
import {AuthContext} from '../../../../contexts/sessionContex';
import fs from 'react-native-fs';
import {updateDeliveryForUser} from '../../../../Apis/lists';
import updateDeliveryWithoutPhoto from '../../../../Apis/updateDeliveryWithoutPhoto';
import {DIRECTORY_RECEIPT_PHOTOS} from '../../../../Apis/localdb/helpers';
import {hideNavigationBar} from 'react-native-navigation-bar-color';

const SignatureScreen = ({navigation}) => {
  const {reloadStudentsList, image, dataStudent, handleStudent, handleImage} =
    useContext(AuthContext);
  const [signature, setSign] = useState('');
  const [text, setText] = React.useState('');
  const [charger, setCharger] = React.useState(false);
  const {attributes} = dataStudent;

  const handleOK = signaturee => {
    setSign(signaturee);
  };

  const handleEmpty = () => {
    console.log('Vacia');
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Entregado', 'Beneficio entregado satisfactoriamente ', [
      {
        text: 'OK',
        onPress: () => {
          hideNavigationBar();
          console.log('OK Pressed');
        },
      },
    ]);

  const noCompleteAlert = () =>
    Alert.alert(
      'Datos Faltantes',
      'Asegurese que la firma y la foto del beneficiario hayan sido agregados ',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  const errorAlert = () =>
    Alert.alert(
      'Error',
      'No se pudo subir los datos reintente de nuevo por favor ',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );

  const deliver = async () => {
    // FOR NOW: not allow to save without image.
    // if (signature === '' || image.fileName === undefined) {
    if (signature === '') {
      noCompleteAlert();
    } else {
      setCharger(true);
      let base64Data = signature.split('data:image/png;base64,');
      base64Data = base64Data[1];

      const signaturePath = `${DIRECTORY_RECEIPT_PHOTOS}/firma_${dataStudent.id}.png`;
      await fs.writeFile(signaturePath, base64Data, 'base64');

      if (image.fileName === undefined) {
        const response = await updateDeliveryWithoutPhoto(
          dataStudent.id,
          signaturePath,
          text,
        );
        if (response) {
          setCharger(false);
          navigation.navigate('lists');
          handleStudent({});
          handleImage({});
          reloadStudentsList();
          createTwoButtonAlert();
        } else {
          setCharger(false);
          errorAlert();
        }
      } else {
        const response = await updateDeliveryForUser(
          dataStudent.id,
          image,
          signaturePath,
          text,
        );
        if (response) {
          setCharger(false);
          navigation.navigate('lists');
          handleStudent({});
          handleImage({});
          reloadStudentsList();
          createTwoButtonAlert();
        } else {
          setCharger(false);
          errorAlert();
        }
      }
    }
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: blue;
      color: #FFF;
    }
    body {
      height: ${400}px;
      margin:auto;
      margin-top:10px;
      width: ${98}%;
      background:rgb(218, 189, 240);
    }`;

  useEffect(() => {
    hideNavigationBar();
  }, []);

  return (
    <View style={{backgroundColor: '#fff', padding: 20, height: '100%'}}>
      <View style={{flexDirection: 'row', height: '100%'}}>
        {/* Text area */}
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            width: '50%',
            height: '100%',
            borderWidth: 1,
            borderColor: '#BCB0EB',
            borderStyle: 'solid',
          }}>
          {/* Title */}
          {/* <Text style={styles.titleReceipt}>RECIBO DE BENEFICIO</Text> */}
          {/* Text */}
          <View style={styles.receipt}>
            <Text style={styles.textReceipt}>
              Yo :
              <Text style={{color: 'blue'}}>
                {`${attributes.beneficiary_name} ${attributes.beneficiary_lastname}`}{' '}
              </Text>
              ,
              {attributes?.beneficiary_gender === 'M'
                ? 'ciudadana'
                : 'ciudadano'}{' '}
              del estado de Querétaro y recidente en el município Santiago De
              Querétaro, recibí mi apoyo de parte del Sistema Nacional para el
              Desarrollo Integral de la Familia
            </Text>
            <View
              style={{
                marginTop: 30,
                marginBottom: 'auto',
                alignItems: 'center',
              }}>
              <View style={styles.preview}>
                {signature ? (
                  <Image
                    resizeMode={'contain'}
                    style={{width: 335, height: 150}}
                    source={{uri: signature}}
                  />
                ) : null}
              </View>
              <Text style={{color: 'black', fontSize: 15}}>Firma</Text>
            </View>
          </View>
          {/* Buttons */}
          <View style={styles.viewButtons}>
            <Button
              style={styles.buttonCancel}
              icon="account-cancel"
              mode="contained"
              onPress={() => navigation.goBack()}>
              Cancelar
            </Button>
            {charger ? (
              <ActivityIndicator
                style={{position: 'absolute', right: 50}}
                animating={true}
                color="green"
              />
            ) : (
              <Button
                style={styles.buttonDeliver}
                icon="check-all"
                mode="contained"
                onPress={() => deliver()}>
                Entregar Beneficio
              </Button>
            )}
          </View>
        </View>
        {/* Signature area */}
        <View style={{width: '50%'}}>
          <Signature
            onOK={handleOK}
            onClear={() => setSign('')}
            onEmpty={handleEmpty}
            descriptionText="Espacio Para Dibujar"
            clearText="Borrar Todo"
            confirmText="Capturar Firma"
            webStyle={style}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 150,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  previewText: {
    color: '#FFF',
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#69B2FF',
    width: 120,
    textAlign: 'center',
    marginTop: 10,
  },
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
  viewButtons: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
  },
  buttonDeliver: {
    backgroundColor: 'green',
    width: 200,
    position: 'absolute',
    right: 50,
  },
  buttonCancel: {
    backgroundColor: 'red',
    width: 200,
    position: 'absolute',
    left: 50,
  },
  titleReceipt: {
    fontSize: 20,
    width: '100%',
    height: 30,
    textAlign: 'center',
    color: 'black',
  },
  receipt: {
    height: 390,
    padding: 3,
    marginVertical: 20,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  textReceipt: {
    fontSize: 25,
    color: 'black',
    lineHeight: 40,
    textAlign: 'justify',
  },
});

export default SignatureScreen;
