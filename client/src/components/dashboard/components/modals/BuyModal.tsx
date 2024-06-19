import React, { useState } from "react";

const BuyModal = ({ price, currencyName, currentBalance, transactions, setTransactions, setCurrentBalance }: any) => {
  const [showModal, setShowModal] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(Number(price));

  const handleQuantity = (event: any) => {
    setQuantity(event.target.value);
    setTotalPrice(event.target.value*price);
  }

  const handleTotalPrice = (event: any) => {
    setTotalPrice(event.target.value);
    setQuantity(event.target.value/price);
  }

  const handleClose = () => {
    setQuantity(0);
    setTotalPrice(0);
    setShowModal(false);
  }

  const handleBuy = () => {
    if (totalPrice > currentBalance) {
        alert("Not enough balance");
        return;
    } else {
        setCurrentBalance(currentBalance- Number(totalPrice));
        const newTransaction: any = {
            currencyName: currencyName,
            quantity: quantity,
            price: Number(totalPrice),
            date: new Date(),
            isBuy: true,
        };

         // API Call here 
         fetch('http://localhost:5146/Transaction/AddTransaction', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTransaction),
        }).then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); 
        })


        
        setTransactions((prevTransactions: any) => [
            ...prevTransactions,
            newTransaction,
          ]);
          console.log(transactions);
    }

    handleClose();
  }

  return (
    <>
      <button 
        type="button" 
        className="text-white bg-green-700 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2"
        style={{ width: '200px' }}
        onClick={() => setShowModal(true)}
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
      > Buy </button>
      {showModal && (
        <div
          id="default-modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            ></span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Buy
                    </h3>
                    <p>Your current balance is $ {currentBalance} </p>
                    <br />
                    {
                      price > 0 ?
                      <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Quantity
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={handleQuantity}
                          id="default-input"
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Price
                        </label>
                        <input
                          type="text"
                          id="default-input"
                          value={totalPrice}
                          onChange={handleTotalPrice}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        />
                      </div>
                    </div> 
                      : <div>No currency selected!</div>
                    }
                    
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleBuy}
                  type="button"
                  disabled={price <= 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Buy
                </button>
                <button
                  onClick={handleClose}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyModal;
