public class Keypad_Combination {
    // Print the Keypad Combination
    public static String Keypad[] = { ".", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tu", "vwx", "yz" };

    public static void Combinations(String str, int index, String Combination) {
        // here we take str as a number
        if (index == str.length()) {
            System.out.println(Combination);
            return;
        }

        String mapping = Keypad[str.charAt(index) - '0'];
        for (int i = 0; i < mapping.length(); i++) {
            Combinations(str, index + 1, Combination + mapping.charAt(i));
        }

    }

    public static void main(String[] args) {
        String str = "23";
        Combinations(str, 0, "");
    }
}
