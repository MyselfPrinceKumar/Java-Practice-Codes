import java.util.Scanner;
public class array_practiceset {
    public static void main(String[] args) {
        float[] arr={12.5f,45.5f,88.8f,56.9f,99.2f};
        // float number;
        // float sum=0;
        // for (int i = 0; i < arr.length; i++) {
        //     sum=sum+arr[i];
        //     System.out.println("the array elements is: "+arr[i]);
        // }
        // System.out.println(sum);
        float number;
        
        Scanner sc=new Scanner(System.in);
        System.out.println("enter the number");
        number=sc.nextFloat();
        boolean b=false;
        for (int i = 0; i < arr.length; i++) {
            
            // System.out.println(sc.hasNextFloat());
            if (number==arr[i]) {
                // System.out.println("the floating number is lies in the array");
                b=true;
                break;
               
            }
            else{
                // System.out.println("number not present in the array");
                b=false;
                
            }
        }
            if (b) {
                System.out.println("the floating number is lies in the array");

            }
            else{
                System.out.println("number not present in the array");
            }
        
        
    }
}
