package edu.brown.cs.student.main;

import static spark.Spark.after;
import static spark.Spark.put;

import edu.brown.cs.student.main.handler.LoadCensusHandler;
import edu.brown.cs.student.main.handler.LoadHandler;
import edu.brown.cs.student.main.handler.ReloadHandler;
import edu.brown.cs.student.main.handler.SearchHandler;
import edu.brown.cs.student.main.handler.ViewHandler;
import edu.brown.cs.student.main.parser.FactoryFailureException;
import edu.brown.cs.student.main.server.Storage;
import java.io.IOException;
import java.util.ArrayList;
import spark.Spark;

/**
 * The Main class of our project. This is where execution begins.
 */
public class Main {

  private ArrayList<String> endpoints;


  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   */


  public static void main(String[] args) throws IOException, FactoryFailureException {

    int port = 2020;
    Spark.port(port);
    after((request, response) -> {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Methods", "*");
    });

    Storage csvStorage = new Storage();
    // Setting up the edu.brown.cs.student.main.handler for the GET /order and /mock endpoints
    Spark.get("loadcsv", new LoadHandler(csvStorage));
    Spark.get("viewcsv", new ViewHandler(csvStorage));
    Spark.get("searchcsv", new SearchHandler(csvStorage));
    Spark.get("broadband", new LoadCensusHandler(csvStorage));
    Spark.get("reload", new ReloadHandler(csvStorage));

    Spark.init();
    Spark.awaitInitialization();
    System.out.println("running");

    System.out.println("Server started at http://localhost:" + port);
  }

  Main(String[] args) {
  }

}