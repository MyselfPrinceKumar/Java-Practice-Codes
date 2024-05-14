public class Merge_Sort {
    public static void conquer(int arr[], int si, int mid, int ei) {
        int[] merged = new int[ei - si + 1];
        int i = si;
        int j = mid + 1;
        int k = 0;

        while (i <= mid && j <= ei) {
            if (arr[i] <= arr[j]) {
                merged[k++] = arr[i++];

            } else {
                merged[k++] = arr[j++];

            }
        }
        while (i <= mid) {
            merged[k++] = arr[i++];

        }
        while (j <= ei) {
            merged[k++] = arr[j++];

        }
        for (int i1 = 0, j1 = si; i1 < merged.length; i1++, j1++) {
            arr[j1] = merged[i1];
        }
    }

    public static void divide(int arr[], int si, int ei) {
        int mid = (si + ei) / 2;
        if (si >= ei) {
            return;

        } else {
            divide(arr, si, mid);
            divide(arr, mid + 1, ei);
            conquer(arr, si, mid, ei);
        }
    }

    public static void main(String[] args) {
        int[] arr = { 15, 223, 37, 93, 222, 34, 56, 87, 4, 23, 45, 6, 34, 32, 2, 32, 454, 54, 5 };

        // call the divide function
        divide(arr, 0, arr.length - 1);

        // print the sorted array
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}