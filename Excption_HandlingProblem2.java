import java.util.Scanner;
/*
 Proble->2.
 Write a java program to print haha when the arithmetic Exceptions are occured
 and if illegal arguments Exceptions are occured then pront hehe
 */
public class Excption_HandlingProblem2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the first number");
        int a = sc.nextInt();
        System.out.println("Enter the Second number");
        int b = sc.nextInt();
        // int c = a / b;
        try {
            int c = a / b;
            System.out.println("the value of a/b is:" + c);
        } catch (IllegalArgumentException e) {
            System.out.println("He He there are  IllegalArgumentException exception are occured");
            System.out.println(e);
        } catch (ArithmeticException e) {
            // TODO: handle exception
            System.out.println("Ha Ha there are Arithmetic Exception");
            System.out.println(e);
        }

    }
}
