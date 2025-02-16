import { clickParameterized } from './script-extended.js';
import { clickPizzaButton } from './script-browser.js';


export const options = {
    scenarios: {
        protocol: {
            executor: 'ramping-vus',
            exec: 'load',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 10 },
                { duration: '3m', target: 10 },
                { duration: '1m', target: 0},
            ]
        },
        browser: {
            executor: 'constant-vus',
            exec: 'automation',
            vus: 1,
            duration: '5m',
            options: {
                browser: {
                  type: "chromium",
                },
              },
        }
    }
}

export function load () {
    clickParameterized();
}

export function automation () {
    clickPizzaButton();
}