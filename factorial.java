import java.util.Scanner;
public class factorial {
    public static int factorial(int num){
        if (num==0) {
            return 0;
        }
        else if (num==1) {
            return 1;
        }
        else{
            return (num*factorial(num-1));
        }
    }
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.println("enter the number");
        int number=sc.nextInt();
        System.out.println(factorial(number));
    }
}
