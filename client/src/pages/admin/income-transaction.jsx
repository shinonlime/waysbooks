import {useQuery, useMutation} from "react-query";
import {useState, useEffect} from "react";
import {API} from "../../config/api";

export default function IncomeTransaction() {
    const title = "Income Transaction";
    document.title = "WaysBooks | " + title;

    let {data: transaction, refetch} = useQuery("transactionsCache", async () => {
        const response = await API.get("/transaction");
        return response.data.data;
    });

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };
    return (
        <div class="mx-20">
            <h4 className="font-serif text-2xl md:text-3xl font-bold mb-3 ml-24 md:mb-6">Income Transaction</h4>
            <table class="mx-auto table-auto w-5/6 text-sm text-left text-gray-500 dark:text-gray-400 border">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            No
                        </th>
                        <th scope="col" class="pl-6 pr-20 py-3">
                            ID Transaction
                        </th>
                        <th scope="col" class="pl-6 pr-20 py-3">
                            Users
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Book Purchased
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Total Payment
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Status Payment
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transaction?.map((data, index) => (
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th class="px-6 py-4 font-medium text-gray-900">{index + 1}</th>
                            <th class="pl-6 pr-auto py-4 font-medium text-gray-900">{data.id}</th>
                            <td class="pl-6 pr-auto py-4">{data.name}</td>
                            <td class="px-6 py-4 -all">{data.book_purchases.map((book) => <span>{book.title}</span>).reduce((prev, curr) => [prev, ", ", curr])}</td>
                            <td class="px-6 py-4">{rupiah(data.total)}</td>
                            {data.status === "success" ? (
                                <td class="px-6 py-4 text-green-500 font-semibold">Success</td>
                            ) : data.status === "pending" ? (
                                <td class="px-6 py-4 text-yellow-400 font-semibold">Pending</td>
                            ) : data.status === "failed" ? (
                                <td class="px-6 py-4 text-red-500 font-semibold">Failed</td>
                            ) : (
                                <td class="px-6 py-4 text-blue-500 font-semibold">Waiting</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
