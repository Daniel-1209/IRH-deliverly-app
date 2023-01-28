import {Platform} from 'react-native';
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from '../../src/model/schema';
import migrations from '../../src/model/migrations';
import Delivery from '../../src/model/delivery';
import Photo from '../../src/model/photo';
import DeliveryList from '../../src/model/deliveryLists';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  dbName: 'wobzdeliverydb',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: Platform.OS === 'ios',
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

export default class WatermelonSingleton {
  constructor() {
    this.db = new Database({
      adapter,
      modelClasses: [DeliveryList, Delivery, Photo],
    });

    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }
}
