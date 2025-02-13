import EventEmitter from 'eventemitter3';

type ErrorEvent = {
    type: 'error' | 'warning';
    message: string;
};

class ErrorEmitter extends EventEmitter {
    emitError(message: string) {
        this.emit('showMessage', { type: 'error', message });
    }

    emitWarning(message: string) {
        this.emit('showMessage', { type: 'warning', message });
    }
}

// Singleton instance
export const errorEmitter = new ErrorEmitter();
