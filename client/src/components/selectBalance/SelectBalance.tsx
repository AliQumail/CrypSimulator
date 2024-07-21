import { URL } from "../../constants";
import { useNavigate } from 'react-router-dom';


const SelectBalance = () => {
    const amounts = [10000, 20000, 30000, 50000, 100000, 500000, 1000000];
    const userId = '3fd2fa93-06ba-486f-ade6-6c97bcc57a05';
    const navigate = useNavigate();
    
    async function handleSelectBalance(selectedAmount: number){
        console.log(selectedAmount);
        
        const postData = await fetch( URL + 'Transaction/AddTransaction', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currencyName: "USD",
              quantity: selectedAmount,
              price: selectedAmount,
              isBuy: true, 
              userId: userId
            })
          });
        if (postData) {
            console.log(postData);
            navigate("/dashboard", { replace: true });    
        }
    };

    function transformAmount(amount : number){
        return '$ ' + amount.toLocaleString();
    }

    return (
       
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-8">Select An Amount To Start Trading</h1>
            <div>
            {amounts.map((amount, index) => (
                <button key={index} onClick={() => handleSelectBalance(amount)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                 {transformAmount(amount)}
                </span>
                </button>
            ))}
            </div>
        </div>
    </>
    );
}

export default SelectBalance;