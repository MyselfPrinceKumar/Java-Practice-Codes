public class String_Occurences {
    // public static int first = -1;
    // public static int last = -1;

    // The Problem is to find first and last occurences of a string .
    public static void String_Occr(String str, int index, char inputChar) {
        if (index == str.length()) {
            System.out.println(first);
            System.out.println(last);
            return;
        }

        if (str.charAt(index) == inputChar) {
            if (first == -1) {
                first = index;
            } else {
                last = index;
            }
        }
        String_Occr(str, index + 1, inputChar);
    }

    public static void main(String[] args) {
        String str = "ajwnfjwnlamadaefnwnaamoiena";
        String_Occr(str, 0, 'n');
    }
}