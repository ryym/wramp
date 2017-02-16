module.exports = {
  "parser": "babel-eslint",

  "plugins": [
    "flowtype"
  ],

  "rules": {
    // ESLint warns about `this` in class property allow functions.
    "no-invalid-this": 0,
    "flowtype/define-flow-type": 1,
  }
}
