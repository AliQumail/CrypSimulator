import { FC } from "react";
import moment from 'moment';

interface ITransaction {
  id: string;
  currencyName: string;
  quantity: number;
  price: number;
  isBuy: boolean;
  date: Date;
  userId: string;
}

interface ShowTransactionsProps {
  transactions: ITransaction[];
}


const ShowTransactions: FC<ShowTransactionsProps> = ({ transactions }) => {

  
  const formatDate = (date: Date)   => {
    const formattedDate = moment(date).format('MM/DD/YYYY h:mm A');
    return formattedDate;
  } 

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-lg text-left rtl:text-right text-black-500 dark:text-black-400 mt-5">
        <thead className="text-lg text-black-900 uppercase dark:text-black-400 border-b-2 border-gray-200">
          <tr>
            <th>Currency</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>
        <br/>
        <tbody className="">
          {transactions && transactions.length > 0 ? (
            transactions.filter(tran=> tran.currencyName !== "USD").map((tran) => (
              <tr key={tran.id}> {/* Unique key for each row */}
                <td>{tran.currencyName}</td>
                <td>{tran.quantity}</td>
                <td>{tran.price}</td>
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

