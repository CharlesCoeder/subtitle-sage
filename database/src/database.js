import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import schema from "./model/schema";
import termBank from "./model/termBank";
import tagBank from "./model/tagBank";
import TermTagRelations from "./model/termTagRelations";

// WatermelonDB setup
const adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  });
  
  const database = new Database({
    adapter,
    modelClasses: [termBank, tagBank, TermTagRelations],
    actionsEnabled: true,
  });
  

export default database;