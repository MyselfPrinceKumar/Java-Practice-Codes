public class Max_Diff {
    public static void main(String[] args) {
        int[] arr = { 7, 9, 5, 6, 3, 2 };
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if ((arr[j] - arr[i]) > max) {
                    max = arr[j] - arr[i];
                }
            }
        }
        System.out.println(max);
    }
}
