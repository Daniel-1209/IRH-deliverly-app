import NetInfo from '@react-native-community/netinfo';
import WatermelonSingleton from '../../model/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const saveDeliveryForUserInServer = async (deliveryId, deliveryData) => {
  // submit photo and signature to server.
  const session = await AsyncStorage.getItem('@USER_SESSION');
  const sessionObject = JSON.parse(session).data;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${sessionObject.jwt}`);

  var config = {
    method: 'PUT',
    url: `https://wobz-government-dif-qro.uw.r.appspot.com/api/deliveries/${deliveryId}`,
    headers: {
      Authorization: `Bearer ${sessionObject.jwt}`,
    },
    data: {
      data: {
        status: deliveryData.status,
        delivered_date: deliveryData.delivered_date,
      },
    },
  };

  try {
    await axios(config);
  } catch (e) {
    console.log(e);
    console.log(e.message);
    return false;
  }

  return true;
};

const syncDelivery = async () => {
  const network = await NetInfo.fetch();

  if (network.isConnected) {
    const connection = new WatermelonSingleton();

    try {
      const deliveriesCollection = await connection.db
        .get('deliveries')
        .query()
        .fetch();

      // transform to server keys objects:
      for (const currDeliver of deliveriesCollection) {
        const curr = currDeliver._raw;
        // console.log('Mira tu beneficiario >>>>> ',JSON.stringify( curr, 2, ' '));
        if (curr.status !== 'no_delivered') {
          const deliverId = curr.id_db;
          const data = {
            photo: curr.photo,
            receipt_photo: curr.receipt_photo,
            status: curr.status,
          };
          if (curr.delivered_date !== '') {
            data.delivered_date = curr.delivered_date;
          }

          const resp = await saveDeliveryForUserInServer(deliverId, data);
          if (!resp) {
            console.log('Error saving delivery to server');
            return false;
          }
        }
      }
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

export default syncDelivery;
