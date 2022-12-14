import { EventEmitter } from "events";

import { ILogEntry } from "@interface/Logger";

export default class Logger {
  private logManager: EventEmitter;
  private minLevel: number;
  private module: string;
  private readonly levels: { [key: string]: number } = {
    'trace': 1,
    'debug': 2,
    'info': 3,
    'warn': 4,
    'error': 5
  };

  constructor(logManager: EventEmitter, module: string, minLevel: string) {
    this.logManager = logManager;
    this.module = module;
    this.minLevel = this.levelToInt(minLevel);
  }

  private levelToInt(minLevel: string): number {
    const minLowerCase = minLevel.toLowerCase();
    return minLowerCase in this.levels ? this.levels[minLowerCase] : 99
  }

  public log(logLevel: string, message: string) {
    const level = this.levelToInt(logLevel);
    if (level < this.minLevel) return;

    const logEntry: ILogEntry = { level: logLevel, module: this.module, message };

    const error = new Error("");
    if (error.stack) {
      const cla = error.stack.split("\n");
      let idx = 1;
      while (idx < cla.length && cla[idx].includes("at Logger.Object.")) idx++;
      if (idx < cla.length)
        logEntry.location = cla[idx].slice(cla[idx].indexOf("at ") + 3, cla[idx].length);
    }

    this.logManager.emit('log', logEntry);
  }

  public trace(message: string) { this.log('trace', message); }
  public debug(message: string) { this.log('debug', message); }
  public info(message: string) { this.log('info', message); }
  public warn(message: string) { this.log('warn', message); }
  public error(message: string) { this.log('error', message); }
}
