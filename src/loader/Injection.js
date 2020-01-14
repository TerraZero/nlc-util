const { ContainerBuilder, JsonFileLoader } = require('node-dependency-injection');

module.exports = class Injection {

  constructor() {
    this._container = new ContainerBuilder();
    this._loader = new JsonFileLoader(this._container);
  }

  get container() {
    return this._container;
  }

  get loader() {
    return this._loader;
  }

}
