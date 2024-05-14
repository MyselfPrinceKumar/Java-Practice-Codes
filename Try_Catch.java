import java.util.Scanner;

import java.util.Scanner;

public class Try_Catch {
    public static void main(String[] args) {
        int[] arr = { 12, 24, 34, 56, 78, 90 };
        int temp;
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the Array index");
        int ind = sc.nextInt();
        // ind=arr[ind];
        System.out.println("Enter the number form which divide array index");
        int number = sc.nextInt();
        // reversing an array elements
        int n = Math.floorDiv(arr.length, 2);
        for (int i = 0; i < n; i++) {
            // System.out.println(arr[i]);
            temp = arr[i];
            arr[i] = arr[arr.length - i - 1];
            arr[arr.length - i - 1] = temp;
        }
        System.out.println("the Reversed Array is: ");
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
        try {
            System.out.println("The Value of arr_index/number is: " + arr[ind] / number);
            // System.out.println("The Value of arr_index is: "+ind / number);
        }

        catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("we can't run because array_index are out of bound see below");
            System.out.println(e);
        } catch (ArithmeticException e) {
            System.out.println("we can't run because arithmetic exception are occues see below");
            System.out.println(e);
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println("we can't run because some other exceptions are occurs see below");
            // System.out.println(e);
            System.out.println(e);
        }
    }
}
