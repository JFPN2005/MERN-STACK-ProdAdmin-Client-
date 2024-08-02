import { ActionFunctionArgs, Form, redirect, useFetcher, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { deleteProduct } from "../services/ProductService";

export async function action({params}: ActionFunctionArgs) {
    if(params.id !== undefined) {
       await deleteProduct(+params.id)
       return redirect('/')
    }
}

type ProductDetailsProps = {
    product: Product;
}
export default function ProductDetails({product}: ProductDetailsProps) {
    const fetcher = useFetcher()
    const navigate = useNavigate()
    const isAvailable = product.availability
  return (
    <tr className="border-b ">
        <td className="p-3 text-lg text-gray-800">
            {product.name}
        </td>
        <td className="p-3 text-lg text-gray-800">
            {formatCurrency(product.price)}
        </td>
        <td className="p-3 text-lg text-gray-800">
            <fetcher.Form method="POST">
                <button 
                    type="submit"
                    name="id"
                    value={product.id}
                    className={`${isAvailable ? 'text-black' : 'text-red-600'} rounded-lg p-2 text-xs uppercase font-bold w-full border border-black-200 hover:cursor-pointer`}
                >
                    {isAvailable ? "Disponible" : "No Disponible"}
                </button>
            </fetcher.Form>
        </td>
        <td className="p-3 text-lg text-gray-800 ">
            <div className="flex gap-2 items-center">
                <button 
                onClick={() => navigate(`productos/${product.id}/editar`)}
                className="bg-emerald-600 p-2 w-full rounded-lg text-white text-sm text-center uppercase font-bold"

                >Editar</button>
                <Form 
                    className="w-full"
                    method="POST" 
                    action={`productos/${product.id}/eliminar`}
                    // El onSubmit se ejecuta antes que el action
                    onSubmit={(e) => {
                        // Esperamos a que el usuario confirme la eliminacion del producto
                        if(!confirm('¿Estas seguro de Eliminar?')) {
                            e.preventDefault()
                        }
                    }}
                >
                    <input type="submit" className="bg-red-600 p-2 w-full rounded-lg text-white text-sm text-center uppercase font-bold cursor-pointer" value="Eliminar"/>
                </Form>
            </div>
        </td>
    </tr>  
  )
}
