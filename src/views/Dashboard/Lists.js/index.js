import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';
import DataCard from './DataCard';
import {AuthContext} from '../../../contexts/sessionContex';
import Autocomplete from 'react-native-autocomplete-input';
import DropDownPicker from 'react-native-dropdown-picker';
import {getBeneficiariesFromDeliveryList} from '../../../Apis/lists';

const Lists = ({navigation}) => {
  const {list, studensList, dataStudent, handleStudent, setStudensList} =
    useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [similarCurps, setSimilarCurps] = useState([]);
  const [validUser, setValidUser] = useState(true);
  const [validTakePhoto, setValidTakePhoto] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchBar, setSearchBar] = useState({
    label: 'CURP',
    value: 0,
    title: 'INGRESE CURP',
  });
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'CURP', value: 0, title: 'INGRESE CURP'},
    {label: 'NOMBRE', value: 1, title: 'NOMBRE Y APELLIDOS'},
    {label: 'APELLIDOS', value: 2, title: 'APELLIDOS Y NOMBRE'},
  ]);
  let name = '';

  // To search in bar
  const onChangeSearch = query => {
    setSearchQuery(query);
    // console.log(query);
    // console.log(JSON.stringify(studensList[0], 2, ' '));
    if (query.length > 0) {
      if (searchBar.label === 'NOMBRE') {
        setSimilarCurps(
          studensList.filter(st => {
            name =
              st.attributes.beneficiary_name +
              ' ' +
              st.attributes.beneficiary_lastname;
            if (name.toUpperCase().startsWith(query.toUpperCase())) {
              return true;
            }
            return false;
          }),
        );
      }
      if (searchBar.label === 'APELLIDOS') {
        setSimilarCurps(
          studensList.filter(st => {
            name =
              st.attributes.beneficiary_lastname +
              ' ' +
              st.attributes.beneficiary_name;
            if (name.toUpperCase().startsWith(query.toUpperCase())) {
              return true;
            }
            return false;
          }),
        );
      }
      if (searchBar.label === 'CURP') {
        setSimilarCurps(
          studensList.filter(st => {
            if (
              st.attributes.beneficiary_curp
                .toUpperCase()
                .startsWith(query.toUpperCase())
            ) {
              return true;
            }
            return false;
          }),
        );
      }
    } else {
      setSimilarCurps([]);
    }
  };
  const [countMissing, setCountMissing] = useState(0);

  // To search selected user
  const searchUser = curp => {
    if (studensList.length !== 0) {
      const data = studensList.filter(student => {
        if (student.attributes.beneficiary_curp === curp) {
          setValidUser(false);
          if (student.attributes.profile_photo.data !== null) {
            setValidTakePhoto(false);
          }

          if (student.attributes.status !== 'no_delivered') {
            setValidTakePhoto(true);
            setValidUser(true);
          }

          return student;
        }
      });

      if (data.length === 0) {
        handleStudent({id: -1});
      } else {
        handleStudent(data[0]);
      }
    } else {
      handleStudent({id: -1});
    }
  };

  useEffect(() => {
    if (dataStudent.id === undefined) {
      setValidUser(true);
      setValidTakePhoto(true);
      setSearchQuery('');
    }
    let count = 0;
    for (const user of studensList) {
      if (user.attributes.status === 'no_delivered') {
        count += 1;
      }
    }
    setCountMissing(count);
  }, [dataStudent, studensList]);

  useEffect(() => {
    setStudensList([]);
  }, [list]);
  return (
    <>
      {/* Header */}
      <View style={styles.viewHeaderContent}>
        {/* Table status */}
        <View style={styles.contentHeaderLeft}>
          <Text style={styles.textHeaderLeft}>
            Beneficiarios Totales: {studensList.length}
          </Text>
          <Text style={styles.textHeaderLeft}>
            Beneficiarios Con Beneficio: {studensList.length - countMissing}
          </Text>
          <Text style={styles.textHeaderLeft}>
            Beneficiarios Pendientes: {countMissing}
          </Text>
          <Text style={styles.textHeaderLeft}>
            Iniciales: {list.beneficiary_initials}
          </Text>
        </View>
        {/* Search box */}
        <View style={styles.viewSearchContent}>
          <Autocomplete
            autoCapitalize="characters"
            placeholderTextColor="#9e9e9e"
            placeholder={searchBar.title}
            style={styles.autocompleteContainer}
            containerStyle={{width: '100%'}}
            listContainerStyle={styles.autocompleteListContainer}
            data={similarCurps.slice(0, 6)}
            value={searchQuery}
            onChangeText={onChangeSearch}
            hideResults={similarCurps.length === 0}
            flatListProps={{
              keyExtractor: (_, idx) => idx,
              renderItem: ({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery(item.attributes.beneficiary_curp);
                    searchUser(item.attributes.beneficiary_curp);
                    setSimilarCurps([]);
                  }}>
                  <Text style={styles.itemText}>
                    {searchBar.label === 'NOMBRE'
                      ? item.attributes.beneficiary_name +
                        ' ' +
                        item.attributes.beneficiary_lastname
                      : ''}
                    {searchBar.label === 'APELLIDOS'
                      ? item.attributes.beneficiary_lastname +
                        ' ' +
                        item.attributes.beneficiary_name
                      : ''}
                    {searchBar.label === 'CURP'
                      ? item.attributes.beneficiary_curp
                      : ''}
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
        </View>
      </View>
      {/* Information Area */}
      <ScrollView style={{backgroundColor: '#e3f2fd'}}>
        {dataStudent.id === undefined ? (
          <View>
            <Text style={styles.textUserNotFound}>BUSQUE UN BENEFICIARIO</Text>
            <View style={styles.twoBottonsBox}>
              {/* Select Search By */}
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                onChangeValue={e => {
                  setSearchBar(items[e]);
                }}
                style={{
                  width: 300,
                  backgroundColor: '#e3f2fd',
                  borderColor: 'white',
                  borderRadius: 0,
                  elevation: 5,
                }}
                labelStyle={{fontSize: 15, color: 'blue'}}
                placeholderStyle={{fontSize: 15, color: 'blue'}}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode="MODAL"
                modalTitle="SELECCIONAR BUSQUEDA POR"
                placeholder="SELECCIONAR BUSQUEDA POR"
              />
              {/* Button To Update Information */}
              {loading ? (
                <Text style={styles.textCharger}>CARGANDO...</Text>
              ) : (
                <Button
                  icon="file"
                  mode="contained"
                  style={{
                    backgroundColor: '#e3f2fd',
                    width: 300,
                    height: 50,
                    borderRadius: 0,
                    borderColor: 'white',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    elevation: 5,
                  }}
                  labelStyle={{color: 'blue'}}
                  contentStyle={{height: '100%'}}
                  onPress={async () => {
                    setLoading(true);
                    // console.log('Hola entrando en busca');
                    const students = await getBeneficiariesFromDeliveryList(
                      list,
                    );
                    console.log('termine');
                    setStudensList(students);
                    setLoading(false);
                  }}>
                  ACTUALIZAR INFORMACIÓN
                </Button>
              )}
            </View>
          </View>
        ) : dataStudent.id !== -1 ? (
          dataStudent.attributes.status !== 'no_delivered' ? (
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <Image
                style={styles.logo}
                source={require('../../../../assets/correct-mark-success.png')}
              />
              <Text style={{color: 'green', fontSize: 30}}>
                Beneficio ya entregado.
              </Text>
              <Text style={{color: 'green', fontSize: 30}}>
                {dataStudent.attributes.beneficiary_curp}
              </Text>
            </View>
          ) : (
            <DataCard dataStudent={dataStudent} />
          )
        ) : (
          <Text style={styles.textUserNotFound}>
            BENEFICIARIO NO ENCONTRADO
          </Text>
        )}
      </ScrollView>
      {/* Buttons */}
      <View style={styles.viewFooterContent}>
        <Button
          disabled={dataStudent.id == undefined}
          icon="file-cancel-outline"
          mode="contained"
          style={styles.cancelButton}
          onPress={() => {
            setSearchQuery('');
            handleStudent({});
            setValidTakePhoto(true);
            setValidUser(true);
          }}>
          Cancelar
        </Button>
        <Button
          icon="camera"
          mode="contained"
          disabled={validTakePhoto}
          style={styles.photoButton}
          onPress={() => navigation.navigate('photo')}>
          Validación
        </Button>
        <Button
          icon="signature-freehand"
          mode="contained"
          disabled={validUser}
          style={{
            backgroundColor: validUser ? '#c3c2d1' : 'blue',
          }}
          onPress={() => navigation.navigate('signature')}>
          Firma
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewHeaderContent: {
    backgroundColor: '#42a5f5',
    alignContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    zIndex: 3,
  },
  viewSearchContent: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cde7fc',
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '30%',
  },
  viewFooterContent: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderWidth: 1,
    display: 'flex',
    borderStyle: 'solid',
    borderColor: '#cde7fc',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 70,
  },
  contentHeaderLeft: {
    backgroundColor: '#fff',
    borderStyle: 'solid',
    alignItems: 'center',
    borderWidth: 1,
    height: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#cde7fc',
    marginLeft: 3,
    marginRight: 'auto',
    width: '50%',
  },
  twoBottonsBox: {
    // backgroundColor:'red',
    flexDirection: 'row',
    width: 400,
    height: 60,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
  },
  textHeaderLeft: {
    display: 'flex',
    height: '50%',
    paddingLeft: 30,
    paddingTop: 10,
    width: '50%',
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#cde7fc',
    backgroundColor: '#42a5f5',
  },
  cancelButton: {backgroundColor: 'red'},
  photoButton: {position: 'relative'},
  deliveriButton: {
    backgroundColor: 'green',
  },
  textUserNotFound: {
    color: 'blue',
    fontSize: 30,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 60,
  },
  logo: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderColor: '#fff',
    width: '100%',
    zIndex: 100,
    // color: '#000000',
  },
  autocompleteInputContainer: {
    color: '#000000',
    fontSize: 20,
  },
  autocompleteListContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    height: 310,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    elevation: 3,
  },
  textCharger: {
    width: 300,
    textAlign: 'center',
    color: 'blue',
    marginTop: 20,
  },
  itemText: {
    zIndex: 100,
    fontSize: 18,
    lineHeight: 40,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 5,
    color: 'black',
    backgroundColor: '#e3f2fd',
    // shadowOffset: {width: 10, height: 10},
    // shadowColor: '#000',
  },
});

export default Lists;
