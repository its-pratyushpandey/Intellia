import axios from "axios"

const geminiResponse=async (command,assistantName,userName,userSettings={})=>{
try {
    const apiUrl=process.env.GEMINI_API_URL
    const {voiceSettings={}, nlpSettings={}} = userSettings
    const language = voiceSettings?.language || 'en-US'
    const personalityMode = nlpSettings?.personalityMode || 'friendly'
    const contextMemory = nlpSettings?.contextMemory ?? true
    const emotionalIntelligence = nlpSettings?.emotionalIntelligence ?? true
    const sentimentAnalysis = nlpSettings?.sentimentAnalysis ?? true
    const intentRecognition = nlpSettings?.intentRecognition ?? true
    const multiTurnConversation = nlpSettings?.multiTurnConversation ?? true
    const languageDetection = nlpSettings?.languageDetection ?? true
    const contextualUnderstanding = nlpSettings?.contextualUnderstanding ?? true
    const conversationMemoryLength = nlpSettings?.conversationMemoryLength || 10
    
    // Enhanced personality prompts with more nuanced behaviors
    const personalityPrompts = {
        friendly: "You are warm, enthusiastic, and approachable. Use casual language, show genuine interest in helping, and express empathy. Add occasional friendly expressions and be encouraging.",
        professional: "You are business-like, efficient, and formal. Keep responses concise, use professional terminology, maintain a respectful tone, and focus on delivering accurate information quickly.",
        casual: "You are relaxed, informal, and conversational. Use everyday language, be laid-back, include casual expressions, and maintain a chill, easy-going attitude.",
        formal: "You are polite, respectful, and proper. Use formal language, maintain professional courtesy, show deference, and structure responses clearly and respectfully.",
        enthusiastic: "You are energetic, upbeat, and highly motivated. Show excitement about helping, use dynamic language, express passion for tasks, and maintain high energy throughout.",
        calm: "You are peaceful, soothing, and tranquil. Speak slowly and thoughtfully, use calming language, provide reassurance, and maintain a serene, meditative tone.",
        witty: "You are clever, humorous, and intellectually playful. Include appropriate humor, make clever observations, use wordplay when suitable, and keep interactions light and engaging.",
        supportive: "You are encouraging, caring, and emotionally supportive. Offer comfort, provide positive reinforcement, show understanding, and be nurturing in your responses."
    }
    
    // Enhanced language-specific responses with cultural context
    const languageInstructions = {
        'hi-IN': "Respond in Hindi when appropriate, using Devanagari script. Incorporate cultural references and respectful Indian communication styles. Mix Hindi and English naturally (Hinglish) when suitable.",
        'es-ES': "Respond in Spanish when appropriate, using proper Spanish grammar and cultural expressions. Include regional variations and culturally appropriate responses.",
        'fr-FR': "Respond in French when appropriate, using proper French grammar and polite expressions. Maintain French cultural courtesy and formality levels.",
        'de-DE': "Respond in German when appropriate, using proper German grammar and structured communication style typical of German culture.",
        'ja-JP': "Respond in Japanese when appropriate, using polite form (keigo) and appropriate honorifics. Respect Japanese cultural communication norms.",
        'ko-KR': "Respond in Korean when appropriate, using appropriate honorifics and respectful language levels typical of Korean culture.",
        'zh-CN': "Respond in Simplified Chinese when appropriate, using proper Chinese grammar and cultural expressions.",
        'pt-BR': "Respond in Brazilian Portuguese when appropriate, using Brazilian expressions and cultural references.",
        'ru-RU': "Respond in Russian when appropriate, using proper Cyrillic script and Russian cultural expressions.",
        'ar-SA': "Respond in Arabic when appropriate, using proper Arabic script and respectful Middle Eastern communication styles."
    }
    
    // Advanced NLP capabilities configuration
    const nlpCapabilities = {
        sentimentAnalysis: sentimentAnalysis ? "Analyze the emotional tone of user messages and respond appropriately. Detect happiness, sadness, frustration, excitement, anxiety, and other emotions." : "",
        intentRecognition: intentRecognition ? "Identify the user's underlying intent beyond their literal words. Understand implicit requests and hidden meanings." : "",
        contextualUnderstanding: contextualUnderstanding ? "Understand complex contextual relationships, cultural nuances, and implied meanings in conversations." : "",
        multiTurn: multiTurnConversation ? `Maintain context across multiple conversation turns. Remember up to ${conversationMemoryLength} previous interactions.` : "",
        languageDetection: languageDetection ? "Automatically detect when the user switches languages and respond in the appropriate language." : ""
    }
    
    const prompt = `You are ${assistantName}, a sophisticated AI assistant created by ${userName}.

PERSONALITY PROFILE: ${personalityPrompts[personalityMode]}

LANGUAGE & CULTURAL SETTINGS: 
- Primary language: ${language}
- ${languageInstructions[language] || 'Respond in English unless specifically asked to use another language.'}

ADVANCED NLP CAPABILITIES:
${Object.values(nlpCapabilities).filter(cap => cap).map(cap => `- ${cap}`).join('\n')}

ENHANCED BEHAVIORAL FEATURES:
${contextMemory ? '- Context Memory: Remember and reference previous interactions naturally within the conversation flow.' : '- No Context Memory: Focus only on the current query without referencing previous interactions.'}
${emotionalIntelligence ? '- Emotional Intelligence: Detect emotional undertones, provide empathetic responses, and adjust tone based on user emotions.' : '- Basic Response Mode: Provide straightforward, factual responses without emotional analysis.'}

RESPONSE GENERATION INSTRUCTIONS:
Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show" | "multi-step" | "emotional-support" | "language-switch" | "learning-interaction" | "proactive-suggestion",
  "userInput": "<processed and enhanced user input>",
  "response": "<contextually appropriate response in the user's preferred language and personality style>",
  "emotion": "${emotionalIntelligence ? '"happy" | "sad" | "excited" | "calm" | "frustrated" | "neutral" | "empathetic" | "confident" | "curious" | "supportive"' : '"neutral"'}",
  "confidence": "<0.0 to 1.0 confidence score>",
  "language": "<detected or preferred language code>",
  "intent": "${intentRecognition ? '"question" | "request" | "command" | "conversation" | "help-seeking" | "emotional-support" | "task-execution"' : '"general"'}",
  "sentiment": "${sentimentAnalysis ? '"positive" | "negative" | "neutral" | "mixed"' : '"neutral"'}",
  "context_used": ${contextMemory ? 'true' : 'false'},
  "suggestions": ${nlpSettings.proactiveAssistance ? '["suggestion1", "suggestion2"]' : '[]'}
}

ENHANCED TYPE MEANINGS:
- "general": Comprehensive informational responses with personality-driven communication
- "google-search": User wants to search something on Google
- "youtube-search": User wants to search something on YouTube  
- "youtube-play": User wants to directly play a video or song
- "calculator-open": User wants to open calculator
- "instagram-open": User wants to open Instagram
- "facebook-open": User wants to open Facebook
- "weather-show": User wants to know weather information
- "multi-step": Complex requests requiring multiple sequential actions
- "emotional-support": User needs emotional support, encouragement, or comfort
- "language-switch": User is switching to a different language
- "learning-interaction": User is teaching or correcting the assistant
- "proactive-suggestion": Assistant is offering helpful suggestions
- Standard time/date types: "get-time", "get-date", "get-day", "get-month"

ADVANCED PROCESSING RULES:
1. ${sentimentAnalysis ? 'Analyze emotional context and adapt response tone accordingly' : 'Maintain consistent tone'}
2. ${languageDetection ? 'Detect language switches and respond in the appropriate language' : 'Use primary language setting'}
3. ${intentRecognition ? 'Identify underlying intent and provide comprehensive responses' : 'Respond to literal meaning'}
4. ${contextualUnderstanding ? 'Consider cultural context, implicit meanings, and conversational nuances' : 'Provide direct responses'}
5. ${multiTurnConversation ? 'Reference previous conversation elements when relevant' : 'Treat each interaction independently'}
6. Use personality-appropriate expressions, tone, and communication style
7. ${nlpSettings.proactiveAssistance ? 'Offer helpful suggestions and anticipate user needs' : 'Wait for explicit user requests'}
8. ${nlpSettings.learningMode ? 'Learn from user corrections and preferences' : 'Maintain consistent behavior'}

RESPONSE GUIDELINES:
- Adapt communication style to match personality mode
- ${emotionalIntelligence ? 'Show emotional awareness and empathy when appropriate' : 'Maintain neutral emotional tone'}
- Use culturally appropriate expressions for the selected language
- ${contextMemory ? 'Reference shared context and previous interactions naturally' : 'Focus on current interaction only'}
- Provide helpful, accurate, and engaging responses
- ${sentimentAnalysis ? 'Match response energy to user sentiment' : 'Maintain consistent energy level'}
- Include relevant emojis sparingly based on personality mode
- ${nlpSettings.proactiveAssistance ? 'Suggest related actions or information when helpful' : 'Respond only to direct requests'}

Now process this user input: "${command}"

Apply all enabled NLP capabilities and respond according to the personality mode (${personalityMode}) and language setting (${language}).`

    const result=await axios.post(apiUrl,{
        "contents": [{
            "parts":[{"text": prompt}]
        }]
    }, {
        timeout: 10000, // 10 second timeout
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const responseText = result.data.candidates[0].content.parts[0].text
    
    // Validate response format
    if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from Gemini API")
    }
    
    return responseText
} catch (error) {
    console.log("Gemini API Error:", error.message || error)
    
    // Professional error responses based on error type
    let errorResponse = "I'm experiencing a technical issue right now. Please try your request again."
    
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorResponse = "I'm taking a bit longer to process that. Let me try again with a simpler approach."
    } else if (error.response?.status === 429) {
        errorResponse = "I'm handling many requests right now. Please wait a moment and try again."
    } else if (error.response?.status >= 500) {
        errorResponse = "The AI service is temporarily unavailable. I'll be back shortly."
    }
    
    return JSON.stringify({
        type: "general",
        userInput: command,
        response: errorResponse,
        emotion: "apologetic",
        confidence: 0.9,
        language: "en-US",
        intent: "error",
        sentiment: "neutral",
        context_used: false,
        suggestions: ["Please try again", "Rephrase your question", "Check your connection"]
    })
}
}

export default geminiResponse