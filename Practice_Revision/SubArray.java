public class SubArray {
    public static void main(String[] args) {
        int[] arr = { 2, 4, 6, 8 };
        int count = 0;
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = i; j < arr.length; j++) {
                // int sum = 0;
                for (int j2 = i; j2 <= j; j2++) {
                    System.out.print(arr[j2] + " ");
                    sum += arr[j2];
                }
                count++;
                System.out.println();
                System.out.println("The sum of the array is " + sum);
                sum = 0;
            }
        }
        System.out.println("total sub arrays is " + count);
    }
}
