import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";

export default class TagBank extends Model {
  static table = "tagBank";
  static associations = {
    termTagRelations: { type: "has_many", foreignKey: "tag_id" },
  };

  @field("tag_name") tag_name;
  @field("category") category;
  @field("sort_order") sort_order;
  @field("notes") notes;
  @field("score") score;

  @children("termTagRelations") termTagRelations;
}
