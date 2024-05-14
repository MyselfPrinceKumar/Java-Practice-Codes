public class String_Permutation {

    // Print all the permutations of a Strings.
    public static void printCombination(String str, String combinations) {
        if (str.length() == 0) {
            System.out.println(combinations);
            return;
        }
        for (int i = 0; i < str.length(); i++) {
            char currChar = str.charAt(i);
            String letftStr = str.substring(0, i);
            String rightStr = str.substring(i + 1);
            String result = letftStr + rightStr;
            printCombination(result, combinations + currChar);
        }
    }

    public static void main(String[] args) {
        String str = "ABCD";
        printCombination(str, " ");
    }
}
