import java.util.Arrays;

public class sorting {
    public static void main(String[] args) {
        int[] arr = { 23, 56, 34, 67, 33, 1, 5, 3, 6 };
        // for (int i = 0; i < arr.length; i++) {
        // System.out.println(arr[i]);
        // // sort(originalArray, fromIndex, endIndex)
        // // System.out.println(sort(arr[i], arr[0], arr.length-1));
        // sort(arr[i], arr[0], arr.length-1);
        // }
        Arrays.sort(arr);
        System.out.println(Arrays.toString(arr));
    }

}
