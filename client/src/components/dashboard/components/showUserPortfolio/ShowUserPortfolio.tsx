import { FC, useEffect, useState } from "react";
import { URL, USER_ID } from "../../../../constants";

interface IUserPortfolio {
  userId: string,
  currencyName: string,
  quantity: number, 
  id: string
}


const ShowUserPortfolio = () => {
  const [userPortfolio, setUserPortfolio] = useState<IUserPortfolio[]>();

  useEffect(() => {
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

    GetUserPortfolio();
  }, []);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-lg text-left rtl:text-right text-black-500 dark:text-black-400 mt-5">
        <thead className="text-lg text-black-900 uppercase dark:text-black-400 border-b-2 border-gray-200">
           <tr>
            <th>Currency Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <br/>
        <tbody>
          {userPortfolio && userPortfolio.length > 0 ? (
            userPortfolio.filter(tran=> tran.currencyName !== "USD").map((tran) => (
              <tr key={tran.id}> {/* Unique key for each row */}
                <td>{tran.currencyName}</td>
                <td>{tran.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">You don't own any currency</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowUserPortfolio;

