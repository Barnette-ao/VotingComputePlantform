import request from '@/utils/request'

export function registerNewUser(data) {
  return request({
    url: '/PlantformUsers',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/PlantformUsers/login',
    method: 'post',
    data
  })
}

export function getInfo(state) {
  return request({
    url: '/PlantformUsers/'+ state.id,
    method: 'get',
    params: { access_token:state.token }
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }



