import { useEffect, useState } from "react";
import { URL, USER_ID } from "../../constants";
import { useNavigate } from "react-router-dom";

const SelectBalance = () => {
  const amounts = [10000, 20000, 30000, 50000, 100000, 500000, 1000000];
  const [balanceExists, setBalanceExists] = useState(false);
  const navigate = useNavigate();

  async function handleSelectBalance(selectedAmount: number) {
    console.log(selectedAmount);

    const postData = await fetch(URL + "Transaction/AddTransaction", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currencyName: "USD",
        quantity: selectedAmount,
        price: selectedAmount,
        isBuy: true,
        userId: USER_ID,
      }),
    });
    if (postData) {
        NavigateToDashboard();
    }
  }

  function transformAmount(amount: number) {
    return "$ " + amount.toLocaleString();
  }

  useEffect(() => {
    CheckExistingUSDBalance();
  });

  const NavigateToDashboard = () => {
    navigate("/dashboard", { replace: true });
  }

  const CheckExistingUSDBalance = async () => {
    try {
      const response = await fetch(
        URL + "Portfolio/GetUserUSDBalance?userId=" + USER_ID
      );
      console.log("response");

      if (response.ok) {
        const data = await response.json();
        if (data) setBalanceExists(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        {balanceExists ? (
          <div>
            <h1 className="text-2xl font-bold mb-8 text-red-500">
              Your balance already exists. Please proceed to the dashboard.
            </h1>
            <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
             onClick={NavigateToDashboard}
            >Let's go</button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">
              Select An Amount To Start Trading
            </h1>
            <div>
              {amounts.map((amount, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectBalance(amount)}
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    {transformAmount(amount)}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SelectBalance;
