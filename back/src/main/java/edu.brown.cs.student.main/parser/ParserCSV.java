package edu.brown.cs.student.main.parser;


import edu.brown.cs.student.main.creator.CreatorFromRow;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * parser class that splits the rows of the CSV using a specific format, while checking if the
 * format of the CSV is correct.
 *
 * @param <T> -- the user-defined type of data passed in for parsing.
 */
public class ParserCSV<T> {

  public ArrayList<T> result;
  public boolean isError;
  private final CreatorFromRow<T> rowTransform;
  private List<String> line; // The lines of the CSV file
  static final Pattern regexSplitCSVRow =
      Pattern.compile(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*(?![^\\\"]*\\\"))");

  /**
   * Constructor that reads the passed in data, transforms rows using the provided CreateFromRow,
   * checks that the amount of inputs for every row of data is the same, catches errors.
   *
   * @param obj     -- object that is going to be read
   * @param creator -- the creator that takes in the user-defined type of data and works with it.
   */
  public ParserCSV(Reader obj, CreatorFromRow<T> creator) {
    this.isError = false;
    this.result = new ArrayList<>();
    this.rowTransform = creator;

    BufferedReader br = new BufferedReader(obj);
    String line;
    try {

      int fieldCount = -1;

      while ((line = br.readLine()) != null) {
        String[] myArray = regexSplitCSVRow.split(line);
        if (fieldCount < 0) {
          fieldCount = myArray.length;
        } else {
          if (fieldCount != myArray.length) {
            this.isError = true;
            System.out.println("Your file doesn't have the same amount of inputs. Please fix it!");
          }
        }
        List<String> lst = Arrays.asList(myArray);
        T newRow = this.rowTransform.create(lst);
        this.result.add(newRow);
      }
    } catch (IOException var) {
      this.isError = true;
    } catch (FactoryFailureException e) {
      throw new RuntimeException(e);
    }
  }

  public ArrayList<T> getParseResult() {
    return new ArrayList<>(this.result);
  }

}
