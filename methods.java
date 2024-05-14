import java.util.Scanner;
public class methods {
    public static int sum(int a,int b){
        return (a+b);
    }
    public static void main(String[] args) {
        //  sum(12,34);
        Scanner sc=new Scanner(System.in);
        System.out.println("enter the first number");
        int x=sc.nextInt();
        System.out.println("enter the first number");
        int y=sc.nextInt();
        System.out.println(sum(x,y));
    }
}
