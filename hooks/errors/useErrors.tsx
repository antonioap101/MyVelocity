import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {errorEmitter} from "@/domain/EventEmitter";


// Context for managing errors and warnings
const ErrorWarningContext = createContext({
    message: '',
    visible: false,
    showError: (msg: string) => {},
    hideError: () => {},
});

// Hook to use the error and warning context
export function useErrorsAndWarnings() {
    return useContext(ErrorWarningContext);
}

// Provider component
export const ErrorWarningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const showError = (msg: string) => {
        setMessage(msg);
        setVisible(true);
    };

    const hideError = () => {
        setVisible(false);
        setMessage('');
    };

    useEffect(() => {
        const handleMessage = (event: { type: 'error' | 'warning'; message: string }) => {
            showError(event.message);
        };

        errorEmitter.on('showMessage', handleMessage);

        return () => {
            errorEmitter.off('showMessage', handleMessage);
        };
    }, []);

    const contextValue = {
        message,
        visible,
        showError,
        hideError,
    };

    return (
        <ErrorWarningContext.Provider value={contextValue}>
            {children}
        </ErrorWarningContext.Provider>
    );
};
