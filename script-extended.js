import http from "k6/http";
import { sleep, check } from 'k6';
import { SharedArray } from "k6/data";

export const options = {
    // vus: 10,
    // duration: '10s',
    stages: [
        { duration: "5s", target: 10 },
        { duration: "5m", target: 10 },
        { duration: "5s", target: 0 },
      ],
    thresholds: {
      "http_req_duration": ["p(95)<5000"],
    },
  };

const BASE_URL = __ENV.BASE_URL || "http://localhost:3333";
const customers = new SharedArray('all my customers', function () {
    return JSON.parse(open('./customers.json')).customers;
  });

export default function () {
  clickParameterized();

}

export function clickParameterized() {
  let restrictions = {
    maxCaloriesPerSlice: 500,
    mustBeVegetarian: false,
    excludedIngredients: ["pepperoni"],
    excludedTools: ["knife"],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };
  let res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
    headers: {
      "Content-Type": 'application/json',
      "X-User-ID": customers[Math.floor(Math.random() * customers.length)],
    },
  });
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  console.log(`${res.json().pizza.name} (${res.json().pizza.ingredients.length} ingredients)`);
  sleep(Math.random() * 5);
}