const FindPackage = require('find-package-json');
const FS = require('fs');

const Bag = require('nlc-util/src/data/Bag');

module.exports = class Finder {

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
    const root = FindPackage(context).next();

    if (root !== undefined && root.value !== undefined) {
      console.log(root.value);
      const nlc = require.resolve(root.value.name + '/nlc.json');

      if (FS.existsSync(nlc)) {
        root.nlc = require(nlc);
        return root;
      }
    }
    return null;
  }

  /**
   *
   * @param {import('nlc-util/src/data/BagCollection')} collection
   * @param {string|module} context
   */
  register(collection, context) {
    const nlc = this.getNLC(context);
    collection.addBag(root.value.name, new Bag(nlc));

    if (nlc.nlc.extensions !== undefined) {
      for (const extension of nlc.nlc.extensions) {
        this.register(collection, extension);
      }
    }
  }

}
