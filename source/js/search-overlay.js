(function() {
    var searchData = null;
    var overlay, input, results;

    function loadData(cb) {
        if (searchData) return cb();
        fetch('/search.xml').then(function(r) { return r.text(); }).then(function(data) {
            var xml = new DOMParser().parseFromString(data, 'text/xml');
            searchData = Array.from(xml.querySelectorAll('entry')).map(function(item) {
                var tags = Array.from(item.querySelectorAll('tag')).map(function(t) { return t.textContent; });
                var contentEl = item.querySelector('content');
                var content = contentEl ? contentEl.textContent.replace(/<[^>]*>/g, '').substring(0, 500) : '';
                return {
                    title: item.querySelector('title').textContent,
                    url: item.querySelector('url').textContent,
                    tags: tags,
                    content: content
                };
            });
            cb();
        });
    }

    function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlight(text, query) {
        if (!query) return text;
        var reg = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
        return text.replace(reg, '<mark>$1</mark>');
    }

    function search(val) {
        if (!val || val.length < 1) {
            results.innerHTML = '<div class="search-empty">輸入關鍵字搜尋文章</div>';
            return;
        }
        var q = val.toLowerCase();
        var matched = searchData.filter(function(p) {
            return p.title.toLowerCase().includes(q) ||
                   p.tags.some(function(t) { return t.toLowerCase().includes(q); }) ||
                   p.content.toLowerCase().includes(q);
        });

        if (matched.length === 0) {
            results.innerHTML = '<div class="search-empty">找不到結果</div>';
            return;
        }

        results.innerHTML = '<div class="search-count">找到 ' + matched.length + ' 個結果</div>' +
            matched.map(function(p) {
                var snippet = '';
                var idx = p.content.toLowerCase().indexOf(q);
                if (idx >= 0) {
                    var start = Math.max(0, idx - 40);
                    var end = Math.min(p.content.length, idx + val.length + 80);
                    snippet = (start > 0 ? '...' : '') + p.content.substring(start, end) + (end < p.content.length ? '...' : '');
                    snippet = highlight(snippet, val);
                }
                var tagsHtml = p.tags.length > 0
                    ? '<div class="search-result-tags">' + p.tags.map(function(t) {
                        return '<span class="search-result-tag">#' + highlight(t, val) + '</span>';
                      }).join('') + '</div>'
                    : '';
                return '<a href="' + p.url + '" class="search-result-item">' +
                    '<div class="search-result-title">' + highlight(p.title, val) + '</div>' +
                    (snippet ? '<div class="search-result-content">' + snippet + '</div>' : '') +
                    tagsHtml +
                    '</a>';
            }).join('');
    }

    function open() {
        loadData(function() {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(function() { input.focus(); }, 100);
        });
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        input.value = '';
        results.innerHTML = '';
    }

    function init() {
        overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.innerHTML =
            '<div class="search-modal">' +
                '<div class="search-header">' +
                    '<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
                    '<input type="text" class="search-input" placeholder="搜尋文章..." autocomplete="off">' +
                    '<button class="search-close">&times;</button>' +
                '</div>' +
                '<div class="search-results"></div>' +
            '</div>';
        document.body.appendChild(overlay);

        input = overlay.querySelector('.search-input');
        results = overlay.querySelector('.search-results');

        overlay.querySelector('.search-close').addEventListener('click', close);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });
        input.addEventListener('input', function() { search(this.value.trim()); });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) close();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                overlay.classList.contains('active') ? close() : open();
            }
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
