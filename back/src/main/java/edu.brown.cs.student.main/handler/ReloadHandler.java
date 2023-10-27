package edu.brown.cs.student.main.handler;


import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.creator.RawCreator;
import edu.brown.cs.student.main.handler.LoadHandler.FailureResponse;
import edu.brown.cs.student.main.handler.LoadHandler.SuccessResponse;
import edu.brown.cs.student.main.parser.ParserCSV;
import edu.brown.cs.student.main.server.Storage;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;

public class ReloadHandler implements Route {

  private final Storage storage;
  private List<List<String>> data = new ArrayList<>();

  public ReloadHandler(Storage storage) {
    this.storage = storage;
  }

  /**
   * The handle method that handles the loading part by processing in, checking if the inputs are
   * valid and putting it through parser, as well as producing a success or failure response.
   *
   * @param request  -- the file path of the desired file.
   * @param response -- the success or failure message regarding the loading.
   * @return -- the success or failure message regarding the loading.
   * @throws Exception -- throws an exception in case of an error in the serialization.
   */
  @Override
  public Object handle(Request request, Response response) {

    this.storage.loadData(data);
    return new SuccessResponseReload("Successful Reload ").serialize();
  }

  public record SuccessResponseReload(String reload) {

    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<ReloadHandler.SuccessResponseReload> adapter = moshi.adapter(
            ReloadHandler.SuccessResponseReload.class);
        return adapter.toJson(this);
      } catch (Exception e) {
        e.printStackTrace();
        throw e;
      }
    }
  }

}
