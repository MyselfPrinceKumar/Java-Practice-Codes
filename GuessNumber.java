import java.util.Random;
import java.util.Scanner;

class Game {
    int n;
    int num;
    int NoOfGuesses = 0;
    boolean b;

    Game() {
        Random rand = new Random();
        n = rand.nextInt(100);
    }

    void TakeUserInput() {
        Scanner sc = new Scanner(System.in);
        System.out.println("Guess the Number");
        num = sc.nextInt();
        // this.number=n;
    }

    void IsCorrect() {
            if (num == n) {
                System.out.println("You Entered correct number");
                // break;
                // NoOfGuesses++;
                // return true;
            }

            else if (num < n) {
                System.out.println("You Entered Too Low....");
                // break;

                // return false;
            } else if (num > n) {
                System.out.println("You Entered Too High....");
                // return false;
                // break;

            } else {
                System.out.println("out of range");
            }
            // return false;
        }
    }

public class GuessNumber {
    public static void main(String[] args) {
        Game g = new Game();

        g.TakeUserInput();
        g.IsCorrect();
        while (num !=n) {
            g.TakeUserInput();
        }
    }
}
