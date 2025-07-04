import natural from 'natural'
import Sentiment from 'sentiment'

class NLPService {
    constructor() {
        this.tokenizer = new natural.WordTokenizer()
        this.stemmer = natural.PorterStemmer
        this.sentiment = new Sentiment()
        this.tfidf = new natural.TfIdf()
    }

    // Analyze sentiment of text
    analyzeSentiment(text) {
        try {
            const result = this.sentiment.analyze(text)
            let sentiment = 'neutral'
            
            if (result.score > 2) sentiment = 'positive'
            else if (result.score < -2) sentiment = 'negative'
            
            return {
                score: result.score,
                sentiment: sentiment,
                positive: result.positive,
                negative: result.negative,
                comparative: result.comparative
            }
        } catch (error) {
            console.error('Sentiment analysis error:', error)
            return { score: 0, sentiment: 'neutral', positive: [], negative: [], comparative: 0 }
        }
    }

    // Extract keywords from text
    extractKeywords(text, limit = 10) {
        try {
            const tokens = this.tokenizer.tokenize(text.toLowerCase())
            const stemmed = tokens.map(token => this.stemmer.stem(token))
            
            // Remove common stop words
            const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']
            
            const filtered = stemmed.filter(word => 
                word.length > 2 && 
                !stopWords.includes(word) && 
                /^[a-zA-Z]+$/.test(word)
            )
            
            // Count word frequency
            const frequency = {}
            filtered.forEach(word => {
                frequency[word] = (frequency[word] || 0) + 1
            })
            
            // Sort by frequency and return top keywords
            return Object.entries(frequency)
                .sort(([,a], [,b]) => b - a)
                .slice(0, limit)
                .map(([word, freq]) => ({ word, frequency: freq }))
        } catch (error) {
            console.error('Keyword extraction error:', error)
            return []
        }
    }

    // Detect intent from text
    detectIntent(text) {
        try {
            const lowerText = text.toLowerCase()
            
            // Define intent patterns
            const intentPatterns = {
                question: ['what', 'how', 'when', 'where', 'why', 'who', 'which', '?'],
                request: ['please', 'can you', 'could you', 'would you', 'help me'],
                command: ['open', 'close', 'start', 'stop', 'play', 'pause', 'set', 'turn'],
                greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
                farewell: ['goodbye', 'bye', 'see you', 'farewell', 'take care'],
                weather: ['weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast'],
                time: ['time', 'clock', 'hour', 'minute', 'when is'],
                date: ['date', 'today', 'tomorrow', 'yesterday', 'calendar'],
                search: ['search', 'find', 'look for', 'google', 'youtube'],
                music: ['play music', 'song', 'music', 'playlist', 'spotify'],
                information: ['tell me', 'information', 'about', 'explain', 'definition']
            }
            
            let maxScore = 0
            let detectedIntent = 'general'
            
            for (const [intent, patterns] of Object.entries(intentPatterns)) {
                let score = 0
                patterns.forEach(pattern => {
                    if (lowerText.includes(pattern)) {
                        score += 1
                    }
                })
                
                if (score > maxScore) {
                    maxScore = score
                    detectedIntent = intent
                }
            }
            
            return {
                intent: detectedIntent,
                confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3
            }
        } catch (error) {
            console.error('Intent detection error:', error)
            return { intent: 'general', confidence: 0.3 }
        }
    }

    // Analyze emotional tone
    analyzeEmotion(text) {
        try {
            const lowerText = text.toLowerCase()
            
            const emotionKeywords = {
                happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'fantastic', 'amazing', 'love', 'awesome'],
                sad: ['sad', 'depressed', 'unhappy', 'miserable', 'disappointed', 'hurt', 'upset'],
                angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'hate'],
                fear: ['afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified'],
                surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'wow'],
                disgust: ['disgusted', 'sick', 'gross', 'yuck', 'terrible', 'awful']
            }
            
            let emotionScores = {}
            
            for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
                let score = 0
                keywords.forEach(keyword => {
                    if (lowerText.includes(keyword)) {
                        score += 1
                    }
                })
                emotionScores[emotion] = score
            }
            
            // Find dominant emotion
            const dominantEmotion = Object.entries(emotionScores)
                .sort(([,a], [,b]) => b - a)[0]
            
            return {
                emotion: dominantEmotion[1] > 0 ? dominantEmotion[0] : 'neutral',
                confidence: dominantEmotion[1] > 0 ? Math.min(dominantEmotion[1] / 2, 1) : 0.5,
                scores: emotionScores
            }
        } catch (error) {
            console.error('Emotion analysis error:', error)
            return { emotion: 'neutral', confidence: 0.5, scores: {} }
        }
    }

    // Comprehensive text analysis
    analyzeText(text) {
        try {
            return {
                sentiment: this.analyzeSentiment(text),
                intent: this.detectIntent(text),
                emotion: this.analyzeEmotion(text),
                keywords: this.extractKeywords(text),
                wordCount: text.split(' ').length,
                characterCount: text.length
            }
        } catch (error) {
            console.error('Text analysis error:', error)
            return null
        }
    }
}

export default new NLPService()
