export default class Logger {

  /**
   * @param {import('nlc-util/src/logger/LoggerBuilder').default} builder
   * @param {import('simple-node-logger/lib/Logger')} logger
   * @param {string} context
   */
  constructor(builder, logger, context) {
    this._builder = builder;
    this._logger = logger;
    this._context = context;
  }

  get logger() {
    return this._logger;
  }

  get context() {
    return this._context;
  }

  create(context, level = null) {
    return this._builder.logger(this.context + '>' + context, level);
  }

  all(...args) {
    this.logger.all(...args);
  }

  trace(...args) {
    this.logger.trace(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  fatal(...args) {
    this.logger.fatal(...args);
  }

}
