
public class Solution {
    public static void main(String[] args) {
        int [][]arr={{0,1,0},{1,1,1},{0,0,1},{0,1,1}};
        int row=arr.length;
        int col=arr[0].length;
        int max=-1;
        int index=-1;
        int count=0;
        for(int i=0;i<row;i++){
            for(int j=0;j<col;j++){
                if(arr[i][j]==1){
                    count++;
                }
            }
            if(count>max){
                max=count;
                index=i;
            }
            count=0;
        }
        System.out.println(index+1 + " has the maximum '1' ");
    }
}






