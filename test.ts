import { assertEqual, equal } from 'https://deno.land/x/testing/testing.ts'
import { t } from 'https://raw.githubusercontent.com/zhmushan/deno_test/master/index.ts'
import { AssertionError } from './index'

t('construction', function() {
  const err = new AssertionError()
  assertEqual(err instanceof Error, true, 'instanceof Error')
  assertEqual(err instanceof AssertionError, true, 'instanceof AssertionError')
  assertEqual(err.name && err.name === 'AssertionError', true, 'name === "AssertionError"')
})

t('message', function() {
  const err = new AssertionError('Oops.'),
    empty = new AssertionError()
  assertEqual(err.message === 'Oops.', true, 'w/ err.message')
  assertEqual(empty.message === 'Unspecified AssertionError', true, 'w/o err.message')
})

t('stack', function() {
  assertEqual(typeof new AssertionError().stack === 'string', true)
})

t('custom properties', function() {
  const err = new AssertionError('good message', {
    name: 'ShouldNotExist',
    hello: 'universe',
    message: 'bad message',
    stack: 'custom stack'
  })

  assertEqual(err.name === 'AssertionError', true, 'does not overwrite name')
  assertEqual(err.message === 'good message', true, 'does not overwrite message')
  assertEqual(err['hello'] && err['hello'] === 'universe', true, 'has custom property')

  // some browsers don't have stack
  if (err.stack) {
    assertEqual(err.stack && err.stack !== 'custom stack', true, 'does not overwrite stack')
  }
})

t('.toJSON()', function() {
  const err = new AssertionError('some message', {
    hello: 'universe',
    goodbye: 'known'
  })

  const json = err.toJSON()

  assertEqual(json['name'] === 'AssertionError', true, 'json has name')
  assertEqual(json['message'] === 'some message', true, 'json has message')
  assertEqual(
    json['hello'] === 'universe' && json['goodbye'] === 'known', true,
    'json has custom properties'
  )

  // some browsers don't have stack
  if (err.stack) {
    assertEqual('string' === typeof json['stack'], true, 'json has stack')
  }

  const nostack = err.toJSON(false)
  assertEqual(!nostack['stack'], true, 'no stack on false argument')
})
