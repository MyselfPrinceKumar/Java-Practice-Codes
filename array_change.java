public class array_change {
    public static void main(String[] args) {
        int [] arr={12,34,56,78,90,98,66};
        int temp;
        int n=Math.floorDiv(arr.length,2);
        for (int i = 0; i <n; i++) {
            temp=arr[i]; 
            arr[i]=arr[arr.length-1-i]; 
            arr[arr.length-1-i]=temp; 

        // System.out.println(arr[i]);
        }
        for (int j = 0; j < arr.length; j++) {
            System.out.println(arr[j]);
        }
        
    }
    
}
