// 支出和收入的二级分类数据

export const expenseCategories = [
  {
    name: '餐饮美食',
    icon: '🍽️',
    subcategories: ['早餐', '午餐', '晚餐', '零食饮料', '水果生鲜', '外卖配送', '聚餐聚会']
  },
  {
    name: '交通出行',
    icon: '🚗',
    subcategories: ['公交地铁', '出租车', '网约车', '加油充电', '停车费', '火车票', '机票', '长途汽车']
  },
  {
    name: '购物消费',
    icon: '🛒',
    subcategories: ['衣服鞋帽', '日用品', '数码产品', '家居家具', '化妆品', '宠物用品', '其他购物']
  },
  {
    name: '住房物业',
    icon: '🏠',
    subcategories: ['房租', '房贷', '物业费', '水电燃气', '宽带电话', '维修保养', '家政服务']
  },
  {
    name: '娱乐休闲',
    icon: '🎮',
    subcategories: ['电影演出', '游戏充值', '旅游度假', '运动健身', '图书音像', 'KTV酒吧']
  },
  {
    name: '医疗健康',
    icon: '💊',
    subcategories: ['门诊挂号', '药品购买', '体检保健', '住院治疗', '牙科眼科']
  },
  {
    name: '教育学习',
    icon: '📚',
    subcategories: ['培训课程', '书籍资料', '考试报名', '文具用品', '电子设备']
  },
  {
    name: '人情往来',
    icon: '🎁',
    subcategories: ['红包礼物', '请客吃饭', '婚丧嫁娶', '慈善捐款']
  },
  {
    name: '金融保险',
    icon: '💰',
    subcategories: ['银行手续费', '保险费用', '投资亏损', '贷款利息']
  },
  {
    name: '其他支出',
    icon: '📦',
    subcategories: ['快递物流', '办公用品', '其他杂项']
  }
]

export const incomeCategories = [
  {
    name: '工资薪酬',
    icon: '💼',
    subcategories: ['基本工资', '加班补贴', '年终奖金', '绩效提成']
  },
  {
    name: '投资理财',
    icon: '📈',
    subcategories: ['基金收益', '股票盈利', '银行利息', '房租收入']
  },
  {
    name: '红包转账',
    icon: '🧧',
    subcategories: ['微信红包', '支付宝转账', '长辈给的']
  },
  {
    name: '人情收入',
    icon: '🎁',
    subcategories: ['结婚礼金', '生日红包', '节日红包']
  },
  {
    name: '兼职副业',
    icon: '💰',
    subcategories: ['兼职收入', '自由职业', '稿费版税']
  },
  {
    name: '退款返利',
    icon: '🔄',
    subcategories: ['购物退款', '平台返利', '优惠返现']
  },
  {
    name: '其他收入',
    icon: '📦',
    subcategories: ['无法归类的收入']
  }
]

// 获取所有一级分类名称
export function getCategoryNames(type) {
  const categories = type === '支出' ? expenseCategories : incomeCategories
  return categories.map(c => c.name)
}

// 根据一级分类获取二级分类
export function getSubcategories(type, categoryName) {
  const categories = type === '支出' ? expenseCategories : incomeCategories
  const found = categories.find(c => c.name === categoryName)
  return found ? found.subcategories : []
}

// 获取分类图标
export function getCategoryIcon(type, categoryName) {
  const categories = type === '支出' ? expenseCategories : incomeCategories
  const found = categories.find(c => c.name === categoryName)
  return found ? found.icon : ''
}
