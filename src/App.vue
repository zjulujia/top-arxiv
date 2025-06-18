<template>
    <div class="min-h-screen bg-gray-50 w-full">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b w-full">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">每月论文排序</h1>
                <p class="text-gray-600 text-sm sm:text-base">当月全部AI学术论文，按引用量排序</p>
            </div>
        </header>

        <!-- Control Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
                <!-- Month Selection -->
                <div class="mb-6">
                    <!-- Year and Month Selectors -->
                    <div class="flex flex-col sm:flex-row gap-4 mb-4">
                        <div class="flex-1">
                            <label class="block text-xs text-gray-500 mb-1">年份</label>
                            <select
                                v-model="selectedYear"
                                @change="onYearChange"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            >
                                <option value="">选择年份</option>
                                <option v-for="year in availableYears" :key="year" :value="year">
                                    {{ year }}年
                                </option>
                            </select>
                        </div>

                        <div class="flex-1">
                            <label class="block text-xs text-gray-500 mb-1">月份</label>
                            <select
                                v-model="selectedMonthOnly"
                                @change="onMonthChange"
                                :disabled="!selectedYear"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">选择月份</option>
                                <option
                                    v-for="month in getAvailableMonthsForYear(selectedYear)"
                                    :key="month"
                                    :value="month"
                                >
                                    {{ month }}月
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Quick Selection for Recent Months -->
                    <div v-if="!selectedMonth" class="mt-4">
                        <label class="block text-xs text-gray-500 mb-2"
                            >快速选择（最近6个月）</label
                        >
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="month in recentMonths"
                                :key="month.value"
                                @click="selectMonth(month.value)"
                                class="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm transition-colors"
                            >
                                {{ month.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Keyword Filter -->
                <div>
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
                        {{ selectedMonthLabel }} 第 {{ currentPage }} 页，共 {{ totalPages }} 页
                        <span v-if="filterKeyword" class="text-blue-600">
                            （过滤后显示 {{ displayedPapers.length }} 篇）
                        </span>
                    </p>
                    <div class="text-sm text-gray-500">按引用量排序</div>
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
                        <div
                            class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold"
                        >
                            {{ (currentPage - 1) * pageSize + index + 1 }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div
                                class="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2"
                            >
                                <h2
                                    class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors mb-2 lg:mb-0 lg:mr-4"
                                    @click="openPaperLink(paper)"
                                >
                                    {{ paper.title }}
                                </h2>
                                <div
                                    class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500"
                                >
                                    <span
                                        class="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap"
                                    >
                                        📊 {{ formatNumber(paper.citations) }}
                                    </span>
                                    <span
                                        class="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-mono text-xs whitespace-nowrap"
                                    >
                                        arXiv:{{ paper.arxivId }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 mb-3"
                            >
                                <span class="font-medium">作者:</span>
                                <p class="text-gray-700 break-words">
                                    {{ paper.authors }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer with keywords and date -->
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100"
                    >
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
                        <div
                            class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500"
                        >
                            <span>📅 {{ formatDate(paper.publishedDate) }}</span>
                            <button
                                class="text-blue-600 hover:text-blue-800 font-medium text-left sm:text-center"
                                @click="openPaperLink(paper)"
                            >
                                查看原文 →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1 && !isLoading" class="mt-8 flex justify-center">
                <nav class="flex items-center space-x-2">
                    <!-- First Page -->
                    <button
                        @click="goToFirstPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        首页
                    </button>

                    <!-- Previous Page -->
                    <button
                        @click="goToPrevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        上一页
                    </button>

                    <!-- Page Numbers -->
                    <div class="flex items-center space-x-1">
                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            @click="changePage(page)"
                            :class="[
                                'px-3 py-2 text-sm font-medium rounded-md',
                                page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
                            ]"
                        >
                            {{ page }}
                        </button>
                    </div>

                    <!-- Next Page -->
                    <button
                        @click="goToNextPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        下一页
                    </button>

                    <!-- Last Page -->
                    <button
                        @click="goToLastPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        末页
                    </button>
                </nav>
            </div>

            <!-- Page Info -->
            <div v-if="totalPages > 1 && !isLoading" class="mt-4 text-center text-sm text-gray-500">
                第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </div>

            <!-- Error Message -->
            <div
                v-if="loadError && !isLoading"
                class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
                <div class="flex items-center">
                    <div class="text-red-800"><strong>加载失败:</strong> {{ loadError }}</div>
                </div>
                <p class="text-red-600 text-sm mt-2">已尝试使用备用数据，如果问题持续请稍后重试</p>
            </div>

            <!-- No results -->
            <div
                v-if="selectedMonth && displayedPapers.length === 0 && !isLoading && !loadError"
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
            <div v-if="!selectedMonth" class="text-center py-12">
                <div class="text-gray-400 text-lg mb-2">请选择月份</div>
                <p class="text-gray-500">选择一个月份来查看该月的推荐论文</p>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                ></div>
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
            selectedYear: '',
            selectedMonthOnly: '',
            filterKeyword: '',
            monthlyPapers: [],
            displayedPapers: [],
            isLoading: false,
            loadError: null,
            currentPage: 1,
            totalPages: 1,
            pageSize: 100,
            startYear: 2020,
            endYear: 2025,
            endMonth: 5, // 2025年5月
            // 模拟不同月份的论文数据
            papersByMonth: {
                '2020-01': [
                    {
                        id: 101,
                        title: 'Language Models are Unsupervised Multitask Learners',
                        authors:
                            'Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, Ilya Sutskever',
                        citations: 12543,
                        arxivId: '1909.08593',
                        publishedDate: '2020-01-15',
                        keywords: ['GPT-2', 'language model', 'unsupervised learning', 'NLP'],
                    },
                ],
                '2023-12': [
                    {
                        id: 201,
                        title: 'GPT-4 Technical Report',
                        authors: 'OpenAI',
                        citations: 8934,
                        arxivId: '2303.08774',
                        publishedDate: '2023-12-10',
                        keywords: ['GPT-4', 'large language model', 'multimodal', 'AI'],
                    },
                ],
                '2024-01': [
                    {
                        id: 1,
                        title: 'Attention Is All You Need',
                        authors:
                            'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
                        citations: 45672,
                        arxivId: '1706.03762',
                        publishedDate: '2024-01-15',
                        keywords: ['transformer', 'attention', 'neural networks', 'NLP'],
                    },
                    {
                        id: 2,
                        title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
                        authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
                        citations: 38291,
                        arxivId: '1810.04805',
                        publishedDate: '2024-01-22',
                        keywords: ['BERT', 'transformer', 'language model', 'pre-training'],
                    },
                ],
                '2024-02': [
                    {
                        id: 3,
                        title: 'Deep Residual Learning for Image Recognition',
                        authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
                        citations: 89234,
                        arxivId: '1512.03385',
                        publishedDate: '2024-02-10',
                        keywords: [
                            'ResNet',
                            'deep learning',
                            'computer vision',
                            'residual networks',
                        ],
                    },
                    {
                        id: 4,
                        title: 'Generative Adversarial Networks',
                        authors:
                            'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio',
                        citations: 67543,
                        arxivId: '1406.2661',
                        publishedDate: '2024-02-18',
                        keywords: [
                            'GAN',
                            'generative models',
                            'adversarial training',
                            'deep learning',
                        ],
                    },
                ],
                '2024-12': [
                    {
                        id: 7,
                        title: 'Scaling Laws for Neural Language Models',
                        authors: 'Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown',
                        citations: 15678,
                        arxivId: '2001.08361',
                        publishedDate: '2024-12-05',
                        keywords: ['scaling laws', 'language models', 'neural networks', 'AI'],
                    },
                ],
                '2025-01': [
                    {
                        id: 8,
                        title: 'Multimodal Large Language Models: A Survey',
                        authors: 'Shukang Yin, Chaoyou Fu, Sirui Zhao, Ke Li, Xing Sun',
                        citations: 2345,
                        arxivId: '2401.13601',
                        publishedDate: '2025-01-10',
                        keywords: ['multimodal', 'large language models', 'survey', 'AI'],
                    },
                ],
                '2025-05': [
                    {
                        id: 9,
                        title: 'The Future of AI: Trends and Predictions',
                        authors: 'Future AI Research Team',
                        citations: 1234,
                        arxivId: '2505.00001',
                        publishedDate: '2025-05-15',
                        keywords: [
                            'AI trends',
                            'future technology',
                            'predictions',
                            'artificial intelligence',
                        ],
                    },
                ],
            },
        };
    },
    computed: {
        availableYears() {
            const years = [];
            for (let year = this.startYear; year <= this.endYear; year++) {
                years.push(year);
            }
            return years;
        },

        selectedMonthLabel() {
            if (!this.selectedMonth) return '';
            const [year, month] = this.selectedMonth.split('-');
            return `${year}年${parseInt(month)}月`;
        },

        recentMonths() {
            const months = [];
            const now = new Date();

            for (let i = 0; i < 6; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                // 检查是否在有效范围内
                if (this.isValidMonth(year, month)) {
                    const value = `${year}-${month.toString().padStart(2, '0')}`;
                    const label = `${year}年${month}月`;
                    months.push({ value, label });
                }
            }

            return months;
        },

        visiblePages() {
            const pages = [];
            const maxVisible = 5; // 最多显示5个页码

            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            // 调整起始位置，确保显示足够的页码
            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },
    },
    methods: {
        isValidMonth(year, month) {
            // 检查月份是否在有效范围内
            if (year < this.startYear || year > this.endYear) return false;
            if (year === this.startYear && month < 1) return false;
            if (year === this.endYear && month > this.endMonth) return false;
            return true;
        },

        getAvailableMonthsForYear(year) {
            if (!year) return [];

            const months = [];
            const startMonth = year === this.startYear ? 1 : 1;
            const endMonth = year === this.endYear ? this.endMonth : 12;

            for (let month = startMonth; month <= endMonth; month++) {
                months.push(month);
            }

            return months;
        },

        onYearChange() {
            this.selectedMonthOnly = '';
            this.selectedMonth = '';
            this.monthlyPapers = [];
            this.displayedPapers = [];
            this.currentPage = 1;
            this.totalPages = 1;
        },

        onMonthChange() {
            if (this.selectedYear && this.selectedMonthOnly) {
                const monthValue = `${this.selectedYear}-${this.selectedMonthOnly.toString().padStart(2, '0')}`;
                this.selectMonth(monthValue);
            }
        },

        selectMonth(monthValue) {
            this.selectedMonth = monthValue;
            const [year, month] = monthValue.split('-');
            this.selectedYear = parseInt(year);
            this.selectedMonthOnly = parseInt(month);
            this.filterKeyword = '';
            this.currentPage = 1;
            this.totalPages = 1;
            this.loadMonthlyPapers();
        },

        clearMonthSelection() {
            this.selectedMonth = '';
            this.selectedYear = '';
            this.selectedMonthOnly = '';
            this.monthlyPapers = [];
            this.displayedPapers = [];
            this.filterKeyword = '';
        },

        async loadMonthlyPapers() {
            this.isLoading = true;
            this.loadError = null;

            try {
                // 将 YYYY-MM 格式转换为 YYYYMM 格式
                const monthParam = this.selectedMonth.replace('-', '');

                // 首先获取总页数
                await this.loadTotalPages(monthParam);

                // 然后加载当前页的数据
                await this.loadPageData(monthParam, this.currentPage);
            } catch (error) {
                console.error('获取论文数据失败:', error);
                this.loadError = error.message;

                // 如果API请求失败，使用本地模拟数据作为备用
                const fallbackData = this.papersByMonth[this.selectedMonth] || [];
                if (fallbackData.length > 0) {
                    this.monthlyPapers = fallbackData.sort((a, b) => b.citations - a.citations);
                    this.displayedPapers = [...this.monthlyPapers];
                    this.totalPages = 1;
                    this.currentPage = 1;
                    this.loadError = null; // 清除错误，因为有备用数据
                } else {
                    this.monthlyPapers = [];
                    this.displayedPapers = [];
                    this.totalPages = 1;
                    this.currentPage = 1;
                }
            }

            this.isLoading = false;
        },

        async loadTotalPages(monthParam) {
            const response = await fetch(`http://125.34.17.225:9300/page_num/${monthParam}/`);

            if (!response.ok) {
                throw new Error(`获取页数失败! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.ret === 'ok' && typeof result.data === 'number') {
                this.totalPages = Math.max(1, result.data);
            } else {
                throw new Error('页数API返回数据格式错误');
            }
        },

        async loadPageData(monthParam, page) {
            const response = await fetch(`http://125.34.17.225:9300/meta/${monthParam}/${page}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.ret === 'ok' && result.data) {
                // 转换API数据格式为组件需要的格式
                this.monthlyPapers = result.data
                    .map((paper, index) => ({
                        id: (page - 1) * this.pageSize + index + 1,
                        title: paper.title,
                        authors: paper.authors,
                        citations: paper.citations,
                        arxivId: this.extractArxivId(paper.url),
                        publishedDate: this.formatPublishedDate(paper.publishedMonth),
                        keywords: paper.keywords || [],
                        url: paper.url,
                    }))
                    .sort((a, b) => b.citations - a.citations);

                this.displayedPapers = [...this.monthlyPapers];
            } else {
                throw new Error('API返回数据格式错误');
            }
        },

        filterPapers() {
            if (!this.filterKeyword.trim()) {
                this.displayedPapers = [...this.monthlyPapers];
                return;
            }

            const keyword = this.filterKeyword.toLowerCase();
            this.displayedPapers = this.monthlyPapers.filter(
                (paper) =>
                    paper.title.toLowerCase().includes(keyword) ||
                    paper.authors.toLowerCase().includes(keyword) ||
                    paper.keywords.some((k) => k.toLowerCase().includes(keyword)),
            );
        },

        filterByKeyword(keyword) {
            this.filterKeyword = keyword;
            this.filterPapers();
        },

        clearFilter() {
            this.filterKeyword = '';
            this.displayedPapers = [...this.monthlyPapers];
        },

        openArxivLink(arxivId) {
            window.open(`https://arxiv.org/abs/${arxivId}`, '_blank');
        },

        formatNumber(num) {
            return num.toLocaleString();
        },

        extractArxivId(url) {
            // 从URL中提取arXiv ID
            // 例如: https://arxiv.org/pdf/2506.01939 -> 2506.01939
            const match = url.match(/arxiv\.org\/pdf\/([^\/]+)/);
            return match ? match[1] : '';
        },

        formatPublishedDate(publishedMonth) {
            // 将 YYYYMM 格式转换为 YYYY-MM-01 格式
            if (publishedMonth && publishedMonth.length === 6) {
                const year = publishedMonth.substring(0, 4);
                const month = publishedMonth.substring(4, 6);
                return `${year}-${month}-01`;
            }
            return '';
        },

        openPaperLink(paper) {
            // 优先使用paper.url，如果没有则使用arxivId构建链接
            if (paper.url) {
                window.open(paper.url, '_blank');
            } else if (paper.arxivId) {
                window.open(`https://arxiv.org/abs/${paper.arxivId}`, '_blank');
            }
        },

        async changePage(page) {
            if (page < 1 || page > this.totalPages || page === this.currentPage) {
                return;
            }

            this.currentPage = page;
            this.isLoading = true;
            this.loadError = null;

            try {
                const monthParam = this.selectedMonth.replace('-', '');
                await this.loadPageData(monthParam, page);

                // 重新应用过滤
                this.filterPapers();
            } catch (error) {
                console.error('切换页面失败:', error);
                this.loadError = error.message;
            }

            this.isLoading = false;
        },

        goToFirstPage() {
            this.changePage(1);
        },

        goToLastPage() {
            this.changePage(this.totalPages);
        },

        goToPrevPage() {
            this.changePage(this.currentPage - 1);
        },

        goToNextPage() {
            this.changePage(this.currentPage + 1);
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('zh-CN');
        },
    },

    mounted() {
        // 默认选择当前月份或最新可用月份
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (this.isValidMonth(currentYear, currentMonth)) {
            const monthValue = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
            this.selectMonth(monthValue);
        } else {
            // 选择最新的可用月份（2025年5月）
            this.selectMonth('2025-05');
        }
    },
};
</script>
