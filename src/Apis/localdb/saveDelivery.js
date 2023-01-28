import fs from 'react-native-fs';
import {Q} from '@nozbe/watermelondb';
import WatermelonSingleton from '../../model/database';
import {getUserDeliveryLists, getBeneficiariesFromDeliveryList} from '../lists';

import {serverToWatermelonMap, watermelonToServerMap} from './helpers';
import {DIRECTORY_RECEIPT_PHOTOS, DIRECTORY_FACE_PHOTOS} from './helpers';

const saveDelivery = async (delivery_server_id, newData) => {
  const connection = new WatermelonSingleton();

  try {
    // update delivery on db
    await connection.db.write(async () => {
      const currDelivery = await connection.db
        .get('deliveries')
        .query(Q.where('id_db', delivery_server_id))
        .fetch();
      if (currDelivery.length > 0) {
        const record = currDelivery[0];
        await record.update(() => {
          for (const key of Object.keys(newData)) {
            const watermelonKey = serverToWatermelonMap[key];
            if (watermelonKey !== undefined) {
              record._raw[watermelonKey] = newData[key];
            }
          }
        });
      }
    });

    return true;
  } catch (error) {
    console.log('Error saving delivery', error);
    return false;
  }
};

export default saveDelivery;
