package edu.brown.cs.student.main.creator;

import edu.brown.cs.student.main.parser.FactoryFailureException;
import java.util.List;

/**
 * Creator is the class that works with the data and transforms it in the desired array format along
 * with trimming (stripping) it for higher search accuracy.
 */
public class Creator implements CreatorFromRow<String[]> {

  /**
   * Creator constructor.
   */
  public Creator() {
  }

  /**
   * the main create method that transforms the data into the string of arrays format that is
   * needed.
   *
   * @param row -- passing in every row for stripping and putting it into the result array
   * @return -- returning the array with ready to search data
   * @throws FactoryFailureException -- throws the exception.
   */
  public String[] create(List<String> row) throws FactoryFailureException {
    String[] array = new String[row.size()];
    for (int i = 0; i < row.size(); i++) {
      array[i] = row.get(i).strip();
      /*
            if(array[i].isEmpty()){
              throw new FactoryFailureException
                  ("One of your entries is empty! Please modify the input data.",row);
            }
       this would stop the process from running in case one of the entries is blank
       which sabotages the design and I find my implementation better since it does find the
       keywords regardless.
      */
    }
    return array;
  }
}
