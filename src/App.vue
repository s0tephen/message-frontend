<template>
    <div class="container mt-5" :class="screenWidth < 600 ? 'w-100' : 'w-50'">
      <div class="title">
        <h2>Message</h2>
      </div>

      <div class="query-box">
        <!--      <el-input class="query-input" v-model="this.queryInput" placeholder="输入用户名搜索🔍"/>-->
        <el-button type="primary" @click="handleAdd">留言</el-button>
      </div>

      <el-table
          ref="multipleTableRef"
          :data="showMessage"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border>
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="Name" width="120"/>
        <el-table-column prop="content" label="Content" width="335"/>
        <el-table-column
            label="时间">
          <template #default="scope">
            {{ typedTime(scope.row.create_at) }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button
                link
                type="danger"
                size="small"
                @click.prevent="deleteMessage(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click.prevent="handleAdd1(scope.row)"
            >
              编辑
            </el-button>

          </template>

        </el-table-column>
      </el-table>
      <br>
      <el-pagination
          v-model:current-page="pageInfo.pageNum"
          background layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :total="parseInt(this.pageInfo.total)">
      </el-pagination>
    </div>


    <el-dialog v-model="this.sendMessageDialog" :title="this.dialogType==='add'?'新增':'编辑'">
      <el-form>
        <el-form-item label="Name" :label-width="80">
          <el-input v-model="sendMessage.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Content" :label-width="80">
          <el-input v-model="sendMessage.content" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="this.sendMessageDialog = false">取消</el-button>
          <el-button type="primary" @click="sendMassages()">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

</template>

<script>

import request from "./http/request"
import functions from "@/utils/functions";
import {ElMessage} from "element-plus";


export default {
  name: 'App',
  data() {
    return {
      screenWidth: null,
      queryInput: '',
      multipleSelection: [],
      sendMessageDialog: false,
      dialogType: 'add',
      //发送数据参数
      sendMessage: {
        id: '',
        name: '',
        content: ''
      },
      //展示数据
      showMessage: [],
      //分页
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: ''
      },
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAdd() {
      this.sendMessageDialog = true;
      this.sendMessage = {};
    },
    handleAdd1(row) {
      this.sendMessage.id = row.id
      this.sendMessage.name = row.name
      this.sendMessage.content = row.content
      this.sendMessageDialog = true;
    },
    typedTime(date) {
      return functions.formatDate(date)
    },
    getContentPage() {
      request.getContentPage(this.pageInfo.pageNum, this.pageInfo.pageSize).then(res => {
            this.showMessage = res.data.data.list
            this.pageInfo.total = res.data.data.total
          }
      )
    },
    sendMassages() {
      this.sendMessageDialog = false
      console.log(this.sendMessage.name, this.sendMessage.content)
      if (this.sendMessage.name === undefined || this.sendMessage.content === undefined) {
        ElMessage.error('请输入完整信息')
      } else {
        request.sendMessageAndUpdate(this.sendMessage.id, this.sendMessage.name, this.sendMessage.content).then(res => {
          if (res.data.code === 1) {
            this.getContentPage()
            ElMessage({
              message: res.data.msg,
              type: 'success',
            })
          }
        })
      }
    },
    deleteMessage(id) {
      request.deleteMessage(id).then(res => {
        if (res.data.msg === 'success') {
          this.getContentPage()
          ElMessage.error('删除成功')
        }
      })
    },
  },
  watch: {
    'pageInfo.pageNum'() {
      this.getContentPage()
    },

  },

  mounted() {
    this.getContentPage()
    this.typedTime()
    this.screenWidth = document.body.clientWidth
    window.onresize = () => {
      //屏幕尺寸变化
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }

  },
}


</script>

<style scoped>

.title {
  text-align: center;
}

.query-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
