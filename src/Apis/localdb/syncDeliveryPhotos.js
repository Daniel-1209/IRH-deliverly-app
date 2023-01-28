import NetInfo from '@react-native-community/netinfo';
import WatermelonSingleton from '../../model/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const uploadDeliveriesPhotos = async (deliveryId, deliveryData) => {
  // submit photo and signature to server.
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${sessionObject.jwt}`);

  if (deliveryData.photo) {
    const formdataPhoto = new FormData();

    formdataPhoto.append('files', {
      name: `foto${Date.now()}`,
      type: 'image/jpeg',
      uri: `file://${deliveryData.photo}`,
    });

    formdataPhoto.append('ref', 'api::delivery.delivery');
    formdataPhoto.append('refId', deliveryId);
    formdataPhoto.append('field', 'photo');

    const requestOptionsPhoto = {
      method: 'POST',
      headers: myHeaders,
      body: formdataPhoto,
      redirect: 'follow',
    };

    try {
      await fetch(
        'https://wobz-government-dif-qro.uw.r.appspot.com/api/upload',
        requestOptionsPhoto,
      );
    } catch (e) {
      console.log(e);
      console.log(e.message);
      return false;
    }
  }

  if (deliveryData.receipt_photo) {
    const formdataPhotoReceipt = new FormData();

    formdataPhotoReceipt.append('files', {
      name: `firma${Date.now()}`,
      type: 'image/png',
      uri: `file://${deliveryData.receipt_photo}`,
    });

    formdataPhotoReceipt.append('ref', 'api::delivery.delivery');
    formdataPhotoReceipt.append('refId', deliveryId);
    formdataPhotoReceipt.append('field', 'receipt_photo');

    const requestOptionsPhotoReceipt = {
      method: 'POST',
      headers: myHeaders,
      body: formdataPhotoReceipt,
      redirect: 'follow',
    };

    try {
      await fetch(
        'https://wobz-government-dif-qro.uw.r.appspot.com/api/upload',
        requestOptionsPhotoReceipt,
      );
    } catch (e) {
      console.log(e);
      console.log(e.message);
      return false;
    }
  }

  return true;
};

const syncDeliveryPhotos = async () => {
  const network = await NetInfo.fetch();

  if (network.isConnected) {
    const connection = new WatermelonSingleton();

    try {
      const deliveriesCollection = await connection.db
        .get('deliveries')
        .query()
        .fetch();
      const idOfUsersInDb = [];

      // transform to server keys objects:
      for (const currDeliver of deliveriesCollection) {
        const curr = currDeliver._raw;
        // console.log('Mira tu beneficiario en subida de Foto >>>>> ',JSON.stringify( curr, 2, ' '));
        //  Aqui voy a ver si el usurio ya fue subido anteriormente como liberado

        if (!curr.is_synced) {
          const deliverId = curr.id_db;
          const data = {
            photo: curr.photo,
            receipt_photo: curr.receipt_photo,
            status: curr.status,
            delivered_date: new Date().toISOString(),
          };

          const resp = await uploadDeliveriesPhotos(deliverId, data);
          if (!resp) {
            console.log('Error saving delivery to server');
            return false;
          } else {
            // Changing your sync state
            if (curr.status !== 'no_delivered') {
              if (!curr.is_synced) {
                idOfUsersInDb.push(curr.id);
              }
            }
          }
        }
      }

      // Update users livered
      await connection.db.write(async () => {
        for (let i = 0; i < idOfUsersInDb.length; i += 1) {
          const user = await connection.db
            .get('deliveries')
            .find(idOfUsersInDb[i]);
          //  console.log('Miraaaaaaa -:> ', user);
          user.update(() => {
            user.isSynced = true;
          });
        }
      });

      return true;
    } catch (error) {
      console.log('Error executing query', error);
      return false;
    }
  } else {
    console.log('no internet connection');
    return false;
  }
};

export default syncDeliveryPhotos;
