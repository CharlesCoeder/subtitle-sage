// JMDict.js
import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators'

const sanitizeDefs = rawDefs => {
  const defs = Array.isArray(rawDefs) ? rawDefs : JSON.parse(rawDefs);
  return Array.isArray(defs) ? defs.map(String) : []
}

export default class termBank extends Model {
  static table = 'termBank';

  @field('termText') termText;  
  @field('reading') reading;
  @field('defTags') defTags;
  @field('rules') rules;
  @field('score') score;
  @json('definitions', sanitizeDefs) definitions;
  @field('sequenceNum') sequenceNum;
  @field('termTags') termTags;
}