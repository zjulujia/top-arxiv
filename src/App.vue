<template>
    <div class="min-h-screen bg-gray-50 w-[1443px] h-[1025px]" data-oid="xmh7k6g">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b" data-oid="02t1xgc">
            <div class="max-w-6xl mx-auto px-4 py-6" data-oid="2w4c3v4">
                <h1 class="text-3xl font-bold text-gray-900 mb-2" data-oid="ufg8y-_">
                    ArXiv 论文搜索
                </h1>
                <p class="text-gray-600" data-oid=":_w4bwx">按引用量排序的学术论文关键词搜索</p>
            </div>
        </header>
        <!-- Search Section -->
        <div class="max-w-6xl mx-auto px-4 py-8" data-oid="pdvnyz.">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8" data-oid="daso_2q">
                <div class="flex flex-col sm:flex-row gap-4" data-oid="aunyibx">
                    <input
                        type="text"
                        v-model="searchQuery"
                        @keypress="handleKeyPress"
                        placeholder="输入关键词搜索论文..."
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                        data-oid="bh.nsek"
                    />
                    <button
                        @click="handleSearch"
                        :disabled="isLoading"
                        class="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base whitespace-nowrap"
                        data-oid="c6mklyz"
                    >
                        {{ isLoading ? '搜索中...' : '搜索' }}
                    </button>
                </div>
            </div>
            <!-- Results -->
            <div v-if="searchResults.length > 0" class="mb-4" data-oid="60hskwd">
                <p class="text-gray-600" data-oid="rmpj.jr">
                    找到 {{ searchResults.length }} 篇论文，按引用量排序
                </p>
            </div>
            <div class="space-y-6" data-oid="ai7x9l5">
                <div
                    v-for="(paper, index) in searchResults"
                    :key="paper.id"
                    class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                    data-oid="1s4ktbq"
                >
                    <!-- Paper ranking and header -->
                    <div class="flex items-start gap-4 mb-4" data-oid="br07q6f">
                        <div
                            class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold"
                            data-oid="q-5mx.0"
                        >
                            {{ index + 1 }}
                        </div>
                        <div class="flex-1" data-oid="o.swj6p">
                            <div class="flex justify-between items-start mb-2" data-oid="moyadkx">
                                <h2
                                    class="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                                    data-oid="r-a3beo"
                                    @click="openArxivLink(paper.arxivId)"
                                >
                                    {{ paper.title }}
                                </h2>
                                <div
                                    class="flex items-center gap-3 text-sm text-gray-500 ml-4"
                                    data-oid="bukciea"
                                >
                                    <span
                                        class="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium"
                                        data-oid="8ga0h2e"
                                    >
                                        📊 {{ formatNumber(paper.citations) }}
                                    </span>
                                    <span
                                        class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-mono text-xs"
                                        data-oid="_at780g"
                                    >
                                        arXiv:{{ paper.arxivId }}
                                    </span>
                                </div>
                            </div>
                            <div
                                class="flex items-center gap-2 text-sm text-gray-600 mb-3"
                                data-oid="wtkigjo"
                            >
                                <span class="font-medium" data-oid="q_ffur1">作者:</span>
                                <p class="text-gray-700" data-oid="0o-kc8s">{{ paper.authors }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- Abstract -->
                    <div class="mb-4" data-oid="tuu2qwh">
                        <h3 class="text-sm font-medium text-gray-800 mb-2" data-oid="ob:9u8u">
                            摘要
                        </h3>
                        <p class="text-gray-600 leading-relaxed text-sm" data-oid=".40rzf3">
                            {{ truncateText(paper.abstract, 300) }}
                        </p>
                    </div>
                    <!-- Footer with keywords and date -->
                    <div
                        class="flex items-center justify-between pt-4 border-t border-gray-100"
                        data-oid="vpgoq_h"
                    >
                        <div class="flex flex-wrap gap-2" data-oid="rzi5b19">
                            <span class="text-sm font-medium text-gray-700 mr-2" data-oid="..-da3x">
                                关键词:
                            </span>
                            <span
                                v-for="(keyword, keywordIndex) in paper.keywords"
                                :key="keywordIndex"
                                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                                data-oid="yl-ij-z"
                                @click="searchByKeyword(keyword)"
                            >
                                #{{ keyword }}
                            </span>
                        </div>
                        <div
                            class="flex items-center gap-4 text-xs text-gray-500"
                            data-oid="y1tn13c"
                        >
                            <span data-oid="ysqbmx1">
                                📅 {{ formatDate(paper.publishedDate) }}
                            </span>
                            <button
                                class="text-blue-600 hover:text-blue-800 font-medium"
                                @click="openArxivLink(paper.arxivId)"
                                data-oid="el85325"
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
                data-oid="9cf4nfj"
            >
                <div class="text-gray-400 text-lg mb-2" data-oid="8w7bh8v">未找到相关论文</div>
                <p class="text-gray-500" data-oid="2y02t84">请尝试其他关键词</p>
            </div>
            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-12" data-oid="z-p-:bi">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    data-oid="may9xpl"
                ></div>
                <p class="mt-4 text-gray-600" data-oid="lr6zl6k">正在搜索论文...</p>
            </div>
        </div>
    </div>
</template>
<script>
export default { name: 'App', data() { return { searchQuery: '', searchResults: [], isLoading: false, mockResults: [ { id: 1, title: 'Attention Is All You Need', authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin', abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...', citations: 45672, arxivId: '1706.03762', publishedDate: '2017-06-12', keywords: ['transformer', 'attention', 'neural networks', 'NLP'], }, { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova', abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...', citations: 38291, arxivId: '1810.04805', publishedDate: '2018-10-11', keywords: ['BERT', 'transformer', 'language model', 'pre-training'], }, { id: 3, title: 'Deep Residual Learning for Image Recognition', authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun', abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training...', citations: 89234, arxivId: '1512.03385', publishedDate: '2015-12-10', keywords: ['ResNet', 'deep learning', 'computer vision', 'residual networks'], }, { id: 4, title: 'Generative Adversarial Networks', authors: 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio', abstract: 'We propose a new framework for estimating generative models via an adversarial process...', citations: 67543, arxivId: '1406.2661', publishedDate: '2014-06-10', keywords: ['GAN', 'generative models', 'adversarial training', 'deep learning'], }, ], }; }, methods: { handleSearch() { if (!this.searchQuery.trim()) return; this.isLoading = true; // Simulate API call setTimeout(() => { // Filter and sort by citations (descending) const filtered = this.mockResults .filter( (paper) => paper.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || paper.keywords.some((keyword) => keyword.toLowerCase().includes(this.searchQuery.toLowerCase()), ) || paper.abstract.toLowerCase().includes(this.searchQuery.toLowerCase()), ) .sort((a, b) => b.citations - a.citations); this.searchResults = filtered; this.isLoading = false; }, 1000); }, handleKeyPress(e) { if (e.key === 'Enter') { this.handleSearch(); } }, searchByKeyword(keyword) { this.searchQuery = keyword; this.handleSearch(); }, openArxivLink(arxivId) { window.open(`https://arxiv.org/abs/${arxivId}`, '_blank'); }, formatNumber(num) { return num.toLocaleString(); }, formatDate(dateString) { return new Date(dateString).toLocaleDateString('zh-CN'); }, truncateText(text, maxLength) { if (text.length > maxLength) { return text.substring(0, maxLength) + '...'; } return text; }, }, };
</script>
