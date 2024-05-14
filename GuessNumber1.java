import java.util.Random;
import java.util.Scanner;
import java.util.Random;

class Game {
    int number;
    int inputNumber;
    public int NoOfGuesses = 0;

    Game() {
        Random rand = new Random();
        number = rand.nextInt(100);
    }

    void setNoOfGuesses(int num) {
        this.NoOfGuesses = num;
    }

    int getNoOfGuesses() {
        return NoOfGuesses;
    }

    void TakeUserInput() {
        Scanner sc = new Scanner(System.in);
        System.out.println("Guess the number");
        inputNumber = sc.nextInt();
    }

    boolean IsCorrectNumber() {
        NoOfGuesses++;
        if (inputNumber == number) {
            System.out.println("You Guess the correct number");
            System.out.printf("You Guess correct number in %d Attempts", NoOfGuesses);
            return true;
        } else if (inputNumber < number) {
            System.out.println("You guess Too Low....");
        } else if (inputNumber > number) {
            System.out.println("your Guess Too High....");
        }
        return false;
    }

}

public class GuessNumber1 {
    public static void main(String[] args) {
        Game g = new Game();
        boolean b = false;
        g.TakeUserInput();
        g.IsCorrectNumber();
        System.out.println(b);
        // System.out.printf("You take %d Attempts to Guess correct number\n",
        // g.getNoOfGuesses());
        while (!b) {
            g.TakeUserInput();
            b = g.IsCorrectNumber();
            System.out.println(b);
        }

    }

}
