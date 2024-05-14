public class countNum {
    public static void main(String[] args) {
        int n = 45;
        int count = 0;
        boolean b = false;
        for (int i = 1; i <= n; i++) {
            while (i != 0) {
                int rem = i % 10;
                if (rem == 3) {
                    b = true;
                }
                i = i / 10;
            }
            if (b == false) {
                count++;
                b = true;
            }
        }
        System.out.println(count);
        System.out.println("hii");
    }
}