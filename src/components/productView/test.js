/**
 * This custom React Hook provides functions to manage alerts in your application.
 * It allows you to add and remove alerts with specific titles, variants, and unique keys.
 *
 * @module useAlerts
 */
import React from 'react';

const useAlerts = () => {
  const [alerts, setAlerts] = React.useState([]);

  /**
   * Add an Alert
   *
   * This function adds an alert to the list of alerts
   *
   * @param {object} options
   */
  const addAlert = options => {
    setAlerts(prevAlerts => [...prevAlerts, options]);
  };

  /**
   * Remove an Alert by Key
   *
   * This function removes an alert from the list of alerts based on its unique key.
   *
   * @param {*} anyValue - Any AlertProps value. The more unique, such as an id, the more direct the removal from state.
   */
  const removeAlert = anyValue => {
    setAlerts(prevAlerts => [
      ...prevAlerts.filter(alert => Object.values(alert).find(value => anyValue === value) === undefined)
    ]);
  };
  // // ...prevAlerts.filter(alert => Object.entries(alert).find(([, value]) => anyValue === value) === undefined)

  return {
    removeAlert,
    addAlert,
    alerts
  };
};

export { useAlerts as default, useAlerts };
