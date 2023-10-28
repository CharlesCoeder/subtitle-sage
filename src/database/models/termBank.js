// JMDict.js
import { Model } from "@nozbe/watermelondb";
import { field, json, children } from "@nozbe/watermelondb/decorators";

const sanitizeDefs = (rawDefs) => {
  const defs = Array.isArray(rawDefs) ? rawDefs : JSON.parse(rawDefs);
  return Array.isArray(defs) ? defs.map(String) : [];
};

export default class TermBank extends Model {
  static table = "termBank";
  static associations = {
    termTagRelations: { type: "has_many", foreignKey: "term_id" },
  };

  @field("term_text") term_text;
  @field("reading") reading;
  @field("rules") rules;
  @field("score") score;
  @json("definitions", sanitizeDefs) definitions;
  @field("sequence_num") sequence_num;
  @field("term_tags") term_tags;

  @children("termTagRelations") termTagRelations;
}
