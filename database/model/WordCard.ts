// WordCard.ts
import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, writer } from "@nozbe/watermelondb/decorators";

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

  @writer async review(grade: 0 | 1 | 2) {
    const now = Date.now();
    let newRepetition = this.repetition;
    let newInterval = this.interval;
    let newEFactor = this.efactor;

    if (grade === 0) {
      // User forgot the word
      newRepetition = 0;
      newInterval = 1;
    } else {
      newRepetition += 1;
      if (newRepetition === 1) {
        newInterval = 1;
      } else if (newRepetition === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(this.interval * this.efactor);
      }
      newEFactor = this.efactor + (grade === 2 ? 0.1 : grade === 1 ? 0 : -0.2);
      if (newEFactor < 1.3) {
        newEFactor = 1.3;
      }
    }

    const newNextReview = now + newInterval * 24 * 60 * 60 * 1000;

    await this.update((card) => {
      card.repetition = newRepetition;
      card.interval = newInterval;
      card.efactor = newEFactor;
      card.nextReview = newNextReview;
      card.status = grade === 0 ? "learning" : "learning"; // You can change if you want
    });
  }
}
