chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'download') {
        chrome.downloads.download({
            url: message.url,
            filename: message.filename + "." + message.suffix,
        });
    }
});

// 安装完成后执行
chrome.runtime.onInstalled.addListener(function () {
    // 创建一个新的标签页
    chrome.tabs.create({
        url: "./installed.html"
    });
}
);