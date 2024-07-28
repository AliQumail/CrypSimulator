import { useState, useEffect, useRef } from "react";
import { formatData } from "../../utils";
import BuyModal from "./components/modals/BuyModal";
import SellModal from "./components/modals/SellModal";
import axios from "axios";
import { URL, USER_ID } from "../../constants";
import ShowTransactions from "./components/showTransactions/ShowTransactions";
import ShowUserPortfolio from "./components/showUserPortfolio/ShowUserPortfolio";

interface ITransaction {
  id: string;
  currencyName: string;
  quantity: number;
  price: number;
  isBuy: boolean;
  date: Date;
  userId: string;
}

interface IUserCurrencyHoldings {
  userId: string;
  currencyName: string;
  amount: number;
}

enum ScreenTypes {
  ShowTransactions = "ShowTransactions",
  ShowUserPortfolio = "ShowUserPortfolio",
  ShowCurrencies = "ShowCurrencies",
}

export default function User() {
  const amount = 0;

  const [currentBalance, setcurrentBalance] = useState(amount);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [userCurrencyHoldings, setUserCurrencyHoldings] = useState<
    IUserCurrencyHoldings[]
  >([]);

  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00"); // my code
  const [productId, setProductId] = useState(""); //
  const [pastData, setpastData] = useState({});
  const ws: any = useRef(null);
  const [records, setRecords] = useState([]);

  const [currentScreenType, setCurrentScreenType] = useState(
    ScreenTypes.ShowCurrencies
  );

  const GetUserBalance = async () => {
    try {
      const response = await fetch(
        URL + "Portfolio/GetUserUSDBalance?userId=" + USER_ID
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data.price");
        console.log(data.quantity);
        setcurrentBalance(data.quantity);
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
    GetUserBalance();
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

  const GetTransactionsByUser = async () => {
    try {
      const response = await fetch(
        URL + "Transaction/GetTransactionsByUser?userId=" + USER_ID
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTransactions(data);
        console.log(transactions);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleScreenType = (currentScreenType: any) => {
    console.log("/----/");
    console.log(currentScreenType);
    setCurrentScreenType(currentScreenType);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          {/* <BuyModal
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
          /> */}
          <div className="card border-left-primary shadow h-100 py-2 mt-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col m-3">
                  <div className="text-lg text-blue-800 font-weight-bold text-uppercase mb-1">
                    Initial Balance
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    20000
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-left-primary shadow h-100 py-2 mt-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col m-3">
                  <div className="text-lg text-blue-800 font-weight-bold text-uppercase mb-1">
                    Current Balance
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    20000
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-left-primary shadow h-100 py-2 mt-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col m-3">
                  <div className="text-lg text-blue-800 font-weight-bold text-uppercase mb-1">
                    Profit
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    20000
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-left-primary shadow h-100 py-2 mt-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col m-3">
                  <div className="text-lg text-blue-800 font-weight-bold text-uppercase mb-1">
                    Profit %
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    20000
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-span-9">
          <div className="text-md font-medium text-center text-black-500 border-b border-black-200 dark:text-black-400 dark:border-black-700">
            <ul className="flex flex-wrap -mb-px mb-5">
              <li className="me-2">
                <button
                  onClick={() => handleScreenType(ScreenTypes.ShowCurrencies)}
                  type="button"
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-blue-900 hover:border-blue-500 dark:hover:text-blue-500"
                >
                  Currencies
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() => handleScreenType(ScreenTypes.ShowTransactions)}
                  type="button"
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-blue-900 hover:border-blue-500 dark:hover:text-blue-500"
                >
                  Transactions
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() =>
                    handleScreenType(ScreenTypes.ShowUserPortfolio)
                  }
                  type="button"
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-blue-900 hover:border-blue-500 dark:hover:text-blue-500"
                >
                  User Portfolio
                </button>
              </li>
            </ul>
          </div>

          {currentScreenType === ScreenTypes.ShowTransactions && (
            <ShowTransactions transactions={transactions} />
          )}
          {currentScreenType === ScreenTypes.ShowCurrencies && (
            <div>
              <h4>Current Balance: $ {currentBalance.toLocaleString()} </h4>
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

          {currentScreenType === ScreenTypes.ShowUserPortfolio && (
            <ShowUserPortfolio />
          )}
        </div>
      </div>
    </div>
  );
}
