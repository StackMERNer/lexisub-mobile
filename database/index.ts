import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { schema } from "./schema";
import WordCard from "./model/WordCard";
import DeletedWord from "./model/DeletedWord";

const adapter = new SQLiteAdapter({ schema });

export const database = new Database({
  adapter,
  modelClasses: [WordCard, DeletedWord],
});
