import Reflection from 'nlc-util/src/data/Reflection';



export default class Err extends Error {

  constructor(message, placeholders, inserter = '"') {
    super(Reflection.replaceMessage(message, placeholders, inserter));
  }

}
