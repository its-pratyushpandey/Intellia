import cron from 'node-cron'

class SmartHomeService {
    constructor() {
        this.devices = new Map()
        this.automationRules = []
        this.schedules = new Map()
        this.initializeDefaultDevices()
    }

    // Initialize default smart home devices
    initializeDefaultDevices() {
        const defaultDevices = [
            {
                id: 'living-room-light',
                name: 'Living Room Light',
                type: 'light',
                room: 'living-room',
                state: false,
                brightness: 80,
                color: '#ffffff'
            },
            {
                id: 'bedroom-light',
                name: 'Bedroom Light',
                type: 'light',
                room: 'bedroom',
                state: false,
                brightness: 60,
                color: '#ffffff'
            },
            {
                id: 'kitchen-light',
                name: 'Kitchen Light',
                type: 'light',
                room: 'kitchen',
                state: false,
                brightness: 90,
                color: '#ffffff'
            },
            {
                id: 'thermostat',
                name: 'Main Thermostat',
                type: 'thermostat',
                room: 'living-room',
                temperature: 22,
                targetTemperature: 22,
                mode: 'auto'
            },
            {
                id: 'front-door-lock',
                name: 'Front Door Lock',
                type: 'lock',
                room: 'entrance',
                state: true, // locked
                batteryLevel: 85
            },
            {
                id: 'security-camera',
                name: 'Front Door Camera',
                type: 'camera',
                room: 'entrance',
                state: true, // recording
                motionDetected: false
            }
        ]

        defaultDevices.forEach(device => {
            this.devices.set(device.id, device)
        })
    }

    // Control light devices
    controlLight(deviceId, action, value = null) {
        try {
            const device = this.devices.get(deviceId)
            if (!device || device.type !== 'light') {
                return { success: false, message: 'Light not found' }
            }

            switch (action) {
                case 'turn_on':
                case 'on':
                    device.state = true
                    break
                case 'turn_off':
                case 'off':
                    device.state = false
                    break
                case 'toggle':
                    device.state = !device.state
                    break
                case 'brightness':
                    if (value && value >= 0 && value <= 100) {
                        device.brightness = value
                        device.state = true // Turn on when setting brightness
                    }
                    break
                case 'color':
                    if (value && typeof value === 'string') {
                        device.color = value
                        device.state = true
                    }
                    break
                default:
                    return { success: false, message: 'Unknown action' }
            }

            this.devices.set(deviceId, device)
            return { 
                success: true, 
                message: `${device.name} ${action} successful`,
                device: device
            }
        } catch (error) {
            console.error('Light control error:', error)
            return { success: false, message: 'Error controlling light' }
        }
    }

    // Control thermostat
    controlThermostat(deviceId, action, value = null) {
        try {
            const device = this.devices.get(deviceId)
            if (!device || device.type !== 'thermostat') {
                return { success: false, message: 'Thermostat not found' }
            }

            switch (action) {
                case 'set_temperature':
                    if (value && value >= 10 && value <= 35) {
                        device.targetTemperature = value
                    }
                    break
                case 'mode':
                    if (['heat', 'cool', 'auto', 'off'].includes(value)) {
                        device.mode = value
                    }
                    break
                case 'increase':
                    device.targetTemperature = Math.min(device.targetTemperature + 1, 35)
                    break
                case 'decrease':
                    device.targetTemperature = Math.max(device.targetTemperature - 1, 10)
                    break
                default:
                    return { success: false, message: 'Unknown thermostat action' }
            }

            this.devices.set(deviceId, device)
            return { 
                success: true, 
                message: `Thermostat ${action} successful`,
                device: device
            }
        } catch (error) {
            console.error('Thermostat control error:', error)
            return { success: false, message: 'Error controlling thermostat' }
        }
    }

    // Control locks
    controlLock(deviceId, action) {
        try {
            const device = this.devices.get(deviceId)
            if (!device || device.type !== 'lock') {
                return { success: false, message: 'Lock not found' }
            }

            switch (action) {
                case 'lock':
                    device.state = true
                    break
                case 'unlock':
                    device.state = false
                    break
                case 'toggle':
                    device.state = !device.state
                    break
                default:
                    return { success: false, message: 'Unknown lock action' }
            }

            this.devices.set(deviceId, device)
            return { 
                success: true, 
                message: `${device.name} ${action} successful`,
                device: device
            }
        } catch (error) {
            console.error('Lock control error:', error)
            return { success: false, message: 'Error controlling lock' }
        }
    }

    // Get all devices
    getAllDevices() {
        return Array.from(this.devices.values())
    }

    // Get devices by room
    getDevicesByRoom(room) {
        return Array.from(this.devices.values()).filter(device => device.room === room)
    }

    // Get devices by type
    getDevicesByType(type) {
        return Array.from(this.devices.values()).filter(device => device.type === type)
    }

