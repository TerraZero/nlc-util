import FindPackage from 'find-package-json';
import FS from 'fs';
import Path from 'path';

import Bag from 'nlc-util/src/data/Bag';

export default class Finder {

  constructor(require) {
    this._require = require;
  }

  /**
   * @param {string|module} context
   */
  getInfo(context) {
    const root = FindPackage(context).next();

    if (root !== undefined && root.value !== undefined) {
      return root;
    }
    return null;
  }

  getNLC(context) {
    try {
      const path = this._require.resolve(context + '/nlc.json');

      if (FS.existsSync(path)) {
        const nlc = this._require(path);

        nlc._path = path;
        return nlc;
      }
    } catch (e) { }
    return null;
  }

  /**
   *
   * @param {import('nlc-util/src/data/BagCollection')} collection
   * @param {string|module} context
   */
  register(collection, context) {
    if (Path.isAbsolute(context)) {
      context = Path.parse(context).base;
    }
    const nlc = this.getNLC(context);
    if (nlc === null) return;

    collection.addBag(context, new Bag(nlc));

    if (nlc.extensions !== undefined) {
      for (const extension of nlc.extensions) {
        this.register(collection, extension);
      }
    }
  }

}
