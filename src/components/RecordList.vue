<template>
  <div class="card record-list">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <h2 class="list-title">收支记录</h2>
      <div class="filters">
        <select v-model="store.filterType" class="filter-select">
          <option value="全部">全部类型</option>
          <option value="支出">💸 支出</option>
          <option value="收入">💰 收入</option>
        </select>
        <select v-model="store.filterMonth" class="filter-select">
          <option value="全部">全部月份</option>
          <option v-for="m in store.availableMonths" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
      </div>
    </div>

    <!-- 记录列表 -->
    <div v-if="store.filteredRecords.length === 0" class="empty-state">
      <div class="icon">📭</div>
      <p>还没有记录，快去记一笔吧！</p>
    </div>

    <div v-else class="records">
      <div
        v-for="(record, index) in store.filteredRecords"
        :key="index"
        :class="['record-item', record.type === '收入' ? 'income' : 'expense']"
      >
        <div class="record-left">
          <span class="record-icon">{{ getIcon(record) }}</span>
          <div class="record-info">
            <div class="record-category">
              {{ record.category1 }} · {{ record.category2 }}
            </div>
            <div class="record-meta">
              <span class="record-date">{{ record.date }}</span>
              <span v-if="record.note" class="record-note">{{ record.note }}</span>
            </div>
          </div>
        </div>

        <div class="record-right">
          <span :class="['record-amount', record.type === '收入' ? 'income-amount' : 'expense-amount']">
            {{ record.type === '收入' ? '+' : '-' }}¥{{ record.amount.toFixed(2) }}
          </span>
          <button class="btn-delete" @click="handleDelete(index)" title="删除">🗑️</button>
        </div>
      </div>
    </div>

    <!-- 汇总 -->
    <div v-if="store.filteredRecords.length > 0" class="summary">
      <span>共 {{ store.filteredRecords.length }} 条记录</span>
      <span class="summary-income">
        收入 ¥{{ totalIncome.toFixed(2) }}
      </span>
      <span class="summary-expense">
        支出 ¥{{ totalExpense.toFixed(2) }}
      </span>
      <span :class="['summary-balance', balance >= 0 ? 'positive' : 'negative']">
        结余 ¥{{ balance.toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRecordsStore } from '../stores/records.js'
import { getCategoryIcon } from '../data/categories.js'

const store = useRecordsStore()

// 获取分类图标
function getIcon(record) {
  return getCategoryIcon(record.type, record.category1) || '📌'
}

// 计算汇总
const totalIncome = computed(() => {
  return store.filteredRecords
    .filter(r => r.type === '收入')
    .reduce((sum, r) => sum + r.amount, 0)
})

const totalExpense = computed(() => {
  return store.filteredRecords
    .filter(r => r.type === '支出')
    .reduce((sum, r) => sum + r.amount, 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

// 删除记录
async function handleDelete(index) {
  // 需要找到该记录在原始数组中的真实索引
  const record = store.filteredRecords[index]
  const realIndex = store.records.findIndex(r => r === record)
  if (realIndex !== -1) {
    await store.remove(realIndex)
  }
}
</script>

<style scoped>
.record-list {
  min-height: 200px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}

.list-title {
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
}

.filters {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 6px 10px;
  font-size: 13px;
}

.records {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f9fafb;
  border-left: 4px solid #e0e0e0;
  transition: background 0.15s;
}

.record-item:hover {
  background: #f0f4f8;
}

.record-item.expense {
  border-left-color: #e74c3c;
}

.record-item.income {
  border-left-color: #27ae60;
}

.record-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.record-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.record-info {
  min-width: 0;
}

.record-category {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.record-meta {
  display: flex;
  gap: 8px;
  margin-top: 2px;
  font-size: 12px;
  color: #999;
}

.record-note {
  color: #bbb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.record-amount {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.expense-amount {
  color: #e74c3c;
}

.income-amount {
  color: #27ae60;
}

.btn-delete {
  background: none;
  font-size: 16px;
  opacity: 0.4;
  transition: opacity 0.2s;
  padding: 4px;
}

.btn-delete:hover {
  opacity: 1;
}

.summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-size: 13px;
  color: #999;
}

.summary-income {
  color: #27ae60;
  font-weight: 600;
}

.summary-expense {
  color: #e74c3c;
  font-weight: 600;
}

.summary-balance {
  font-weight: 700;
  font-size: 15px;
}

.summary-balance.positive {
  color: #27ae60;
}

.summary-balance.negative {
  color: #e74c3c;
}
</style>
