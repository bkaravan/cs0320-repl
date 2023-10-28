package edu.brown.cs.student.main;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.LocalTest.ResponseError;
import edu.brown.cs.student.main.handler.LoadCensusHandler;
import edu.brown.cs.student.main.handler.LoadHandler;
import edu.brown.cs.student.main.handler.SearchHandler;
import edu.brown.cs.student.main.handler.ViewHandler;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.Arrays;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

import edu.brown.cs.student.main.server.Storage;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test the actual handlers.
 * <p>
 * On Sprint 2, you'll need to deserialize API responses. Although this demo doesn't need to do
 * that, these _tests_ do.
 * <p>
 * https://junit.org/junit5/docs/current/user-guide/
 * <p>
 * Because these tests exercise more than one "unit" of code, they're not "unit tests"...
 * <p>
 * If the backend were "the system", we might call these system tests. But I prefer "integration
 * test" since, locally, we're testing how the Soup functionality connects to the handler. These
 * distinctions are sometimes fuzzy and always debatable; the important thing is that these ARE NOT
 * the usual sort of unit tests.
 * <p>
 * Note: if we were doing this for real, we might want to test encoding formats other than UTF-8
 * (StandardCharsets.UTF_8).
 */

class MainTest {

  @BeforeAll
  public static void setup_before_everything() {

    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root logger
  }

  /**
   * Shared state for all tests. We need to be able to mutate it (adding recipes etc.) but never
   * need to replace the reference itself. We clear this state out after every test runs.
   */


  @BeforeEach
  public void setup() {
    // Re-initialize state, etc. for _every_ test method run

    // In fact, restart the entire Spark server for every test!
    Storage csvStorage = new Storage();
    Spark.get("loadCSV", new LoadHandler(csvStorage));
    Spark.get("viewCSV", new ViewHandler(csvStorage));
    Spark.get("searchCSV", new SearchHandler(csvStorage));
    Spark.get("broadband", new LoadCensusHandler(csvStorage));

    // MOCK DATA SETUP

    Storage csvStorage_M = new Storage();
    List<List<String>> storlist = new ArrayList<>();
    String[] arr1 = {"cars", "ferries", "horses"};
    String[] arr2 = {"food", "drinks", "desert"};
    String[] arr3 = {"kindergarden", "school", "university"};

    ArrayList<String> example1 = new ArrayList<>(Arrays.asList(arr1));
    ArrayList<String> example2 = new ArrayList<>(Arrays.asList(arr2));
    ArrayList<String> example3 = new ArrayList<>(Arrays.asList(arr3));
    storlist.add(example1);
    storlist.add(example2);
    storlist.add(example3);
    csvStorage_M.loadData(storlist);

    Spark.get("loadCSV_M", new LoadHandler(csvStorage_M));
    Spark.get("viewCSV_M", new ViewHandler(csvStorage_M));
    Spark.get("searchCSV_M", new SearchHandler(csvStorage_M));
    Spark.get("broadband_M", new LoadCensusHandler(csvStorage_M));

    Spark.init();
    Spark.awaitInitialization(); // don't continue until the server is listening
  }

  /**
   * The teardown stops spark.
   */
  @AfterEach
  public void teardown() {
    // Gracefully stop Spark listening on both endpoints
    Spark.unmap("loadCSV");
    Spark.unmap("viewCSV");
    Spark.unmap("searchCSV");
    Spark.unmap("broadband");
    Spark.unmap("loadCSV_M");
    Spark.unmap("viewCSV_M");
    Spark.unmap("searchCSV_M");
    Spark.unmap("broadband_M");

    Spark.awaitStop(); // don't proceed until the server is stopped
  }

  /**
   * Helper to start a connection to a specific API endpoint/params
   *
   * @param apiCall the call string, including endpoint (NOTE: this would be better if it had more
   *                structure!)
   * @return the connection for the given URL, just after connecting
   * @throws IOException if the connection fails for some reason
   */
  static private HttpURLConnection tryRequest(String apiCall) throws IOException {
    // Configure the connection (but don't actually send the request yet)
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();

    // The default method is "GET", which is what we're using here.
    // If we were using "POST", we'd need to say so.
    //clientConnection.setRequestMethod("GET");

    clientConnection.connect();
    return clientConnection;
  }


