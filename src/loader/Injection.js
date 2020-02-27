import { ContainerBuilder, JsonFileLoader } from 'node-dependency-injection';

import Reflection from 'nlc-util/src/data/Reflection';



export default class Injection {

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

  init() {
    this._logger = NLC.logger.logger('util');
  }

  /**
   * @param {string} service
   */
  get(service) {
    return this.container.get(service);
  }

  /**
   * @param {string} service
   * @param {object} object
   * @param {array} args
   */
  register(service, object = null, args = []) {
    return this.container.register(service, object, args);
  }

  /**
   * @param {string} service
   * @param {Object} instance
   */
  set(service, instance) {
    return this.container.set(service, instance);
  }

  /**
   * @param {string} tag
   */
  findTags(tag) {
    return this.container.findTaggedServiceIds(tag);
  }

  /**
   * @param {string} tag
   * @param {Map<string, any>} service_results
   */
  getRelevantTags(tag, service_results) {
    const services = [];

    for (const [key, definition] of service_results) {
      for (const definition_tag of definition.tags) {
        if (definition_tag.name === tag) {
          services.push({
            key,
            attributes: definition_tag.attributes,
          });
        }
      }
    }

    services.sort((a, b) => {
      return (Number.parseInt(a.attributes.get('weight')) || 0) - (Number.parseInt(b.attributes.get('weight')) || 0);
    });
    return services;
  }

  /**
   * @param {string} tag
   * @param  {...any} params
   */
  trigger(tag, ...params) {
    const services = this.getRelevantTags(tag, this.findTags(tag));

    for (const service of services) {
      const method = (service.attributes.get('method') || Reflection.getFunctionNameFromKey(tag));
      this._logger.trace('Trigger event: ' + service.key + ':' + method + '()');
      this.get(service.key)[method](...params);
    }
  }

}
