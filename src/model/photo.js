import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Photo extends Model {
  static table = 'photos';

  @field('user_id_db') userIdDb;
  @field('delivery_id_db') deliveryIdDb;
  @field('field_to_fill') fieldToFill;
  @field('photo') photo;
  @field('isSynced') isSynced;
}
