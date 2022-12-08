import http from '@/http/index'

export default {


    /**
     * 发送留言
     * @returns {*}
     * @param id
     * @param name
     * @param content
     */
    sendMessageAndUpdate(id, name, content) {
        return http({
            url: `/api/user/sendMessageAndUpdate`,
            method: 'post',
            data: {
                id, name, content
            }
        })
    },

    /**
     * 获取留言 分页
     */
    getContentPage(pageNum, pageSize) {
        return http({
            url: `/api/user/showMessage?pageNum=${pageNum}&pageSize=${pageSize}`,
            method: 'get',
        })
    },

    deleteMessage(id) {
        return http({
            url: `/api/user/detectMessage?id=${id}`,
            method: 'post'
        })
    },
}