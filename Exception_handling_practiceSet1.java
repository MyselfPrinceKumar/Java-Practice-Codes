/*
Problem-1. Write java program to Demonstrate Syntax,Logical and Runtime Errors
 */
public class Exception_handling_practiceSet1 {
    public static void main(String[] args) {
        // // syntax error
        // int a = 23;
        // b = 54;
        // int c=33
        // int sum = a + b + c;
        // System.out.println("the sum of three number is: " + c);
        /*
         * int gives 2 Syntax error
         * 1->variable b is not declared
         * 2->missed semocolon at line no 6
         */
        // Logical Error
        // int a = 23;
        // int b = 54;
        // int c = 33;
        // int sum = a + b * c;
        // System.out.println("the sum of three number is: " + sum);
        // /*
        // It gives logical error because formula of sum=a+b+c
        // Logical Error are Handled by the users
        // */
        // Runtime Error
        int a = 23;
        int b = 0;
        int result = a / b;
        System.out.println("the sum of three number is: " + result);
        /*
         * It gives Runtime error because we can't divide to any number by 0
         * it gives the Arithmetic Exception which is called Runtime Error
         */
    }
}
