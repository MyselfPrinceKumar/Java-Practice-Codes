import java.util.Scanner;

public class tryCatchQuiz {
    public static void main(String[] args) {
        int[] arr = { 12, 24, 34, 56, 78, 90 };
        Scanner sc = new Scanner(System.in);
        int ind = 0;
        while (ind < arr.length) {
            try {
                System.out.println("enter the Array index");
                ind = sc.nextInt();
                for (int i = 0; i < arr.length; i++) {
                    System.out.println(arr[i]);
                }
            } catch (Exception e) {
                System.out.println(e);
            }

        }
        if (ind > arr.length) {
            try {
                System.out.println(arr[ind] + "this index is out of bound");
            } catch (Exception e) {
                System.out.println(e);
            }
        }

    }

}
