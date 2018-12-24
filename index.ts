/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */
function exclude(...excludes: any[]) {
  function excludeProps(res: object, obj: object) {
    for (const key of Object.keys(obj)) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    }
  }

  return function extendExclude(...args: any[]) {
    let i = 0,
      res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
}

export class AssertionError<T = {}> extends Error {
  name = "AssertionError";
  showDiff: boolean;
  /**
   * ### AssertionError
   *
   * An extension of the JavaScript `Error` constructor for
   * assertion and validation scenarios.
   *
   * @param {String} message
   * @param {Object} properties to include (optional)
   * @param {callee} start stack function (optional)
   */
  constructor(message?: string, _props?: T, ssf?: Function) {
    super();
    let extend = exclude("name", "message", "stack", "constructor", "toJSON"),
      props = extend(_props || {});

    // default values
    this.message = message || "Unspecified AssertionError";
    this.showDiff = false;

    // copy from properties
    for (const key in props) {
      this[key] = props[key];
    }

    // capture stack trace
    ssf = ssf || AssertionError;
    if (Error["captureStackTrace"]) {
      Error["captureStackTrace"](this, ssf);
    } else {
      try {
        throw new Error();
      } catch (e) {
        this.stack = e.stack;
      }
    }
  }
  /**
   * Allow errors to be converted to JSON for static transfer.
   *
   * @param {Boolean} include stack (default: `true`)
   * @return {Object} object that can be `JSON.stringify`
   */
  toJSON(stack?: boolean): object {
    let extend = exclude("constructor", "toJSON", "stack"),
      props = extend({ name: this.name }, this);

    // include stack if exists and not turned off
    if (false !== stack && this.stack) {
      props["stack"] = this.stack;
    }

    return props;
  }
}
