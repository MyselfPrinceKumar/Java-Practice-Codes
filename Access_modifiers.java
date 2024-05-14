class cylinder{
    private float radius=3.5f;
    private float height=6.6f;
    private float Area;
    private float Volume;
    public void setRadius(float r){
        this.radius=r;
    }
    public float getRadius(){
        return radius;
    }
    public void setHeight(float h){
        this.height=h;
    }
    public float getHeight(){
        return height;
    }
    public void setArea(float a){
        a=2*Math.PI*radius(radius+height);
        this.area=a;
    }
    public float getArea(){
        return area;
    }
    public void setVolume(float v){
        v=math.PI*radius*radius*height;
        this.Volume=v;
    }
    public float getVolume(){
        return Volume;
    }
}
public class Access_Modifiers {
    public static void main(String[] args) {
        cylinder c=new cylinder();
        
    }
}
