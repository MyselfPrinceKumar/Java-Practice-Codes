public class selectionSort_Practice {
    public static void main(String[] args) {
        int[] arr = { 7, 8, 3, 1, 2, 23, 34, 3, 4, 5, 6, 7, 7, 7, 6, 5, 4, 343, 3, 3, 4, 5, 6, 23, 6, 6, 6, 6, 1212, 6,
                6, 6, 6, 121212, 89, 89, 98, 87, 67, 67, 65, 5, 54, 54, 4, 3 };
        for (int i = 0; i < arr.length ; i++) {
            int small = i;
            for (int j = i+1; j < arr.length; j++) {
                if (arr[j] < arr[small]) {
                    small = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[small];
            arr[small] = temp;
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
