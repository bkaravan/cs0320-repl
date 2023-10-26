package edu.brown.cs.student.main.server;

import java.util.ArrayList;
import java.util.List;

/**
 * A class accessed by LoadHandler and ViewHandler that stores loaded CSV data and allows to access
 * and manipulate (load) it later.
 */
public class Storage {

  private List<List<String>> data = new ArrayList<>();

  /**
   * Getter for the storage data.
   * @return -- the data.
   */
  public List<List<String>> getData() {
    //return this.data;
    return new ArrayList<>(this.data); // defensive programming.
  }

  /**
   * This is a getter for the storage.
   * @return -- the data as an array.
   */
  public ArrayList<String[]> getDataAsArray() {
    ArrayList<String[]> toRet = new ArrayList<>();
    for (List<String> row : this.data) {
      String[] arr = row.toArray(new String[0]);
      toRet.add(arr);
    }
    return toRet;
  }

  /**
   * This is the setter that loads the storage.
   * @param data -- the data that we are getting passed in to the storage to load.
   */
  public void loadData(List<List<String>> data) {
    this.data = data;
  }
}
