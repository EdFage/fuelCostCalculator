chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab's status is 'complete'
    if (changeInfo.status === 'complete') {
        // Perform your URL check and other actions here
        if (tab.url && tab.url.includes('dir')) {
            chrome.tabs.sendMessage(tabId, {
                message: 'dir tab found',
            })
        }
    }
})
