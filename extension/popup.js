document.getElementById('summarize-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => document.body.innerText
      }, (results) => {
        const pageContent = results[0].result;
        document.getElementById('summary').innerText = pageContent
        // fetch('https://your-backend-api-url/summarize', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ content: pageContent })
        // })
        // .then(response => response.json())
        // .then(data => {
        //   document.getElementById('summary').value = data.summary;
        // })
        // .catch(error => {
        //   console.error('Error:', error);
        // });
      });
    });
  });
  