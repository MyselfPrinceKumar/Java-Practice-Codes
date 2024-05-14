
import java.util.Scanner;

public class Fibbonacci_Series {
    public static void main(String[] args) {
        int f1 = 1;
        int f2 = 1;
        System.out.println("Enter number ");
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            System.out.println(f1);
            int next = f1 + f2;
            f1 = f2;
            f2 = next;
        }
    }
}
