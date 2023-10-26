package edu.brown.cs.student.main.handler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.Storage;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;


/**
 * This is a class that helps to view the loaded file.
 */
public class ViewHandler implements Route {

  Storage storedData;

  /**
   * This constructor sets the storage.
   *
   * @param storedData -- the storage.
   */
  public ViewHandler(Storage storedData) {
    this.storedData = storedData;
  }

  /**
   * This handle method is working with serialization of the requests, checking if the data that got
   * inputted is valid, and displays the data in a readable and comprehensive way.
   *
   * @param request  -- the standard request parameter for the handle method.
   * @param response -- the failure or success response.
   * @return -- the failure message specifying the mistake or the success message with the data.
   * @throws Exception -- if there are any errors encountered on the way, gets thrown.
   */
  @Override
  public Object handle(Request request, Response response) {

    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObj = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObj);

    Map<String, Object> responseMap = new HashMap<>();

    try {
      List<List<String>> currdata = this.storedData.getData();
      if (currdata.isEmpty()) {
        responseMap.put("result", "error");
        responseMap.put("error_type", "error_datasource");
        //    return "ViewHandler: no file is loaded.";
        return adapter.toJson(responseMap);
      }
      responseMap.put("result", "success");
      responseMap.put("view_data", currdata);
      String json = adapter.toJson(responseMap);
      // System.out.println(json);
      return adapter.toJson(responseMap);
      //return "ViewHandler: successfully viewed your data!" + currdata;
    } catch (Exception e) {
      responseMap.put("result", "error");
      responseMap.put("error_type", e);
      return adapter.toJson(responseMap);
      //throw new RuntimeException("ViewHandler error:  " + e);
    }

  }
}