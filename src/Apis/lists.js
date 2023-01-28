/*
  DOCUMENTATION: https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html
*/

import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import fs from 'react-native-fs';

import getDeliveryLists from './localdb/getDeliveryLists';
import getDeliveries from './localdb/getDeliveries';
import saveDelivery from './localdb/saveDelivery';
import {DIRECTORY_FACE_PHOTOS} from './localdb/helpers';

const BASE_URL = 'https://wobz-government-dif-qro.uw.r.appspot.com/api';
const SAVE_ON_SERVER = false;

const listsToEventListMatrix = lists => {
  const eventNameMap = {};
  for (const list of lists) {
    let obj = eventNameMap[list.event_id];
    if (obj !== undefined) {
      obj.push(list);
    } else {
      eventNameMap[list.event_id] = [list];
    }
  }

  const finalArray = [];
  for (const event_id of Object.keys(eventNameMap)) {
    finalArray.push(eventNameMap[event_id]);
  }

  return finalArray;
};

export const getUserDeliveryListsFromServer = async user => {
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;

  const config = {
    headers: {Authorization: `Bearer ${sessionObject.jwt}`},
  };

  const query = qs.stringify(
    {
      pagination: {
        page: 1,
        pageSize: 100000,
      },
      populate: '*',
      filters: {
        delivery_user: {
          id: {
            $eq: user.id,
          },
        },
        is_delivered: {
          $eq: false,
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  );

  const requestUrl = `${BASE_URL}/delivery-lists?${query}`;
  const response = await axios.get(requestUrl, config);
  // console.log('Response -> ', JSON.stringify(response.data, 2, ' '));

  let lists = [];
  for (const e of response.data.data) {
    const newList = {
      id: e.id,
      is_delivered: e.attributes.is_delivered,
      event_id: e.attributes.delivery_event.data.id,
      event_name: e.attributes.delivery_event.data.attributes.name,
      name: e.attributes.name,
      beneficiary_initials: e.attributes.beneficiary_initials,
    };
    lists.push(newList);
  }

  return listsToEventListMatrix(lists);
};

export const getUserDeliveryLists = async user => {
  const lists = await getDeliveryLists();
  return listsToEventListMatrix(lists);
};

export const getBeneficiariesFromDeliveryListFromServer = async (
  deliveryList,
  userId,
) => {
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;

  const config = {
    headers: {Authorization: `Bearer ${sessionObject.jwt}`},
  };

  const query = qs.stringify(
    {
      pagination: {
        page: 1,
        pageSize: 100000,
      },
      populate: '*',
      filters: {
        delivery_list_id: {
          $eq: deliveryList.id,
        },
        delivery_event_id: {
          $eq: deliveryList.event_id,
        },
        delivered_by_id: {
          $eq: userId,
        },
      },
      fields: [
        'status',
        'card_number',
        'beneficiary_id',
        'delivery_list_id',
        'full_address',
        'school_level',
        'program_social_id',
        'social_program_announcement_id',
        'delivered_by_id',
        'delivery_event_id',
        'amount',
        'beneficiary_gender',
        'beneficiary_age',
        'enrollment_id',
        'school_name',
        'locality_name',
        'city_name',
        'beneficiary_name',
        'beneficiary_lastname',
        'beneficiary_birthday',
        'beneficiary_email',
        'beneficiary_curp',
        'face_encodings',
      ],
    },
    {
      encodeValuesOnly: true,
    },
  );

  const requestUrl = `${BASE_URL}/deliveries?${query}`;
  const response = await axios.get(requestUrl, config);

  return response.data.data;
};

export const getBeneficiariesFromDeliveryList = async deliveryList => {
  const deliveries = await getDeliveries(deliveryList.id);
  return deliveries;
};

const saveDeliveryForUserInServer = async (userID, photo, signature, card) => {
  // submit photo and signature to server.
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  // Fetch  ++++++++++++++  Signature, Photo and NumberCard

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${sessionObject.jwt}`);

  const formdataPhoto = new FormData();
  const formdataSignature = new FormData();

  formdataPhoto.append('files', {
    name: photo.fileName,
    type: photo.type,
    uri: photo.uri,
  });

  formdataSignature.append('files', {
    name: `firma${Date.now()}`,
    type: 'image/jpeg',
    uri: signature,
  });

  formdataPhoto.append('ref', 'api::delivery.delivery');
  formdataPhoto.append('refId', userID);
  formdataPhoto.append('field', 'photo');

  formdataSignature.append('ref', 'api::delivery.delivery');
  formdataSignature.append('refId', userID);
  formdataSignature.append('field', 'receipt_photo');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdataPhoto,
    redirect: 'follow',
  };
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
      'https://wobz-government-dif-qro.uw.r.appspot.com/api/upload',
      requestOptions,
    );
  } catch (e) {
    return false;
  }

  try {
    await fetch(
      'https://wobz-government-dif-qro.uw.r.appspot.com/api/upload',
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

  return true;
};

const updateDeliveryLocally = async (
  deliveryID,
  photo,
  signaturePath,
  card,
) => {
  // save photo on disk
  // console.log('Miras datos foto => ', JSON.stringify(photo, 2, ' '));
  // const extension = photo.fileName.split('.').pop();
  // const path = `${DIRECTORY_FACE_PHOTOS}/delivery_${deliveryID}.${extension}`;
  // await fs.writeFile(path, photo.base64, 'base64');

  const updateDeliveryData = {
    photo: photo.uri,
    receipt_photo: signaturePath,
    status: 'delivered_with_validation',
    delivered_date: new Date().toISOString(),
  };

  return await saveDelivery(deliveryID, updateDeliveryData);
};

const updateSyncFlagOnDelivery = async (userID, photo, signature, card) => {
  // TODO: update locally delivery flag is_synced to true
};

export const updateDeliveryForUser = async (userID, photo, signature, card) => {
  // save delivery locally first:
  const response = await updateDeliveryLocally(userID, photo, signature, card);

  if (SAVE_ON_SERVER) {
    const network = await NetInfo.fetch();
    if (network.isConnected) {
      const responseServer = await saveDeliveryForUserInServer(
        userID,
        photo,
        signature,
        card,
      );
      if (responseServer) {
        // successfully saved on server;
        await updateSyncFlagOnDelivery(userID, photo, signature, card);
      }
    }
  }

  return response;
};
