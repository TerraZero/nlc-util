import Path from 'path';
import Glob from 'glob';

import Bag from 'nlc-util/src/data/Bag';
import BagCollection from 'nlc-util/src/data/BagCollection';


/** @type {CollectionFactory} */
let singleton = null;

export default class CollectionFactory {

  /**
   * @param {string} pattern
   * @param {boolean} simple
   * @returns {(Bag|BagCollection)}
   */
  static create(pattern, simple = false) {
    return singleton.create(pattern, simple);
  }

  /**
   * @param {import('nlc/src/Core').default} core
   */
  constructor(core) {
    this._core = core;
    singleton = this;
  }

  /**
   * @param {string} pattern
   * @param {boolean} simple
   * @returns {(Bag|BagCollection)}
   */
  create(pattern, simple = false) {
    const collection = (simple ? new Bag() : new BagCollection());
    for (const [name, mod] of this._core.extensions.bags) {
      const path = Path.join(Path.dirname(mod.get('_path')), 'src');
      const results = Glob.sync(pattern, {
        cwd: path,
        absolute: true,
      });

      if (results.length) {
        const bag = (simple ? collection : new Bag());

        for (const file of results) {
          const subject = require(file).default;

          bag.set(subject.name, {
            file,
            subject,
            path
          });
        }

        if (!simple) {
          collection.addBag(name, bag);
        }
      }
    }
    return collection;
  }

}
