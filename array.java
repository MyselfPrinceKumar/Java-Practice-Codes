public class array {
    public static void main(String[] args) {
        int[] arr={12,34,56,78,90};
        for (int i = arr.length-1; i >=0; i--) {
            System.out.println("the elements of the arry is: "+arr[i]);
            // System.out.println("\n");
        }
        for (int i = 0; i <arr.length; i++) {
            System.out.println("the elements of the arry is: "+arr[i]);
            // System.out.println("\n");
        }
        for (int i : arr) {
            System.out.println(i);
        }
    }
    
}
