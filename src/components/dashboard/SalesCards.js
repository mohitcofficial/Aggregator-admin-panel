import React from "react";
import styles from "./SalesCards.module.css";

function SalesCards({
  leads = 120,
  qualityLeads = 70,
  bookings = 20,
  renewals = 2,
  conversionRate = 18,
  profit = 180000,
}) {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <p className={styles.cardText}>Total Leads</p>
        <h3 className={styles.cardData}>{leads}</h3>
      </div>

      <div className={styles.card}>
        <p className={styles.cardText}>Quality Leads</p>
        <h3 className={styles.cardData}>{qualityLeads}</h3>
      </div>

      <div className={styles.card}>
        <p className={styles.cardText}>Bookings</p>
        <h3
          className={styles.cardData}
          style={{
            color: "#002c8a",
          }}
        >
          {bookings}
        </h3>
      </div>
      <div className={styles.card}>
        <p className={styles.cardText}>Renewals</p>
        <h3
          className={styles.cardData}
          style={{
            color: "#F7AC02",
          }}
        >
          {renewals}
        </h3>
      </div>
      <div className={styles.card}>
        <p className={styles.cardText}>Conversion Rate</p>
        <h3
          className={styles.cardData}
          style={{
            color: "#DA3225",
          }}
        >
          {conversionRate}%
        </h3>
      </div>
      <div className={styles.card}>
        <p className={styles.cardText}>Profit</p>
        <h3
          className={styles.cardData}
          style={{
            color: "rgb(0, 122, 0)",
          }}
        >
          ₹{profit}
        </h3>
      </div>
    </div>
  );
}

export default SalesCards;
