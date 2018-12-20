import { test, assertEqual } from 'https://deno.land/x/testing/testing.ts'
import { AssertionError } from './index'

test(function testConstruction() {
  const err = new AssertionError()
  assertEqual(err instanceof Error, true)
  assertEqual(err instanceof AssertionError, true)
  assertEqual(err.name === 'AssertionError', true)
})

test(function testMessage() {
  const err = new AssertionError('Oops.'),
    empty = new AssertionError()
  assertEqual(err.message === 'Oops.', true)
  assertEqual(empty.message === 'Unspecified AssertionError', true)
})

test(function testStack() {
  assertEqual(typeof new AssertionError().stack, 'string')
})

test(function testCustomProperties() {
  const err = new AssertionError('good message', {
    name: 'ShouldNotExist',
    hello: 'universe',
    message: 'bad message',
    stack: 'custom stack'
  })

  assertEqual(err.name === 'AssertionError', true)
  assertEqual(err.message === 'good message', true)
  assertEqual(err['hello'] && err['hello'] === 'universe', true)

  // some browsers don't have stack
  if (err.stack) {
    assertEqual(err.stack && err.stack !== 'custom stack', true)
  }
})

test(function testToJSON() {
  const err = new AssertionError('some message', {
    hello: 'universe',
    goodbye: 'known'
  })

  const json = err.toJSON()

  assertEqual(json['name'] === 'AssertionError', true)
  assertEqual(json['message'] === 'some message', true)
  assertEqual(json['hello'] === 'universe' && json['goodbye'] === 'known', true)

  // some browsers don't have stack
  if (err.stack) {
    assertEqual('string' === typeof json['stack'], true)
  }

  const nostack = err.toJSON(false)
  assertEqual(!nostack['stack'], true)
})
