// JMDict.js
import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators'

const sanitizeDefs = rawDefs => {
  const defs = Array.isArray(rawDefs) ? rawDefs : JSON.parse(rawDefs);
  return Array.isArray(defs) ? defs.map(String) : []
}

export default class termBank extends Model {
  static table = 'termBank';

  @field('term_text') term_text;  
  @field('reading') reading;
  @field('def_tags') def_tags;
  @field('rules') rules;
  @field('score') score;
  @json('definitions', sanitizeDefs) definitions;
  @field('sequence_num') sequence_num;
  @field('term_tags') term_tags;
}