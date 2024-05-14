public class Move_String {
    // The problem is to move all the x last to the string
    public static void MoveAllX(String str, int index, int count, String newStr) {
        if (index == str.length()) {
            for (int i = 0; i < count; i++) {
                newStr += 'x';
            }
            System.out.println(newStr);
            return;
        }
        if (str.charAt(index) == 'x') {
            count++;
            MoveAllX(str, index + 1, count, newStr);
        } else {
            newStr += str.charAt(index);
            MoveAllX(str, index + 1, count, newStr);
        }
    }

    public static void main(String[] args) {
        String str = "axbcxxd";
        MoveAllX(str, 0, 0, "");
    }
}
