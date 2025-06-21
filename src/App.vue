<template>
    <div class="min-h-screen bg-gray-50 w-full overflow-y-scroll">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b w-full"<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    ArXiv 
                    <span class="relative inline-block">
                        AI Paper
                        <div class="group relative inline-block ml-1">
                            <span class="inline-flex items-center justify-center w-4 h-4 text-xs bg-blue-100 text-blue-600 rounded-full cursor-help hover:bg-blue-200 transition-colors">
                                ?
                            </span>
                            <!-- Tooltip -->
                            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                <div class="text-center">
                                    <div class="font-medium mb-1">AI Paper Categories:</div>
                                    <div class="text-xs space-y-0.5">
                                        <div>cs.CV - Computer Vision</div>
                                        <div>cs.LG - Machine Learning</div>
                                        <div>cs.CL - Computational Linguistics</div>
                                        <div>cs.AI - Artificial Intelligence</div>
                                    </div>
                                </div>
                                <!-- Tooltip arrow -->
                                <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    </span>
                    Ranking
                    <span class="text-gray-600 text-sm sm:text-base ml-4">
                        All ArXiv AI Papers, Sorted by Citations, Daily Updating
                    </span>
                </h1>
            </div>
        </header>
        <!-- Control Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
                <!-- Month Selection -->
                <div class="mb-6">
                    <!-- Year and Month Selection in Same Row -->
                    <div class="flex flex-col lg:flex-row gap-4 mb-4">
                        <!-- Year Dropdown -->
                        <div class="lg:w-48">
                            <label class="block text-xs text-gray-500 mb-2">Year</label>
                            <select
                                v-model="selectedYear"
                                @change="onYearChange"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            >
                                <option value="">Select Year</option>
                                <option v-for="year in availableYears" :key="year" :value="year">
                                    {{ year }}
                                </option>
                            </select>
                        </div>
                        <!-- Month Buttons -->
                        <div v-if="selectedYear" class="flex-1">
                            <label class="block text-xs text-gray-500 mb-2">Month</label>
                            <div
                                class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2"
                            >
                                <button
                                    v-for="month in getAvailableMonthsForYear(selectedYear)"
                                    :key="month"
                                    @click="selectMonthOnly(month)"
                                    :class="[
                                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                        selectedMonthOnly === month
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                    ]"
                                >
                                    {{ getMonthName(month) }}
                                </button>
                            </div>
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
                            placeholder="Enter keywords to filter papers..."
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                        <button
                            @click="clearFilter"
                            v-if="filterKeyword"
                            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>
            </div>
            <!-- Results -->
            <div v-if="displayedPapers.length > 0 && !isLoading" class="mb-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <p class="text-gray-600 mb-2 sm:mb-0">
                        {{ selectedMonthLabel }} Page {{ currentPage }} of {{ totalPages }}
                        <span v-if="filterKeyword" class="text-blue-600">
                            ({{ filteredPapers.length }} papers after filtering)
                        </span>
                    </p>
                    <div class="text-sm text-gray-500">Sorted by Citations</div>
                </div>
            </div<!-- Loading Block for Paper List -->
            <div v-if="isLoading && selectedMonth" class="relative min-h-screen">
                <div
                    class="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 rounded-lg"
                >
                    <div class="flex flex-col items-center justify-center" style="height: 50vh;">
                        <div
                            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"
                        ></div>
                        <p class="text-lg font-medium text-gray-700 mb-2">Loading Papers...</p>
                        <p class="text-sm text-gray-500">
                            Fetching data for {{ selectedMonthLabel }}
                        </p>
                    </div>
                </div>
                <!-- Placeholder content to maintain layout and prevent scrollbar jumping -->
                <div class="space-y-6 opacity-30">
                    <div v-for="i in Math.max(15, pageSize / 5)" :key="i" class="bg-gray-100 rounded-lg p-6 animate-pulse">
                        <div class="flex items-start gap-4 mb-4">
                            <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div class="flex-1">
                                <div class="h-6 bg-gray-200 rounded mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                        <div class="flex gap-2 pt-4 border-t border-gray-200">
                            <div class="h-6 bg-gray-200 rounded w-16"></div>
                            <div class="h-6 bg-gray-200 rounded w-20"></div>
                            <div class="h-6 bg-gray-200 rounded w-24"></div>
                            <div class="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Paper List -->
            <div v-if="!isLoading" class="space-y-6">
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
                            {{ paper.id }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start gap-4 mb-2">
                                <h2
                                    class="flex-1 text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors min-w-0"
                                    @click="openPaperLink(paper)"
                                >
                                    {{ paper.title }}
                                </h2>
                                <div
                                    class="flex-shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-2 text-xs sm:text-sm text-gray-500 w-48 sm:w-auto"
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
                                <span class="font-medium">Authors:</span>
                                <p class="text-gray-700 break-words">
                                    {{ truncateAuthors(paper.authors, 100) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- Footer with keywords and date -->
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100"
                    >
                        <div class="flex flex-wrap gap-2">
                            <span class="text-sm font-medium text-gray-700 mr-2">Keywords:</span>
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
                                View Paper →
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
                        First
                    </button>
                    <!-- Previous Page -->
                    <button
                        @click="goToPrevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
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
                        Next
                    </button>
                    <!-- Last Page -->
                    <button
                        @click="goToLastPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Last
                    </button>
                </nav>
            </div>
            <!-- Page Info -->
            <div v-if="totalPages > 1 && !isLoading" class="mt-4 text-center text-sm text-gray-500">
                Page {{ currentPage }} of {{ totalPages }}
            </div>
            <!-- Error Message -->
            <div
                v-if="loadError && !isLoading"
                class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
                <div class="flex items-center">
                    <div class="text-red-800"><strong>Loading Failed:</strong> {{ loadError }}</div>
                </div>
                <p class="text-red-600 text-sm mt-2">
                    Fallback data has been used. Please try again later if the problem persists.
                </p>
            </div>
            <!-- No results -->
            <div
                v-if="selectedMonth && displayedPapers.length === 0 && !isLoading && !loadError"
                class="text-center py-12"
            >
                <div class="text-gray-400 text-lg mb-2">
                    {{
                        filterKeyword
                            ? 'No matching papers found'
                            : 'No papers available for this month'
                    }}
                </div>
                <p class="text-gray-500">
                    {{
                        filterKeyword
                            ? 'Try different keywords or select another month'
                            : 'Please select another month'
                    }}
                </p>
            </div>
            <!-- No month selected -->
            <div v-if="!selectedMonth && !isLoading" class="text-center py-12">
                <div class="text-gray-400 text-lg mb-2">Please select a month</div>
                <p class="text-gray-500">Select a month to view recommended papers</p>
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
            allMonthlyPapers: [],
            filteredPapers: [],
            displayedPapers: [],
            isLoading: false,
            loadError: null,
            currentPage: 1,
            totalPages: 1,
            pageSize: 100,
            startYear: 2020,
            endYear: new Date().getFullYear(),
            endMonth: new Date().getMonth() + 1,
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
            },
        };
    },
    computed: {
        availableYears() {
            const years = [];
            const currentYear = new Date().getFullYear();
            for (let year = 2020; year <= currentYear; year++) {
                years.push(year);
            }
            return years;
        },
        selectedMonthLabel() {
            if (!this.selectedMonth) return '';
            const [year, month] = this.selectedMonth.split('-');
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            return `${monthNames[parseInt(month) - 1]} ${year}`;
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);
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
        getMonthName(month) {
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            return monthNames[month - 1];
        },
        isValidMonth(year, month) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            if (year < 2020 || (year === 2020 && month < 1)) return false;
            if (year > currentYear || (year === currentYear && month > currentMonth)) return false;
            return true;
        },
        getAvailableMonthsForYear(year) {
            if (!year) return [];
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            const months = [];
            const startMonth = year === 2020 ? 1 : 1;
            const endMonth = year === currentYear ? currentMonth : 12;
            for (let month = startMonth; month <= endMonth; month++) {
                months.push(month);
            }
            return months;
        },
        onYearChange() {
            this.selectedMonthOnly = '';
            this.selectedMonth = '';
            this.allMonthlyPapers = [];
            this.filteredPapers = [];
            this.displayedPapers = [];
            this.currentPage = 1;
            this.totalPages = 1;
            if (this.selectedYear) {
                const availableMonths = this.getAvailableMonthsForYear(this.selectedYear);
                if (availableMonths.includes(12)) {
                    this.selectMonthOnly(12);
                } else if (availableMonths.length > 0) {
                    this.selectMonthOnly(availableMonths[availableMonths.length - 1]);
                }
            }
        },
        selectMonthOnly(month) {
            this.selectedMonthOnly = month;
            if (this.selectedYear && month) {
                const monthValue = `${this.selectedYear}-${month.toString().padStart(2, '0')}`;
                this.selectMonth(monthValue);
            }
        },
        selectMonth(monthValue) {
            this.selectedMonth = monthValue;
            const [year, month] = monthValue.split('-');
            this.selectedYear = parseInt(year);
            this.selectedMonthOnly = parseInt(month);
            this.currentPage = 1;
            this.totalPages = 1;
            this.loadMonthlyPapers();
        },
        async loadMonthlyPapers() {
            this.isLoading = true;
            this.loadError = null;
            try {
                const monthParam = this.selectedMonth.replace('-', '');
                await this.loadAllMonthData(monthParam);
                if (this.filterKeyword.trim()) {
                    this.filterPapers();
                } else {
                    this.calculateTotalPages();
                    this.updateCurrentPageData();
                }
            } catch (error) {
                console.error('Failed to fetch paper data:', error);
                this.loadError = error.message;
                const fallbackData = this.papersByMonth[this.selectedMonth] || [];
                if (fallbackData.length > 0) {
                    this.allMonthlyPapers = fallbackData.sort((a, b) => b.citations - a.citations);
                    if (this.filterKeyword.trim()) {
                        this.filterPapers();
                    } else {
                        this.calculateTotalPages();
                        this.updateCurrentPageData();
                    }
                    this.loadError = null;
                } else {
                    this.allMonthlyPapers = [];
                    this.filteredPapers = [];
                    this.displayedPapers = [];
                    this.totalPages = 1;
                    this.currentPage = 1;
                }
            }
            this.isLoading = false;
        },
        async loadAllMonthData(monthParam) {
            const response = await fetch(`http://125.34.17.225:9300/meta/${monthParam}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.ret === 'ok' && result.data) {
                this.allMonthlyPapers = result.data.map((paper) => ({
                    id: paper.id,
                    title: paper.title,
                    authors: paper.authors,
                    citations: paper.citations,
                    arxivId: this.extractArxivId(paper.url),
                    publishedDate: this.formatPublishedDate(paper.publishedMonth),
                    keywords: paper.keywords || [],
                    url: paper.url,
                }));
            } else {
                throw new Error('Invalid API response format');
            }
        },
        calculateTotalPages() {
            const dataLength = this.filterKeyword.trim()
                ? this.filteredPapers.length
                : this.allMonthlyPapers.length;
            this.totalPages = Math.max(1, Math.ceil(dataLength / this.pageSize));
        },
        updateCurrentPageData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const sourceData = this.filterKeyword.trim()
                ? this.filteredPapers
                : this.allMonthlyPapers;
            this.displayedPapers = sourceData.slice(startIndex, endIndex);
        },
        filterPapers() {
            if (!this.filterKeyword.trim()) {
                this.filteredPapers = [];
                this.currentPage = 1;
                this.calculateTotalPages();
                this.updateCurrentPageData();
                return;
            }
            const keyword = this.filterKeyword.toLowerCase();
            this.filteredPapers = this.allMonthlyPapers.filter(
                (paper) =>
                    paper.title.toLowerCase().includes(keyword) ||
                    paper.authors.toLowerCase().includes(keyword) ||
                    paper.keywords.some((k) => k.toLowerCase().includes(keyword)),
            );
            this.currentPage = 1;
            this.calculateTotalPages();
            this.updateCurrentPageData();
        },
        filterByKeyword(keyword) {
            this.filterKeyword = keyword;
            this.filterPapers();
        },
        clearFilter() {
            this.filterKeyword = '';
            this.filteredPapers = [];
            this.currentPage = 1;
            this.calculateTotalPages();
            this.updateCurrentPageData();
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages || page === this.currentPage) {
                return;
            }
            this.currentPage = page;
            this.updateCurrentPageData();
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
        openArxivLink(arxivId) {
            window.open(`https://arxiv.org/abs/${arxivId}`, '_blank');
        },
        formatNumber(num) {
            return num.toLocaleString();
        },
        extractArxivId(url) {
            const match = url.match(/arxiv\.org\/pdf\/([^\/]+)/);
            return match ? match[1] : '';
        },
        formatPublishedDate(publishedMonth) {
            if (publishedMonth && publishedMonth.length === 6) {
                const year = publishedMonth.substring(0, 4);
                const month = publishedMonth.substring(4, 6);
                return `${year}-${month}-01`;
            }
            return '';
        },
        openPaperLink(paper) {
            if (paper.url) {
                window.open(paper.url, '_blank');
            } else if (paper.arxivId) {
                window.open(`https://arxiv.org/abs/${paper.arxivId}`, '_blank');
            }
        },
        truncateAuthors(authors, maxLength) {
            if (!authors || authors.length <= maxLength) {
                return authors;
            }
            return authors.substring(0, maxLength) + '...';
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US');
        },
    },
    mounted() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (this.isValidMonth(currentYear, currentMonth)) {
            const monthValue = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
            this.selectMonth(monthValue);
        } else {
            const monthValue = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
            this.selectMonth(monthValue);
        }
    },
};
</script>
