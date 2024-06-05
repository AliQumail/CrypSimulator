import React, { useState, useEffect, useRef } from "react";
//import Dashboard from "./components/Dashboard";
import { formatData } from "../../utils";

// import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import HistoryChart from "./components/chart/HistoryChart";
// import TotalStats from "./components/TotalStats";
// import Records from "./components/Records";
// import CurrencyStats from "./components/CurrencyStats";
// import Features from "./components/Features";
// import NavBar from "../navbar/NavBar";

export default function User() {
  const [userDetails, setUserDetails] = useState({});
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00"); // my code
  const [productId, setProductId] = useState(""); //
  const [pastData, setpastData] = useState({});
  const ws: any = useRef(null);
  const [money, setMoney] = useState(500000); // my code
  const [tracker, setTracker] = useState([]);
  const [btcPrice, setBtcPrice] = useState(0); // my code
  const [currentBalance, setCurrentBalance] = useState();
  const [boughtCurrency, setBoughtCurrency] = useState({
    type: "",
    boughtPrice: " ",
  });

  const [newPrices, setNewPrices] = useState([]);
  const [records, setRecords] = useState([]);

  // Getting user details from backend
  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.removeItem("token");
    //window.location.href = "/signin";
  }

  

  


  const updateLatestPrice = async () => {
    let newRecords: any = records.map((obj:any) => {
      return { ...obj, latestPrice: 20 };
    });
    console.log("newRecords")
    console.log(newRecords);
    setRecords(newRecords);
  };


  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    let pairs: any = [];

    // pairs RETURN ALL CURRENCIES AND THEIR VALUES
    const apiCall = async () => {
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));

      // FILTER OUT ANY CURRENCY EXPECT FOR USD
      let filtered = pairs.filter((pair: any) => {
        if (pair.quote_currency === "USD") {
          return pair;
        }
      });

      // SORTS THE CURRENCIES IN ALPHABETICAL ORDER
      filtered = filtered.sort((a: any, b: any) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });

      console.log("what is filtered");
      console.log(filtered);
      setcurrencies(filtered);
      first.current = true;
    };

    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      return;
    }

    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"],
    };

    // try code
    let newMsg = {
      type: "unsubscribe",
      product_ids: ["BTC-USD"],
      channels: [""],
    };
    let newJsonMsg = JSON.stringify(newMsg);
    ws.current.send(newJsonMsg);

    ws.current.onmessage = (e: any) => {
      let newData = JSON.parse(e.data);
      console.log("new data" + newData);
      if (newData.productId === "BTC-USD") {
        setBtcPrice(newData.price);
      }
    };
    // try code

    let jsonMsg = JSON.stringify(msg);

    ws.current.send(jsonMsg);

    ws.current.onmessage = (e: any) => {
      let data = JSON.parse(e.data);

      if (data.type !== "ticker") {
        return;
      }
      console.log("the value in pair" + pair);
      if (data.product_id === pair) {
        setprice(data.price);
        setProductId(data.product_id);
      }
      // if (data.product_id === "BTC-USD") {
      //   setBtcPrice(data.price);
      // }

      //   for (let i = 0; i < records.length; i++) {
      //     if (data.product_id === records[i].currency) {
      //       records[i].latestPrice = data.price;
      //     }
      //   }
    };

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    console.log("historical data URL");
    console.log(historicalDataURL);
    const fetchHistoricalData = async () => {
      let dataArr: any = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr);

      setpastData(formattedData);
    };

    fetchHistoricalData();
  }, [pair]);
  
  useEffect(() => {
    if (records.length > 0) {
      updateLatestPrice();
    }
  }, []);

  const handleSelect = (e: any) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"],
    };
    let unsub = JSON.stringify(unsubMsg);
    setpair(e.target.value);
  };

  return (
    <div>
      <div className="container mt-4">
        <hr/>
            {
              <select name="currency" value={pair} onChange={handleSelect}>
                {currencies.map((cur: any, idx: number) => {
                  return (
                    <option key={idx} value={cur.id}>
                      {cur.display_name}
                    </option>
                  );
                })}
              </select>
            }
            price {price}
            <HistoryChart price={price} data={pastData} />      
      </div>
    </div>
  );
}
