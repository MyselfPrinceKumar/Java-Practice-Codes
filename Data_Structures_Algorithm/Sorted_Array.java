public class Sorted_Array {

    public static boolean isSorted(int arr[], int index) {
        if (index == arr.length - 1) {
            return true;
        }

        if (arr[index] < arr[index + 1]) {
            return isSorted(arr, index + 1);
        } else {
            return false;
        }

    }

    public static void main(String[] args) {
        // Iterative Approach
        // int[] arr = { 2, 3, 4, 5, 6, 7, 7, 34, 56,32, 67 };
        // for (int i = 0; i < arr.length; i++) {
        // if (arr[i] > arr[i + 1]) {
        // System.out.println("Array is not sorted");
        // return;
        // }

        // }

        // Check this is strictly increasing and sorted array or not
        int[] arr = { 12, 34, 45, 67, 78 };
        System.out.println(isSorted(arr, 0));

    }
}
