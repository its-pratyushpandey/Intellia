import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"
export const getCurrentUser=async (req,res)=>{
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(401).json({message: "Unauthorized: No user ID found"})
        }

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        return res.status(200).json(user)     
    } catch (error) {
        console.error('Get current user error:', error)
        return res.status(500).json({message: "Failed to retrieve user information"}) 
    }
}

export const updateAssistant=async (req,res)=>{
   try {
      const {assistantName,imageUrl}=req.body
      let assistantImage;

      if(req.file){
         try {
            assistantImage = await uploadOnCloudinary(req.file.path)
         } catch (uploadError) {
            console.error('Image upload failed:', uploadError)
            return res.status(500).json({message: "Failed to upload image. Please try again."})
         }
      } else {
         assistantImage = imageUrl
      }

      const user = await User.findByIdAndUpdate(req.userId, {
         assistantName, assistantImage
      }, {new: true}).select("-password")

      if (!user) {
         return res.status(404).json({message: "User not found"})
      }

      return res.status(200).json(user)
      
   } catch (error) {
       console.error('Update assistant error:', error)
       return res.status(500).json({message: "Failed to update assistant settings"}) 
   }
}


export const askToAssistant=async (req,res)=>{
   try {
      const {command}=req.body
      
      // Validate input
      if (!command || typeof command !== 'string' || command.trim().length === 0) {
         return res.status(400).json({
            type: "general",
            userInput: command || "",
            response: "Please provide a valid command.",
            emotion: 'neutral',
            confidence: 1.0,
            language: 'en-US',
            intent: 'validation_error',
            sentiment: 'neutral'
         })
      }

      const user = await User.findById(req.userId);
      if (!user) {
         return res.status(404).json({
            type: "general",
            userInput: command,
            response: "User session expired. Please sign in again.",
            emotion: 'neutral',
            confidence: 1.0,
            language: 'en-US',
            intent: 'auth_error',
            sentiment: 'neutral'
         })
      }

      // Save command to history
      user.history.push(command)
      await user.save()
      
      const userName = user.name
      const assistantName = user.assistantName || 'Assistant'
      
      // Pass complete user settings to gemini
      const userSettings = {
         voiceSettings: user.voiceSettings || {},
         nlpSettings: user.nlpSettings || {}
      }
      
      const result = await geminiResponse(command, assistantName, userName, userSettings)

      const jsonMatch = result.match(/{[\s\S]*}/)
      if (!jsonMatch) {
         console.log("Invalid Gemini response format:", result)
         return res.status(200).json({
            type: "general",
            userInput: command,
            response: "I understand you're trying to communicate with me. Could you please rephrase your request?",
            emotion: 'helpful',
            confidence: 0.8,
            language: user.voiceSettings?.language || 'en-US',
            intent: 'clarification',
            sentiment: 'neutral'
         })
      }
      
      let gemResult
      try {
         gemResult = JSON.parse(jsonMatch[0])
      } catch (parseError) {
         console.log("JSON parse error:", parseError)
         return res.status(200).json({
            type: "general",
            userInput: command,
            response: "I'm having trouble understanding that request. Please try again.",
            emotion: 'apologetic',
            confidence: 0.7,
            language: user.voiceSettings?.language || 'en-US',
            intent: 'error',
            sentiment: 'neutral'
         })
      }
      
      console.log('Gemini Result:', gemResult)
      const type = gemResult.type

      switch(type){
         case 'get-date' :
            return res.json({
               type,
               userInput:gemResult.userInput,
               response:`current date is ${moment().format("YYYY-MM-DD")}`,
               emotion: gemResult.emotion || 'neutral',
               confidence: gemResult.confidence || 0.9,
               language: gemResult.language || user.voiceSettings?.language || 'en-US',
               intent: gemResult.intent || 'question',
               sentiment: gemResult.sentiment || 'neutral'
            });
            case 'get-time':
                return res.json({
               type,
               userInput:gemResult.userInput,
               response:`current time is ${moment().format("hh:mm A")}`,
               emotion: gemResult.emotion || 'neutral',
               confidence: gemResult.confidence || 0.9,
               language: gemResult.language || user.voiceSettings?.language || 'en-US',
               intent: gemResult.intent || 'question',
               sentiment: gemResult.sentiment || 'neutral'
            });
             case 'get-day':
                return res.json({
               type,
               userInput:gemResult.userInput,
               response:`today is ${moment().format("dddd")}`,
               emotion: gemResult.emotion || 'neutral',
               confidence: gemResult.confidence || 0.9,
               language: gemResult.language || user.voiceSettings?.language || 'en-US',
               intent: gemResult.intent || 'question',
               sentiment: gemResult.sentiment || 'neutral'
            });
            case 'get-month':
                return res.json({
               type,
               userInput:gemResult.userInput,
               response:`today is ${moment().format("MMMM")}`,
               emotion: gemResult.emotion || 'neutral',
               confidence: gemResult.confidence || 0.9,
               language: gemResult.language || user.voiceSettings?.language || 'en-US',
               intent: gemResult.intent || 'question',
               sentiment: gemResult.sentiment || 'neutral'
            });
      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case  "calculator-open":
      case "instagram-open": 
       case "facebook-open": 
       case "weather-show" :
       case "multi-step":
       case "emotional-support":
       case "language-switch":
       case "learning-interaction":
       case "proactive-suggestion":
         return res.json({
            type,
            userInput:gemResult.userInput,
            response:gemResult.response,
            emotion: gemResult.emotion || 'neutral',
            confidence: gemResult.confidence || 0.8,
            language: gemResult.language || user.voiceSettings?.language || 'en-US',
            intent: gemResult.intent || 'general',
            sentiment: gemResult.sentiment || 'neutral',
            context_used: gemResult.context_used || false,
            suggestions: gemResult.suggestions || []
         });

         default:
            return res.status(400).json({ 
               response: "I didn't understand that command.",
               emotion: 'neutral',
               confidence: 0.3,
               language: user.voiceSettings?.language || 'en-US',
               intent: 'unknown',
               sentiment: 'neutral'
            })
      }
     

   } catch (error) {
      console.error("Assistant error:", error)
      return res.status(200).json({ 
         type: "general",
         userInput: req.body.command || "unknown",
         response: "I'm experiencing a temporary issue. I'm still here and ready to help you with your next request.",
         emotion: 'reassuring',
         confidence: 0.9,
         language: 'en-US',
         intent: 'error',
         sentiment: 'neutral',
         suggestions: ["Try again", "Speak clearly", "Check microphone"]
      })
   }
}

export const updateUserSettings = async (req, res) => {
   try {
      const { voiceSettings, nlpSettings } = req.body
      
      // Validate input
      if (!voiceSettings && !nlpSettings) {
         return res.status(400).json({ message: "No settings provided to update" })
      }
      
      const updateData = {}
      if (voiceSettings) {
         // Validate voice settings if needed
         updateData.voiceSettings = voiceSettings
      }
      if (nlpSettings) {
         // Validate nlp settings if needed
         updateData.nlpSettings = nlpSettings
      }

      const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password")
      
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      console.log('User settings updated successfully for user:', req.userId)
      return res.status(200).json(user)
      
   } catch (error) {
       console.error('Update user settings error:', error)
       return res.status(500).json({ message: "Failed to update user settings" }) 
   }
}