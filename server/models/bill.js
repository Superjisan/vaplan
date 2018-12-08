import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const historySchema = new Schema({
    text: {type: 'String'},
    date: {type: 'String'}
})

const billSchema = new Schema({
  number: { type: 'String', required: true },
  name: { type: 'String', required: true },
  committeeText: { type: 'String' },
  subcommitteeText: { type: 'String' },
  sponsor: {type: 'String'},
  link: {type: 'String'},
  historyItems: [historySchema],
  isFavorite: {type: 'Boolean'}
});

export const History = mongoose.model('History', historySchema)
export const Bill =  mongoose.model('Bill', billSchema);