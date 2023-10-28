import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "termBank",
      columns: [
        { name: "term_text", type: "string", isIndexed: true },
        { name: "reading", type: "string" },
        { name: "rules", type: "string" },
        { name: "score", type: "number" },
        { name: "definitions", type: "string", isOptional: true },
        { name: "sequence_num", type: "number", isOptional: true },
        { name: "term_tags", type: "string", isOptional: true },
      ],
    }),

    tableSchema({
      name: "tagBank",
      columns: [
        { name: "tag_name", type: "string" },
        { name: "category", type: "string" },
        { name: "sort_order", type: "number" },
        { name: "notes", type: "string" },
        { name: "score", type: "number" },
      ],
    }),

    // each term in termBank can have multiple tags,
    // so we need another table to handle the many-to-many relationship
    tableSchema({
      name: "termTagRelations",
      columns: [
        { name: "term_id", type: "string", isIndexed: true },
        { name: "tag_id", type: "string", isIndexed: true },
      ],
    }),

    tableSchema({
      name: "kanjiBank",
      columns: [
        { name: "kanji", type: "string" },
        { name: "onyomi", type: "string" },
        { name: "kunyomi", type: "string" },
        { name: "tags", type: "string" },
        { name: "meaning", type: "string", isOptional: true },
        { name: "stats", type: "string", isOptional: true },
      ],
    }),
  ],
});

export default mySchema;
