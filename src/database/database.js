import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from "./schema"
import termBank from "./models/termBank"
import tagBank from "./models/tagBank";
import TermTagRelations from "./models/termTagRelations";

// WatermelonDB setup
const adapter = new SQLiteAdapter({
  schema,
  jsi: true /* enable if Platform.OS === 'ios' */,
});
  
  const database = new Database({
    adapter,
    modelClasses: [termBank, tagBank, TermTagRelations],
    actionsEnabled: true,
  });
  

export default database;