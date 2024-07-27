import { FC } from "react";

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
  return (
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
          {transactions && transactions.length > 0 ? (
            transactions.filter(tran=> tran.currencyName !== "USD").map((tran) => (
              <tr key={tran.id}> {/* Unique key for each row */}
                <td>{tran.currencyName}</td>
                <td>{tran.quantity}</td>
                <td>{tran.price}</td>
                <td>{tran.isBuy ? "Bought" : "Sold"}</td>
                <td>{tran.date.toString()}</td>
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

