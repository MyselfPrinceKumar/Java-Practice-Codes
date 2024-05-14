import java.util.HashSet;

//The problem is to print all the unique subsequences of a String ;
//This problem is based on the previous problem
public class Unique_Subsequences {
    public static void UniqueSub(String str, int index, String newStr, HashSet<String> set) {

        if (index == str.length()) {
            if (set.contains(newStr)) {
                // Means if the character is exists in the newstr then
                // It does not print anything
                return;
            } else {
                set.add(newStr);
                System.out.println(newStr);
                return;
            }
        }
        // to be
        UniqueSub(str, index + 1, newStr + str.charAt(index), set);

        // to not be
        UniqueSub(str, index + 1, newStr, set);
    }

    public static void main(String[] args) {
        HashSet<String> set = new HashSet<>();
        // String str = "ABC";
        String str = "AAA";
        UniqueSub(str, 0, "", set);
    }
}
