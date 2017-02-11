/**
 * If all major browsers and Node.js versions support ES2015, this file is unnecessary.
 * Currently, we need to determine a `class` syntax is available or not because:
 *  - A constructor defined by `class` can be extended only as `class`.
 *  - A constructor defined by `function` can be extended as `function` or `class`.
 *  Therefore if we extend a given class as `function` using `prototype` it throws an error
 *  in case the given class is defined by `class`. In that case we can use `class` to extend
 *  but need to use `eval` to avoid syntax error on runtime where `class` is not available.
 */

/* eslint-disable no-eval */

import * as es2015 from './es2015Features';

// eslint-disable-next-line no-unused-vars
const extendByClass = (OriginalClass, initialize) => {
  return eval(`
    class WrampSubClass extends OriginalClass {
      constructor() {
        super(...arguments)
        initialize(this)
      }
    };
    WrampSubClass
  `);
};

// XXX: We can't use `apply` for `super`.
// eslint-disable-next-line no-unused-vars
const extendByClassWithoutSpread = (OriginalClass, initialize) => {
  return eval(`
    class WrampSubClass extends OriginalClass {
      constructor(a,b,c,d,e,f,g,h,i,j) {
        super(a,b,c,d,e,f,g,h,i,j)
        initialize(this)
      }
    };
    WrampSubClass
  `);
};

const extendByPrototype = (OriginalClass, initialize) => {
  function WrampSubClass(...args) {
    OriginalClass.apply(this, args);
    initialize(this);
  }
  WrampSubClass.prototype = Object.create(OriginalClass.prototype);
  WrampSubClass.prototype.constructor = WrampSubClass;

  return WrampSubClass;
};

export default function getClassExtender({
  classSyntax = es2015.classSyntax,
  spreadOperator = es2015.spreadOperator,
} = {}) {
  if (classSyntax && spreadOperator) {
    return extendByClass;
  }
  else if (classSyntax) {
    return extendByClassWithoutSpread;
  }
  return extendByPrototype;
}
