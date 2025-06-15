<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          每月论文推荐
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          精选当月最优质的学术论文，按引用量排序
        </p>
      </div>
    </header>

    <!-- Control Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <!-- Month Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">选择月份</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="month in availableMonths"
              :key="month.value"
              @click="selectMonth(month.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedMonth === month.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ month.label }}
            </button>
          </div>
        </div>

        <!-- Keyword Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">关键词过滤（可选）</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              v-model="filterKeyword"
              @input="filterPapers"
              placeholder="输入关键词过滤当月论文..."
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
            <button
              @click="clearFilter"
              v-if="filterKeyword"
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              清除过滤
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="displayedPapers.length > 0" class="mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <p class="text-gray-600 mb-2 sm:mb-0">
            {{ selectedMonthLabel }} 共 {{ monthlyPapers.length }} 篇论文
            <span v-if="filterKeyword" class="text-blue-600">
              （过滤后显示 {{ displayedPapers.length }} 篇）
            </span>
          </p>
          <div class="text-sm text-gray-500">
            按引用量排序
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          v-for="(paper, index) in displayedPapers"
          :key="paper.id"
          class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
        >
          <!-- Paper ranking and header -->
          <div class="flex items-start gap-3 sm:gap-4 mb-4">
            <div class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2">
                <h2
                  class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors mb-2 lg:mb-0 lg:mr-4"
                  @click="openArxivLink(paper.arxivId)"
                >
                  {{ paper.title }}
                </h2>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <span class="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap">
                    📊 {{ formatNumber(paper.citations) }}
                  </span>
                  <span class="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-mono text-xs whitespace-nowrap">
                    arXiv:{{ paper.arxivId }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 mb-3">
                <span class="font-medium">作者:</span>
                <p class="text-gray-700 break-words">
                  {{ paper.authors }}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer with keywords and date -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100">
            <div class="flex flex-wrap gap-2">
              <span class="text-sm font-medium text-gray-700 mr-2">关键词:</span>
              <span
                v-for="(keyword, keywordIndex) in paper.keywords"
                :key="keywordIndex"
                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                @click="filterByKeyword(keyword)"
              >
                #{{ keyword }}
              </span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
              <span>📅 {{ formatDate(paper.publishedDate) }}</span>
              <button
                class="text-blue-600 hover:text-blue-800 font-medium text-left sm:text-center"
                @click="openArxivLink(paper.arxivId)"
              >
                查看原文 →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div
        v-if="selectedMonth && displayedPapers.length === 0 && !isLoading"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-lg mb-2">
          {{ filterKeyword ? '未找到匹配的论文' : '该月份暂无论文' }}
        </div>
        <p class="text-gray-500">
          {{ filterKeyword ? '请尝试其他关键词或选择其他月份' : '请选择其他月份' }}
        </p>
      </div>

      <!-- No month selected -->
      <div
        v-if="!selectedMonth"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-lg mb-2">请选择月份</div>
        <p class="text-gray-500">选择一个月份来查看该月的推荐论文</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">正在加载论文...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      selectedMonth: '',
      filterKeyword: '',
      monthlyPapers: [],
      displayedPapers: [],
      isLoading: false,
      availableMonths: [
        { value: '2024-01', label: '2024年1月' },
        { value: '2024-02', label: '2024年2月' },
        { value: '2024-03', label: '2024年3月' },
        { value: '2024-04', label: '2024年4月' },
        { value: '2024-05', label: '2024年5月' },
        { value: '2024-06', label: '2024年6月' },
        { value: '2024-07', label: '2024年7月' },
        { value: '2024-08', label: '2024年8月' },
        { value: '2024-09', label: '2024年9月' },
        { value: '2024-10', label: '2024年10月' },
        { value: '2024-11', label: '2024年11月' },
        { value: '2024-12', label: '2024年12月' }
      ],
      // 模拟不同月份的论文数据
      papersByMonth: {
        '2024-01': [
          {
            id: 1,
            title: 'Attention Is All You Need',
            authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
            citations: 45672,
            arxivId: '1706.03762',
            publishedDate: '2024-01-15',
            keywords: ['transformer', 'attention', 'neural networks', 'NLP']
          },
          {
            id: 2,
            title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
            authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
            citations: 38291,
            arxivId: '1810.04805',
            publishedDate: '2024-01-22',
            keywords: ['BERT', 'transformer', 'language model', 'pre-training']
          }
        ],
        '2024-02': [
          {
            id: 3,
            title: 'Deep Residual Learning for Image Recognition',
            authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
            citations: 89234,
            arxivId: '1512.03385',
            publishedDate: '2024-02-10',
            keywords: ['ResNet', 'deep learning', 'computer vision', 'residual networks']
          },
          {
            id: 4,
            title: 'Generative Adversarial Networks',
            authors: 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio',
            citations: 67543,
            arxivId: '1406.2661',
            publishedDate: '2024-02-18',
            keywords: ['GAN', 'generative models', 'adversarial training', 'deep learning']
          }
        ],
        '2024-03': [
          {
            id: 5,
            title: 'Vision Transformer (ViT) for Image Recognition',
            authors: 'Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn',
            citations: 25431,
            arxivId: '2010.11929',
            publishedDate: '2024-03-05',
            keywords: ['vision transformer', 'computer vision', 'image recognition', 'transformer']
          },
          {
            id: 6,
            title: 'GPT-3: Language Models are Few-Shot Learners',
            authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah',
            citations: 34567,
            arxivId: '2005.14165',
            publishedDate: '2024-03-12',
            keywords: ['GPT', 'language model', 'few-shot learning', 'NLP']
          }
        ]
      }
    }
  },
  computed: {
    selectedMonthLabel() {
      const month = this.availableMonths.find(m => m.value === this.selectedMonth)
      return month ? month.label : ''
    }
  },
  methods: {
    selectMonth(monthValue) {
      this.selectedMonth = monthValue
      this.filterKeyword = ''
      this.loadMonthlyPapers()
    },
    
    loadMonthlyPapers() {
      this.isLoading = true
      
      // Simulate API call
      setTimeout(() => {
        this.monthlyPapers = (this.papersByMonth[this.selectedMonth] || [])
          .sort((a, b) => b.citations - a.citations)
        this.displayedPapers = [...this.monthlyPapers]
        this.isLoading = false
      }, 500)
    },
    
    filterPapers() {
      if (!this.filterKeyword.trim()) {
        this.displayedPapers = [...this.monthlyPapers]
        return
      }
      
      const keyword = this.filterKeyword.toLowerCase()
      this.displayedPapers = this.monthlyPapers.filter(paper => 
        paper.title.toLowerCase().includes(keyword) ||
        paper.authors.toLowerCase().includes(keyword) ||
        paper.keywords.some(k => k.toLowerCase().includes(keyword))
      )
    },
    
    filterByKeyword(keyword) {
      this.filterKeyword = keyword
      this.filterPapers()
    },
    
    clearFilter() {
      this.filterKeyword = ''
      this.displayedPapers = [...this.monthlyPapers]
    },
    
    openArxivLink(arxivId) {
      window.open(`https://arxiv.org/abs/${arxivId}`, '_blank')
    },
    
    formatNumber(num) {
      return num.toLocaleString()
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
  },
  
  mounted() {
    // 默认选择当前月份
    const currentMonth = new Date().toISOString().slice(0, 7)
    const availableCurrentMonth = this.availableMonths.find(m => m.value === currentMonth)
    if (availableCurrentMonth) {
      this.selectMonth(currentMonth)
    } else {
      // 如果当前月份不在可选列表中，选择最新的月份
      this.selectMonth(this.availableMonths[this.availableMonths.length - 1].value)
    }
  }
}
</script>