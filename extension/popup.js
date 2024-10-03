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

      console.log("Active Tab:", tab)

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPageContent",
      });

      console.log("Received response:", response);
      //   alert("Received response:", response);

      // Call OpenAI API to summarize (implementation needed)
      const summaryContent = await callOpenAIAPI(response.content);
      if (!summaryContent) {
        summaryElement.textContent = "Api call not working"
      }
      updateSummary(summaryContent);
    } catch (error) {
      console.error("Error summarizing page:", error);
      summaryElement.textContent = "Failed to summarize the page.";
    }
  }

  function postToTwitter() {
    const summary = summaryElement.textContent;
    if (
      summary &&
      summary !== "Summarizing..." &&
      summary !== "Failed to summarize the page."
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

// Placeholder function for OpenAI API call
async function callOpenAIAPI(content) {
  // Implement the API call to OpenAI here

  const response = await fetch("http://localhost:3000/api/summarize", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: content })
  })

  const final1 = await response.json()
  console.log(final1)
  let final = String(content)
  // let final = String(content).substring(0, 300);
  return `🔥🔥🔥${final1}`;
  return "This is a placeholder summary. Implement the actual OpenAI API call.";
}
