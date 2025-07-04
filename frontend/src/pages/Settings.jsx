import React, { useContext, useState, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace, MdVolumeUp, MdSpeed, MdMic, MdTranslate, MdPsychology, MdSettings } from "react-icons/md";
import { FiSliders } from "react-icons/fi";
import { BsSpeedometer2 } from "react-icons/bs";
import { IoLanguage } from "react-icons/io5";
import { RiEmotionLine, RiSoundModuleLine } from "react-icons/ri";
import axios from 'axios'

function Settings() {
    const {userData, setUserData, serverUrl} = useContext(userDataContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('voice')
    
    // Voice Settings State
    const [voiceSettings, setVoiceSettings] = useState({
        speed: userData?.voiceSettings?.speed || 1,
        pitch: userData?.voiceSettings?.pitch || 1,
        volume: userData?.voiceSettings?.volume || 1,
        language: userData?.voiceSettings?.language || 'en-US',
        voiceGender: userData?.voiceSettings?.voiceGender || 'female',
        // Enhanced voice controls
        emphasis: userData?.voiceSettings?.emphasis || 'normal',
        breathiness: userData?.voiceSettings?.breathiness || 0.5,
        roughness: userData?.voiceSettings?.roughness || 0.5,
        voiceStyle: userData?.voiceSettings?.voiceStyle || 'neutral',
        speakingStyle: userData?.voiceSettings?.speakingStyle || 'general',
        noiseReduction: userData?.voiceSettings?.noiseReduction ?? true,
        autoSpeedAdjust: userData?.voiceSettings?.autoSpeedAdjust ?? false
    })
    
    // NLP Settings State
    const [nlpSettings, setNlpSettings] = useState({
        contextMemory: userData?.nlpSettings?.contextMemory ?? true,
        emotionalIntelligence: userData?.nlpSettings?.emotionalIntelligence ?? true,
        personalityMode: userData?.nlpSettings?.personalityMode || 'friendly',
        // Enhanced NLP features
        sentimentAnalysis: userData?.nlpSettings?.sentimentAnalysis ?? true,
        intentRecognition: userData?.nlpSettings?.intentRecognition ?? true,
        multiTurnConversation: userData?.nlpSettings?.multiTurnConversation ?? true,
        languageDetection: userData?.nlpSettings?.languageDetection ?? true,
        contextualUnderstanding: userData?.nlpSettings?.contextualUnderstanding ?? true,
        proactiveAssistance: userData?.nlpSettings?.proactiveAssistance ?? false,
        learningMode: userData?.nlpSettings?.learningMode ?? true,
        conversationMemoryLength: userData?.nlpSettings?.conversationMemoryLength || 10
    })

    const languages = [
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
        { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
        { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
        { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
        { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
        { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' }
    ]

    const personalityModes = [
        { value: 'friendly', name: 'Friendly', desc: 'Warm and approachable', icon: '😊' },
        { value: 'professional', name: 'Professional', desc: 'Business-like and efficient', icon: '💼' },
        { value: 'casual', name: 'Casual', desc: 'Relaxed and informal', icon: '😎' },
        { value: 'formal', name: 'Formal', desc: 'Polite and respectful', icon: '🎩' },
        { value: 'enthusiastic', name: 'Enthusiastic', desc: 'Energetic and upbeat', icon: '🎉' },
        { value: 'calm', name: 'Calm', desc: 'Peaceful and soothing', icon: '🧘' },
        { value: 'witty', name: 'Witty', desc: 'Clever and humorous', icon: '🤓' },
        { value: 'supportive', name: 'Supportive', desc: 'Encouraging and caring', icon: '🤗' }
    ]

    const voiceStyles = [
        { value: 'neutral', name: 'Neutral', desc: 'Standard speaking style' },
        { value: 'cheerful', name: 'Cheerful', desc: 'Happy and upbeat tone' },
        { value: 'empathetic', name: 'Empathetic', desc: 'Understanding and caring' },
        { value: 'calm', name: 'Calm', desc: 'Peaceful and relaxed' },
        { value: 'assistant', name: 'Assistant', desc: 'Professional helper tone' },
        { value: 'newscast', name: 'Newscast', desc: 'Clear and informative' },
        { value: 'customerservice', name: 'Customer Service', desc: 'Helpful and polite' }
    ]

    const speakingStyles = [
        { value: 'general', name: 'General', desc: 'Standard conversation' },
        { value: 'advertisement', name: 'Advertisement', desc: 'Promotional tone' },
        { value: 'narration', name: 'Narration', desc: 'Storytelling style' },
        { value: 'sports', name: 'Sports', desc: 'Energetic commentary' },
        { value: 'poetry', name: 'Poetry', desc: 'Artistic expression' },
        { value: 'lyrical', name: 'Lyrical', desc: 'Musical and flowing' }
    ]

    const handleSaveSettings = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/user/update-settings`, {
                voiceSettings,
                nlpSettings
            }, {withCredentials: true})
            
            setUserData(result.data)
            setLoading(false)
            
            // Show success animation
            const successMsg = document.createElement('div')
            successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            successMsg.textContent = 'Settings saved successfully! ✓'
            document.body.appendChild(successMsg)
            setTimeout(() => document.body.removeChild(successMsg), 3000)
            
        } catch (error) {
            setLoading(false)
            console.log(error)
            
            // Show error animation
            const errorMsg = document.createElement('div')
            errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            errorMsg.textContent = 'Failed to save settings ✗'
            document.body.appendChild(errorMsg)
            setTimeout(() => document.body.removeChild(errorMsg), 3000)
        }
    }

    const testVoice = () => {
        const testMessages = {
            'en-US': "Hello! This is how I sound with your current settings. I can adjust my voice to match your preferences perfectly.",
            'hi-IN': "नमस्ते! यह आपकी वर्तमान सेटिंग्स के साथ मेरी आवाज़ है। मैं अपनी आवाज़ को आपकी पसंद के अनुसार समायोजित कर सकता हूं।",
            'es-ES': "¡Hola! Así es como sueno con tu configuración actual. Puedo ajustar mi voz para que coincida perfectamente con tus preferencias.",
            'fr-FR': "Bonjour! Voici comment je sonne avec vos paramètres actuels. Je peux ajuster ma voix pour correspondre parfaitement à vos préférences.",
            'de-DE': "Hallo! So klinge ich mit Ihren aktuellen Einstellungen. Ich kann meine Stimme perfekt an Ihre Vorlieben anpassen.",
            'ja-JP': "こんにちは！これが現在の設定での私の声です。あなたの好みに完璧に合わせて声を調整できます。",
            'ko-KR': "안녕하세요! 현재 설정으로 제 목소리가 이렇게 들립니다. 당신의 선호도에 완벽하게 맞춰 목소리를 조정할 수 있습니다.",
            'zh-CN': "你好！这是我使用当前设置的声音。我可以调整我的声音以完全匹配您的偏好。",
            'pt-BR': "Olá! É assim que soo com suas configurações atuais. Posso ajustar minha voz para corresponder perfeitamente às suas preferências.",
            'ru-RU': "Привет! Вот как я звучу с вашими текущими настройками. Я могу настроить свой голос в соответствии с вашими предпочтениями.",
            'ar-SA': "مرحباً! هذا هو صوتي مع إعداداتك الحالية. يمكنني تعديل صوتي ليتطابق مع تفضيلاتك تماماً."
        };
        
        const testText = testMessages[voiceSettings.language] || testMessages['en-US'];
        const utterance = new SpeechSynthesisUtterance(testText)
        
        // Apply all voice settings
        utterance.rate = Math.max(0.1, Math.min(10, voiceSettings.speed))
        utterance.pitch = Math.max(0, Math.min(2, voiceSettings.pitch))
        utterance.volume = Math.max(0, Math.min(1, voiceSettings.volume))
        utterance.lang = voiceSettings.language
        
        // Advanced voice selection
        const voices = window.speechSynthesis.getVoices()
        let selectedVoice = null
        let bestScore = 0
        
        voices.forEach(voice => {
            let score = 0
            
            // Language matching
            if (voice.lang === voiceSettings.language) score += 100
            else if (voice.lang.startsWith(voiceSettings.language.split('-')[0])) score += 80
            
            // Gender preference
            if (voiceSettings.voiceGender) {
                const voiceName = voice.name.toLowerCase()
                const isFemaleName = voiceName.includes('female') || voiceName.includes('woman') || 
                                   voiceName.includes('zira') || voiceName.includes('cortana')
                const isMaleName = voiceName.includes('male') || voiceName.includes('man') ||
                                  voiceName.includes('david') || voiceName.includes('mark')
                
                if (voiceSettings.voiceGender === 'female' && isFemaleName) score += 50
                if (voiceSettings.voiceGender === 'male' && isMaleName) score += 50
                if (voiceSettings.voiceGender === 'neutral') score += 25
            }
            
            // Voice style preference
            if (voiceSettings.voiceStyle && voice.name.toLowerCase().includes(voiceSettings.voiceStyle)) {
                score += 30
            }
            
            // Quality indicators
            if (voice.name.toLowerCase().includes('premium')) score += 30
            if (voice.name.toLowerCase().includes('neural')) score += 25
            if (voice.name.toLowerCase().includes('enhanced')) score += 20
            if (voice.localService) score += 10
            
            if (score > bestScore) {
                bestScore = score
                selectedVoice = voice
            }
        })
        
        if (selectedVoice) utterance.voice = selectedVoice
        
        // Apply emphasis and style modifications
        if (voiceSettings.emphasis === 'strong') {
            utterance.rate *= 0.9
            utterance.pitch *= 1.1
        } else if (voiceSettings.emphasis === 'moderate') {
            utterance.rate *= 0.95
            utterance.pitch *= 1.05
        }
        
        // Visual feedback
        const testButton = document.querySelector('.test-voice-button')
        if (testButton) {
            testButton.classList.add('testing')
            setTimeout(() => testButton.classList.remove('testing'), 3000)
        }
        
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-black via-blue-950 to-purple-950 flex flex-col items-center p-4 lg:p-8'>
            {/* Header */}
            <div className='w-full max-w-6xl flex items-center justify-between mb-8'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={() => navigate("/")}
                        className='p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110'
                    >
                        <MdKeyboardBackspace className='text-white w-6 h-6' />
                    </button>
                    <div className='flex items-center gap-3'>
                        <MdSettings className='text-blue-400 w-8 h-8' />
                        <h1 className='text-white text-2xl lg:text-3xl font-bold'>Assistant Settings</h1>
                    </div>
                </div>
                
                <button 
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Tabs */}
            <div className='w-full max-w-6xl mb-8'>
                <div className='flex flex-wrap gap-2 lg:gap-4 p-2 bg-white/5 backdrop-blur-sm rounded-2xl'>
                    <button 
                        onClick={() => setActiveTab('voice')}
                        className={`flex items-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'voice' 
                                ? 'bg-blue-500 text-white shadow-lg' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <RiSoundModuleLine className='w-5 h-5' />
                        <span className='hidden sm:block'>Voice Controls</span>
                        <span className='sm:hidden'>Voice</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('language')}
                        className={`flex items-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'language' 
                                ? 'bg-purple-500 text-white shadow-lg' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <IoLanguage className='w-5 h-5' />
                        <span className='hidden sm:block'>Language</span>
                        <span className='sm:hidden'>Lang</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('nlp')}
                        className={`flex items-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'nlp' 
                                ? 'bg-green-500 text-white shadow-lg' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <MdPsychology className='w-5 h-5' />
                        <span className='hidden sm:block'>AI Behavior</span>
                        <span className='sm:hidden'>AI</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className='w-full max-w-6xl'>
                {/* Voice Controls Tab */}
                {activeTab === 'voice' && (
                    <div className='space-y-8 animate-fadeIn'>
                        {/* Basic Voice Controls */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {/* Voice Speed */}
                            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <BsSpeedometer2 className='text-blue-400 w-6 h-6' />
                                    <h3 className='text-white text-xl font-semibold'>Voice Speed</h3>
                                </div>
                                <div className='space-y-4'>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="3" 
                                        step="0.1"
                                        value={voiceSettings.speed}
                                        onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                                    />
                                    <div className='flex justify-between text-sm text-gray-400'>
                                        <span>Very Slow (0.1x)</span>
                                        <span className='text-blue-400 font-semibold'>{voiceSettings.speed}x</span>
                                        <span>Fast (3.0x)</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <input 
                                            type="checkbox" 
                                            id="autoSpeedAdjust"
                                            checked={voiceSettings.autoSpeedAdjust}
                                            onChange={(e) => setVoiceSettings({...voiceSettings, autoSpeedAdjust: e.target.checked})}
                                            className='w-4 h-4'
                                        />
                                        <label htmlFor="autoSpeedAdjust" className='text-sm text-gray-300'>Auto-adjust speed based on content</label>
                                    </div>
                                </div>
                            </div>

                            {/* Voice Pitch */}
                            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <MdMic className='text-purple-400 w-6 h-6' />
                                    <h3 className='text-white text-xl font-semibold'>Voice Pitch</h3>
                                </div>
                                <div className='space-y-4'>
                                    <input 
                                        type="range" 
                                        min="0.5" 
                                        max="2" 
                                        step="0.05"
                                        value={voiceSettings.pitch}
                                        onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseFloat(e.target.value)})}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                                    />
                                    <div className='flex justify-between text-sm text-gray-400'>
                                        <span>Deep (0.5x)</span>
                                        <span className='text-purple-400 font-semibold'>{voiceSettings.pitch}x</span>
                                        <span>High (2.0x)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Voice Volume */}
                            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <MdVolumeUp className='text-green-400 w-6 h-6' />
                                    <h3 className='text-white text-xl font-semibold'>Voice Volume</h3>
                                </div>
                                <div className='space-y-4'>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="1" 
                                        step="0.05"
                                        value={voiceSettings.volume}
                                        onChange={(e) => setVoiceSettings({...voiceSettings, volume: parseFloat(e.target.value)})}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                                    />
                                    <div className='flex justify-between text-sm text-gray-400'>
                                        <span>Whisper (10%)</span>
                                        <span className='text-green-400 font-semibold'>{Math.round(voiceSettings.volume * 100)}%</span>
                                        <span>Maximum (100%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Voice Gender */}
                            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-400/30 transition-all duration-300'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <RiEmotionLine className='text-pink-400 w-6 h-6' />
                                    <h3 className='text-white text-xl font-semibold'>Voice Gender</h3>
                                </div>
                                <div className='grid grid-cols-3 gap-2'>
                                    {['female', 'male', 'neutral'].map((gender) => (
                                        <button
                                            key={gender}
                                            onClick={() => setVoiceSettings({...voiceSettings, voiceGender: gender})}
                                            className={`p-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                                                voiceSettings.voiceGender === gender 
                                                    ? 'bg-pink-500 text-white shadow-lg' 
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                            }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Advanced Voice Controls */}
                        <div className='space-y-6'>
                            <h3 className='text-white text-2xl font-bold flex items-center gap-3'>
                                <FiSliders className='text-blue-400' />
                                Advanced Voice Controls
                            </h3>
                            
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Voice Style */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <RiSoundModuleLine className='text-yellow-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Voice Style</h3>
                                    </div>
                                    <div className='space-y-2'>
                                        {voiceStyles.map((style) => (
                                            <button
                                                key={style.value}
                                                onClick={() => setVoiceSettings({...voiceSettings, voiceStyle: style.value})}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                                                    voiceSettings.voiceStyle === style.value 
                                                        ? 'bg-yellow-500 text-white shadow-lg' 
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                                }`}
                                            >
                                                <div className='text-left'>
                                                    <div className='font-semibold'>{style.name}</div>
                                                    <div className='text-xs opacity-70'>{style.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Speaking Style */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-indigo-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <MdMic className='text-indigo-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Speaking Style</h3>
                                    </div>
                                    <div className='space-y-2'>
                                        {speakingStyles.map((style) => (
                                            <button
                                                key={style.value}
                                                onClick={() => setVoiceSettings({...voiceSettings, speakingStyle: style.value})}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                                                    voiceSettings.speakingStyle === style.value 
                                                        ? 'bg-indigo-500 text-white shadow-lg' 
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                                }`}
                                            >
                                                <div className='text-left'>
                                                    <div className='font-semibold'>{style.name}</div>
                                                    <div className='text-xs opacity-70'>{style.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Voice Emphasis */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <BsSpeedometer2 className='text-orange-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Speech Emphasis</h3>
                                    </div>
                                    <div className='grid grid-cols-3 gap-2'>
                                        {[
                                            { value: 'reduced', name: 'Reduced', desc: 'Soft emphasis' },
                                            { value: 'normal', name: 'Normal', desc: 'Natural emphasis' },
                                            { value: 'strong', name: 'Strong', desc: 'Bold emphasis' }
                                        ].map((emphasis) => (
                                            <button
                                                key={emphasis.value}
                                                onClick={() => setVoiceSettings({...voiceSettings, emphasis: emphasis.value})}
                                                className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                                                    voiceSettings.emphasis === emphasis.value 
                                                        ? 'bg-orange-500 text-white shadow-lg' 
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                                }`}
                                            >
                                                <div className='text-xs'>{emphasis.name}</div>
                                                <div className='text-xs opacity-70'>{emphasis.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Audio Enhancement */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-teal-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <RiSoundModuleLine className='text-teal-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Audio Enhancement</h3>
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Noise Reduction</div>
                                                <div className='text-sm text-gray-400'>Reduce background noise</div>
                                            </div>
                                            <button
                                                onClick={() => setVoiceSettings({...voiceSettings, noiseReduction: !voiceSettings.noiseReduction})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    voiceSettings.noiseReduction ? 'bg-teal-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    voiceSettings.noiseReduction ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Voice Button */}
                        <div className='flex justify-center'>
                            <button 
                                onClick={testVoice}
                                className='test-voice-button flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg'
                            >
                                <MdVolumeUp className='w-5 h-5' />
                                Test Voice Settings
                            </button>
                        </div>
                    </div>
                )}

                {/* Language Tab */}
                {activeTab === 'language' && (
                    <div className='space-y-6 animate-fadeIn'>
                        <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10'>
                            <div className='flex items-center gap-3 mb-6'>
                                <MdTranslate className='text-purple-400 w-6 h-6' />
                                <h3 className='text-white text-xl font-semibold'>Select Language</h3>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setVoiceSettings({...voiceSettings, language: lang.code})}
                                        className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                                            voiceSettings.language === lang.code 
                                                ? 'bg-purple-500 text-white shadow-lg border-2 border-purple-400' 
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border-2 border-transparent hover:border-purple-400/30'
                                        }`}
                                    >
                                        <span className='text-2xl'>{lang.flag}</span>
                                        <div className='text-left'>
                                            <div className='font-semibold'>{lang.name.split(' ')[0]}</div>
                                            <div className='text-xs opacity-70'>{lang.name.split(' ').slice(1).join(' ')}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* NLP/AI Behavior Tab */}
                {activeTab === 'nlp' && (
                    <div className='space-y-8 animate-fadeIn'>
                        {/* Personality Settings */}
                        <div className='space-y-6'>
                            <h3 className='text-white text-2xl font-bold flex items-center gap-3'>
                                <MdPsychology className='text-green-400' />
                                AI Personality & Behavior
                            </h3>
                            
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Personality Mode */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <MdPsychology className='text-green-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Personality Mode</h3>
                                    </div>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                        {personalityModes.map((mode) => (
                                            <button
                                                key={mode.value}
                                                onClick={() => setNlpSettings({...nlpSettings, personalityMode: mode.value})}
                                                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                                                    nlpSettings.personalityMode === mode.value 
                                                        ? 'bg-green-500 text-white shadow-lg' 
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                                }`}
                                            >
                                                <span className='text-2xl'>{mode.icon}</span>
                                                <div className='text-left'>
                                                    <div className='font-semibold text-sm'>{mode.name}</div>
                                                    <div className='text-xs opacity-70'>{mode.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conversation Memory */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <FiSliders className='text-blue-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Memory Settings</h3>
                                    </div>
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='text-white font-semibold mb-2 block'>Conversation Memory Length</label>
                                            <input 
                                                type="range" 
                                                min="5" 
                                                max="50" 
                                                step="5"
                                                value={nlpSettings.conversationMemoryLength}
                                                onChange={(e) => setNlpSettings({...nlpSettings, conversationMemoryLength: parseInt(e.target.value)})}
                                                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                                            />
                                            <div className='flex justify-between text-sm text-gray-400 mt-2'>
                                                <span>5 turns</span>
                                                <span className='text-blue-400 font-semibold'>{nlpSettings.conversationMemoryLength} turns</span>
                                                <span>50 turns</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced NLP Features */}
                        <div className='space-y-6'>
                            <h3 className='text-white text-2xl font-bold flex items-center gap-3'>
                                <RiEmotionLine className='text-purple-400' />
                                Advanced AI Capabilities
                            </h3>
                            
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Core AI Features */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <FiSliders className='text-blue-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Core Features</h3>
                                    </div>
                                    <div className='space-y-6'>
                                        {/* Context Memory */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Context Memory</div>
                                                <div className='text-sm text-gray-400'>Remember conversation context and history</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, contextMemory: !nlpSettings.contextMemory})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.contextMemory ? 'bg-blue-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.contextMemory ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Emotional Intelligence */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Emotional Intelligence</div>
                                                <div className='text-sm text-gray-400'>Understand and respond to emotions</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, emotionalIntelligence: !nlpSettings.emotionalIntelligence})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.emotionalIntelligence ? 'bg-green-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.emotionalIntelligence ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Sentiment Analysis */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Sentiment Analysis</div>
                                                <div className='text-sm text-gray-400'>Analyze mood and tone in conversations</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, sentimentAnalysis: !nlpSettings.sentimentAnalysis})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.sentimentAnalysis ? 'bg-purple-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.sentimentAnalysis ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Intent Recognition */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Intent Recognition</div>
                                                <div className='text-sm text-gray-400'>Better understand what you want to do</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, intentRecognition: !nlpSettings.intentRecognition})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.intentRecognition ? 'bg-yellow-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.intentRecognition ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced AI Features */}
                                <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <RiEmotionLine className='text-purple-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Advanced Features</h3>
                                    </div>
                                    <div className='space-y-6'>
                                        {/* Multi-turn Conversation */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Multi-turn Conversations</div>
                                                <div className='text-sm text-gray-400'>Handle complex back-and-forth dialogues</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, multiTurnConversation: !nlpSettings.multiTurnConversation})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.multiTurnConversation ? 'bg-indigo-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.multiTurnConversation ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Language Detection */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Auto Language Detection</div>
                                                <div className='text-sm text-gray-400'>Automatically detect and switch languages</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, languageDetection: !nlpSettings.languageDetection})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.languageDetection ? 'bg-teal-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.languageDetection ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Contextual Understanding */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Contextual Understanding</div>
                                                <div className='text-sm text-gray-400'>Deep understanding of context and nuance</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, contextualUnderstanding: !nlpSettings.contextualUnderstanding})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.contextualUnderstanding ? 'bg-orange-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.contextualUnderstanding ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Learning Mode */}
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Learning Mode</div>
                                                <div className='text-sm text-gray-400'>Learn from your preferences over time</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, learningMode: !nlpSettings.learningMode})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.learningMode ? 'bg-pink-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.learningMode ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Proactive Assistance */}
                                <div className='lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <MdSettings className='text-emerald-400 w-6 h-6' />
                                        <h3 className='text-white text-xl font-semibold'>Proactive AI Features</h3>
                                    </div>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-white font-semibold'>Proactive Assistance</div>
                                                <div className='text-sm text-gray-400'>Offer help before you ask</div>
                                            </div>
                                            <button
                                                onClick={() => setNlpSettings({...nlpSettings, proactiveAssistance: !nlpSettings.proactiveAssistance})}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    nlpSettings.proactiveAssistance ? 'bg-emerald-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                                    nlpSettings.proactiveAssistance ? 'left-7' : 'left-1'
                                                }`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                }
                
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
                }
                
                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                }
                
                .slider::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
                }
                
                .test-voice-button.testing {
                    animation: pulse 1s infinite;
                    background: linear-gradient(45deg, #10b981, #06d6a0);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
                
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .glass-effect:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #2563eb, #7c3aed);
                }
                
                /* Enhanced button animations */
                .enhanced-button {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .enhanced-button::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    transform: translate(-50%, -50%);
                }
                
                .enhanced-button:hover::before {
                    width: 300px;
                    height: 300px;
                }
                
                .enhanced-button:active {
                    transform: scale(0.98);
                }
                
                /* Floating animation for icons */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .float-animation {
                    animation: float 3s ease-in-out infinite;
                }
                
                /* Responsive grid animations */
                @media (max-width: 768px) {
                    .animate-fadeIn {
                        animation: fadeInMobile 0.3s ease-out;
                    }
                }
                
                @keyframes fadeInMobile {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

export default Settings
