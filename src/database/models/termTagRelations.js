import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class TermTagRelations extends Model {
  static table = "termTagRelations";
  static associations = {
    termBank: { type: "belongs_to", key: "term_id" },
    tagBank: { type: "belongs_to", key: "tag_id" },
  };

  @relation("termBank", "term_id") term;
  @relation("tagBank", "tag_id") tag;

  @field("term_id") term_id;
  @field("tag_id") tag_id;
}
