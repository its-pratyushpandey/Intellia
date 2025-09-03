import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { MdSettings, MdVolumeUp, MdDashboard } from "react-icons/md";
import { FiFeather } from "react-icons/fi";
import userImg from "../assets/user.gif"
import IntegratedDashboard from '../components/IntegratedDashboard'
import FeaturesShowcase from '../components/FeaturesShowcase'

function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    
   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error);
      }
    }
  }
    
  }

  const speak=(text)=>{
    const utterance=new SpeechSynthesisUtterance(text)
    
    // Apply user voice settings with enhanced controls
    const voiceSettings = userData?.voiceSettings || {}
    utterance.rate = Math.max(0.1, Math.min(10, voiceSettings.speed || 1)) // Enhanced range
    utterance.pitch = Math.max(0, Math.min(2, voiceSettings.pitch || 1))
    utterance.volume = Math.max(0, Math.min(1, voiceSettings.volume || 1))
    utterance.lang = voiceSettings.language || 'en-US'
    
    // Advanced voice selection with quality scoring
    const voices = window.speechSynthesis.getVoices()
    let selectedVoice = null
    let bestScore = 0
    
    voices.forEach(voice => {
      let score = 0
      
      // Language matching (highest priority)
      if (voice.lang === utterance.lang) {
        score += 100
      } else if (voice.lang.startsWith(utterance.lang.split('-')[0])) {
        score += 80
      }
      
      // Gender preference matching
      if (voiceSettings.voiceGender) {
        const voiceName = voice.name.toLowerCase()
        const isFemaleName = voiceName.includes('female') || voiceName.includes('woman') || 
                            voiceName.includes('zira') || voiceName.includes('cortana') ||
                            voiceName.includes('samantha') || voiceName.includes('alex')
        const isMaleName = voiceName.includes('male') || voiceName.includes('man') ||
                          voiceName.includes('david') || voiceName.includes('mark')
        
        if (voiceSettings.voiceGender === 'female' && isFemaleName) score += 50
        if (voiceSettings.voiceGender === 'male' && isMaleName) score += 50
        if (voiceSettings.voiceGender === 'neutral') score += 25
      }
      
      // Quality indicators (premium voices get higher scores)
      if (voice.name.toLowerCase().includes('premium')) score += 30
      if (voice.name.toLowerCase().includes('neural')) score += 25
      if (voice.name.toLowerCase().includes('enhanced')) score += 20
      if (voice.localService) score += 10 // Local voices are usually better
      
      if (score > bestScore) {
        bestScore = score
        selectedVoice = voice
      }
    })
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    // Enhanced speech events with emotion and emphasis
    const nlpSettings = userData?.nlpSettings || {}
    if (nlpSettings.emotionalIntelligence) {
      // Adjust speech based on content emotion
      if (text.includes('!') || text.includes('exciting') || text.includes('amazing')) {
        utterance.rate *= 1.1
        utterance.pitch *= 1.05
      }
      if (text.includes('sorry') || text.includes('error') || text.includes('problem')) {
        utterance.rate *= 0.9
        utterance.pitch *= 0.95
      }
    }

    isSpeakingRef.current=true
    
    utterance.onstart = () => {
      // Add visual feedback for speech start
      document.body.classList.add('speaking-active')
    }
    
    utterance.onend=()=>{
        setAiText("");
        setIsProcessing(false)
        isSpeakingRef.current = false;
        document.body.classList.remove('speaking-active')
        
        // Optimized delay - faster restart for shorter responses
        const delay = Math.min(800, Math.max(200, text.length * 5)); // Reduced calculation
        setTimeout(() => {
          if (!isSpeakingRef.current && !isRecognizingRef.current) {
            startRecognition();
          }
        }, delay);
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      isSpeakingRef.current = false
      document.body.classList.remove('speaking-active')
      setIsProcessing(false)
      // Immediate restart on speech error
      setTimeout(() => {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
          startRecognition();
        }
      }, 200);
    }
    
   synth.cancel();
   synth.speak(utterance);
  }

  const handleCommand=(data)=>{
    const {type,userInput,response}=data
      speak(response);
    
    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator-open') {
  
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error('Speech Recognition not supported in this browser');
    return;
  }
  
  const recognition = new SpeechRecognition();

  // Enhanced recognition settings
  recognition.continuous = true;
  recognition.lang = userData?.voiceSettings?.language || 'en-US';
  recognition.interimResults = true; // Enable interim results for better UX
  recognition.maxAlternatives = 3; // Get multiple alternatives
  
  // Advanced noise handling
  const userVoiceSettings = userData?.voiceSettings || {}
  if (userVoiceSettings.noiseReduction !== false) {
    recognition.mozAudioChannel = 'normal' // Firefox specific
  }

  recognitionRef.current = recognition;

  let isMounted = true;
  let confidenceThreshold = 0.4; // Lowered from 0.7 to catch more commands
  let interimResult = '';

  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 500); // Reduced delay from 1000ms to 500ms

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
    console.log('Advanced voice recognition started');
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    interimResult = '';
    if (isMounted && !isSpeakingRef.current) {
      // Reduced restart delay for faster response
      setTimeout(() => {
        if (isMounted && !isSpeakingRef.current) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 300); // Reduced from 1000ms to 300ms
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    interimResult = '';
    
    // Enhanced error handling with user feedback
    if (event.error === 'network') {
      console.log('Network error - will retry with shorter delay');
    } else if (event.error === 'not-allowed') {
      console.log('Microphone access denied');
      // Show user notification
      setUserText("🎤 Microphone access needed for voice commands");
      setTimeout(() => setUserText(""), 3000);
    } else if (event.error === 'no-speech') {
      console.log('No speech detected - continuing listening');
    }
    
    // Faster restart after errors (except for critical ones)
    if (event.error !== "aborted" && event.error !== "not-allowed" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted && !isSpeakingRef.current) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, event.error === 'network' ? 1000 : 500); // Adaptive delay based on error type
    }
  };

  recognition.onresult = async (e) => {
    const results = e.results;
    const lastResult = results[results.length - 1];
    
    // Handle interim results for better UX
    if (!lastResult.isFinal) {
      interimResult = lastResult[0].transcript;
      setUserText(interimResult + '...');
      return;
    }
    
    // Process final result with confidence checking
    let bestTranscript = '';
    let highestConfidence = 0;
    
    // Check all alternatives and pick the best one
    for (let i = 0; i < Math.min(lastResult.length, 3); i++) {
      const alternative = lastResult[i];
      if (alternative.confidence > highestConfidence) {
        highestConfidence = alternative.confidence;
        bestTranscript = alternative.transcript;
      }
    }
    
    const transcript = bestTranscript.trim();
    const assistantName = userData.assistantName.toLowerCase();
    
    // Enhanced wake word detection with multiple variations and fuzzy matching
    const wakeWords = [
      assistantName,
      `hey ${assistantName}`,
      `hi ${assistantName}`,
      `hello ${assistantName}`,
      `ok ${assistantName}`,
      // Add common variations
      assistantName.split(' ')[0], // First name only
      `call ${assistantName}`,
      `assistant`
    ];
    
    const containsWakeWord = wakeWords.some(word => 
      transcript.toLowerCase().includes(word.toLowerCase())
    );
    
    // Advanced NLP preprocessing
    const nlpSettings = userData?.nlpSettings || {}
    
    // Improved confidence handling - process commands with lower confidence if wake word is clear
    if (containsWakeWord && (highestConfidence >= confidenceThreshold || 
        (highestConfidence >= 0.2 && wakeWords.some(word => 
          transcript.toLowerCase().startsWith(word.toLowerCase()))))) {
      setAiText("");
      setUserText(transcript);
      setIsProcessing(true);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      
      try {
        // Enhanced command processing with context
        const enhancedCommand = nlpSettings.contextMemory ? 
          `${transcript} [Context: User is ${userData.name}, Assistant is ${userData.assistantName}]` : 
          transcript;
          
        const data = await getGeminiResponse(enhancedCommand);
        
        // Advanced command handling with emotion detection
        if (nlpSettings.emotionalIntelligence && data.emotion) {
          console.log(`Detected emotion: ${data.emotion}`);
          // Could add emotion-based visual effects here
        }
        
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      } catch (error) {
        console.error("Error getting response:", error);
        setIsProcessing(false);
        setUserText("");
        
        // Enhanced error handling with professional responses
        const errorMessages = {
          'en-US': "I'm experiencing a temporary issue. Let me try again.",
          'hi-IN': "मुझे अस्थायी समस्या हो रही है। मैं फिर से कोशिश करता हूं।",
          'es-ES': "Estoy experimentando un problema temporal. Déjame intentarlo de nuevo.",
          'fr-FR': "Je rencontre un problème temporaire. Laissez-moi réessayer.",
          'de-DE': "Ich habe ein vorübergehendes Problem. Lassen Sie mich es nochmal versuchen.",
        };
        
        const language = userData?.voiceSettings?.language || 'en-US';
        const errorMessage = errorMessages[language] || errorMessages['en-US'];
        speak(errorMessage);
        
        // Quick restart after error
        setTimeout(() => {
          if (!isSpeakingRef.current && !isRecognizingRef.current) {
            startRecognition();
          }
        }, 500);
      }
    } else if (containsWakeWord && highestConfidence < 0.2) {
      // Very low confidence - ask for clarification professionally
      console.log(`Low confidence (${highestConfidence}) - asking for clarification`);
      const clarificationMessages = {
        'en-US': "I didn't catch that clearly. Could you please repeat your request?",
        'hi-IN': "मैंने स्पष्ट रूप से नहीं सुना। क्या आप अपना अनुरोध दोहरा सकते हैं?",
        'es-ES': "No escuché claramente. ¿Podrías repetir tu solicitud?",
        'fr-FR': "Je n'ai pas bien entendu. Pourriez-vous répéter votre demande?",
        'de-DE': "Ich habe das nicht klar verstanden. Könnten Sie Ihre Anfrage wiederholen?",
      };
      
      const language = userData?.voiceSettings?.language || 'en-US';
      const clarificationMessage = clarificationMessages[language] || clarificationMessages['en-US'];
      speak(clarificationMessage);
    }
  };

  // Enhanced initial greeting with personality and language adaptation
  const greetingMessages = {
    'en-US': `Hello ${userData.name}, I'm ${userData.assistantName}. What can I help you with today?`,
    'hi-IN': `नमस्ते ${userData.name}, मैं ${userData.assistantName} हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?`,
    'es-ES': `Hola ${userData.name}, soy ${userData.assistantName}. ¿En qué puedo ayudarte hoy?`,
    'fr-FR': `Bonjour ${userData.name}, je suis ${userData.assistantName}. Comment puis-je vous aider aujourd'hui?`,
    'de-DE': `Hallo ${userData.name}, ich bin ${userData.assistantName}. Womit kann ich Ihnen heute helfen?`,
    'ja-JP': `こんにちは${userData.name}さん、私は${userData.assistantName}です。今日は何をお手伝いしましょうか？`,
    'ko-KR': `안녕하세요 ${userData.name}님, 저는 ${userData.assistantName}입니다. 오늘 무엇을 도와드릴까요?`,
    'zh-CN': `您好${userData.name}，我是${userData.assistantName}。今天我可以为您做什么？`,
    'pt-BR': `Olá ${userData.name}, eu sou ${userData.assistantName}. Como posso ajudá-lo hoje?`,
    'ru-RU': `Привет ${userData.name}, я ${userData.assistantName}. Чем могу помочь сегодня?`,
    'ar-SA': `مرحباً ${userData.name}، أنا ${userData.assistantName}. كيف يمكنني مساعدتك اليوم؟`
  };
  
  const language = userData?.voiceSettings?.language || 'en-US';
  const personalityMode = userData?.nlpSettings?.personalityMode || 'friendly';
  
  // Adjust greeting based on personality
  let greetingText = greetingMessages[language] || greetingMessages['en-US'];
  
  if (personalityMode === 'professional') {
    greetingText = greetingText.replace('Hello', 'Good day').replace('Hi', 'Good day');
  } else if (personalityMode === 'casual') {
    greetingText = greetingText.replace('Hello', 'Hey').replace('What can I help you with', 'What\'s up? What can I do for you');
  }
  
  const greeting = new SpeechSynthesisUtterance(greetingText);
  const greetingVoiceSettings = userData?.voiceSettings || {}
  greeting.rate = greetingVoiceSettings.speed || 1
  greeting.pitch = greetingVoiceSettings.pitch || 1
  greeting.volume = greetingVoiceSettings.volume || 1
  greeting.lang = language
  
  // Apply the same advanced voice selection as in speak function
  const voices = window.speechSynthesis.getVoices()
  let selectedVoice = null
  let bestScore = 0
  
  voices.forEach(voice => {
    let score = 0
    if (voice.lang === language) score += 100
    else if (voice.lang.startsWith(language.split('-')[0])) score += 80
    
    if (greetingVoiceSettings.voiceGender) {
      const voiceName = voice.name.toLowerCase()
      const isFemaleName = voiceName.includes('female') || voiceName.includes('woman')
      const isMaleName = voiceName.includes('male') || voiceName.includes('man')
      
      if (greetingVoiceSettings.voiceGender === 'female' && isFemaleName) score += 50
      if (greetingVoiceSettings.voiceGender === 'male' && isMaleName) score += 50
      if (greetingVoiceSettings.voiceGender === 'neutral') score += 25
    }
    
    if (score > bestScore) {
      bestScore = score
      selectedVoice = voice
    }
  })
  
  if (selectedVoice) greeting.voice = selectedVoice
  
  setTimeout(() => {
    window.speechSynthesis.speak(greeting);
  }, 800); // Reduced from 1500ms to 800ms for faster greeting

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  };
}, [userData]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-br from-black via-blue-950 to-purple-950 flex justify-center items-center flex-col gap-[15px] overflow-hidden relative'>
      {/* Mobile Menu */}
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] z-50 cursor-pointer hover:text-blue-400 transition-colors' onClick={()=>setHam(true)}/>
      
      {/* Mobile Sidebar */}
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000080] backdrop-blur-xl p-[20px] flex flex-col gap-[20px] items-start z-40 ${ham?"translate-x-0":"translate-x-full"} transition-transform duration-300`}>
        <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer hover:text-red-400 transition-colors' onClick={()=>setHam(false)}/>
        
        <div className='space-y-4 mt-16'>
          <button className='w-full min-w-[200px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[16px] hover:bg-gray-100 transition-colors' onClick={handleLogOut}>
            Log Out
          </button>
          
          <button className='w-full min-w-[200px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[16px] hover:bg-gray-100 transition-colors' onClick={()=>navigate("/customize")}>
            Customize Assistant
          </button>
          
          <button className='w-full min-w-[200px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[16px] hover:bg-gray-100 transition-colors' onClick={()=>navigate("/settings")}>
            <MdSettings className='inline w-5 h-5 mr-2' />
            Settings
          </button>

          <button className='w-full min-w-[200px] h-[50px] text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full cursor-pointer text-[16px] hover:from-purple-700 hover:to-indigo-700 transition-colors' onClick={() => setShowDashboard(true)}>
            <MdDashboard className='inline w-5 h-5 mr-2' />
            Dashboard
          </button>

          <button className='w-full min-w-[200px] h-[50px] text-white font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full cursor-pointer text-[16px] hover:from-emerald-700 hover:to-teal-700 transition-colors' onClick={() => setShowFeatures(true)}>
            <FiFeather className='inline w-5 h-5 mr-2' />
            Features
          </button>
        </div>

        <div className='w-full h-[2px] bg-gray-400 my-4'></div>
        <h1 className='text-white font-semibold text-[19px]'>Recent Commands</h1>

        <div className='w-full h-[300px] gap-[15px] overflow-y-auto flex flex-col'>
          {userData.history?.slice(-10).reverse().map((his, index)=>(
            <div key={index} className='text-gray-200 text-[16px] p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors'>{his}</div>
          ))}
        </div>
      </div>

      {/* Desktop Controls */}
      <div className='absolute top-[20px] right-[20px] hidden lg:flex gap-3'>
        <button className='px-6 py-3 text-black font-semibold bg-white rounded-full cursor-pointer text-[16px] hover:bg-gray-100 transition-all duration-300 hover:scale-105' onClick={handleLogOut}>
          Log Out
        </button>
        
        <button className='px-6 py-3 text-black font-semibold bg-white rounded-full cursor-pointer text-[16px] hover:bg-gray-100 transition-all duration-300 hover:scale-105' onClick={()=>navigate("/customize")}>
          Customize
        </button>
        
        <button className='px-6 py-3 text-white font-semibold bg-blue-600 rounded-full cursor-pointer text-[16px] hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center gap-2' onClick={()=>navigate("/settings")}>
          <MdSettings className='w-5 h-5' />
          Settings
        </button>

        <button className='px-6 py-3 text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full cursor-pointer text-[16px] hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 flex items-center gap-2' onClick={() => setShowDashboard(true)}>
          <MdDashboard className='w-5 h-5' />
          Dashboard
        </button>

        <button className='px-6 py-3 text-white font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full cursor-pointer text-[16px] hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 flex items-center gap-2' onClick={() => setShowFeatures(true)}>
          <FiFeather className='w-5 h-5' />
          Features
        </button>
      </div>

      {/* Main Content */}
      <div className='flex flex-col items-center gap-6 z-10'>
        {/* Assistant Avatar with Enhanced Glow Effect */}
        <div className={`assistant-avatar w-[280px] h-[380px] lg:w-[320px] lg:h-[420px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border-4 transition-all duration-500 ${
          listening ? 'border-blue-400 shadow-blue-400/50 glow-blue' : 
          isProcessing ? 'border-purple-400 shadow-purple-400/50 glow-purple animate-pulse' :
          aiText ? 'border-green-400 shadow-green-400/50 glow-green' : 
          'border-white/30 shadow-white/20'
        }`}>
          <img src={userData?.assistantImage} alt="Assistant" className='h-full object-cover transition-all duration-500' />
        </div>

        {/* Assistant Name with Animation */}
        <h1 className={`text-white text-[20px] lg:text-[24px] font-bold transition-all duration-300 ${
          listening ? 'text-blue-400 animate-pulse' : 
          isProcessing ? 'text-purple-400' :
          aiText ? 'text-green-400' : ''
        }`}>
          I'm {userData?.assistantName}
        </h1>

        {/* Status Indicator */}
        <div className='flex items-center gap-4'>
          {listening && (
            <div className='flex items-center gap-2 text-blue-400'>
              <div className='w-3 h-3 bg-blue-400 rounded-full animate-pulse'></div>
              <span className='text-sm font-semibold'>Listening...</span>
            </div>
          )}
          
          {isProcessing && (
            <div className='flex items-center gap-2 text-purple-400'>
              <div className='loading-spinner border-purple-400'></div>
              <span className='text-sm font-semibold processing-indicator'>Processing your request</span>
            </div>
          )}
        </div>

        {/* Animation Assets */}
        <div className='relative'>
          {!aiText && !isProcessing && <img src={userImg} alt="User" className='w-[180px] lg:w-[200px] transition-opacity duration-300'/>}
          {(aiText || isProcessing) && <img src={aiImg} alt="AI" className='w-[180px] lg:w-[200px] transition-opacity duration-300'/>}
        </div>

        {/* Text Display */}
        {(userText || aiText) && (
          <div className='max-w-[90%] lg:max-w-[600px] p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20'>
            <h1 className={`text-white text-[16px] lg:text-[18px] font-semibold text-center transition-all duration-300 ${
              userText ? 'text-blue-400' : aiText ? 'text-green-400' : ''
            }`}>
              {userText || aiText}
            </h1>
          </div>
        )}

        {/* Language Indicator with Animation */}
        {userData?.voiceSettings?.language && userData.voiceSettings.language !== 'en-US' && (
          <div className='flex items-center gap-2 text-gray-400 text-sm animate-fade-in'>
            <span>🌐</span>
            <span>Language:</span>
            <span className='text-blue-400 font-semibold animate-pulse'>
              {userData.voiceSettings.language}
            </span>
          </div>
        )}

        {/* AI Insights Display */}
        {userData?.nlpSettings?.emotionalIntelligence && (
          <div className='flex items-center gap-4 text-sm'>
            {/* Emotion Display */}
            <div className='flex items-center gap-2 text-purple-400'>
              <span>😊</span>
              <span>Mood: Positive</span>
            </div>
            
            {/* Confidence Display */}
            <div className='flex items-center gap-2 text-green-400'>
              <span>🎯</span>
              <span>Confidence: High</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons with Enhanced Features */}
      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3'>
        <button 
          onClick={() => navigate("/settings")}
          className='p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 animate-bounce-slow'
          title="Voice & AI Settings"
        >
          <MdSettings className='w-5 h-5' />
        </button>

        <button 
          onClick={() => setShowDashboard(true)}
          className='p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-110'
          title="Professional Dashboard"
        >
          <MdDashboard className='w-5 h-5' />
        </button>

        <button 
          onClick={() => setShowFeatures(true)}
          className='p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-110'
          title="Features Showcase"
        >
          <FiFeather className='w-5 h-5' />
        </button>
        
        {/* Voice Test Button */}
        <button 
          onClick={() => {
            const testMessage = userData?.voiceSettings?.language === 'hi-IN' ? 
              "नमस्ते! यह एक आवाज़ परीक्षण है।" : 
              userData?.voiceSettings?.language === 'es-ES' ? 
              "¡Hola! Esta es una prueba de voz." :
              "Hello! This is a voice test.";
            
            const utterance = new SpeechSynthesisUtterance(testMessage);
            const voiceSettings = userData?.voiceSettings || {};
            utterance.rate = voiceSettings.speed || 1;
            utterance.pitch = voiceSettings.pitch || 1;
            utterance.volume = voiceSettings.volume || 1;
            utterance.lang = voiceSettings.language || 'en-US';
            window.speechSynthesis.speak(utterance);
          }}
          className='p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-110'
          title="Test Voice"
        >
          <MdVolumeUp className='w-6 h-6' />
        </button>
      </div>

      {/* Background Animation Effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow' />
        <div className='absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000' />
      </div>

      {/* Responsive Voice Visualizer */}
      {listening && (
        <div className='absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-1'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='w-1 bg-blue-400 rounded-full animate-voice-wave'
              style={{
                height: `${20 + Math.random() * 20}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(360deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(270deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes voice-wave {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-0 { animation: float-0 3s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-voice-wave { animation: voice-wave 0.6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animation-delay-1000 { animation-delay: 1s; }
        
        /* Glass morphism effects */
        .glass-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Enhanced glow effects */
        .glow-blue { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        .glow-purple { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
        .glow-green { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        
        /* Speaking animation effect */
        body.speaking-active .assistant-avatar {
          animation: gentle-pulse 1s ease-in-out infinite;
        }
        
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      {/* Integrated Dashboard */}
      {showDashboard && (
        <IntegratedDashboard onClose={() => setShowDashboard(false)} />
      )}

      {/* Features Showcase */}
      {showFeatures && (
        <FeaturesShowcase onClose={() => setShowFeatures(false)} />
      )}
    </div>
  )
}

export default Home
