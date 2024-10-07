// DOM Elements
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const chatbotContainer = document.querySelector(".chatbot-container");
const openChatbotButton = document.querySelector("#open-chatbot");
const closeChatbotButton = document.querySelector("#close-chatbot");

// State Variables
let userMessage = null;
let isResponseGenerating = false;
let isChatOpen = false;

// API Configuration
const API_KEY = ""; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

/* =====================================
   UI FUNCTIONS
===================================== */

// Toggle chatbot visibility
const toggleChatbot = () => {
  isChatOpen = !isChatOpen;
  chatbotContainer.style.display = isChatOpen ? "flex" : "none";
  openChatbotButton.style.display = isChatOpen ? "none" : "block";
};

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }

    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
};

// Show loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `
    <div class="message-content">
      <img class="avatar" src="download.jpeg" alt="Gemini avatar">
      <p class="text"></p>
      <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>`;
  
  const incomingMessageDiv = document.createElement("div");
  incomingMessageDiv.classList.add("message", "incoming", "loading");
  incomingMessageDiv.innerHTML = html;
  
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  generateAPIResponse(incomingMessageDiv);
};

/* =====================================
   API FUNCTIONS
===================================== */

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);

  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  }
};

/* =====================================
   EVENT LISTENERS
===================================== */

// Handle outgoing chat message
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;

  const html = `
    <div class="message-content">
      <img class="avatar" src="download.jpeg" alt="User avatar">
      <p class="text"></p>
    </div>`;
  
  const outgoingMessageDiv = document.createElement("div");
  outgoingMessageDiv.classList.add("message", "outgoing");
  outgoingMessageDiv.innerHTML = html;
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  
  chatContainer.appendChild(outgoingMessageDiv);
  typingForm.reset(); // Clear input
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  setTimeout(showLoadingAnimation, 500); // Show loading animation
};

// Open and close chatbot
openChatbotButton.addEventListener("click", toggleChatbot);
closeChatbotButton.addEventListener("click", toggleChatbot);

// Form submit handler
typingForm.addEventListener("submit", e => {
  e.preventDefault();
  handleOutgoingChat();
});
