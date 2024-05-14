public class String_Practice {
    public static void main(String[] args) {
        String str = "this is not Me   ";
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == "i") {
                return;
            }
        }
        System.out.println(str);
    }
}
