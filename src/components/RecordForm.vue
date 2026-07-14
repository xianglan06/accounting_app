<template>
  <div class="card record-form">
    <h2 class="form-title">记一笔</h2>

    <div class="form-row">
      <!-- 类型选择 -->
      <div class="form-group">
        <label>类型</label>
        <div class="type-toggle">
          <button
            :class="['type-btn', { active: form.type === '支出' }]"
            @click="form.type = '支出'; onTypeChange()"
          >
            💸 支出
          </button>
          <button
            :class="['type-btn', { active: form.type === '收入' }]"
            @click="form.type = '收入'; onTypeChange()"
          >
            💰 收入
          </button>
        </div>
      </div>

      <!-- 金额 -->
      <div class="form-group">
        <label>金额 (¥)</label>
        <input
          v-model="form.amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          class="amount-input"
        />
      </div>
    </div>

    <!-- 分类选择（两级联动） -->
    <div class="form-row">
      <div class="form-group flex-1">
        <label>一级分类</label>
        <select v-model="form.category1" @change="onCategory1Change">
          <option value="">请选择</option>
          <option
            v-for="cat in currentCategories"
            :key="cat.name"
            :value="cat.name"
          >
            {{ cat.icon }} {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-group flex-1">
        <label>二级分类</label>
        <select v-model="form.category2" :disabled="!form.category1">
          <option value="">请选择</option>
          <option
            v-for="sub in currentSubcategories"
            :key="sub"
            :value="sub"
          >
            {{ sub }}
          </option>
        </select>
      </div>
    </div>

    <!-- 日期和备注 -->
    <div class="form-row">
      <div class="form-group">
        <label>日期</label>
        <input v-model="form.date" type="date" />
      </div>

      <div class="form-group flex-1">
        <label>备注（选填）</label>
        <input v-model="form.note" type="text" placeholder="例如：公司楼下便当" />
      </div>
    </div>

    <!-- 提交按钮 -->
    <button class="btn-primary submit-btn" @click="submit">✓ 记录</button>

    <!-- 提示信息 -->
    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { expenseCategories, incomeCategories, getSubcategories } from '../data/categories.js'
import { useRecordsStore } from '../stores/records.js'

const store = useRecordsStore()

const form = reactive({
  type: '支出',
  amount: '',
  category1: '',
  category2: '',
  date: new Date().toISOString().split('T')[0],
  note: ''
})

const message = ref('')
const messageType = ref('success')

// 当前分类列表
const currentCategories = ref(expenseCategories)
const currentSubcategories = ref([])

// 切换类型时重置分类
function onTypeChange() {
  form.category1 = ''
  form.category2 = ''
  currentCategories.value = form.type === '支出' ? expenseCategories : incomeCategories
  currentSubcategories.value = []
  message.value = ''
}

// 选择一级分类后更新二级分类
function onCategory1Change() {
  form.category2 = ''
  currentSubcategories.value = getSubcategories(form.type, form.category1)
  message.value = ''
}

// 提交记录
async function submit() {
  // 验证
  if (!form.amount || parseFloat(form.amount) <= 0) {
    message.value = '请输入有效的金额'
    messageType.value = 'error'
    return
  }
  if (!form.category1) {
    message.value = '请选择一级分类'
    messageType.value = 'error'
    return
  }
  if (!form.category2) {
    message.value = '请选择二级分类'
    messageType.value = 'error'
    return
  }

  try {
    await store.add({
      type: form.type,
      amount: parseFloat(form.amount),
      category1: form.category1,
      category2: form.category2,
      date: form.date,
      note: form.note
    })

    // 重置表单
    form.amount = ''
    form.category1 = ''
    form.category2 = ''
    form.note = ''
    form.date = new Date().toISOString().split('T')[0]
    currentSubcategories.value = []

    message.value = '记录成功！'
    messageType.value = 'success'

    // 3秒后清除提示
    setTimeout(() => { message.value = '' }, 3000)
  } catch (err) {
    message.value = '记录失败：' + err.message
    messageType.value = 'error'
  }
}

// 初始化
currentCategories.value = expenseCategories
</script>

<style scoped>
.record-form {
  margin-bottom: 16px;
}

.form-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 14px;
  color: #2c3e50;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.flex-1 {
  flex: 1;
}

.type-toggle {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  background: #f0f0f0;
  color: #666;
  font-size: 14px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.type-btn.active {
  background: #e8f4fd;
  color: #3498db;
  border-color: #3498db;
  font-weight: 600;
}

.amount-input {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 12px;
}

.submit-btn {
  width: 100%;
  margin-top: 4px;
  padding: 12px;
  font-size: 16px;
}

.message {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.message.success {
  color: #27ae60;
}

.message.error {
  color: #e74c3c;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
