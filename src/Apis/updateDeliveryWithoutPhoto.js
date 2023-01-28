import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://wobz-government-dif-qro.uw.r.appspot.com/api';

const updateDeliveryWithoutPhoto = async (userID, signature, card) => {
  // submit photo and signature to server.
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;

  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  // console.log(hoy.toISOString());
  // Fetch  ++++++++++++++  Signature, Photo and NumberCard

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${sessionObject.jwt}`);

  const formdataSignature = new FormData();

  formdataSignature.append('files', {
    name: `firma${Date.now()}`,
    type: 'image/jpeg',
    uri: signature,
  });

  formdataSignature.append('ref', 'api::delivery.delivery');
  formdataSignature.append('refId', userID);
  formdataSignature.append('field', 'receipt_photo');

  const requestOptionsSig = {
    method: 'POST',
    headers: myHeaders,
    body: formdataSignature,
    redirect: 'follow',
  };
  var config = {
    method: 'put',
    url: `https://wobz-government-dif-qro.uw.r.appspot.com/api/deliveries/${userID}`,
    headers: {
      Authorization: `Bearer ${sessionObject.jwt}`,
    },
    data: {
      data: {
        card_number: card,
        status: 'delivered_with_validation',
        delivered_date: hoy.toISOString(),
      },
    },
  };

  try {
    await fetch(
      `https://wobz-government-dif-qro.uw.r.appspot.com/api/upload`,
      requestOptionsSig,
    );
  } catch (e) {
    return false;
  }

  try {
    await axios(config);
  } catch (e) {
    return false;
  }

  // submit new delivery data to server.
  return true;
};

export default updateDeliveryWithoutPhoto;
