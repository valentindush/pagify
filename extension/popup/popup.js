document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const summaryContainer = document.getElementById('summary');
    const summaryText = document.getElementById('summaryText');
    const loader = document.querySelector('.loader');
    const btnText = document.querySelector('.btn-text');

    summarizeBtn.addEventListener('click', async () => {
        loader.style.display = 'block';
        btnText.textContent = 'Summarizing...';
        summarizeBtn.disabled = true;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: "getContent" });

            if (response && response.content) {
                const summaryResponse = await chrome.runtime.sendMessage({ action: "summarize", content: response.content });

                if (summaryResponse && summaryResponse.summary) {
                    summaryText.textContent = summaryResponse.summary;
                    summaryContainer.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            summaryText.textContent = error;
            summaryContainer.classList.remove('hidden');
        } finally {
            loader.style.display = 'none';
            btnText.textContent = 'Summarize Page';
            summarizeBtn.disabled = false;
        }
    });
});