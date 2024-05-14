public class Subsequences_OfString {
    public static void SubSequences(String str, int index, String newStr) {

        // Base case
        if (index == str.length()) {
            System.out.println(newStr);
            return;
        }
        // To be
        SubSequences(str, index + 1, newStr + str.charAt(index));

        // To not be
        SubSequences(str, index + 1, newStr);
    }

    public static void main(String[] args) {
        String str = "ABC";
        SubSequences(str, 0, "");
    }
}
