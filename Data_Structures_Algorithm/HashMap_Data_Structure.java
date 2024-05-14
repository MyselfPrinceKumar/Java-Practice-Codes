import java.util.HashMap;
import java.util.Map;

public class HashMap_Data_Structure {
    public static void main(String[] args) {
        // It stores the key value pairs in the unordered manner
        HashMap<String, Integer> map = new HashMap<>();

        map.put("Prince", 27);
        map.put("Rock", 29);
        map.put("Roman", 22);
        map.put("Rohit", 12);
        map.put("Riya", 56);

        map.put("Rock", 34); // we cannot insert the duplicate keys
        // b/c keys are unique and value are not unique
        // Here Rock value are updated by 34.
        // System.out.println(map.get("Prince"));
        System.out.println(map.values()); // Prints All the values

        System.out.println(map.keySet()); // Prints All the Values

        // map.forEach((k, v) -> System.out.println(k + " " + v));
        if (map.containsKey("Riya") == true) {
            System.out.println("key is present ");
        }
        if (map.containsValue(27) == true) {
            System.out.println("value is present ");
        }
        // First Way to iterate the HashMap
        // Map.Entry<String,Integer> e: map.entrySet();
        for (Map.Entry<String, Integer> e : map.entrySet()) {
            System.out.println(e.getValue());
            System.out.println(e.getKey());
        }
    }
}