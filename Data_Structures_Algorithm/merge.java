public class merge {
    public static void conquer(int arr[], int si, int mid, int ei) {
        int merged[] = new int[ei - si + 1];
        int i = si;
        int j = mid + 1;
        int k = 0;
        while (i <= mid && j <= ei) {
            if (arr[i] <= arr[j]) {
                merged[k] = arr[i];
                i++;
                k++;
            } else {
                merged[k] = arr[j];
                j++;
                k++;
            }
        }
        while (i <= mid) {
            merged[k] = arr[i];
            k++;
            i++;
        }
        while (j <= ei) {
            merged[k] = arr[j];
            k++;
            j++;
        }
        for (int i1 = 0, j1 = si; i1 < merged.length; i1++, j1++) {
            arr[j1] = merged[i1];
        }
    }

    public static void divide(int arr[], int si, int ei) {
        int mid = si + (ei - si) / 2;
        if (si < ei) {
            divide(arr, si, mid);
            divide(arr, mid + 1, ei);
            conquer(arr, si, mid, ei);
        }
    }

    public static void main(String[] args) {
        int arr[] = { 2, 4, 3, 6, 9, 1, 34, 12, 89, 34, 1 };

        // call the divide function
        divide(arr, 0, arr.length - 1);

        // Prints the array
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
