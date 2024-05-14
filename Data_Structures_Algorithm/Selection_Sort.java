public class Selection_Sort {
    public static void main(String[] args) {
        int arr[] = { 7, 18, 34, 56, 223, 5, 213, 273, 233, 45, 6, 3, 1, 2 };
        // Selection Sort
        for (int i = 0; i < arr.length - 1; i++) {
            // assume i is the smallest element of the array
            int smallest = i;
            for (int j = i + 1; j < arr.length; j++) {
                // agar koi element smallest se chhota hota h to usko smallest bana do
                if (arr[smallest] > arr[j]) {
                    smallest = j;
                }
            }
            // swap
            int temp = arr[smallest];
            arr[smallest] = arr[i];
            arr[i] = temp;
        }

        // Print the Array
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }

}
