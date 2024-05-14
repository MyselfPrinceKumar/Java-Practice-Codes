
public class Reverse_Array {
    public static void main(String[] args) {
        int[] arr = { 12, 24, 36, 48, 60, 72, 84 };
        int low = 0;
        int high = arr.length - 1;
        int temp = 0;
        while (low < high) {
            temp = arr[low];
            arr[low] = arr[high];
            arr[high] = temp;
            low++;
            high--;
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
