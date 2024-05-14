class employee {
    private int id = 12;
    private String name = "myself prince mourya";

    public void setId(int n) {
        this.id = n;
    }

    public int getId() {
        return id;
    }

    public void setName(String n) {
        this.name = n;
    }

    public String getName() {
        return name;
    }
}

public class AccessModifiers {
    public static void main(String[] args) {
        employee emp = new employee();
        System.out.println(emp.getId());
        System.out.println(emp.getName());
    }
}
