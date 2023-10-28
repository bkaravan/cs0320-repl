package edu.brown.cs.student.main.parser;

import java.util.ArrayList;

/**
 * SearcherCSV is a class that contains three methods used for searching through the lines: 1.
 * searching by using the name of the column input 2. searching by using the number of the column
 * input 3. general search through every column of every row when no information to narrow the
 * search down is available.
 */
public class SearchCSV {

  private final ArrayList<String[]> obj;
  private final boolean header;
  public ArrayList<String[]> result;

  /**
   * Constructor for the SearchCSV.
   *
   * @param inArray   -- the initial array we are passing in for searching after parsing
   * @param hasHeader --a boolean stating if there is a header in the CSV.
   */
  public SearchCSV(ArrayList<String[]> inArray, boolean hasHeader) {
    this.obj = inArray;
    this.header = hasHeader;
  }

  /**
   * Method that searchers by using the name of the column.
   *
   * @param keyword -- the word the user is looking for;
   * @param colName -- the name of the column in the header
   * @return -- boolean stating if the result of the search is positive or negative.
   */
  public boolean searchByName(String keyword, String colName) {
    if (!header) {
      return false;
    }

    int colNum = -1;
    String[] headerRow = this.obj.get(0);
    for (int i = 0; i < headerRow.length; i++) {
      if (headerRow[i].equals(colName)) {
        colNum = i;
      }
    }
    if (colNum < 0) {
      return false;
    }
    boolean res = false;
    this.result = new ArrayList<>();
    for (int r = 1; r < this.obj.size(); r++) {
      String[] currrow = this.obj.get(r);
      if (currrow[colNum].equals(keyword)) {
        this.result.add(currrow);
        res = true;
      }
    }
    return res;
  }

  // header?
  // yes - num/name
  // none -- all
  // no -- num / all

  /**
   * Method that searchers by using the index of the column.
   *
   * @param keyword -- the word the user is looking for;
   * @param colNum  -- the number of the column in the header (starting from 0);
   * @return -- boolean stating if the result of the search is positive or negative.
   */
  public boolean searchByIndex(String keyword, int colNum) {
    int startRow = 0;
    if (this.header) {
      startRow = 1;
    }
    boolean res = false;
    this.result = new ArrayList<>();
    for (int r = startRow; r < this.obj.size(); r++) {
      String[] currrow = this.obj.get(r);
      if (currrow[colNum].contains(keyword)) {
        this.result.add(currrow);
        res = true;
      }
    }
    return res;
  }

  /**
   * Method that searchers through the whole document.
   *
   * @param keyword -- the word the user is looking for;
   * @return -- boolean stating if the result of the search is positive or negative.
   */
  public boolean searchByAll(String keyword) {
    int startRow = 0;
    if (this.header) {
      startRow = 1;
    }
    boolean res = false;
    this.result = new ArrayList<>();
    for (int r = startRow; r < this.obj.size(); r++) {
      String[] currrow = this.obj.get(r);
      for (String s : currrow) {
        if (s.equals(keyword)) {
          this.result.add(currrow);
          res = true;
        }
      }
    }
    return res;
  }
}
