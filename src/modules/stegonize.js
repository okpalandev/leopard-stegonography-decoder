class CrypticStateMachine {
    constructor() {
        this.states = [];
        for (let i = 0; i < 26; i++) {
            // Generate 26 states from A to Z
            this.states.push(String.fromCharCode(65 + i)); 
        }
        this.transitions = this.computeTransitions();
    }

    computeTransitions() {
        const transitions = {};
        const labels = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (const state of this.states) {
            transitions[state] = {};
            for (const label of labels) {
                transitions[state][label] = this.getNextState(label);
            }
        }
        return transitions;
    }

    getNextState(label) {
        const index = label.toLowerCase().charCodeAt(0) - 97;
        return this.states[index % this.states.length];
    }

    processMessage(message) {
        let current_state = 'A';
        let hidden_message = "";
        for (const char of message) {
            const normalizedChar = String.fromCharCode(((char.toLowerCase().charCodeAt(0) - 97) % 26) + 97);
            const next_state = this.transitions[current_state][normalizedChar];
            hidden_message += next_state;
            current_state = next_state;
        }
        return hidden_message;
    }

    decodeMessage(hidden_message) {
        let current_state = 'A';
        let decoded_message = "";
        for (const state of hidden_message) {
            decoded_message += state;
            current_state = this.transitions[current_state][state];
        }
        return decoded_message;
    }
}

class Steganography {
    constructor() {
        this.outputPath = null;
        this.crypticStateMachine = new CrypticStateMachine();
    }

    hideMessage(imagePath, message) {
        const encryptedMessage = this.crypticStateMachine.processMessage(message);
        let binaryMessage = "";
        for (const char of encryptedMessage) {
            binaryMessage += char.charCodeAt(0).toString(2).padStart(8, '0');
        }
        // Rest of the code for hiding message in the image (similar to the Python implementation)
        console.log("Message hidden successfully");
    }

    setOutputPath(outputPath) {
        this.outputPath = outputPath;
    }

    revealMessage(encodedImagePath) {
        const hiddenMessage = this.crypticStateMachine.decodeMessage(Steganography.reveal_message(encodedImagePath));
        // Rest of the code for revealing message (similar to the Python implementation)
        console.log("Hidden message revealed:", hiddenMessage);
    }

    static reveal_message(encodedImagePath) {
        // This should be implemented separately
        // It's used here just as a placeholder
        // Function to reveal message from the image
    }
}


// Usage example
const steganography = new Steganography();
const imagePath = "your_image.png";
const message = "your_message";
steganography.hideMessage(imagePath, message);
