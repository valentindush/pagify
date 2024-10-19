document.getElementById('summarize-btn').addEventListener('click', () => {
  const summaryDiv = document.getElementById('summary');
  const spinner = document.getElementById('loading-spinner');
  const summaryPlaceholder = document.querySelector('.summary-placeholder');

  // Clear any previous summary
  summaryDiv.innerHTML = '';

  // Show the loading spinner
  spinner.style.display = 'block';

  // Get the active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentTabUrl = currentTab.url;

    // Check if the current tab is a valid URL
    if (currentTabUrl.startsWith('chrome://') || currentTabUrl.startsWith('edge://')) {
      alert('This extension cannot run on internal browser pages.');
      spinner.style.display = 'none';
      return;
    }

    // Send a request to localhost:8000/summarize with the tab URL
    fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentTabUrl })
    })
      .then(response => response.json())
      .then(data => {
        // Hide the spinner
        spinner.style.display = 'none';

        // Process the response and display the result
        if (data && data.title && data.summary && data.key_points) {
          const summaryHTML = `
          <div class="summary-output">
            <h2>${data.title}</h2>
            <p><strong>Summary:</strong> ${data.summary}</p>
            <p><strong>Key Points:</strong></p>
            <ul>
              ${data.key_points.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        `;
          summaryDiv.innerHTML = summaryHTML;
        } else {
          summaryDiv.innerHTML = '<p>Failed to retrieve the summary.</p>';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        spinner.style.display = 'none';
        summaryDiv.innerHTML = '<p>An error occurred while summarizing the page.</p>';
      });
  });
});
