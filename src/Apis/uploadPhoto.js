import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://wobz-government-dif-qro.uw.r.appspot.com/api';

const uploadPhoto = async (beneficiariID, idOfListBeneficiari, photo) => {
  // submit photo to server.
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${sessionObject.jwt}`);

  const formdataPhoto = new FormData();

  formdataPhoto.append('files', {
    name: photo.fileName,
    type: photo.type,
    uri: photo.uri,
  });

  formdataPhoto.append('ref', 'plugin::users-permissions.user');
  formdataPhoto.append('refId', beneficiariID);
  formdataPhoto.append('field', 'face_photo');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdataPhoto,
    redirect: 'follow',
  };

  try {
    await fetch(
      'https://wobz-government-dif-qro.uw.r.appspot.com/api/upload',
      requestOptions,
    );
  } catch (e) {
    return false;
  }

  return true;
};

export default uploadPhoto;
