import test from 'ava'
import { classSyntax, spreadOperator } from '../es2015Features'
import getExtender from '../classExtender'

function FuncParent(a, b, c) {
  this.abc = [a, b, c]
}

const makeClassParent = () => eval(`
  class ClassParent {
    constructor(a, b, c) {
      this.abc = [a, b, c]
    }
  }
`)

const testExtend = (mode, Parent, extendClass) => {
  const title = text => `${mode} (${Parent.name}): ${text}`

  test(title('inherits a given class'), t => {
    const Child = extendClass(Parent, () => {})
    t.true(new Child() instanceof Parent)
  })

  test(title('accepts initializer callback'), t => {
    t.plan(1)
    const Child = extendClass(Parent, child => {
      t.true(child instanceof Child)
    })
    new Child()
  })

  test(title('pass all arguments to super class'), t => {
    const Child = extendClass(Parent, () => {})
    const child = new Child(1, 2, 3)
    t.deepEqual(child.abc, [1, 2, 3])
  })
}

if (classSyntax && spreadOperator) {
  testExtend('class and spread', FuncParent, getExtender({
    classSyntax: true,
    spreadOperator: true,
  }))
  testExtend('class and spread', makeClassParent(), getExtender({
    classSyntax: true,
    spreadOperator: true,
  }))
}

// XXX:
// Child takes always 10 length arguments
// because the spread operator is unavailable.
if (classSyntax) {
  testExtend('class', FuncParent, getExtender({
    classSyntax: true,
    spreadOperator: false,
  }))
  testExtend('class and spread', makeClassParent(), getExtender({
    classSyntax: true,
    spreadOperator: false,
  }))
}

testExtend('prototype', FuncParent, getExtender({
  classSyntax: false,
  spreadOperator: false,
}))
