import { useEffect, useState } from "react";
import { URL, USER_ID } from "../../constants";
import { useNavigate } from "react-router-dom";

const SelectBalance = () => {
  const amounts = [10000, 20000, 30000, 50000, 100000, 500000, 1000000];
  const [balanceExists, setBalanceExists] = useState(false);
  const navigate = useNavigate();

  async function handleSelectBalance(selectedAmount: number) {
    const postData = await fetch(URL + "Transaction/AddUserBalance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: USER_ID,
        initialBalance: selectedAmount
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
        URL + "Transaction/GetUserBalance?userId=" + USER_ID
      );

      if (response.ok) {
        const data = await response.json();
        if (data) setBalanceExists(true);
      }
    } catch (error) {
      
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
            <button type="button" 
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
