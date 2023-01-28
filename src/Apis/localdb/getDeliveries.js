import {Q} from '@nozbe/watermelondb';
import WatermelonSingleton from '../../model/database';
import {watermelonToServerMap} from './helpers';

const getDeliveriesByDeliveryListId = async delivery_list_id => {
  const connection = new WatermelonSingleton();
  try {
    const deliveriesCollection = await connection.db
      .get('deliveries')
      .query(Q.where('delivery_list_id_db', delivery_list_id))
      .fetch();

    // transform to server keys objects:
    const newArray = [];
    for (const currDeliver of deliveriesCollection) {
      const curr = currDeliver._raw;
      const newObj = {};
      for (const watermelonKey of Object.keys(curr)) {
        const serverKey = watermelonToServerMap[watermelonKey];
        if (serverKey !== undefined) {
          newObj[serverKey] = curr[watermelonKey];
        }
      }
      newArray.push({id: newObj.id, attributes: newObj});
    }

    return newArray;
  } catch (error) {
    console.log('Error executing query', error);
    return false;
  }
};

export default getDeliveriesByDeliveryListId;
