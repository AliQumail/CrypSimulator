import { FC, useEffect, useState } from "react";
import { URL, USER_ID } from "../../../../constants";


interface IUserPortfolio {
  userId: string,
  currencyName: string,
  quantity: number, 
  id: string
}

interface ShowUserPortfolioProps {
  userPortfolio: IUserPortfolio[];
}

const ShowUserPortfolio: FC<ShowUserPortfolioProps> = ({ userPortfolio }) => {

  const [searchValue, setSearchValue] = useState("");
  const [filteredUserPortfolio, setfilteredUserPortfolio] = useState<IUserPortfolio[]>(userPortfolio);

  useEffect(() => {
    // Perform filtering whenever searchValue or transactions change
    const filtered = userPortfolio.filter(userPortfolio =>
      userPortfolio.currencyName.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log(filtered);
    setfilteredUserPortfolio(filtered);
  }, [searchValue, userPortfolio]);

  return (
    <div className="relative overflow-x-auto">
      <div className="search relative flex justify-end overflow-x-auto">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border-2 border-gray-400 rounded mt-4"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>
      <table className="w-full text-lg text-left rtl:text-right text-black-500 dark:text-black-400 mt-5">
        <thead className="text-lg text-black-900 uppercase dark:text-black-400 border-b-2 border-gray-200">
           <tr>
            <th>Currency Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <br/>
        <tbody>
          {filteredUserPortfolio && filteredUserPortfolio.length > 0 ? (
            filteredUserPortfolio.filter(port => port.currencyName !== "USD").map((tran) => (
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

