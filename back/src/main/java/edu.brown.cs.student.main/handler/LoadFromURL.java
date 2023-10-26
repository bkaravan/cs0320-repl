package edu.brown.cs.student.main.handler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.exceptions.DatasourceException;
import edu.brown.cs.student.main.server.Storage;
import java.util.Arrays;
import okio.Buffer;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

/**
 * This class is dealing with loading the requests from URLs.
 */
public class LoadFromURL {
    public Storage storage;

    /**
     * Dealing with loading the requests from URL.
     * @param requestURL -- the requested URL.
     * @throws DatasourceException -- throws an exception if the data provided is bad.
     */
    public  LoadFromURL(URL  requestURL) throws DatasourceException {
        Moshi moshi = new Moshi.Builder().build();
        try {
            HttpURLConnection clientConnection = connect(requestURL);
            Type mapStringObject = Types.newParameterizedType(List.class, String[].class);
            JsonAdapter<List<String[]>> adapterR = moshi.adapter(mapStringObject);
            List<String[]> res = adapterR.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
            clientConnection.disconnect();

            // convert data to our internal format for CSV
            List<List<String>> MyRes = new ArrayList<>();
          for (String[] currRow : res) {
            List<String> currLs = new ArrayList<>();
              currLs.addAll(Arrays.asList(currRow));
            MyRes.add(currLs);
          }

            this.storage = new Storage();
            this.storage.loadData(MyRes);
        } catch (IOException e) {
            throw new DatasourceException(e.getMessage());
        }
    }

    /**
     * This method deals with establishing the HttpURL connection by processing the provided URL.
     * @param requestURL -- the URL that we are provided.
     * @return -- clientConnection status.
     * @throws DatasourceException -- throws an exception if the API connection wasn't established correctly
     * @throws IOException -- gets thrown if an I/O exception occurs.
     */
    private static HttpURLConnection connect(URL requestURL) throws DatasourceException, IOException {
        URLConnection urlConnection = requestURL.openConnection();
        if(! (urlConnection instanceof HttpURLConnection))
            throw new DatasourceException("unexpected: result of connection wasn't HTTP");
        HttpURLConnection clientConnection = (HttpURLConnection) urlConnection;
        clientConnection.connect(); // GET
        if(clientConnection.getResponseCode() != 200)
            throw new DatasourceException("unexpected: API connection not success status "+clientConnection.getResponseMessage());
        return clientConnection;
    }

}


