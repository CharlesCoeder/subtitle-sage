// JMDict.js
import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators'

const sanitizeReactions = rawReactions => {
  const parsed = JSON.parse(JSON.parse(rawReactions))
  return Array.isArray(parsed) ? parsed.map(String) : []
}

export default class termBank extends Model {
  static table = 'termBank';

  @field('termText') termText;  
  @field('reading') reading;
  @field('defTags') defTags;
  @field('rules') rules;
  @field('score') score;
  @json('definitions', sanitizeReactions) definitions;
  @field('sequenceNum') sequenceNum;
  @field('termTags') termTags;
}