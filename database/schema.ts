import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: "word_cards",
      columns: [
        { name: "word", type: "string" },
        { name: "lemma", type: "string" },
        { name: "meaning", type: "string" },
        { name: "sentence", type: "string" },
        { name: "status", type: "string" }, // 'learning' | 'known' | 'removed'
        { name: "interval", type: "number" },
        { name: "repetition", type: "number" },
        { name: "efactor", type: "number" },
        { name: "next_review", type: "number" },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "deleted_words",
      columns: [
        { name: "word", type: "string" },
        { name: "deleted_at", type: "number" },
      ],
    }),
  ],
});
