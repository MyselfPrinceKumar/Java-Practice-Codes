import java.util.Scanner;
class square{
    int side=6;

    int area;
    int perimeter;
    // Scanner sc=new Scanner(System.in);
    // System.out.println("enter the side of the Square");
    // side=sc.nextInt();
    public int getSide(){
        return side;
    }
    public int getArea(){
        area=side*side;
        return area;
    }
    public int getPerimeter(){
        perimeter=4*side;
        return perimeter;
    }
}
public class oops2 {
    public static void main(String[] args){
        square sq=new square();
        System.out.println("the side of the Square is:"+sq.getSide());
        System.out.println("the Area of the Square is:"+sq.getArea());
        System.out.println("the perimeter of the Square is:"+sq.getPerimeter());
    }
}
