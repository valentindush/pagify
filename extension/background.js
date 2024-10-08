chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        const mockSummary = "This is a mock summary of the page content.";
        sendResponse({ summary: mockSummary });
    }
});