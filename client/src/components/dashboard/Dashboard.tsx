import { useState, useEffect, useRef } from "react";
import { formatData } from "../../utils";
import BuyModal from "./components/modals/BuyModal";
import SellModal from "./components/modals/SellModal";
import axios from 'axios';
import { URL } from "../../constants";

interface ITransaction {
  id: string
  currencyName: string;
  quantity: number;
  price: number;
  isBuy: boolean;
  date: Date;
  userId: string
}

interface IUserCurrencyHoldings {
  userId: string, 
  currencyName: string, 
  amount: number 
}

export default function User() {
  const amount = 10000;

  const [currentBalance, setcurrentBalance] = useState(amount);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [userCurrencyHoldings, setUserCurrencyHoldings] = useState<IUserCurrencyHoldings[]>([]);

 
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00"); // my code
  const [productId, setProductId] = useState(""); //
  const [pastData, setpastData] = useState({});
  const ws: any = useRef(null);
  const [records, setRecords] = useState([]);

  const USER_ID = 'b366d3cb-26ef-43b1-b2eb-89ecb7bff869'
  const GetTransactionsByUser = async () => {
    try {
      const response = await fetch("http://localhost:5146/Transaction/GetTransactionsByUser?userId=b366d3cb-26ef-43b1-b2eb-89ecb7bff869");
      if (response.ok){
        const data = await response.json();
        console.log(data);
        setTransactions(data);
        console.log(transactions);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const updateLatestPrice = async () => {
    let newRecords: any = records.map((obj: any) => {
      return { ...obj, latestPrice: 20 };
    });
  
    setRecords(newRecords);
  };

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    GetTransactionsByUser(); 
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
   
      // if (newData.productId === "BTC-USD") {
      //   setBtcPrice(newData.price);
      // }
    };
    // try code

    let jsonMsg = JSON.stringify(msg);

    ws.current.send(jsonMsg);

    ws.current.onmessage = (e: any) => {
      let data = JSON.parse(e.data);

      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
        setProductId(data.product_id);
      }
    };

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
  
    const fetchHistoricalData = async () => {
      let dataArr: any = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => {
          dataArr = data;
        
          let formattedData = formatData(dataArr);
          setpastData(formattedData);
        });
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

  const [showTransactions, setShowTransactions] = useState<Boolean>(false);
  const handleShowTransactions = () => {
    setShowTransactions((prevVal) => !prevVal);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <BuyModal
            price={price}
            currencyName={productId}
            currentBalance={currentBalance}
            transactions={transactions}
            setTransactions={setTransactions}
            setCurrentBalance={setcurrentBalance}
          />
          
          <SellModal
            price={price}
            currencyName={productId}
            currentBalance={currentBalance}
            transactions={transactions}
            setTransactions={setTransactions}
            setCurrentBalance={setcurrentBalance}
            userCurrencyHoldings={userCurrencyHoldings}
            setUserCurrencyHoldings={setUserCurrencyHoldings}
          />

          

        </div>
        <div className="col-span-9">
          <button onClick={handleShowTransactions} type="button">
            {showTransactions ? "Show graph" : "Show transactions"}
          </button>
          {showTransactions ? (
            <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Currency</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {
                transactions.map((tran) => {
                  return  <tr>
                  <td>{tran.currencyName}</td>
                  <td>{tran.quantity}</td>
                  <td>{tran.price}</td>
                  <td>{tran.isBuy ? 'Bought': 'Sold'}</td>
                  <td>{tran.date.toString()}</td>
                </tr>
                })
              }
            </tbody>
          </table>
          </div>
          ) : (
            <div>
              <h4>Current Balance: {currentBalance} </h4>
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
              {/* <HistoryChart price={price} data={pastData} />       */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
