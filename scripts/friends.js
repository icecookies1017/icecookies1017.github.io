const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

hexo.extend.tag.register('friendsLink', function(args) {
    const filePath = path.join(hexo.source_dir, args[0]);
    if (!fs.existsSync(filePath)) return '<p>找不到友鏈資料檔案</p>';

    const data = yaml.load(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data) || data.length === 0) return '<p>暫無友鏈</p>';

    var cards = data
        .filter(function(item) { return item && item.name && item.url; })
        .map(function(item) {
            return '<a class="friend-item" href="' + item.url + '" target="_blank" rel="noopener noreferrer">' +
                '<div class="friend-avatar"><img src="' + (item.image || '') + '" alt="' + item.name + '" loading="lazy"></div>' +
                '<div class="friend-info">' +
                '<div class="friend-name">' + item.name + '</div>' +
                '<div class="friend-desc">' + (item.desc || '') + '</div>' +
                '</div></a>';
        })
        .join('');

    return '<div class="friend-wrap">' + cards + '</div>';
});
