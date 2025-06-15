<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          ArXiv 论文搜索
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          按引用量排序的学术论文关键词搜索
        </p>
      </div>
    </header>

    <!-- Search Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            v-model="searchQuery"
            @keypress="handleKeyPress"
            placeholder="输入关键词搜索论文..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
          />
          <button
            @click="handleSearch"
            :disabled="isLoading"
            class="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            {{ isLoading ? '搜索中...' : '搜索' }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="searchResults.length > 0" class="mb-4">
        <p class="text-gray-600">
          找到 {{ searchResults.length }} 篇论文，按引用量排序
        </p>
      </div>

      <div class="space-y-6">
        <div
          v-for="(paper, index) in searchResults"
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

          <!-- Abstract -->
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-800 mb-2">摘要</h3>
            <p class="text-gray-600 leading-relaxed text-sm break-words">
              {{ truncateText(paper.abstract, 300) }}
            </p>
          </div>

          <!-- Footer with keywords and date -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100">
            <div class="flex flex-wrap gap-2">
              <span class="text-sm font-medium text-gray-700 mr-2">关键词:</span>
              <span
                v-for="(keyword, keywordIndex) in paper.keywords"
                :key="keywordIndex"
                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                @click="searchByKeyword(keyword)"
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
        v-if="searchQuery && searchResults.length === 0 && !isLoading"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-lg mb-2">未找到相关论文</div>
        <p class="text-gray-500">请尝试其他关键词</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">正在搜索论文...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      mockResults: [
        {
          id: 1,
          title: 'Attention Is All You Need',
          authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
          abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
          citations: 45672,
          arxivId: '1706.03762',
          publishedDate: '2017-06-12',
          keywords: ['transformer', 'attention', 'neural networks', 'NLP']
        },
        {
          id: 2,
          title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
          authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
          abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
          citations: 38291,
          arxivId: '1810.04805',
          publishedDate: '2018-10-11',
          keywords: ['BERT', 'transformer', 'language model', 'pre-training']
        },
        {
          id: 3,
          title: 'Deep Residual Learning for Image Recognition',
          authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
          abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
          citations: 89234,
          arxivId: '1512.03385',
          publishedDate: '2015-12-10',
          keywords: ['ResNet', 'deep learning', 'computer vision', 'residual networks']
        },
        {
          id: 4,
          title: 'Generative Adversarial Networks',
          authors: 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio',
          abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
          citations: 67543,
          arxivId: '1406.2661',
          publishedDate: '2014-06-10',
          keywords: ['GAN', 'generative models', 'adversarial training', 'deep learning']
        }
      ]
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery.trim()) return

      this.isLoading = true

      // Simulate API call
      setTimeout(() => {
        // Filter and sort by citations (descending)
        const filtered = this.mockResults
          .filter(paper => 
            paper.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            paper.keywords.some(keyword => 
              keyword.toLowerCase().includes(this.searchQuery.toLowerCase())
            ) ||
            paper.abstract.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .sort((a, b) => b.citations - a.citations)

        this.searchResults = filtered
        this.isLoading = false
      }, 1000)
    },
    
    handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.handleSearch()
      }
    },
    
    searchByKeyword(keyword) {
      this.searchQuery = keyword
      this.handleSearch()
    },
    
    openArxivLink(arxivId) {
      window.open(`https://arxiv.org/abs/${arxivId}`, '_blank')
    },
    
    formatNumber(num) {
      return num.toLocaleString()
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    },
    
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    }
  }
}
</script>