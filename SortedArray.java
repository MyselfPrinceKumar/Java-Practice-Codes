public class SortedArray {
    public static void main(String[] args) {
        // int []arr={12,32,1,3,4,65,75,18};
        int []arr={12,32,100,465,751,811};
        boolean sort=true;
        for (int i = 0; i < arr.length-1; i++) {
            if (arr[i]>arr[i+1]) {
                sort=false;
            }            
        }
        if (sort) {
            System.out.println("the array is sorted ");
        }
        else{
            System.out.println("Array is not sorted");
        }
    }
}
