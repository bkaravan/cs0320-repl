package edu.brown.cs.student.main.handler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.parser.SearchCSV;
import edu.brown.cs.student.main.server.Storage;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;


/**
 * This class deals with searching for the requested data by using the SearchCSV from the previous
 * project.
 */
// this is a class that has the handle method (which helps run the searchCSV).
public class SearchHandler implements Route {

  private final Storage storage;

  /**
   * This constructor sets the storage to the filed value.
   *
   * @param storage -- the storage with the passed in data.
   */
  public SearchHandler(Storage storage) {
    this.storage = storage;
  }

  /**
   * This method handles the process of searching by processing the request parameters and
   * outputting the result. Implements a slightly modified version of the SearchCSV from the
   * previous Sprint.
   *
   * @param request  -- the requested parameters needed for narrowing the search.
   * @param response -- the date and time of the request, the request status, the output if
   *                 applicable and successful.
   * @return -- the failure or successfully processed and found data.
   * @throws Exception -- exception thrown if there are errors encountered.
   */
  @Override
  public Object handle(Request request, Response response) throws Exception {

    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObj = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObj);
    Map<String, Object> responseMap = new HashMap<>();

    try {

      String search = request.queryParams("search");
      if (search == null) {
        responseMap.put("result", "error");
        responseMap.put("error_type", "Search not provided");
        return adapter.toJson(responseMap);
      }
      String args = request.queryParams("args");
      if (args == null) {
        args = "";
      }

      String ishead = request.queryParams("ishead");
      if (ishead == null) {
        ishead = "N";
      }

      int modesearch = 1;
      ArrayList<String[]> currdat = this.storage.getDataAsArray();
      if (currdat.isEmpty()) {
        responseMap.put("result", "error");
        responseMap.put("error_type", "error_datasource");
        return adapter.toJson(responseMap);
      }
      boolean header = ishead.equalsIgnoreCase("y");
      SearchCSV searcher = new SearchCSV(currdat, header);
      if (args.startsWith("I:")) {
        modesearch = 2;
      } else if (args.startsWith("N:")) {
        modesearch = 3;
      }
      boolean resSearch =
      switch (modesearch) {
        case 1 -> searcher.searchByAll(search);
        case 2 -> searcher.searchByIndex(search, Integer.parseInt(args.substring(2)));
        case 3 -> searcher.searchByName(search, args.substring(2));
        default -> false;
          };
      if (resSearch) {
        responseMap.put("result", "success");
        responseMap.put("data", searcher.result);
      } else {
        responseMap.put("result", "error");
        responseMap.put("error_type", "seeking word not found");
      }
      return adapter.toJson(responseMap);
    } catch (Exception e) {
      System.out.println(e);
      responseMap.put("result", "error");
      responseMap.put("error_bad_request", e);
      return adapter.toJson(responseMap);
    }
  }
}
