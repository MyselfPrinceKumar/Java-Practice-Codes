import java.util.LinkedList;

public class LinkedList_Collections {
  public static void main(String[] args) {
    LinkedList<String> s1 = new LinkedList<>();
    s1.add("Prince");
    s1.addLast("kumar");
    s1.addFirst("Myself");
    s1.addFirst("Hello EveryOne");
    s1.add("Here");
    int size = s1.size();
    System.out.println(size);
    s1.remove(1); // Remove elements by index.
    s1.removeLast();
    // forEach loop
    // for (String string : s1) {
    // System.out.println(string);
    // }
    // Printing elements using for loop
    for (int i = 0; i < s1.size(); i++) {
      System.out.println(s1.get(i));
    }
  }
}
