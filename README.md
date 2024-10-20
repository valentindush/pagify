# PAGIFY
A browser extension for AI page summarization using **LangChain**

## Installation
### Extension
1. Clone this repository
    ```bash
    git clone <repo.git>
    ```
2. In your browser extension setting, turn on dev mode
3. Load the extension in `./extension`

### Server
1. Navigate to the `./server`
2. Install packages
    ```bash
    pip install -r requirements.txt
    ```
3. Create `.env` file
    ```bash
    GROQ_API_KEY = <gsk_...>
    ```
4. Run the server
    ```bash
    fastapi dev main.py
    ```