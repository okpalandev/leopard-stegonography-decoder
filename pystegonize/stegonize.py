import random
from string import ascii_lowercase, ascii_uppercase
from PIL import Image
import argparse

class CrypticStateMachine:
    def __init__(self):
        self.states = [chr(65 + i) for i in range(26)] # Generate 26 states from A to Z
        self.transitions = self.compute_transitions()

    def compute_transitions(self):
        transitions = {}
        # Generate transition labels using both lowercase and uppercase ASCII characters
        labels = ascii_lowercase + ascii_uppercase
        # Create transitions for each state
        for state in self.states:
            transitions[state] = {}
            for label in labels:
                transitions[state][label] = self.get_next_state(label)
        return transitions

    def get_next_state(self, label):
        # Get the index of the label in the alphabet
        index = ascii_lowercase.find(label.lower())
        # Calculate the next state based on the index
        return self.states[index % len(self.states)]

    def process_message(self, message):
        current_state = 'A'
        hidden_message = ""
        for char in message:
            # Encode characters to lowercase ASCII letters
            char = chr(((ord(char.lower()) - ord('a')) % 26) + ord('a'))
            next_state = self.transitions[current_state][char]
            hidden_message += next_state  # Append the next state to the hidden message
            current_state = next_state
        return hidden_message

    def decode_message(self, hidden_message):
        current_state = 'A'
        decoded_message = ""
        for state in hidden_message:
            # Append the transition labels directly to the decoded message
            decoded_message += state
            current_state = self.transitions[current_state][state]
        return decoded_message

class Steganography:
    def __init__(self):
        self.output_path = None
        self.cryptic_state_machine = CrypticStateMachine()

    def hide_message(self, image_path, message):
        # Encrypt the message using CrypticStateMachine
        encrypted_message = self.cryptic_state_machine.process_message(message)

        # Convert encrypted message to binary
        binary_message = ''.join(format(ord(char), '08b') for char in encrypted_message)

        # Open the image
        img = Image.open(image_path)

        # Get the width and height of the image
        width, height = img.size

        # Check if the message can fit in the image
        if len(binary_message) > width * height * len(img.getbands()):
            raise ValueError("Message is too long to hide in the image")

        # Counter for the bits of the message
        bit_count = 0

        # Get pixel data
        pixels = list(img.getdata())

        # Shuffle the message within the image data
        random.seed(42)  # Seed for reproducibility
        random.shuffle(pixels)

        # Iterate over each pixel
        for i, pixel in enumerate(pixels):
            # Convert the pixel to a list so it's mutable
            pixel = list(pixel)

            # Modify the least significant bit of each color channel
            for j in range(len(pixel)):
                if bit_count < len(binary_message):
                    pixel[j] = pixel[j] & ~1 | int(binary_message[bit_count])
                    bit_count += 1

            # Update the pixel data
            pixels[i] = tuple(pixel)

        # Put the modified pixels back into the image
        img.putdata(pixels)

        # Save the modified image to the output path
        output_file = self.output_path if self.output_path else "encoded_image.png"
        img.save(output_file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hide a message within an image.")
    parser.add_argument("image", help="Path to the input image")
    parser.add_argument("message", help="Message to hide")
    parser.add_argument("--output", help="Path to the output image (default: encoded_image.png)")
    args = parser.parse_args()

    steganography = Steganography()
    if args.output:
        steganography.set_output_path(args.output)
    steganography.hide_message(args.image, args.message)
    print("Message hidden successfully")

    # Reveal the message
    encoded_image_path = args.output if args.output else "encoded_image.png"
    message = Steganography.reveal_message(encoded_image_path)