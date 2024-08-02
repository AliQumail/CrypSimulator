import { useState, useEffect, useRef } from "react";
import { formatData } from "../../utils";
import BuyModal from "./components/modals/BuyModal";
import SellModal from "./components/modals/SellModal";
import axios from "axios";
import { URL, USER_ID } from "../../constants";
import ShowTransactions from "./components/showTransactions/ShowTransactions";
import ShowUserPortfolio from "./components/showUserPortfolio/ShowUserPortfolio";
import HistoryChart from "./components/chart/HistoryChart";
import ResetModal from "./components/modals/ResetModal";

interface ITransaction {
  id: string;
  currencyName: string;
  quantity: number;
  price: number;
  isBuy: boolean;
  date: Date;
  userId: string;
}

interface IUserPortfolio {
  userId: string,
  currencyName: string,
  quantity: number, 
  id: string
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

  const [initialBalance, setInitialBalance] = useState(amount);
  const [currentBalance, setcurrentBalance] = useState(amount);

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<IUserPortfolio[]>([]);
  const [userCurrencyHoldings, setUserCurrencyHoldings] = useState<IUserCurrencyHoldings[]>([]);
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00");
  const [productId, setProductId] = useState("");
  const [pastData, setpastData] = useState({});
  const ws: any = useRef<WebSocket | null>(null);
  const [records, setRecords] = useState([]);

  const [currentScreenType, setCurrentScreenType] = useState(ScreenTypes.ShowCurrencies);

  const GetUserBalance = async () => {
    try {
      const response = await fetch(URL + "Transaction/GetUserBalance?userId=" + USER_ID);
      if (response.ok) {
        const data = await response.json();
        setcurrentBalance(data.currentBalance);
        setInitialBalance(data.initialBalance);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const updateLatestPrice = async () => {
    let newRecords : any = records.map((obj: any) => ({ ...obj, latestPrice: 20 }));
    setRecords(newRecords);
  };

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  const GetUserPortfolio = async () => {
    try {
      const response = await fetch(URL + "Portfolio/GetUserPorfolio?userId=" + USER_ID);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserPortfolio(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    GetTransactionsByUser();
    GetUserBalance();
    GetUserPortfolio();

    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    ws.current.onopen = () => {
      console.log('WebSocket is connected');
      
      // Fetch available products and filter currencies
      const apiCall = async () => {
        let pairs: any = [];
        await fetch(url + "/products")
          .then((res) => res.json())
          .then((data) => (pairs = data));
        
        let filtered = pairs.filter((pair: any) => pair.quote_currency === "USD");
        filtered = filtered.sort((a: any, b: any) => (a.base_currency < b.base_currency ? -1 : 1));
        setcurrencies(filtered);
        first.current = true;
      };

      apiCall();
    };

    ws.current.onclose = () => {
      console.log('WebSocket is closed');
    };

    ws.current.onerror = (error: any) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!first.current || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const unsubscribeMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"],
    };
    const jsonUnsubMsg = JSON.stringify(unsubscribeMsg);
    ws.current.send(jsonUnsubMsg);

    const subscribeMsg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"],
    };
    const jsonSubMsg = JSON.stringify(subscribeMsg);
    ws.current.send(jsonSubMsg);

    ws.current.onmessage = (e: any) => {
      const data = JSON.parse(e.data);

      if (data.type === "ticker" && data.product_id === pair) {
        setprice(data.price);
        setProductId(data.product_id);
      }
    };

    const historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;

    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => {
          dataArr = data;
          const formattedData = formatData(dataArr);
          setpastData(formattedData);
        });
    };

    fetchHistoricalData();
  }, [pair]);

  useEffect(() => {
    if (records.length > 0) {
      updateLatestPrice();
    }
  }, [records]);

  const handleSelect = (e: any) => {
    setpair(e.target.value);
  };

  const [showTransactions, setShowTransactions] = useState<Boolean>(false);
  const handleShowTransactions = () => {
    setShowTransactions(prevVal => !prevVal);
  };

