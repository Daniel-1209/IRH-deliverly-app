import fs from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import WatermelonSingleton from '../../model/database';
import {
  getUserDeliveryListsFromServer,
  getBeneficiariesFromDeliveryListFromServer,
} from '../lists';

import {
  serverToWatermelonMap,
  watermelonToServerMap,
  DIRECTORY_PROFILE_PHOTOS,
} from './helpers';

const saveImageToDiskFromURL = async url => {
  const fileName = url.split('/').pop();
  const path = `${DIRECTORY_PROFILE_PHOTOS}/${fileName}`;
  const config = {
    fromUrl: url, // URL to download file from
    toFile: path, // Local filesystem path to save the file to
    background: false, // Continue the download in the background after the app terminates (iOS only)
    discretionary: false, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
  };

  try {
    const downloadResult = await fs.downloadFile(config).promise;
    if (downloadResult.statusCode === 200) {
      return path;
    }
  } catch (error) {
    console.log('error downloading image: ', error);
  }

  return '';
};

const getDeliveryToSave = async (deliveryId, deliveryServer) => {
  const watermelonDelivery = {};

  for (const key in deliveryServer) {
    if (deliveryServer.hasOwnProperty(key)) {
      const watermelonKey = serverToWatermelonMap[key];
      if (watermelonKey !== undefined) {
        if (key === 'profile_photo') {
          // save photo localy and store URL.
          if (
            deliveryServer[key] &&
            deliveryServer[key].data &&
            deliveryServer[key].data.attributes &&
            deliveryServer[key].data.attributes.url
          ) {
            const photoUrl = deliveryServer[key].data.attributes.url;
            const localUrl = await saveImageToDiskFromURL(photoUrl);
            watermelonDelivery[watermelonKey] = localUrl;
          } else {
            watermelonDelivery[watermelonKey] = '';
          }
        } else if (key === 'photo' || key === 'receipt_photo') {
          watermelonDelivery[watermelonKey] = '';
        } else if (deliveryServer[key] === null) {
          watermelonDelivery[key] = '';
        } else {
          watermelonDelivery[watermelonKey] = deliveryServer[key];
        }
      }
    }
  }
  watermelonDelivery.id_db = deliveryId;

  return watermelonDelivery;
};

const removeAndCreateLists = async (connection, user) => {
  const listCollection = await connection.db
    .get('deliverylists')
    .query()
    .fetch();
  await connection.db.write(async () => {
    for (const list of listCollection) {
      await list.destroyPermanently();
    }
  });

  const listsFromServer = await getUserDeliveryListsFromServer(user);
  for (const event of listsFromServer) {
    for (const list of event) {
      await connection.db.write(async () => {
        await connection.db.get('deliverylists').create(newList => {
          newList._raw.id_db = list.id;
          newList._raw.name = list.name;
          newList._raw.beneficiary_initials = list.beneficiary_initials;
          newList._raw.event_id_db = list.event_id;
          newList._raw.event_name = list.event_name;
        });
      });
    }
  }

  return listsFromServer;
};

const removeCurrentDelivers = async connection => {
  const deliveryCollection = await connection.db
    .get('deliveries')
    .query()
    .fetch();
  await connection.db.write(async () => {
    for (const dbDeliver of deliveryCollection) {
      await dbDeliver.destroyPermanently();
    }
  });
};

const initialDeliveryLoad = async user => {
  const network = await NetInfo.fetch();

  if (network.isConnected) {
    const connection = new WatermelonSingleton();
    await removeCurrentDelivers(connection);
    const listsOfEvents = await removeAndCreateLists(connection, user);

    for (const lists of listsOfEvents) {
      for (const list of lists) {
        // console.log('Mira la lista ', list);
        const deliveries = await getBeneficiariesFromDeliveryListFromServer(
          list,
          user.id,
        );
        // console.log('SERVER deliveries: ', deliveries);
        if (deliveries.length > 0) {
          for (const delivery of deliveries) {
            const deliveryId = delivery.id;
            const attr = delivery.attributes;
            const dataToSave = await getDeliveryToSave(deliveryId, attr);
            await connection.db.write(async () => {
              const saved = await connection.db
                .get('deliveries')
                .create(newDelivery => {
                  for (const key of Object.keys(watermelonToServerMap)) {
                    newDelivery._raw[key] = dataToSave[key];
                  }
                });
              // console.log('saved: ', saved);
            });
          }
        }
      }
    }
    return true;
  } else {
    console.log('no internet connection');
    return false;
  }
};

export default initialDeliveryLoad;
