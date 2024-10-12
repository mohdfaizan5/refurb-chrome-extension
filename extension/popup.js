document.addEventListener("DOMContentLoaded", function () {
  const summaryElement = document.getElementById("summary");
  const charCountElement = document.getElementById("charCount");
  const postButton = document.getElementById("postButton");
  const regenerateButton = document.getElementById("regenerateButton");

  function updateSummary(text) {
    summaryElement.textContent = text;
    charCountElement.textContent = `(${text.length}/300)`;
  }

  async function summarizeCurrentPage() {
    summaryElement.textContent = "Summarizing...";
    charCountElement.textContent = "(0/300)";

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab) {
        throw new Error("No active tab found");
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPageContent",
      });

      if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
      }

      if (!response || !response.content) {
        throw new Error("Invalid response from content script");
      }

      const summaryContent = await callOpenAIAPI(response.content);
      if (!summaryContent) {
        throw new Error("API call not working");
      }
      updateSummary(summaryContent);
    } catch (error) {
      console.error("Error summarizing page:", error);
      summaryElement.textContent = `Failed to summarize the page: ${error.message}`;
    }
  }

  function postToTwitter() {
    const summary = summaryElement.textContent;
    if (
      summary &&
      summary !== "Summarizing..." &&
      !summary.startsWith("Failed to summarize the page")
    ) {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        summary
      )}`;
      window.open(twitterUrl, "_blank");
    }
  }

  postButton.addEventListener("click", postToTwitter);
  regenerateButton.addEventListener("click", summarizeCurrentPage);

  // Initial summarization
  summarizeCurrentPage();
});

async function callOpenAIAPI(content) {
  try {
    const response = await fetch("https://refurb-chrome-extension.vercel.app/api/summarize", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `${content}, the above is the content of the chrome tab, your job is to summarize this for me in less than 290 characters` })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.summary) {
      throw new Error("No summary returned from API");
    }

    return `${data.summary}`;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}