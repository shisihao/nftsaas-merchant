import request from '@/utils/request'

// 评论列表
export function dataList(videoId, params) {
  return request.get(`/videos/${videoId}/comments`, {
    params
  })
}

// 删除评论
export function deleteData(videoId, commentId) {
  return request.delete(`/videos/${videoId}/comments/${commentId}`)
}

// 回复列表
export function repliesList(videoId, commentId, params) {
  return request.get(`/videos/${videoId}/comments/${commentId}/replies`, {
    params
  })
}

// 删除回复
export function deleteReply(videoId, commentId, replyId) {
  return request.delete(`/videos/${videoId}/comments/${commentId}/replies/${replyId}`)
}
