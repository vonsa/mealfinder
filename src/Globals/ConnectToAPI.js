export class ConnectToAPI {
  /*
    API GET request
  */
  static fetchMeals(url, input, callbackFn) {
    console.log(url + input);
    fetch(url + input)
      .then(function (response) {
        if (response.status !== 200) {
          callbackFn(response);
          return;
        }
        // Examine the text in the response
        response.json().then(function (data) {
          callbackFn(data);
        });
      })
      .catch(function (err) {
        callbackFn(err);
      });
  }
}
