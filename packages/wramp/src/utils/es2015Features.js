/**
 * Expose boolean values that represent a ES2015 feature is available or not.
 * This flags are necessary to extend a class on different JS runtimes.
 */

const isValid = code => {
  try {
    eval(code);  // eslint-disable-line no-eval
    return true;
  }
  catch (_) {
    return false;
  }
};

export const classSyntax = isValid('class A {}');
export const spreadOperator = isValid('[1, ...[1,2,3]]');
