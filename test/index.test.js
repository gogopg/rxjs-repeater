import * as Rx from "rxjs";
import { delay } from "rxjs/operators";
import Repeater from "../src";

describe("core test", () => {
  test("basic test", () => {
    const arr = [1];
    const target = Rx.from(arr);
    const repeater = new Repeater(target);

    repeater.onSuccess$.subscribe(data => {
      expect(data).toBe(arr[0]);
    });
  });

  test("when observable are slower than tick", done => {
    const target = Rx.of(1).pipe(delay(100));
    const option = {
      interval: 50
    };
    const repeater = new Repeater(target, option);
    let count = 0;
    repeater.onSuccess$.subscribe(() => {
      count += 1;
    });

    setInterval(() => {
      repeater.pause();
      expect(count).toBeGreaterThanOrEqual(4);
      expect(count).toBeLessThanOrEqual(6);

      done();
    }, 500);
  });

  test("set interval test", done => {
    const arr = [1];
    const target = Rx.from(arr);
    const option = {
      interval: 50
    };
    const repeater = new Repeater(target, option);

    setInterval(() => {
      repeater.pause();
      expect(repeater.tick).toBeGreaterThanOrEqual(9);
      expect(repeater.tick).toBeLessThanOrEqual(11);
      repeater.pause();
      done();
    }, 500);
  });

  test("on success", () => {
    const arr = [1];
    const target = Rx.from(arr);
    const option = {};
    const handler = {
      successHandler(data) {
        return data + 1;
      }
    };

    const repeater = new Repeater(target, option, handler);
    repeater.onSuccess$.subscribe(data => {
      expect(data).toBe(2);
    });
  });

  test("get data test", async () => {
    let counter = 0;
    const targetObservable = Rx.Observable.create(observer => {
      observer.next(counter);
      counter += 1;
    });

    const option = {
      interval: 500
    };
    const handler = {
      successHandler(data) {
        return data + 1;
      }
    };

    const repeater = new Repeater(targetObservable, option, handler);

    repeater.onSuccess$.subscribe(data => {
      console.log("data arrived", data);
    });

    setTimeout(async () => {
      console.log("result of getData()", await repeater.getData());
    }, 750);
  });
});
