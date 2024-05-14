public class bubbleSort_Practice {
    public static void main(String[] args) {
        int[] arr = { 7, 8, 3, 1, 2, 23, 34, 3, 4, 5, 6, 7, 7, 7, 6, 5, 4, 343, 3, 3, 4, 5, 6, 23, 6, 6, 6, 6, 1212, 6,
                6, 6, 6, 121212, 89, 89, 98, 87, 67, 3332, 67, 65, 5, 54, 54, 4, 3 };
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
