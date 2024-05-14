import java.util.Scanner;

public class main {

    // Method to encrypt the message
    public static String encrypt(String message, int key) {
        String result = "";
        for (int i = 0; i < message.length(); i++) {
            char ch = message.charAt(i);
            if (Character.isUpperCase(ch)) {
                result += (char) ((ch + key - 65) % 26 + 65);
            } else {
                result += (char) ((ch + key - 97) % 26 + 97);
            }
        }
        return result;
    }

    // Method to decrypt the message
    public static String decrypt(String message, int key) {
        String result = "";
        for (int i = 0; i < message.length(); i++) {
            char ch = message.charAt(i);
            if (Character.isUpperCase(ch)) {
                result += (char) ((ch - key - 65 + 26) % 26 + 65);
            } else {
                result += (char) ((ch - key - 97 + 26) % 26 + 97);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the message to be encrypted:");
        String message = scanner.nextLine();
        System.out.println("Enter the encryption key (an integer between 1 and 25):");
        int key = scanner.nextInt();
        String encryptedMessage = encrypt(message, key);
        System.out.println("Encrypted message: " + encryptedMessage);
        String decryptedMessage = decrypt(encryptedMessage, key);
        System.out.println("Decrypted message: " + decryptedMessage);
    }
}
