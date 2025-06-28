<template>
    <div class="min-h-screen bg-gray-50 w-full overflow-y-scroll">
        <!-- Control Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
                <!-- Month Range Filter -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <label class="block text-sm font-medium text-gray-700">
                            📅 Publication Date Range
                        </label>
                        <button
                            @click="resetMonthRange"
                            class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Reset to All Time
                        </button>
                    </div>
                    <!-- Elegant Month Range Selector -->
                    <div
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                    >
                        <!-- Selected Range Display -->
                        <div class="flex items-center justify-center mb-4">
                            <div
                                class="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border"
                            >
                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                                        >From</span
                                    >
                                    <span class="text-sm font-semibold text-blue-600">{{
                                        getMonthDisplay(startMonth)
                                    }}</span>
                                </div>
                                <div class="w-8 h-px bg-gray-300"></div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                                        >To</span
                                    >
                                    <span class="text-sm font-semibold text-blue-600">{{
                                        getMonthDisplay(endMonth)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Year and Month Grid Selector -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- Start Date Selector -->
                            <div class="bg-white rounded-lg p-3 border border-gray-200">
                                <h4
                                    class="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide"
                                >
                                    Start Date
                                </h4>
                                <div class="space-y-2">
                                    <!-- Year Selector for Start -->
                                    <select
                                        v-model="selectedStartYear"
                                        @change="updateStartMonth"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option
                                            v-for="year in availableYears"
                                            :key="year"
                                            :value="year"
                                        >
                                            {{ year }}
                                        </option>
                                    </select>
                                    <!-- Month Selector for Start -->
                                    <select
                                        v-model="selectedStartMonthNum"
                                        @change="updateStartMonth"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option
                                            v-for="(monthName, monthNum) in monthNames"
                                            :key="monthNum"
                                            :value="monthNum"
                                        >
                                            {{ monthName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <!-- End Date Selector -->
                            <div class="bg-white rounded-lg p-3 border border-gray-200">
                                <h4
                                    class="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide"
                                >
                                    End Date
                                </h4>
                                <div class="space-y-2">
                                    <!-- Year Selector for End -->
                                    <select
                                        v-model="selectedEndYear"
                                        @change="updateEndMonth"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option
                                            v-for="year in availableYears"
                                            :key="year"
                                            :value="year"
                                        >
                                            {{ year }}
                                        </option>
                                    </select>
                                    <!-- Month Selector for End -->
                                    <select
                                        v-model="selectedEndMonthNum"
                                        @change="updateEndMonth"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option
                                            v-for="(monthName, monthNum) in monthNames"
                                            :key="monthNum"
                                            :value="monthNum"
                                        >
                                            {{ monthName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- Quick Select Buttons -->
                        <div class="mt-4 flex flex-wrap gap-2 justify-center">
                            <button
                                v-for="preset in datePresets"
                                :key="preset.label"
                                @click="applyDatePreset(preset)"
                                class="px-3 py-1 text-xs font-medium bg-white text-gray-600 border border-gray-300 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
                            >
                                {{ preset.label }}
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
                            @keyup.enter="filterPapers"
                            placeholder="Enter keywords to search all papers (separate multiple keywords with commas)..."
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                        <div class="relative">
                            <div
                                @click="toggleKeywordsDropdown"
                                class="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <span class="text-sm text-gray-700 font-medium">Keywords:</span>
                                <span class="text-sm text-gray-700 font-medium">{{
                                    matchAllKeywords ? 'And' : 'Or'
                                }}</span>
                                <svg
                                    class="w-4 h-4 text-gray-500 transition-transform duration-200"
                                    :class="{ 'rotate-180': showKeywordsDropdown }"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </div>
                            <div
                                v-if="showKeywordsDropdown"
                                class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-full"
                            >
                                <div class="p-2 space-y-2">
                                    <div
                                        class="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                                        @click="selectKeywordOption(true)"
                                    >
                                        <input
                                            type="radio"
                                            id="keywords-and-search"
                                            name="match-type-search"
                                            :value="true"
                                            v-model="matchAllKeywords"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        />
                                        <label
                                            for="keywords-and-search"
                                            class="text-sm text-gray-700 cursor-pointer"
                                        >
                                            And
                                        </label>
                                    </div>
                                    <div
                                        class="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                                        @click="selectKeywordOption(false)"
                                    >
                                        <input
                                            type="radio"
                                            id="keywords-or-search"
                                            name="match-type-search"
                                            :value="false"
                                            v-model="matchAllKeywords"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        />
                                        <label
                                            for="keywords-or-search"
                                            class="text-sm text-gray-700 cursor-pointer"
                                        >
                                            Or
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            @click="filterPapers"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                        >
                            Search
                        </button>
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
            <div v-if="displayedPapers.length > 0 && !isLoading && hasSearched" class="mb-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <p class="text-gray-600 mb-2 sm:mb-0">
                        All Papers - Page {{ currentPage }} of {{ totalPages }}
                        <span v-if="filterKeyword" class="text-blue-600">
                            (filtered by "{{ filterKeyword }}")
                        </span>
                        <span v-else class="text-gray-500"> (default results) </span>
                    </p>
                    <div class="text-sm text-gray-500">Sorted by Citations</div>
                </div>
            </div>
            <!-- Loading Block for Paper List -->
            <div v-if="isLoading" class="relative min-h-screen">
                <div
                    class="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 rounded-lg"
                >
                    <div class="flex flex-col items-center justify-center" style="height: 50vh">
                        <div
                            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"
                        ></div>
                        <p class="text-lg font-medium text-gray-700 mb-2">Loading Papers...</p>
                        <p class="text-sm text-gray-500">
                            Fetching page {{ currentPage }}
                            <span v-if="filterKeyword">(filtered by "{{ filterKeyword }}")</span>
                        </p>
                    </div>
                </div>
                <!-- Placeholder content to maintain layout and prevent scrollbar jumping -->
                <div class="space-y-6 opacity-30">
                    <div
                        v-for="i in Math.max(15, pageSize / 5)"
                        :key="i"
                        class="bg-gray-100 rounded-lg p-6 animate-pulse"
                    >
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
                v-if="displayedPapers.length === 0 && !isLoading && !loadError && hasSearched"
                class="text-center py-12"
            >
                <div class="text-6xl mb-4">📄</div>
                <div class="text-gray-400 text-lg mb-2">No matching papers found</div>
                <p class="text-gray-500 mb-4" v-if="filterKeyword">
                    No papers found for "{{ filterKeyword }}"
                </p>
                <p class="text-gray-500 mb-4" v-else>No default papers available</p>
                <div class="text-sm text-gray-400">
                    <p>💡 Try different keywords, check spelling, or use broader terms</p>
                </div>
            </div>
            <!-- No search performed -->
            <div v-if="!hasSearched && !isLoading" class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <div class="text-gray-400 text-lg mb-2">Enter keywords to search</div>
                <p class="text-gray-500">Search across all papers by entering keywords above</p>
                <div class="mt-6 text-sm text-gray-400">
                    <p>
                        💡 Tips: Try keywords like "transformer", "attention", "BERT", "GPT", etc.
                    </p>
                    <p class="mt-2">
                        🔍 You can search multiple keywords separated by commas (e.g., "transformer,
                        attention")
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const data_url = import.meta.env.VITE_API_BASE_URL; export default { name: 'SearchPage', data() { const currentDate = new Date(); const currentYear = currentDate.getFullYear(); const currentMonth = currentDate.getMonth() + 1; return { filterKeyword: '', matchAllKeywords: false, showKeywordsDropdown: false, displayedPapers: [], isLoading: false, loadError: null, currentPage: 1, totalPages: 1, pageSize: 100, hasSearched: false, startMonth: 0, endMonth: 0, // 将在初始化时设置为当前月份 minMonth: 0, maxMonth: 0, // 将在初始化时计算 monthList: [], selectedStartYear: 2020, selectedStartMonthNum: 1, selectedEndYear: currentYear, selectedEndMonthNum: currentMonth, availableYears: [], monthNames: { 1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December', }, datePresets: [ { label: 'Last 6 Months', months: 6 }, { label: 'Last Year', months: 12 }, { label: 'Last 2 Years', months: 24 }, { label: 'All Time', months: null }, ], }; }, computed: { visiblePages() { const pages = []; const maxVisible = 5; let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2)); let end = Math.min(this.totalPages, start + maxVisible - 1); if (end - start + 1 < maxVisible) { start = Math.max(1, end - maxVisible + 1); } for (let i = start; i <= end; i++) { pages.push(i); } return pages; }, }, watch: { startMonth() { if (this.hasSearched) { this.currentPage = 1; this.loadSearchResults(); } }, endMonth() { if (this.hasSearched) { this.currentPage = 1; this.loadSearchResults(); } }, }, methods: { async loadSearchResults() { this.isLoading = true; this.loadError = null; try { const keywords = this.filterKeyword.trim(); await this.loadPageData(keywords, this.currentPage); } catch (error) { console.error('Failed to fetch paper data:', error); this.loadError = error.message; this.displayedPapers = []; this.totalPages = 1; this.currentPage = 1; } this.isLoading = false; }, async loadPageData(keywordString, page) { let keywords = null; if (keywordString && keywordString.trim()) { keywords = keywordString .trim() .split(',') .map((kw) => kw.trim()) .filter((kw) => kw.length > 0); } const requestBody = { start_month: this.getMonthValue(this.startMonth) ? this.getMonthValue(this.startMonth).toString() : null, end_month: this.getMonthValue(this.endMonth) ? this.getMonthValue(this.endMonth).toString() : null, page: page, keywords: keywords, match_all_keywords: this.matchAllKeywords, }; const response = await fetch(`${data_url}/meta`, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(requestBody), }); if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); } const result = await response.json(); if (result.ret === 'ok' && result.data) { this.displayedPapers = result.data.map((paper) => ({ id: paper.id, title: paper.title, authors: paper.authors, citations: paper.citations, arxivId: this.extractArxivId(paper.url), publishedDate: this.formatPublishedDate(paper.publishedMonth), keywords: paper.keywords || [], url: paper.url, })); this.totalPages = result.page_count || 1; } else { throw new Error('Invalid API response format'); } }, async filterPapers() { this.currentPage = 1; this.hasSearched = true; await this.loadSearchResults(); }, async filterByKeyword(keyword) { this.filterKeyword = keyword; await this.filterPapers(); }, async clearFilter() { this.filterKeyword = ''; this.currentPage = 1; this.hasSearched = true; await this.loadSearchResults(); }, async changePage(page) { if (page < 1 || page > this.totalPages || page === this.currentPage) { return; } this.currentPage = page; await this.loadSearchResults(); }, async goToFirstPage() { await this.changePage(1); }, async goToLastPage() { await this.changePage(this.totalPages); }, async goToPrevPage() { await this.changePage(this.currentPage - 1); }, async goToNextPage() { await this.changePage(this.currentPage + 1); }, formatNumber(num) { return num.toLocaleString(); }, extractArxivId(url) { const match = url.match(/arxiv\.org\/pdf\/([^\/]+)/); return match ? match[1] : ''; }, formatPublishedDate(publishedMonth) { if (publishedMonth && publishedMonth.length === 6) { const year = publishedMonth.substring(0, 4); const month = publishedMonth.substring(4, 6); return `${year}-${month}-01`; } return ''; }, openPaperLink(paper) { if (paper.url) { window.open(paper.url, '_blank'); } else if (paper.arxivId) { window.open(`https://arxiv.org/abs/${paper.arxivId}`, '_blank'); } }, truncateAuthors(authors, maxLength) { if (!authors || authors.length <= maxLength) { return authors; } return authors.substring(0, maxLength) + '...'; }, formatDate(dateString) { return new Date(dateString).toLocaleDateString('en-US'); }, toggleKeywordsDropdown() { this.showKeywordsDropdown = !this.showKeywordsDropdown; }, selectKeywordOption(value) { this.matchAllKeywords = value; this.showKeywordsDropdown = false; }, initializeMonthList() { this.monthList = []; const currentDate = new Date(); const currentYear = currentDate.getFullYear(); const currentMonth = currentDate.getMonth() + 1; // 生成可用年份列表 this.availableYears = []; for (let year = 2020; year <= Math.min(currentYear, 2024); year++) { this.availableYears.push(year); } // 生成月份列表，只到当前月份 for (let year = 2020; year <= Math.min(currentYear, 2024); year++) { const maxMonth = year === Math.min(currentYear, 2024) ? currentYear <= 2024 ? currentMonth : 12 : 12; for (let month = 1; month <= maxMonth; month++) { this.monthList.push({ value: year * 100 + month, display: `${year}-${month.toString().padStart(2, '0')}`, }); } } // 设置最大月份索引和默认结束月份 this.maxMonth = this.monthList.length - 1; this.endMonth = this.maxMonth; // 设置为当前月份 // 确保选择器也更新到当前月份 this.selectedEndYear = Math.min(currentYear, 2024); this.selectedEndMonthNum = currentYear <= 2024 ? currentMonth : 12; }, getMonthDisplay(index) { if (index >= 0 && index < this.monthList.length) { return this.monthList[index].display; } return ''; }, getMonthValue(index) { if (index >= 0 && index < this.monthList.length) { return this.monthList[index].value; } return null; }, resetMonthRange() { this.startMonth = 0; this.endMonth = this.maxMonth; this.selectedStartYear = 2020; this.selectedStartMonthNum = 1; // 使用当前年月作为重置时的结束日期 const currentDate = new Date(); const currentYear = currentDate.getFullYear(); const currentMonth = currentDate.getMonth() + 1; this.selectedEndYear = currentYear; this.selectedEndMonthNum = currentMonth; }, updateStartMonth() { const targetValue = this.selectedStartYear * 100 + this.selectedStartMonthNum; const index = this.monthList.findIndex((month) => month.value === targetValue); if (index !== -1) { this.startMonth = index; if (this.startMonth > this.endMonth) { this.endMonth = this.startMonth; this.updateEndSelectors(); } } }, updateEndMonth() { const targetValue = this.selectedEndYear * 100 + this.selectedEndMonthNum; const index = this.monthList.findIndex((month) => month.value === targetValue); if (index !== -1) { this.endMonth = index; if (this.endMonth < this.startMonth) { this.startMonth = this.endMonth; this.updateStartSelectors(); } } }, updateStartSelectors() { if (this.startMonth >= 0 && this.startMonth < this.monthList.length) { const monthValue = this.monthList[this.startMonth].value; this.selectedStartYear = Math.floor(monthValue / 100); this.selectedStartMonthNum = monthValue % 100; } }, updateEndSelectors() { if (this.endMonth >= 0 && this.endMonth < this.monthList.length) { const monthValue = this.monthList[this.endMonth].value; this.selectedEndYear = Math.floor(monthValue / 100); this.selectedEndMonthNum = monthValue % 100; } }, applyDatePreset(preset) { if (preset.months === null) { this.resetMonthRange(); } else { const currentDate = new Date(); const currentYear = currentDate.getFullYear(); const currentMonth = currentDate.getMonth() + 1; // 确保结束日期始终是当前月份 let endYear = currentYear; let endMonth = currentMonth; let startYear = endYear; let startMonth = endMonth - preset.months + 1; while (startMonth <= 0) { startYear--; startMonth += 12; } if (startYear < 2020 || (startYear === 2020 && startMonth < 1)) { startYear = 2020; startMonth = 1; } this.selectedStartYear = startYear; this.selectedStartMonthNum = startMonth; this.selectedEndYear = endYear; this.selectedEndMonthNum = endMonth; this.updateStartMonth(); this.updateEndMonth(); } }, }, mounted() { this.initializeMonthList(); this.updateStartSelectors(); this.updateEndSelectors(); this.filterPapers(); }, };
</script>
<style scoped>
select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.date-preset-button {
    transition: all 0.2s ease-in-out;
}
.date-preset-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
