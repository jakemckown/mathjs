'use strict'

import { isBigNumber, isCollection, isNumber } from '../../utils/is'
import { factory } from '../../utils/factory'
import { errorTransform } from './error.transform'

const name = 'expression.transform.max'
const dependencies = ['typed', 'max']

export const createMaxTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, max }) => {
  /**
   * Attach a transform function to math.max
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function max
   * from one-based to zero based
   */
  return typed('max', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length === 2 && isCollection(args[0])) {
        const dim = args[1]
        if (isNumber(dim)) {
          args[1] = dim - 1
        } else if (isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return max.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
})