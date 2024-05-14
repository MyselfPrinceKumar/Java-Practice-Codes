
public class FibbonacciSeries {
    public static void main(String[] args) {
        int firstTerm = 0;
        int secondTerm = 1;
        int i = 1;
        int n = 10;
        while (i <= n) {
            System.out.print(firstTerm + " ,");
            int nextTerm = firstTerm + secondTerm;
            firstTerm = secondTerm;
            secondTerm = nextTerm;
            i++;
        }
    }
}

Prince Kumar