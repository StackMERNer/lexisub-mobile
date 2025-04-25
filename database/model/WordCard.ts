// WordCard.ts
import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class WordCard extends Model {
  static table = "word_cards";

  @field("word") word!: string;
  @field("sentence") sentence!: string;
  @field("meaning") meaning!: string;
  @field("status") status!: string; // or use enum if you prefer
  @field("interval") interval!: number;
  @field("repetition") repetition!: number;
  @field("efactor") efactor!: number;
  @field("next_review") nextReview!: number;
  @readonly @date("created_at") createdAt!: number;
}
