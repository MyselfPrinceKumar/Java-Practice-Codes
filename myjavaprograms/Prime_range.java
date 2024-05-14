public class Prime_range {
    public static boolean isPrime(int n) {
        for (int i = 2; i <= n - 1; i++) {
            if (n % i == 0) {
                // It returns true if the numbers non Prime numbers ex 2,4,6,8,9,10,12,14,15....
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 100;
        // Program to print prime numbers in between 10 to 100.
        for (int i = num1; i <= num2; i++) {
            if (!isPrime(i)) {
                System.out.println(i);
            }
        }
    }
}
