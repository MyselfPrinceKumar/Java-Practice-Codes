public class Tower_of_hanoi {

  public static void tower_hanoi(int n, String src, String helper, String dest) {
    if (n == 1) {
      System.out.println("Transfer disc " + n + " from " + src + " to " + dest);
      return;
    }
    tower_hanoi((n - 1), src, dest, helper);
    System.out.println("Transfer disc " + n + " from " + src + " to " + dest);
    tower_hanoi((n - 1), helper, src, dest);
  }

  public static void main(String[] args) {
    int n = 3;
    tower_hanoi(n, "p", "q", "r");
  }
}
