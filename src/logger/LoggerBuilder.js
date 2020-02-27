import SimpleNodeLogger from 'simple-node-logger';
import ConsoleAppender from 'simple-node-logger/lib/ConsoleAppender';
import FS from 'fs';

import Logger from 'nlc-util/src/logger/Logger';



export default class NLCLogger {

  constructor(quite = false) {
    this._quite = quite;
    this._manager = SimpleNodeLogger.createLogManager();
    this._level = null;
  }

  get manager() {
    return this._manager;
  }

  install(config = {}, isCli = false) {
    if (isCli) {
      this.manager.getAppenders().pop();
    }

    if (config.appender !== undefined) {
      for (const appender of config.appender) {
        this.addAppender(appender, isCli);
      }
    }

    if (config.level !== undefined) {
      this._level = config.level || 'all';
    }
  }

  addAppender(appender, isCli = false) {
    switch (appender.type) {
      case 'console':
        if (!isCli) {
          this.manager.createConsoleAppender(appender);
        }
        break;
      case 'file':
        this.manager.createFileAppender(appender);
        break;
      case 'rollingfile':
        if (appender.logDirectory !== undefined) {
          if (!FS.existsSync(appender.logDirectory)) {
            if (!this._quite) {
              console.warn('[BOOT LOGGER] Creating unexisting log directory "' + appender.logDirectory + '"');
            }
            FS.mkdirSync(appender.logDirectory);
            if (!this._quite) {
              console.log('[BOOT LOGGER] Created log directory "' + appender.logDirectory + '"');
            }
          }
        }
        this.manager.createRollingFileAppender(appender);
        break;
      default:
        console.error('ERROR: Unknown appender type "' + appender.type + '"');
        break;
    }
  }

  /**
   * @param {string} context
   * @param {string} level
   */
  logger(context, level = null) {
    return new Logger(this, this.manager.createLogger('[' + context.toUpperCase() + ']', level || this._level), context);
  }

}
