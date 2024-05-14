public class maxArray {
    public static void main(String[] args) {
        int[] arr = { 12, 34, 45, 67, 78, 98, 43, 232, 21, 44 };
        // int max=Integer.MIN_VALUE;
        int max = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        System.out.println(max);
    }
}
