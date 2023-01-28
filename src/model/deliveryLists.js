import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class DeliveryList extends Model {
  static table = 'deliverylists';

  @field('id_db') idDb;
  @field('event_id_db') eventIdDb;
  @field('event_name') eventName;
  @field('name') name;
  @field('beneficiary_initials') beneficiaryInitials;
}
