import { FC, useEffect, useState } from "react";
import { URL, USER_ID } from "../../../../constants";

interface IUserPortfolio {
  userId: string,
  currencyName: string,
  quantity: number, 
  id: string
}


const ShowUserPortfolio = () => {
  const [userPortfolio, setuserPortfolio] = useState<IUserPortfolio[]>();

  useEffect(()=>{
    GetUserPortfolio();
  })

  const GetUserPortfolio = async () => {
    try {
      const response = await fetch(URL + "Portfolio/GetUserPorfolio?userId=" +  USER_ID);
      if (response.ok){
        const data = await response.json();
        console.log(data);
        setuserPortfolio(data);
      
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Currency Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
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

