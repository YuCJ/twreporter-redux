import actionTypes from '../constants/action-types'
import axios from 'axios'
import errorActionCreators from './error-action-creators'
import formAPIURL from '../utils/form-api-url'
import httpConsts from '../constants/http-protocol'
// lodash
import get from 'lodash/get'

const _ = {
  get,
}

const timeout = 5000

/**
 *  Send POST method request with Cookie in the headers
 *  to fetch the access_token.
 *
 *  @param {string} cookieList - cookieList contains `id_token` cookie
 *  @param {string} releaseBranch - should be one of 'master', 'test', 'staging' and 'release'
 *  @return {Function} returned function will get executed by the Redux Thunk middleware
 */
export function getAccessToken(cookieList, releaseBranch) {
  return dispatch => {
    const endpoint = formAPIURL(releaseBranch, '/v2/auth/token')
    const headers = {}

    if (cookieList) {
      headers.Cookie = cookieList
    }

    const options = {
      timeout,
      headers,
      withCredentials: true,
    }

    dispatch({
      type: actionTypes.REQUEST_AUTH,
      payload: {
        body: null,
        config: {
          timeout: options.timeout,
          withCredentials: options.withCredentials,
        },
        headers: options.headers,
        method: httpConsts.method.post,
        url: endpoint,
      },
    })

    return axios
      .post(endpoint, null, options)
      .then(axiosRes => {
        dispatch({
          type: actionTypes.AUTH_SUCCESS,
          payload: {
            headers: axiosRes.headers,
            statusCode: axiosRes.status,
            config: axiosRes.config,
            data: _.get(axiosRes, 'data.data'),
          },
        })
      })
      .catch(err => {
        dispatch(errorActionCreators.axios(err, actionTypes.AUTH_FAILURE))
      })
  }
}

export default {
  getAccessToken,
}
