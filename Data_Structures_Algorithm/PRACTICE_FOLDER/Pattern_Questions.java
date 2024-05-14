import java.util.Scanner;

public class Pattern_Questions {
    public static void main(String[] args) {
        System.out.println("Enter the number");
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        for (int symbol = 1; symbol <= num; symbol++) {
            int space = num - symbol;
            for (int i = 0; i < space; i++) {
                System.out.print(" ");
            }
            for (int i = 0; i < symbol; i++) {
                System.out.print("*");
            }
            // for (int i = 0; i < space; i++) {
            // System.out.print(" ");
            // }
            System.out.println();
        }
    }
}