    // Parse voice commands for smart home control
    parseSmartHomeCommand(command) {
        const lowerCommand = command.toLowerCase()
        
        // Light control patterns
        const lightPatterns = {
            'turn on': /turn on (?:the )?(.+?)(?:\s|$)/i,
            'turn off': /turn off (?:the )?(.+?)(?:\s|$)/i,
            'dim': /dim (?:the )?(.+?)(?:\s|$)/i,
            'brighten': /brighten (?:the )?(.+?)(?:\s|$)/i,
            'set brightness': /set (?:the )?(.+?) (?:brightness )?to (\d+)/i
        }

        // Thermostat patterns
        const thermostatPatterns = {
            'set temperature': /set (?:the )?temperature to (\d+)/i,
            'increase temperature': /(?:increase|raise) (?:the )?temperature/i,
            'decrease temperature': /(?:decrease|lower) (?:the )?temperature/i
        }

        // Lock patterns
        const lockPatterns = {
            'lock': /lock (?:the )?(.+?)(?:\s|$)/i,
            'unlock': /unlock (?:the )?(.+?)(?:\s|$)/i
        }

        // Check light commands
        for (const [action, pattern] of Object.entries(lightPatterns)) {
            const match = command.match(pattern)
            if (match) {
                const deviceName = match[1] ? match[1].trim() : null
                const value = match[2] ? parseInt(match[2]) : null
                
                return {
                    type: 'light',
                    action: action === 'dim' ? 'brightness' : 
                           action === 'brighten' ? 'brightness' : 
                           action.replace(' ', '_'),
                    device: this.findDeviceByName(deviceName, 'light'),
                    value: action === 'dim' ? 30 : 
                          action === 'brighten' ? 80 : value
                }
            }
        }

        // Check thermostat commands
        for (const [action, pattern] of Object.entries(thermostatPatterns)) {
            const match = command.match(pattern)
            if (match) {
                const value = match[1] ? parseInt(match[1]) : null
                
                return {
                    type: 'thermostat',
                    action: action.replace(' ', '_'),
                    device: this.findDeviceByType('thermostat'),
                    value: value
                }
            }
        }

        // Check lock commands
        for (const [action, pattern] of Object.entries(lockPatterns)) {
            const match = command.match(pattern)
            if (match) {
                const deviceName = match[1] ? match[1].trim() : 'door'
                
                return {
                    type: 'lock',
                    action: action,
                    device: this.findDeviceByName(deviceName, 'lock'),
                    value: null
                }
            }
        }

        return null
    }

    // Find device by name and type
    findDeviceByName(name, type = null) {
        if (!name) return null
        
        const devices = Array.from(this.devices.values())
        return devices.find(device => {
            const nameMatch = device.name.toLowerCase().includes(name.toLowerCase())
            const typeMatch = !type || device.type === type
            return nameMatch && typeMatch
        })
    }

    // Find first device by type
    findDeviceByType(type) {
        const devices = Array.from(this.devices.values())
        return devices.find(device => device.type === type)
    }

    // Execute smart home command
    executeCommand(parsedCommand) {
        if (!parsedCommand || !parsedCommand.device) {
            return { success: false, message: 'Device not found or command not recognized' }
        }

        const { type, action, device, value } = parsedCommand

        switch (type) {
            case 'light':
                return this.controlLight(device.id, action, value)
            case 'thermostat':
                return this.controlThermostat(device.id, action, value)
            case 'lock':
                return this.controlLock(device.id, action)
            default:
                return { success: false, message: 'Unsupported device type' }
        }
    }

    // Create automation rule
    createAutomationRule(name, trigger, actions) {
        const rule = {
            id: Date.now().toString(),
            name,
            trigger,
            actions,
            enabled: true,
            createdAt: new Date()
        }
        
        this.automationRules.push(rule)
        return rule
    }

    // Schedule device action
    scheduleAction(deviceId, action, cronExpression, value = null) {
        try {
            const scheduleId = `${deviceId}_${Date.now()}`
            
            const task = cron.schedule(cronExpression, () => {
                const device = this.devices.get(deviceId)
                if (device) {
                    switch (device.type) {
                        case 'light':
                            this.controlLight(deviceId, action, value)
                            break
                        case 'thermostat':
                            this.controlThermostat(deviceId, action, value)
                            break
                        case 'lock':
                            this.controlLock(deviceId, action)
                            break
                    }
                }
            }, {
                scheduled: false
            })

            this.schedules.set(scheduleId, {
                task,
                deviceId,
                action,
                value,
                cronExpression,
                createdAt: new Date()
            })

            task.start()
            
            return { success: true, scheduleId, message: 'Action scheduled successfully' }
        } catch (error) {
            console.error('Schedule action error:', error)
            return { success: false, message: 'Failed to schedule action' }
        }
    }

    // Get device status summary
    getStatusSummary() {
        const devices = this.getAllDevices()
        const summary = {
            total: devices.length,
            online: devices.length, // All mock devices are online
            lights: {
                total: devices.filter(d => d.type === 'light').length,
                on: devices.filter(d => d.type === 'light' && d.state).length
            },
            temperature: devices.find(d => d.type === 'thermostat')?.temperature || 'N/A',
            security: {
                locked: devices.filter(d => d.type === 'lock' && d.state).length,
                unlocked: devices.filter(d => d.type === 'lock' && !d.state).length
            }
        }
        
        return summary
    }
}

export default new SmartHomeService()
