import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()
function UserContext({children}) {
    const serverUrl = "http://localhost:8000"
    const [userData, setUserData] = useState(null)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
                timeout: 10000 // 10 second timeout
            })
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log("Failed to get current user:", error.message)
            // Don't set userData to null here as it might interfere with authentication flow
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, 
                { command }, 
                { 
                    withCredentials: true,
                    timeout: 30000 // 30 second timeout for AI responses
                }
            )
            return result.data
        } catch (error) {
            console.log("Gemini response error:", error.message)
            throw error
        }
    }

    useEffect(() => {
        handleCurrentUser()
    }, [])
    
    const value = {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }
    
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext
