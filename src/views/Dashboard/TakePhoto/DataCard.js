import React from 'react';
import {View, ScrollView, Text, Button, StyleSheet, Image} from 'react-native';
import {DataTable} from 'react-native-paper';

const DataCard = ({dataStudent}) => {
  const {attributes} = dataStudent;
  return (
    <View style={styles.viewStudentContent}>
      <Text style={styles.titleCard}>Datos Del Estudiante</Text>

      <View
        style={{
          width: '100%',
          height: 230,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <View style={styles.viewColumsContent}>
        {attributes.profile_photo.data === null ? (
            <Image
              style={styles.imageAvatar}
              source={require('../../../../assets/sinFoto.jpeg')}
            />
          ) : (
            <Image
              style={styles.imageAvatar}
              source={{
                uri: attributes.profile_photo,
              }}
            />
          )}
        </View>
        <View style={styles.viewColumsContent}>
          {/* <Text style={{marginTop: 30, fontSize: 18, textAlign: 'center'}}>
            {' '}
            {attributes.school_name}{' '}
          </Text> */}
          <Text style={{marginTop: 30, fontSize: 18, textAlign: 'center'}}>
            {' '}
            {attributes.beneficiary_name} {attributes.beneficiary_lastname}{' '}
          </Text>
          <Text style={{marginTop: 30, fontSize: 18}}>
            {attributes.beneficiary_curp}
          </Text>
          {/* <Text style={{marginTop: 30, fontSize: 18}}>
            {attributes.beneficiary_curp}
          </Text> */}
        </View>
      </View>
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell></DataTable.Cell>
          <DataTable.Cell></DataTable.Cell>
          <DataTable.Cell></DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Nombre:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_name}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Apellidos:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_lastname}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>CURP:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_curp}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Fecha de Nacimiento:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_birthday}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Genero:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_gender}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Correo Electrónico:</DataTable.Cell>
          <DataTable.Cell>{attributes.beneficiary_email}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Dirección:</DataTable.Cell>
          <DataTable.Cell>{attributes.full_address}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Nombre de la Escuela:</DataTable.Cell>
          <DataTable.Cell>{attributes.school_name}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Delegación:</DataTable.Cell>
          <DataTable.Cell>{attributes.locality_name}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Colonia:</DataTable.Cell>
          <DataTable.Cell>{attributes.city_name}</DataTable.Cell>
        </DataTable.Row>

        {/* {data.forEach(e => {
          console.log(e);
          return (
            <DataTable.Row key={e}>
              <DataTable.Cell>CURP</DataTable.Cell>
              <DataTable.Cell>GAMD091209HOCRNNAO</DataTable.Cell>
            </DataTable.Row>
          );
        })} */}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  imageAvatar: {
    height: 200,
    borderWidth: 1,
    borderColor: '#cde7fc',
    width: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  titleCard: {
    width: '100%',
    fontSize: 23,
    fontStyle: 'italic',
    color: 'black',
    textAlign: 'center',
  },
  viewStudentContent: {
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderColor: '#cde7fc',
    height: 'auto',
    marginVertical: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    padding: 10,
    paddingBottom: 30,
  },
  viewColumsContent: {
    alignContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
  },
});

export default DataCard;
