// AI Helper functionality
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatInput || !sendMessageBtn || !chatMessages) return;

    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    try {
        const response = await generateAIResponse(message);
        
        // Remove typing indicator and add bot response
        typingIndicator.remove();
        addMessage(response, 'bot');
    } catch (error) {
        typingIndicator.remove();
        addMessage("I'm sorry, I'm having trouble responding right now. Please try again later.", 'bot');
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="loading"></div> Thinking...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

async function generateAIResponse(message) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = message.toLowerCase();
    
    // Simple response logic - in production, this would call OpenAI API
    if (lowerMessage.includes('adopt') || lowerMessage.includes('adoption')) {
        return "Our adoption process involves filling out an application, a meet-and-greet with the pet, and a home check. All our pets are vaccinated and spayed/neutered before adoption. Would you like to know more about a specific pet?";
    } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('vaccination')) {
        return "Pets need core vaccinations to protect against common diseases. Dogs typically need rabies, distemper, parvovirus, and adenovirus vaccines. Cats need rabies, feline distemper, calicivirus, and herpesvirus vaccines. Always consult with a veterinarian for the best schedule.";
    } else if (lowerMessage.includes('food') || lowerMessage.includes('diet')) {
        return "A balanced diet is essential for pet health. The right food depends on the pet's age, breed, and health conditions. Puppies/kittens need growth formulas, adults need maintenance diets, and seniors may need special formulations. Always provide fresh water.";
    } else if (lowerMessage.includes('train') || lowerMessage.includes('behavior')) {
        return "Positive reinforcement training works best for pets. Reward good behavior with treats and praise. Consistency and patience are key. For specific behavior issues, consider consulting a professional trainer.";
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
        return "Our adoption fees help cover veterinary care, food, and shelter expenses. Fees typically range from $50-$300 depending on the pet's age and medical needs. This includes spay/neuter, vaccinations, and microchipping.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I'm the PetResQ assistant. I can help with questions about pet adoption, care, training, and our services. What would you like to know?";
    } else {
        return "I'm here to help with pet adoption, care, and training questions. Could you please provide more details about what you'd like to know? You can ask about adoption processes, pet care, training tips, or our services.";
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});