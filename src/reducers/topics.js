import types from '../constants/action-types'

// lodash
import concat from 'lodash/concat'
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'
import set from 'lodash/set'

const _ = {
  concat,
  get,
  map,
  merge,
  set,
}

function topic(state = {}, action = {}) {
  switch (action.type) {
    case types.GET_A_FULL_TOPIC:
    case types.CHANGE_SELECTED_TOPIC: {
      return _.merge({}, state, {
        slug: _.get(action, 'payload.slug'),
        error: null,
        isFetching: false,
      })
    }

    case types.START_TO_GET_A_FULL_TOPIC:
      return _.merge({}, state, {
        slug: _.get(action, 'payload.slug'),
        error: null,
        isFetching: true,
      })

    case types.ERROR_TO_GET_A_FULL_TOPIC:
      return _.merge({}, state, {
        slug: _.get(action, 'payload.slug'),
        error: _.get(action, 'payload.error'),
        isFetching: false,
      })
    default:
      return state
  }
}

function topics(state = {}, action = {}) {
  switch (action.type) {
    case types.GET_TOPICS: {
      const items = _.get(action, 'payload.items', [])
      const total = _.get(action, 'payload.total', 0)

      const concatItems = _.concat(_.get(state, 'items', []), _.map(items, item => item.slug))

      return _.merge({}, state, {
        items: concatItems,
        total,
        error: null,
        isFetching: false,
      })
    }

    case types.START_TO_GET_TOPICS:
      console.log('url to fetch:', action.url)
      return _.merge({}, state, {
        error: null,
        isFetching: true,
      })

    case types.ERROR_TO_GET_TOPICS:
      return _.merge({}, state, {
        error: _.get(action, 'error'),
        isFetching: false,
      })
    default:
      return state
  }
}

export {
  topic,
  topics,
}
