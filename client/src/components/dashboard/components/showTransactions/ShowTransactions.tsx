import { FC, useState, useEffect } from "react";
import moment from 'moment';
import { ITransaction, ShowTransactionsProps } from "../../../../global/Interfaces";

const ShowTransactions: FC<ShowTransactionsProps> = ({ transactions }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactions);

  const formatDate = (date: Date) => {
    return moment(date).format('MM/DD/YYYY h:mm A');
  }

  useEffect(() => {
    // Perform filtering whenever searchValue or transactions change
    const filtered = transactions.filter(transaction =>
      transaction.currencyName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchValue, transactions]);

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
            <th>Currency</th>
            <th>Quantity</th>
            <th>Price $</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>
        <br/>
        <tbody className="">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.filter(tran => tran.currencyName !== "USD").map(tran => (
              <tr key={tran.id}> {/* Unique key for each row */}
                <td>{tran.currencyName}</td>
                <td>{tran.quantity}</td>
                <td>{tran.price.toLocaleString()}</td>
                <td style={{ color: tran.isBuy ? 'green' : 'red' }}>{tran.isBuy ? "BOUGHT" : "SOLD"}</td>
                <td>{formatDate(tran.date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">No transactions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowTransactions;
