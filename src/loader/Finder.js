import FindPackage from 'find-package-json';
import FS from 'fs';
import Path from 'path';

import Bag from 'nlc-util/src/data/Bag';



export default class Finder {

  constructor(require) {
    this._require = require;
    this._loaded = [];
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
   * @param {import('nlc-util/src/data/BagCollection').default} collection
   * @param {string|module} context
   * @param {import('nlc-util/src/logger/Logger').default} logger
   */
  register(collection, context, logger) {
    if (Path.isAbsolute(context)) {
      context = Path.parse(context).base;
    }

    const nlc = this.getNLC(context);
    if (nlc === null) return;

    if (this._loaded.includes(context)) return;
    this._loaded.push(context);

    logger.trace('Register: ' + context);
    collection.addBag(context, new Bag(nlc));

    if (nlc.extensions !== undefined) {
      for (const extension of nlc.extensions) {
        logger.trace('Register extension: ' + extension);
        this.register(collection, extension, logger);
      }
    }
  }

}
