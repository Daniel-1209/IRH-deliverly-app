import React, {useState, useContext} from 'react';
import {StyleSheet, Text, View, Image, PermissionsAndroid} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, Button, ActivityIndicator, Colors} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import SearchUser from '../../Apis/SearchUser';
import {AuthContext} from '../../contexts/sessionContex';

const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permisos Para la Camara',
        message: 'Se necesitan permsos para la camara',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Permitir',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
    const grantedTwo = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permisos Para Guardar Archivos',
        message: 'Se necesitan permsos para guardar los archivos',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Permitir',
      },
    );

    if (grantedTwo === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write files');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.log('Hubo un error en los permisos');
    console.warn(err);
  }
};

const checkPermissions = async () => {
  try {
    // Tipo de promesa de devolución
    const grantedOne = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const grantedTwo = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    // console.log(grantedOne, grantedTwo);
    if (grantedOne === true && grantedTwo === true) {
      return true;
    }
    return false;
  } catch (err) {
    console.log('Hubo un error en los permisos');
    return false;
  }
};

const Login = () => {
  const [activeError, setActiveError] = useState('');
  const [charger, setCharger] = useState(false);
  const [seePassword, setSeePassword] = useState(true);

  const {signIn} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const onSubmit = async data => {
    const responsePermissions = await checkPermissions();
    // console.log('res ', responsePermissions);
    if (responsePermissions === false) {
      await requestPermission();
    }
    const netinfo = await NetInfo.fetch();
    if (!netinfo.isConnected) {
      setActiveError('Sin Conexión A Internet');
      return;
    }

    setCharger(true);
    setActiveError('');
    const response = await SearchUser(data.firstName, data.lastName);
    // console.log(response);
    if (response && response.request && response.request.status === 200) {
      // console.log('Estoy en el login ',JSON.stringify( response.data, ' ', 2));
      // var axios = require('axios');
      // var data = '';

      // var config = {
      //   method: 'get',
      //   url: 'https://wobz-government-dif-qro.uw.r.appspot.com/api/helpers/me',
      //   headers: {
      //     Authorization: `Bearer ${response?.data.jwt}`,
      //   },
      //   data: data,
      // };

      // const photData = await axios(config);
      try {
        // response.photData = photData.data.face_photo?.url;
        signIn(response);
      } catch (e) {
        // saving error
        console.log('Hubo un error al guardar');
      }
    } else {
      setActiveError('Usuarion No encontrado');
      setCharger(false);
      console.log('No encontrado');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxOne}>
        <Image
          style={styles.logo}
          source={require('../../../assets/Beneficios.jpg')}
        />

        <Text style={styles.userNotFound}>{activeError}</Text>

        {/* Email */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label="Correo Electronico"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="firstName"
        />
        {errors.firstName && (
          <Text style={{color: 'red'}}>Correo requerido.</Text>
        )}

        {/* Password */}
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label="Contraseña"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() => setSeePassword(!seePassword)}
                />
              }
              secureTextEntry={seePassword}
            />
          )}
          name="lastName"
        />
        {/* Submit Button */}
        {charger ? (
          <View style={styles.chargerStyle}>
            <ActivityIndicator animating={true} color="blue" size="large" />
            <Text>Buscando Usuario...</Text>
          </View>
        ) : (
          <Button
            title="Submit"
            mode="contained" // 'text' | 'flat' | 'contained'
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            Iniciar Sesión
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    alignItems: 'center',
    margin: 0,
    height: '100%',
  },
  boxOne: {
    backgroundColor: 'white',
    padding: 10,
    width: '50%',
    borderRadius: 10,
    elevation: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
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
  chargerStyle: {
    marginTop: 15,
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default Login;