  const GetTransactionsByUser = async () => {
    try {
      const response = await fetch(URL + "Transaction/GetTransactionsByUser?userId=" + USER_ID);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleScreenType = (currentScreenType: any) => {
    setCurrentScreenType(currentScreenType);
  };

  const profit = (currentBalance - initialBalance).toLocaleString();

  return (
    <div className="container mx-auto px-10 mt-5">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          {/* Sidebar or other content */}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          {/* Cards for displaying balances and profit */}
          <div className="card border-left-primary shadow h-100 py-2 mt-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col m-3">
                  <div className="text-lg text-blue-800 font-weight-bold text-uppercase mb-1">
                    INITIAL BALANCE
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    $ {initialBalance.toLocaleString()}
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
                    CURRENT BALANCE
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    $ {currentBalance.toLocaleString()}
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
                    PROFIT
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    $ {profit}
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
                    PROFIT %
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {(currentBalance / initialBalance - 1) * 100} %
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ResetModal/>
          </div>
        </div>
        <div className="col-span-9">
          <div className="text-md font-medium text-center text-black-500 border-b border-black-200 dark:text-black-400 dark:border-black-700">
            <ul className="flex flex-wrap -mb-px mb-5">
              <li className="me-2">
                <button
                  onClick={() => handleScreenType(ScreenTypes.ShowCurrencies)}
                  type="button"
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    currentScreenType === ScreenTypes.ShowCurrencies
                      ? 'text-red-900 border-red-500'
                      : 'border-transparent hover:text-red-900 hover:border-red-500'
                  } dark:hover:text-red-500`} 
                >
                  TRADE
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() => handleScreenType(ScreenTypes.ShowTransactions)}
                  type="button"
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    currentScreenType === ScreenTypes.ShowTransactions
                      ? 'text-red-900 border-red-500'
                      : 'border-transparent hover:text-red-900 hover:border-red-500'
                  } dark:hover:text-red-500`} >
                  TRANSACTIONS
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() =>
                    handleScreenType(ScreenTypes.ShowUserPortfolio)
                  }
                  type="button"
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    currentScreenType === ScreenTypes.ShowUserPortfolio
                      ? 'text-red-900 border-red-500'
                      : 'border-transparent hover:text-red-900 hover:border-red-500'
                  } dark:hover:text-red-500`} >
                  PORTFOLIO
                </button>
              </li>
            </ul>
          </div>

          {currentScreenType === ScreenTypes.ShowTransactions && (
            <ShowTransactions transactions={transactions} />
          )}
          {currentScreenType === ScreenTypes.ShowCurrencies && (
            <div className="flex flex-col items-start justify-start mt-5">
              <div>
                <BuyModal
                  price={price}
                  currencyName={productId}
                  currentBalance={currentBalance}
                  transactions={transactions}
                  userPortfolio={userPortfolio}
                  setUserPortfolio={setUserPortfolio}
                  setTransactions={setTransactions}
                  setCurrentBalance={setcurrentBalance}

                />

                <SellModal
                  price={price}
                  currencyName={productId}
                  currentBalance={currentBalance}
                  transactions={transactions}
                  userPortfolio={userPortfolio}
                  setUserPortfolio={setUserPortfolio}
                  setTransactions={setTransactions}
                  setCurrentBalance={setcurrentBalance}
                  userCurrencyHoldings={userCurrencyHoldings}
                  setUserCurrencyHoldings={setUserCurrencyHoldings}
                />
                <b>Select Currency: </b>
                <select name="currency" value={pair} onChange={handleSelect} className="border-black border-2 m-1">
                  <label>SELECT CURRENCY</label>
                  {currencies.map((cur: any, idx: number) => (
                    <option key={idx} value={cur.id}>
                      {cur.display_name}
                    </option>
                  ))}
                </select>
                <b>Price:</b>$ {price}
              </div>

              <HistoryChart price={price} data={pastData} />  
            </div>
          )}

          {currentScreenType === ScreenTypes.ShowUserPortfolio && (
            <ShowUserPortfolio userPortfolio={userPortfolio}/>
          )}
        </div>
      </div>
    </div>
  );
}
