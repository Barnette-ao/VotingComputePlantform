import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 1000
axios.defaults.baseURL = '/ppu/web'

axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      let result = ''
      if (error.response) {
        const code = error.response.status
        if (code === 403) {
          result = '登录失效，请重新登录'
          sessionStorage.clear()
          window.location.href = '/login'
        } else if (code === 404) {
          result = '请求的页面失踪了~'
        }
      } else {
        result = error + ''
      }
      alert(result)
      return Promise.reject(result)
    }
)

/**
 * 封装get请求
 * @param url
 * @param params
 * @returns {Promise}
 */
 export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(response => {
        console.log(response);
        
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns { Promise }
 */
 export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [function(data) { // 对传递的数据进行格式转换，以便传递给后台
          data = qs.stringify(data)
          return data
        }]
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }