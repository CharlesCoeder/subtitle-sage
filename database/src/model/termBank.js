// JMDict.js
import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators'

const sanitizeDefs = rawDefs => {
  return Array.isArray(rawDefs) ? rawDefs.map(String) : []
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