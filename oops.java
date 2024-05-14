 class employee1{
    int salary=230000;
    String name="prince rock";
  public int getSallary(){
        return salary;
    }
   public String getname(){
        return name;
    }
    public void setName(String newName){
        name=newName;
        System.out.println("your new name is "+name);
    }
}
public class oops {
    public static void main(String[] args) {
        employee1 emp=new employee1();
        // emp.getSallary();
    //   int  salary=230000;
    //    String nname="prince";
        System.out.println("Your name is: "+emp.getname());
        System.out.println("your sallary is: "+emp.getSallary());
        // System.out.println("the new name is: "+emp.setName("prince kumar"));
        emp.setName("prince kuamr");
    }
}
