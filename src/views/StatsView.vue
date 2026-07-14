<template>
  <div class="stats-view">
    <!-- 月份选择 -->
    <div class="card month-selector">
      <label>选择月份：</label>
      <select v-model="selectedMonth" @change="updateCharts">
        <option value="全部">全部</option>
        <option v-for="m in store.availableMonths" :key="m" :value="m">
          {{ m }}
        </option>
      </select>
    </div>

    <!-- 月度汇总卡片 -->
    <div class="summary-cards">
      <div class="summary-card income-card">
        <div class="card-label">收入</div>
        <div class="card-value income-value">¥{{ monthIncome.toFixed(2) }}</div>
      </div>
      <div class="summary-card expense-card">
        <div class="card-label">支出</div>
        <div class="card-value expense-value">¥{{ monthExpense.toFixed(2) }}</div>
      </div>
      <div class="summary-card balance-card">
        <div class="card-label">结余</div>
        <div :class="['card-value', balance >= 0 ? 'income-value' : 'expense-value']">
          ¥{{ balance.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts">
      <!-- 支出分类饼图 -->
      <div class="card chart-card">
        <h3>支出分类占比</h3>
        <div v-if="expensePieData.length === 0" class="empty-state">
          <p>暂无支出数据</p>
        </div>
        <v-chart v-else :option="expensePieOption" class="chart" autoresize />
      </div>

      <!-- 收支月度柱状图 -->
      <div class="card chart-card">
        <h3>月度收支趋势</h3>
        <div v-if="store.monthlyStats.length === 0" class="empty-state">
          <p>暂无数据</p>
        </div>
        <v-chart v-else :option="barOption" class="chart" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useRecordsStore } from '../stores/records.js'

// 注册 ECharts 组件（按需加载，减小体积）
use([
  PieChart, BarChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  CanvasRenderer
])

const store = useRecordsStore()

const selectedMonth = ref('全部')

// 月度汇总
const monthIncome = computed(() => {
  const records = selectedMonth.value === '全部'
    ? store.records
    : store.records.filter(r => r.date.startsWith(selectedMonth.value))
  return records.filter(r => r.type === '收入').reduce((s, r) => s + r.amount, 0)
})

const monthExpense = computed(() => {
  const records = selectedMonth.value === '全部'
    ? store.records
    : store.records.filter(r => r.date.startsWith(selectedMonth.value))
  return records.filter(r => r.type === '支出').reduce((s, r) => s + r.amount, 0)
})

const balance = computed(() => monthIncome.value - monthExpense.value)

// 支出分类饼图数据
const expensePieData = computed(() => {
  return store.getCategoryStats('支出', selectedMonth.value)
})

const expensePieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: ¥{c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 0,
    top: 'center',
    textStyle: { fontSize: 12 }
  },
  series: [{
    type: 'pie',
    radius: ['45%', '75%'],
    center: ['40%', '50%'],
    emphasis: {
      label: { fontSize: 16, fontWeight: 'bold' }
    },
    data: expensePieData.value.map(d => ({
      name: d.name,
      value: Math.round(d.value * 100) / 100
    }))
  }]
}))

// 月度收支柱状图
const barOption = computed(() => {
  const months = store.monthlyStats.map(s => s.month)
  const incomes = store.monthlyStats.map(s => s.income)
  const expenses = store.monthlyStats.map(s => s.expense)

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['收入', '支出'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        data: incomes,
        itemStyle: { color: '#27ae60' }
      },
      {
        name: '支出',
        type: 'bar',
        data: expenses,
        itemStyle: { color: '#e74c3c' }
      }
    ]
  }
})

function updateCharts() {
  // 切换月份时图表自动响应更新
}

onMounted(async () => {
  if (!store.loaded) {
    await store.fetchRecords()
  }
})
</script>

<style scoped>
.stats-view {
  max-width: 750px;
  margin: 0 auto;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.month-selector label {
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.month-selector select {
  padding: 6px 12px;
}

.summary-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.summary-card {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.card-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 6px;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
}

.income-value {
  color: #27ae60;
}

.expense-value {
  color: #e74c3c;
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chart-card {
  padding: 16px;
}

.chart-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
