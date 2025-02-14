// jest.setup.js

// Mock AsyncStorage
import mockAccelerometerData from "./tests/mockAccelerometerData";

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

// Mock Accelerometer using the extracted callback
jest.mock('expo-sensors', () => ({
    Accelerometer: {
        setUpdateInterval: jest.fn(),
        addListener: mockAccelerometerData,
    },
}));
