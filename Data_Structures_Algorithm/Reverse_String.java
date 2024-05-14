// public class Reverse_String {
//     public static void main(String[] args) {
//         String str = "prince";
//         // for (int index = 0; index < str.length(); index++) {
//         // System.out.println(str.charAt(index));
//         // }
//         How to reverse a string
//         for (int index = str.length() - 1; index >= 0; index--) {
//             System.out.print(str.charAt(index));
//         }
//     }
// }

// by using Recursion
public class Reverse_String {
    public static void reverse(String str, int index) {
        if (index < 0) {
            return;
        } else {
            System.out.print(str.charAt(index));
            reverse(str, index - 1);

        }
    }

    public static void main(String[] args) {
        String str = "Prinasioenoqwefbebbbduayewbfuywbweffuqvce";
        reverse(str, str.length() - 1);
        // Below code gives last and first index of a character

        // System.out.println(str.lastIndexOf("e"));
        // System.out.println(str.indexOf("e"));
    }
}
