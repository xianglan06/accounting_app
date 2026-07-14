import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadRecords, addRecord as addRecordToStorage, deleteRecord as deleteRecordFromStorage, updateRecord as updateRecordInStorage } from '../utils/storage.js'

export const useRecordsStore = defineStore('records', () => {
  // 所有记录
  const records = ref([])
  // 数据是否已加载
  const loaded = ref(false)

  // 当前筛选条件
  const filterType = ref('全部')    // '全部' | '支出' | '收入'
  const filterMonth = ref('全部')    // '全部' | '2026-07'

  // 加载数据
  async function fetchRecords() {
    records.value = await loadRecords()
    loaded.value = true
  }

  // 添加记录
  async function add(record) {
    const newRecord = {
      ...record,
      date: record.date || new Date().toISOString().split('T')[0]
    }
    records.value = await addRecordToStorage(newRecord)
  }

  // 删除记录
  async function remove(index) {
    records.value = await deleteRecordFromStorage(index)
  }

  // 更新记录
  async function update(index, record) {
    records.value = await updateRecordInStorage(index, record)
  }

  // 筛选后的记录
  const filteredRecords = computed(() => {
    let result = [...records.value]

    // 按类型筛选
    if (filterType.value !== '全部') {
      result = result.filter(r => r.type === filterType.value)
    }

    // 按月筛选
    if (filterMonth.value !== '全部') {
      result = result.filter(r => r.date.startsWith(filterMonth.value))
    }

    // 按日期降序排列（最新的在前面）
    result.sort((a, b) => b.date.localeCompare(a.date))

    return result
  })

  // 可用的月份列表（用于筛选）
  const availableMonths = computed(() => {
    const months = new Set()
    records.value.forEach(r => {
      const month = r.date.substring(0, 7) // '2026-07'
      months.add(month)
    })
    return Array.from(months).sort().reverse()
  })

  // 月度统计
  const monthlyStats = computed(() => {
    const stats = {}
    records.value.forEach(r => {
      const month = r.date.substring(0, 7)
      if (!stats[month]) {
        stats[month] = { month, income: 0, expense: 0 }
      }
      if (r.type === '收入') {
        stats[month].income += r.amount
      } else {
        stats[month].expense += r.amount
      }
    })
    return Object.values(stats).sort((a, b) => b.month.localeCompare(a.month))
  })

  // 当月分类统计（用于饼图）
  function getCategoryStats(type, month) {
    const stats = {}
    const targetRecords = records.value.filter(r => {
      if (r.type !== type) return false
      if (month && month !== '全部') {
        return r.date.startsWith(month)
      }
      return true
    })

    targetRecords.forEach(r => {
      const key = r.category1
      if (!stats[key]) {
        stats[key] = 0
      }
      stats[key] += r.amount
    })

    return Object.entries(stats).map(([name, value]) => ({ name, value }))
  }

  return {
    records,
    loaded,
    filterType,
    filterMonth,
    filteredRecords,
    availableMonths,
    monthlyStats,
    fetchRecords,
    add,
    remove,
    update,
    getCategoryStats
  }
})
