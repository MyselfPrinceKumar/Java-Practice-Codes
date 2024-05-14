import java.util.Scanner;
public class method_pattern {
    public static void pattern(int num){
        for (int i = num; i > 0; i--) {
            for(int j=i;j>0;j--){
                System.out.print(" * ");
                // return 0;
            }
            System.out.print("\n");
        }
    
    }
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.println("enter the number ");
        int number =sc.nextInt();
        // System.out.println(pattern(number));
        pattern(number);
      }
}
