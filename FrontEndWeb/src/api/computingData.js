import request from '@/utils/request'

export function saveData(data) {
  return request({
    url: '/computingData',
    method: 'post',
    data
  })
}


