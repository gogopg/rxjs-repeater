import * as _ from "lodash";
import * as Rx from "rxjs";
import { takeUntil } from "rxjs/operators";

class Repeater {
  constructor(target, options?, handler?) {
    this.target = target;
    this.tick = 0;
    this.repeater = null;
    this.interval = 1000; // default value are 1000m sec
    this.enableCache = true; // default value are true
    this.cache = null;
    this.successHandler = null;
    this.failureHandler = null;
    this.isPause = false;

    this.onSuccess$ = new Rx.BehaviorSubject();
    this.onError$ = new Rx.BehaviorSubject();

    this.isNotResponse = false;

    if (options) {
      this.setOptions(options);
    }

    if (handler) {
      this.setHandler(handler);
    }
    this.fetchTrigger = new Rx.BehaviorSubject();
    this.stopTrigger = new Rx.Subject();
    this.repeating();
  }

  repeating() {
    if (!this.repeater) {
      const timer$ = Rx.timer(0, this.interval);

      this.repeater = Rx.merge(timer$, this.fetchTrigger)
        .pipe(takeUntil(this.stopTrigger))
        .subscribe(() => {
          if (this.isPause || this.isNotResponse) {
            return;
          }

          this.tick += 1;

          this.isNotResponse = true;
          this.target.subscribe(data => {
            try {
              this.isNotResponse = false;

              if (this.successHandler) {
                this.onSuccess$.next(this.successHandler(data));
              } else {
                this.onSuccess$.next(data);
              }
            } catch (err) {
              if (this.failureHandler) {
                this.onError$.next(this.failureHandler(err));
              } else {
                this.onError$.next(err);
              }
            }
          });
        });
    }
  }

  setOptions(options) {
    this.interval = _.get(options, "interval")
      ? _.get(options, "interval")
      : this.interval;
    this.enableCache = _.get(options, "enableCache")
      ? _.get(options, "enableCache")
      : this.enableCache;
  }

  setHandler(handler) {
    this.successHandler = _.get(handler, "successHandler");
    this.failureHandler = _.get(handler, "failureHandler");
  }

  pause() {
    this.isPause = true;
    return this;
  }

  start() {
    this.isPause = false;
    return this;
  }

  stop() {
    this.stopTrigger.next(null);
  }

  refresh() {
    this.fetchTrigger.next();
    return this;
  }

  async getData() {
    return await this.target.toPromise().then(d => {
      this.onSuccess$.next(d);
      return Promise.resolve(d);
    });
  }

  setInterval(interval) {
    this.interval = interval;
  }
}

module.exports = Repeater;
