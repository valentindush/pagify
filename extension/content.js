document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const summaryContainer = document.getElementById('summary');
    const summaryText = document.getElementById('summaryText');
    const loader = document.querySelector('.loader');
    const btnText = document.querySelector('.btn-text');

    summarizeBtn.addEventListener('click', summarizePage);

    async function summarizePage() {
        setLoadingState(true);

        try {
            const pageContent = await getPageContent();
            if (pageContent) {
                const summary = await getSummary(pageContent);
                displaySummary(summary);
            } else {
                throw new Error('Failed to get page content');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingState(false);
        }
    }

    async function getPageContent() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                throw new Error('No active tab found');
            }

            // Check if we can inject the content script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    // This function will be injected into the page
                    return true;
                },
            });

            // Now that we know the script can be injected, send the message
            const response = await chrome.tabs.sendMessage(tab.id, { action: "getContent" });
            return response && response.content;
        } catch (error) {
            if (error.message.includes('Cannot access contents of url')) {
                throw new Error('Cannot access page content. The extension may not have permission for this page.');
            } else if (error.message.includes('Receiving end does not exist')) {
                throw new Error('Content script not loaded. Please refresh the page and try again.');
            }
            throw error;
        }
    }

    async function getSummary(content) {
        const response = await chrome.runtime.sendMessage({ action: "summarize", content: content });
        return response && response.summary;
    }

    function displaySummary(summary) {
        if (summary) {
            summaryText.textContent = summary;
            summaryContainer.classList.remove('hidden');
        } else {
            throw new Error('Failed to generate summary');
        }
    }

    function handleError(error) {
        console.error('Error:', error);
        summaryText.textContent = error.message || 'An error occurred while summarizing the page.';
        summaryContainer.classList.remove('hidden');
    }

    function setLoadingState(isLoading) {
        loader.style.display = isLoading ? 'block' : 'none';
        btnText.textContent = isLoading ? 'Summarizing...' : 'Summarize Page';
        summarizeBtn.disabled = isLoading;
    }
});