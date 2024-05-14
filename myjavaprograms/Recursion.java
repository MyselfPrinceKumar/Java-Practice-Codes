// sum of n naturals numbers
// public class Recursion {
//     public static int sumNumbs(int n) {
//         if (n != 0) {
//             return n + sumNumbs(n - 1);
//         }

//         else {
//             return n;
//         }

//     }

//     public static void main(String[] args) {
//         int sum = sumNumbs(7);
//         System.out.println("The sum is :" + sum);
//     }
// }
//sum of factorial n
public class Recursion {
    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        } else if (n == 1) {
            return 1;
        }

        else {
            return n * factorial(n - 1);
        }

    }

    public static void main(String[] args) {
        int fact = factorial(6);
        System.out.println("The factorial is :" + fact);
    }
}
