'use client';

import { useState } from 'react';

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock search results data
    const mockResults = [
        {
            id: 1,
            title: 'Attention Is All You Need',
            authors:
                'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
            abstract:
                'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
            citations: 45672,
            arxivId: '1706.03762',
            publishedDate: '2017-06-12',
            keywords: ['transformer', 'attention', 'neural networks', 'NLP'],
        },
        {
            id: 2,
            title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
            authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
            abstract:
                'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...',
            citations: 38291,
            arxivId: '1810.04805',
            publishedDate: '2018-10-11',
            keywords: ['BERT', 'transformer', 'language model', 'pre-training'],
        },
        {
            id: 3,
            title: 'Deep Residual Learning for Image Recognition',
            authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
            abstract:
                'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training...',
            citations: 89234,
            arxivId: '1512.03385',
            publishedDate: '2015-12-10',
            keywords: ['ResNet', 'deep learning', 'computer vision', 'residual networks'],
        },
        {
            id: 4,
            title: 'Generative Adversarial Networks',
            authors:
                'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio',
            abstract:
                'We propose a new framework for estimating generative models via an adversarial process...',
            citations: 67543,
            arxivId: '1406.2661',
            publishedDate: '2014-06-10',
            keywords: ['GAN', 'generative models', 'adversarial training', 'deep learning'],
        },
    ];

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Filter and sort by citations (descending)
            const filtered = mockResults
                .filter(
                    (paper) =>
                        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        paper.keywords.some((keyword) =>
                            keyword.toLowerCase().includes(searchQuery.toLowerCase()),
                        ) ||
                        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .sort((a, b) => b.citations - a.citations);

            setSearchResults(filtered);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-[1443px] h-[1025px]" data-oid="xmh7k6g">
            {/* Header */}
            <header className="bg-white shadow-sm border-b" data-oid="02t1xgc">
                <div className="max-w-6xl mx-auto px-4 py-6" data-oid="2w4c3v4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" data-oid="ufg8y-_">
                        ArXiv 论文搜索
                    </h1>
                    <p className="text-gray-600" data-oid=":_w4bwx">
                        按引用量排序的学术论文关键词搜索
                    </p>
                </div>
            </header>

            {/* Search Section */}
            <div className="max-w-6xl mx-auto px-4 py-8" data-oid="pdvnyz.">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-oid="daso_2q">
                    <div className="flex gap-4" data-oid="aunyibx">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="输入关键词搜索论文..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            data-oid="bh.nsek"
                        />

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-oid="c6mklyz"
                        >
                            {isLoading ? '搜索中...' : '搜索'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                    <div className="mb-4" data-oid="60hskwd">
                        <p className="text-gray-600" data-oid="rmpj.jr">
                            找到 {searchResults.length} 篇论文，按引用量排序
                        </p>
                    </div>
                )}

                <div className="space-y-6" data-oid="ai7x9l5">
                    {searchResults.map((paper, index) => (
                        <div
                            key={paper.id}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                            data-oid="1s4ktbq"
                        >
                            {/* Paper ranking and header */}
                            <div className="flex items-start gap-4 mb-4" data-oid="br07q6f">
                                <div
                                    className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold"
                                    data-oid="q-5mx.0"
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1" data-oid="o.swj6p">
                                    <div
                                        className="flex justify-between items-start mb-2"
                                        data-oid="moyadkx"
                                    >
                                        <h2
                                            className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                                            data-oid="r-a3beo"
                                            onClick={() =>
                                                window.open(
                                                    `https://arxiv.org/abs/${paper.arxivId}`,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            {paper.title}
                                        </h2>
                                        <div
                                            className="flex items-center gap-3 text-sm text-gray-500 ml-4"
                                            data-oid="bukciea"
                                        >
                                            <span
                                                className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium"
                                                data-oid="8ga0h2e"
                                            >
                                                📊 {paper.citations.toLocaleString()}
                                            </span>
                                            <span
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-mono text-xs"
                                                data-oid="_at780g"
                                            >
                                                arXiv:{paper.arxivId}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center gap-2 text-sm text-gray-600 mb-3"
                                        data-oid="wtkigjo"
                                    >
                                        <span className="font-medium" data-oid="q_ffur1">
                                            作者:
                                        </span>
                                        <p className="text-gray-700" data-oid="0o-kc8s">
                                            {paper.authors}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract */}
                            <div className="mb-4" data-oid="tuu2qwh">
                                <h3
                                    className="text-sm font-medium text-gray-800 mb-2"
                                    data-oid="ob:9u8u"
                                >
                                    摘要
                                </h3>
                                <p
                                    className="text-gray-600 leading-relaxed text-sm"
                                    data-oid=".40rzf3"
                                >
                                    {paper.abstract.length > 300
                                        ? `${paper.abstract.substring(0, 300)}...`
                                        : paper.abstract}
                                </p>
                            </div>

                            {/* Footer with keywords and date */}
                            <div
                                className="flex items-center justify-between pt-4 border-t border-gray-100"
                                data-oid="vpgoq_h"
                            >
                                <div className="flex flex-wrap gap-2" data-oid="rzi5b19">
                                    <span
                                        className="text-sm font-medium text-gray-700 mr-2"
                                        data-oid="..-da3x"
                                    >
                                        关键词:
                                    </span>
                                    {paper.keywords.map((keyword, keywordIndex) => (
                                        <span
                                            key={keywordIndex}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                                            data-oid="yl-ij-z"
                                            onClick={() => setSearchQuery(keyword)}
                                        >
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                                <div
                                    className="flex items-center gap-4 text-xs text-gray-500"
                                    data-oid="y1tn13c"
                                >
                                    <span data-oid="ysqbmx1">
                                        📅{' '}
                                        {new Date(paper.publishedDate).toLocaleDateString('zh-CN')}
                                    </span>
                                    <button
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={() =>
                                            window.open(
                                                `https://arxiv.org/abs/${paper.arxivId}`,
                                                '_blank',
                                            )
                                        }
                                        data-oid="el85325"
                                    >
                                        查看原文 →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results */}
                {searchQuery && searchResults.length === 0 && !isLoading && (
                    <div className="text-center py-12" data-oid="9cf4nfj">
                        <div className="text-gray-400 text-lg mb-2" data-oid="8w7bh8v">
                            未找到相关论文
                        </div>
                        <p className="text-gray-500" data-oid="2y02t84">
                            请尝试其他关键词
                        </p>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-12" data-oid="z-p-:bi">
                        <div
                            className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                            data-oid="may9xpl"
                        ></div>
                        <p className="mt-4 text-gray-600" data-oid="lr6zl6k">
                            正在搜索论文...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
