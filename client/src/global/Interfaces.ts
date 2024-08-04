export interface ITransaction {
    id: string;
    currencyName: string;
    quantity: number;
    price: number;
    isBuy: boolean;
    date: Date;
    userId: string;
}

export interface IUserPortfolio {
    userId: string,
    currencyName: string,
    quantity: number, 
    id: string
}

export interface ShowTransactionsProps {
    transactions: ITransaction[];
}

export interface ShowUserPortfolioProps {
    userPortfolio: IUserPortfolio[];
}