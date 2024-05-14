public class amdocs {
    public static void main(String[] args) {
        String[] arr = { "prince", "vikram", "rock", "hello", "mc", "nawle" };
        int[] rank = { 9, 3, 1, 5, 7, 2 };
        int min = Integer.MAX_VALUE;
        int max = 0;
        int minrank = -1;
        int maxrank = -1;
        for (int i = 0; i < rank.length; i++) {
            if (rank[i] < min) {
                min = rank[i];
                minrank = i;
            }
            if (rank[i] > max) {
                max = rank[i];
                maxrank = i;
            }
        }
        System.out.println(arr[minrank]);
        System.out.println(arr[maxrank]);
    }
}
