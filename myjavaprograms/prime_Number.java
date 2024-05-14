public class prime_Number {
    public static void isPrime(int num) {
        // Find Weather a number is prime or not
        for (int i = 2; i*i <= num; i++) {
            if (num % i == 0) {
                System.out.println("It is not Prime Number");
                return;
            }
        }
    }

    public static void main(String[] args) {
        int num = 12;
        isPrime(num);
    }
}