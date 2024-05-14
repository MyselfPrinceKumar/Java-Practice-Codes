public class Remove_Duplicates_String {
    public static boolean[] map = new boolean[26];

    public static void Remove_Duplicate(String str, int index, String newStr) {
        
        if (index==str.length()) {
            System.out.println(newStr);
            return;
        }
        char currChar = str.charAt(index);
        if (map[currChar - 'a']) {
            Remove_Duplicate(str, index + 1, newStr);
        } else {
            newStr += currChar;
            map[currChar - 'a'] = true;
            Remove_Duplicate(str, index + 1, newStr);
        }
    }

    public static void main(String[] args) {
          String str="aabcbbdd";
          Remove_Duplicate(str, 0, "");
    }
}
