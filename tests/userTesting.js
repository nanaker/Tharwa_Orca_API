//imports and constants
const base_url = "http://localhost:8081";
var request = require("request");

//tester la récupération des info du tableau de bord
describe("GET /users/dashboard", function () {
        it("Get the id and the userName of the user return with code 200", function (done) {
           request.get(
               {url : base_url + "/users/dashboard",
                headers : {
                    "Content-Type" : 'application/x-www-form-urlencoded',
                    "token" : "TujmG2z2og5oRN75JZuDK2CJLeiGTXvOYqcaof8nncN2EfeQfnmhnkcHC3jz8AbvBY1aELfEKpENFwg7MaPJ25Uc6kwhIVTg6GEmtoHqvgWEImXX97JDKHNbSMshrZHpTfP9y7zcg9n1UygnH14Ug5wdsjSjdyBXid9HvQFwJRlKvPPglLNi3MVxNT8XOnQH8az073frV5PU70cwCqQLOUXrdrDUFBmXBh6H1QECzcrJLSq4ItCdj5auUGFICaX"
                }},
               function (error, response, body) {
              expect(response.statusCode).toBe(200);
              done();
            });
        });
});