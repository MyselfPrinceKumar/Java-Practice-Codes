public class printsubArray {
    public static void main(String[] args) {
        int count = 0;
        int sum = 0;
        int maxSum = 0;
        int[] arr = { -3, 5, 8, 2 };
        for (int i = 0; i < arr.length; i++) {
            count++;
            for (int j = i; j < arr.length; j++) {
                System.out.print(arr[j] + "  ");
                sum = sum + arr[i];
                if (sum >= maxSum) {
                    maxSum = sum;
                }
                if (sum < maxSum) {
                    sum = 0;
                }
            }
        }
        System.out.println();
        System.out.println("The Size of the subAyyay is " + count);
        System.out.println("The sum of the SubAyyar is " + maxSum);
    }
}
