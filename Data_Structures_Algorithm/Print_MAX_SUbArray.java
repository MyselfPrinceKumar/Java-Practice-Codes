public class Print_MAX_SUbArray {
    public static void main(String[] args) {
        // Find the subArray with largest sum and print the sum;
        int[] arr = { -2, 5, -6, 40, -14, -4, -8, 6, 5 };
        int currSum = 0;
        int maxSum = Integer.MIN_VALUE;
        for (int i = 0; i < arr.length; i++) {
            currSum = currSum + arr[i];
            if (currSum >= maxSum) {
                maxSum = currSum;
            }
            if (currSum < 0) {
                currSum = 0;
            }
        }
        System.out.println(maxSum);
    }
    // int max = Math.max(arr[1], arr[8]); It returns the max value of two integers
    // System.out.println(max);
}