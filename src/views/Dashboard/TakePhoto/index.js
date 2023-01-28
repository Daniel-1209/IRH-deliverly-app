import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, Image, Alert, ScrollView} from 'react-native';
import {Button, Searchbar, ActivityIndicator} from 'react-native-paper';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DataCard from './DataCard';
import {AuthContext} from '../../../contexts/sessionContex';
import uploadPhoto from '../../../Apis/uploadPhoto';

const TakePhoto = ({navigation}) => {
  const {studensList, dataStudent, handleStudent} = useContext(AuthContext);
  const [image, setImage] = useState(require('../../../../assets/sinFoto.jpeg'));
  const [charger, setCharger] = React.useState(false);
  const [takePhoto, setTakePhoto] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState(
    dataStudent.attributes === undefined
      ? ''
      : dataStudent.attributes.beneficiary_curp,
  );
  const [validTakePhoto, setValidTakePhoto] = useState(true);

  const onChangeSearch = query => setSearchQuery(query);

  const errorAlert = () =>
    Alert.alert(
      'Error',
      'No se pudo subir la foto reintente de nuevo por favor ',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  const succesAlert = () =>
    Alert.alert('Aceptado', 'Foto subida exitosamente', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const searchUser = () => {
    if (studensList.length !== 0) {
      const data = studensList.filter(student => {
        if (student.attributes.beneficiary_curp == searchQuery) {
          console.log('Datos de estudiante: ', JSON.stringify(student, ' ', 2));
          return student;
        }
      });

      if (data.length === 0) {
        handleStudent({id: -1});
      } else {
        handleStudent(data[0]);
        setTakePhoto(true);
      }
    } else {
      handleStudent({id: -1});
    }
  };

  // Tomar Imagen

  const takePicture = () => {
    const options = {
      title: 'Tomar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
    };

    launchCamera(options, response => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('Usuario Cancelo');
      } else {
        const uri = response.assets[0];
        setImage(uri);
        setValidTakePhoto(false);
      }
    });
  };

  const save = async () => {
    setCharger(true);
    const response = await uploadPhoto(
      dataStudent.attributes.beneficiary_id,
      dataStudent.id,
      image,
    );
    console.log('Respodio con ', response);
    setCharger(false);
    if (response) {
      setValidTakePhoto(true);
      setTakePhoto(false);
      setImage(require('../../../../assets/sinFoto.jpeg'));
      succesAlert();
    } else {
      errorAlert();
    }
  };

  return (
    <View style={{backgroundColor: '#fff', padding: 10, height: '100%'}}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{width: '50%', alignContent: 'center', alignItems: 'center'}}>
          {dataStudent.attributes === undefined ? (
            <Text style={styles.introductoryText}>
              Primero escoge una lista y despues regresa a buscar un alumno
            </Text>
          ) : dataStudent.attributes.profile_photo.data !== null ? (
            <Text style={styles.introductoryText}>Usuario con foto</Text>
          ) : (
            <>
              <Image style={styles.viewPhoto} source={image} />
              {takePhoto ? (
                <Button
                  style={{
                    backgroundColor: '#4526a0',
                    width: 300,
                  }}
                  icon="camera"
                  mode="contained"
                  onPress={takePicture}>
                  Tomar fotografia
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </View>

        <View style={{width: '50%', alignItems: 'center', height: '100%'}}>
          {/* <Button icon="folder-image" mode="contained" onPress={selectImage}>
                Seleccionar imagen
              </Button> */}
          <Text style={styles.textHeaderRigth}>
            Búsqueda De CURP y Guardado de Foto
          </Text>
          <View style={styles.viewSearchContent}>
            <Searchbar
              placeholder="CURP"
              onSubmitEditing={searchUser}
              onIconPress={searchUser}
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchCurp}
            />
          </View>
          <ScrollView style={styles.viewContentData}>
            {dataStudent.id === undefined ? (
              <Text style={styles.textUserNotFound}>BUSQUE UN ALUMNO</Text>
            ) : (
              <>
                {dataStudent.id !== -1 ? (
                  <DataCard dataStudent={dataStudent} />
                ) : (
                  <Text style={styles.textUserNotFound}>
                    ALUMNO NO ENCONTRADO
                  </Text>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.areaButtons}>
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
                style={{
                  backgroundColor: validTakePhoto ? '#c3c2d1' : 'green',
                  width: 200,
                  position: 'absolute',
                  right: 50,
                }}
                icon="check-all"
                mode="contained"
                disabled={validTakePhoto}
                onPress={() => save()}>
                Guardar
              </Button>
            )}
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
  areaButtons: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonCancel: {
    backgroundColor: 'red',
    width: 200,
    position: 'absolute',
    left: 50,
  },
  buttonSave: {
    backgroundColor: 'green',
    width: 200,
    position: 'absolute',
    right: 50,
  },
  viewUserData: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
  },
  viewContentData: {
    height: 450,
    marginVertical: 10,
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  viewPhoto: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 300,
    width: 300,
  },
  textHeaderRigth: {
    fontSize: 20,
    backgroundColor: '#cde7fc',
    width: '100%',
    height: 30,
    textAlign: 'center',
    color: 'black',
  },
  viewSearchContent: {
    backgroundColor: '#cde7fc',
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cde7fc',
    height: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchCurp: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  textUserNotFound: {
    color: 'red',
    fontSize: 30,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 60,
  },
  introductoryText: {
    color: 'purple',
    fontSize: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default TakePhoto;
