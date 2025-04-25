import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class DeletedWord extends Model {
  static table = "deleted_words";
  @field("word") word!: string;
  @readonly @date("deleted_at") deletedAt!: number;
}