  /**
   * This class shows the response of the filepath resulting from a successful load.
   */
  public static class ResponseLoadCSV {

    public String filepath;
  }

  /**
   * This class shows the responses generated by a successful view of the file.
   */
  public static class ResponseViewCSV {

    public String result;
    public List<List<String>> view_data;

  }

  /**
   * This class shows the responses of the use of broadband endpoint.
   */
  public static class ResponseBB {

    public String result;
    public String timestamp;
    public String address;
    public String bbNumber;
    public String error_type;
  }

  /**
   * This class shows the response to the search.
   */
  public static class SearchResponse {

    public String result;
    public List<String[]> data;
    public String error_type;

  }

  /**
   * This class shows the response when errors are encountered.
   */
  public static class ResponseBroadband {

    public String result;
    public String error_type;
  }

  /**
   * This test checks a successful view of a mocked dataset.
   * @throws IOException -- throws an exception.
   */
  @Test
  public void testViewFileLoadedMocked() throws IOException {
    HttpURLConnection clientConnection2 = tryRequest("viewCSV_M");
    assertEquals(200, clientConnection2.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseViewCSV response = moshi.adapter(ResponseViewCSV.class).
        fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));

    clientConnection2.disconnect();
    assertEquals("success", response.result);
    List<String> ex = new ArrayList<>();
    ex.add("cars");
    ex.add("ferries");
    ex.add("horses");
    assertEquals(ex, response.view_data.get(0));
  }

  /**
   * This test checks a successful search on a dataset without specifications.
   * @throws IOException - throws an exception
   */
  @Test
  public void testViewSearchMocked() throws IOException {
    HttpURLConnection clientConnection2 = tryRequest("searchCSV_M?search=ferries");
    assertEquals(200, clientConnection2.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseViewCSV response = moshi.adapter(ResponseViewCSV.class).
        fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));

    clientConnection2.disconnect();
    assertEquals("success", response.result);
  }

  /**
   * This test shows a successful search on a mocked dataset with advanced parameters.
   * @throws IOException - throws an exception
   */
  @Test
  public void testViewSearchAdvancedMocked() throws IOException {
    HttpURLConnection clientConnection2 = tryRequest("searchCSV_M?search=desert&I:2&n");
    assertEquals(200, clientConnection2.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseViewCSV response = moshi.adapter(ResponseViewCSV.class).
        fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));

    clientConnection2.disconnect();
    assertEquals("success", response.result);
  }

  /**
   * This test checks a result of a search with an error.
   * @throws IOException - throws an exception
   */
  @Test
  public void testViewSearchNotFoundMocked() throws IOException {
    HttpURLConnection clientConnection2 = tryRequest("searchCSV_M?search=ferry");
    assertEquals(200, clientConnection2.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBB response = moshi.adapter(ResponseBB.class).
        fromJson(new Buffer().readFrom(clientConnection2.getInputStream()));

    clientConnection2.disconnect();
    assertEquals("error", response.result);
    assertEquals("seeking word not found", response.error_type);
  }

  /**
   * This test shows that the program works with custom and local mocked jsons.
   * @throws IOException -- throws an exception.
   */
  @Test
  public void testViewNoFileLoadedMock() throws IOException {

    String json = new String(Files.readAllBytes(Paths.get("data/testData/mocktest1.json")));
    Moshi moshi = new Moshi.Builder().build();

    JsonAdapter<ResponseError> adapter = moshi.adapter(ResponseError.class);
    ResponseError response = adapter.fromJson(json);

    assertEquals("error", response.result);
    assertEquals("No files are loaded", response.error_type);
  }

  /**
   * This test checks the successful load of a file with a relative path.
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPILoadCSVFileOK_rel_path() throws IOException {
    HttpURLConnection clientConnection = tryRequest("loadCSV?filepath=data/stars/stardata.csv");
    assertEquals(200, clientConnection.getResponseCode());

    Moshi moshi = new Moshi.Builder().build();
    ResponseLoadCSV response =
        moshi.adapter(ResponseLoadCSV.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));

    clientConnection.disconnect();
    assertEquals("Success! File: data/stars/stardata.csv", response.filepath);
  }
  /**
   * This test checks the successful load of a file with an absolute path.
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPILoadCSVFileOK_abs_path() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=C:\\Users\\julia\\Brown\\sophomore\\s1\\cs32\\server-ystepane-Hamad1020\\data\\stars\\stardata.csv");
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseLoadCSV response =
        moshi.adapter(ResponseLoadCSV.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));

    clientConnection.disconnect();
    assertEquals(
        "Success! File: C:\\Users\\julia\\Brown\\sophomore\\s1\\cs32\\server-ystepane-Hamad1020\\data\\stars\\stardata.csv",
        response.filepath);
  }

  /**
   * This test checks the load error of a not existing file.
   * @throws IOException  - throws an exception.
   */
  @Test
  public void testAPILoadCSVFileError() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/stardataFALSE.csv");
    assertEquals(200, clientConnection.getResponseCode());

    Moshi moshi = new Moshi.Builder().build();
    ResponseLoadCSV response =
        moshi.adapter(ResponseLoadCSV.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    assertEquals("Error: Invalid or empty file name", response.filepath);

  }

  /**   This test checks the successful load and view of a file.

   * @throws IOException - throws an exception.
   */
  @Test
  public void testAPILoadCSVFile_and_view() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseLoadCSV response =
        moshi.adapter(ResponseLoadCSV.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    assertEquals("Success! File: data/stars/ten-star.csv", response.filepath);
    // view
    HttpURLConnection clientConnectionView = tryRequest(
        "viewCSV");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionView.getResponseCode());
    Moshi moshiView = new Moshi.Builder().build();
    ResponseViewCSV responseView =
        moshi.adapter(ResponseViewCSV.class)
            .fromJson(new Buffer().readFrom(clientConnectionView.getInputStream()));
    System.out.println(responseView.view_data);
    assertEquals("success", responseView.result);

  }

  /**
   * This test checks a failing view because load hasn't been initiated.
   * @throws IOException - throws an exception
   */
  @Test
  public void testViewWithoutLoad() throws IOException {
    HttpURLConnection clientConnection = tryRequest("viewCSV");
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBroadband response =
        moshi.adapter(ResponseBroadband.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));

    assertEquals("error", response.result);
    assertEquals("error_datasource", response.error_type);

    clientConnection.disconnect();
  }

  /** This test checks a successful search result.
   * @throws IOException - throws an exception
   */
  @Test
  public void testSearchCSV_OK() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?search=Sol&I:2&y");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("success", responseSearch.result);
    String[] resList = {"0", "Sol", "0", "0", "0"};
    String responseString = resList[0];
    String responseString1 = resList[1];
    String responseString2 = resList[2];
    String responseString3 = resList[3];
    String responseString4 = resList[4];

    assertEquals(responseString, responseSearch.data.get(0)[0]);
    assertEquals(responseString1, responseSearch.data.get(0)[1]);
    assertEquals(responseString2, responseSearch.data.get(0)[2]);
    assertEquals(responseString3, responseSearch.data.get(0)[3]);
    assertEquals(responseString4, responseSearch.data.get(0)[4]);
  }

  @Test
  public void testSearchCSV_OK_NoHeader() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?search=Sol&I:2&n");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("success", responseSearch.result);
    String[] resList = {"0", "Sol", "0", "0", "0"};
    String responseString = resList[0];
    String responseString1 = resList[1];
    String responseString2 = resList[2];
    String responseString3 = resList[3];
    String responseString4 = resList[4];

    assertEquals(responseString, responseSearch.data.get(0)[0]);
    assertEquals(responseString1, responseSearch.data.get(0)[1]);
    assertEquals(responseString2, responseSearch.data.get(0)[2]);
    assertEquals(responseString3, responseSearch.data.get(0)[3]);
    assertEquals(responseString4, responseSearch.data.get(0)[4]);

  }

  /**
   * This test checks a successful search with just the keyword.
   * @throws IOException - throws an exception
   */
  @Test
  public void testSearchCSV_OK_NoSpecs() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?search=Sol");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("success", responseSearch.result);
    String[] resList = {"0", "Sol", "0", "0", "0"};
    String responseString = resList[0];
    String responseString1 = resList[1];
    String responseString2 = resList[2];
    String responseString3 = resList[3];
    String responseString4 = resList[4];

    assertEquals(responseString, responseSearch.data.get(0)[0]);
    assertEquals(responseString1, responseSearch.data.get(0)[1]);
    assertEquals(responseString2, responseSearch.data.get(0)[2]);
    assertEquals(responseString3, responseSearch.data.get(0)[3]);
    assertEquals(responseString4, responseSearch.data.get(0)[4]);
  }

  /** This test checks a failing search result because there is not a valid keyword.
   * @throws IOException - throws an exception
   */
  @Test
  public void testSearchCSV_NonExistentKeyword() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    //assertEquals("Success! File: data/stars/ten-star.csv",response.filepath);
    // search
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?search=Sol1&I:2&y");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("error", responseSearch.result);
    assertEquals("seeking word not found", responseSearch.error_type);
  }

  /**
   * This test searches through an empty dataset.
   * @throws IOException - throws an exception
   */
  @Test
  public void testSearchCSV_Empty() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/testData/empty.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    //assertEquals("Success! File: data/stars/ten-star.csv",response.filepath);
    // search
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?search=Sol&I:2&y");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("error", responseSearch.result);
    assertEquals("error_datasource", responseSearch.error_type);
  }

  /** This test checks a failing search result because there is no keyword.
   * @throws IOException - throws an exception
   */
  @Test
  public void testSearchCSV_NoKeyword() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "loadCSV?filepath=data/stars/ten-star.csv");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    //assertEquals("Success! File: data/stars/ten-star.csv",response.filepath);
    // search
    HttpURLConnection clientConnectionSearch = tryRequest(
        "searchCSV?");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnectionSearch.getResponseCode());
    Moshi moshiSearch = new Moshi.Builder().build();
    SearchResponse responseSearch =
        moshiSearch.adapter(SearchResponse.class)
            .fromJson(new Buffer().readFrom(clientConnectionSearch.getInputStream()));
    assertEquals("error", responseSearch.result);
    assertEquals("Search not provided", responseSearch.error_type);
  }

  /**
   * This test checks the broadband working.
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPICensusBB() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "broadband?state=Rhode%20Island&county=Providence");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBB response =
        moshi.adapter(ResponseBB.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    assertEquals("success", response.result);
    assertEquals("Providence County, Rhode Island", response.address);
    assertEquals("85.4", response.bbNumber);
  }

  /**
   * This test checks a failing broadband request because no state was inputted.
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPICensusBB_NoState() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "broadband?");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBB response =
        moshi.adapter(ResponseBB.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    assertEquals("error", response.result);
    assertEquals("state or county not provided", response.error_type);
  }
  /**
   * This test checks a failing broadband request because no state was found (wrong input).
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPICensusBB_NotFound() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "broadband?state=Rode%20Island&county=Providence");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBB response =
        moshi.adapter(ResponseBB.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    assertEquals("error", response.result);
    assertEquals("seeking state Rode Island not found", response.error_type);
  }

  /**
   * This test checks a failing broadband request because no such county was found. (wrong input)
   * @throws IOException - throws an exception
   */
  @Test
  public void testAPICensusBB_NotFound_County() throws IOException {
    HttpURLConnection clientConnection = tryRequest(
        "broadband?state=Rhode%20Island&county=Cumberland");// Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    ResponseBB response =
        moshi.adapter(ResponseBB.class)
            .fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    clientConnection.disconnect();
    assertEquals("error", response.result);
    assertEquals("county Cumberland in Rhode Island. Not found", response.error_type);
  }

}