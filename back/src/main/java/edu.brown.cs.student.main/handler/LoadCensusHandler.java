package edu.brown.cs.student.main.handler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.exceptions.DatasourceException;
import edu.brown.cs.student.main.parser.SearchCSV;
import java.time.LocalDateTime;
import java.io.IOException;
import java.net.URL;


import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.Storage;
import spark.Request;
import spark.Response;
import spark.Route;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;


/**
 * This class is dealing with loading the URL from the given API, processing the requests and
 * displaying the results.
 */
public class LoadCensusHandler implements Route {

  //    private String file;
  private final Storage storage;

  /**
   * This method sets the storage to the current storage.
   *
   * @param storage -- the storage that is getting passed in.
   */
  public LoadCensusHandler(Storage storage) {
    this.storage = storage;
  }

  /**
   * The handle method's main purpose in to take in a request, and to return a response. This method
   * deals with searching for the country/state, taking in the request, sending the additional
   * request to Census and displaying the result.
   *
   * @param request  -- the requested query parameters of country and state.
   * @param response -- the generated response that will be displayed after being processed.
   * @return -- returns the response to the request.
   * @throws Exception -- throws an exception if there is a mistake in the provided information.
   */
  @Override
  public Object handle(Request request, Response response) throws Exception {

    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObj = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObj);
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String state = request.queryParams("state");
      String county = request.queryParams("county");
      if ((state == null) || (county == null)) {
        responseMap.put("result", "error");
        responseMap.put("error_type", "state or county not provided");
        return adapter.toJson(responseMap);
      }
      // list of State
      // URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=state:*");
      // list of county in state
      //    URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=county:*&in=state:06");
      // list of broadband in state by county
//            URL requestURL = new URL("https", "api.census.gov", "/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:*&in=state:06");
//            URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=state:*");

      //  Find State. Can be cashed or hard coded.
      URL requestURL = new URL("https", "api.census.gov",
          "/data/2010/dec/sf1?get=NAME&for=state:*");
      LoadFromURL fromURL = new LoadFromURL(requestURL);
      this.storage.loadData(fromURL.storage.getData());
      SearchCSV searcher = new SearchCSV(fromURL.storage.getDataAsArray(), true);
      boolean resSearch = searcher.searchByIndex(state, 0);
      String stateNum = "";
      if (resSearch) {
        stateNum = searcher.result.get(0)[1];
      } else {
        responseMap.put("result", "error");
        responseMap.put("error_type", "seeking state " + state + " not found");
        return adapter.toJson(responseMap);
      }

      //  Find broadband users.
      try {
        String timestamp = LocalDateTime.now().toString().substring(0, 19);
        requestURL = new URL("https", "api.census.gov",
            "/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:*&in=state:"
                + stateNum);
        fromURL = new LoadFromURL(requestURL);
        this.storage.loadData(fromURL.storage.getData());
        searcher = new SearchCSV(fromURL.storage.getDataAsArray(), true);
        resSearch = searcher.searchByIndex(county, 0);
        String broadbandUsers = "";
        if (resSearch) {
          broadbandUsers = searcher.result.get(0)[1];
          responseMap.put("result", "success");
          responseMap.put("timestamp", timestamp);
          responseMap.put("address", searcher.result.get(0)[0]);
          responseMap.put("bbNumber", searcher.result.get(0)[1]);
          System.out.println(LocalDateTime.now());

        } else {
          responseMap.put("result", "error");
          responseMap.put("error_type", "county " + county + " in " + state + ". Not found");
        }
        return adapter.toJson(responseMap);
      } catch (Exception e) {
        return e;
      }

    } catch (IOException e) {
      throw new DatasourceException(e.getMessage());
    }
  }
}