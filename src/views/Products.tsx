import { ActionFunctionArgs, Link, useLoaderData } from "react-router-dom";
import { getProducts, updateProductAvailability } from "../services/ProductService";
import ProductDetails from "../components/ProductDetails";
import { Product } from "../types";

// Recogemos los productos de la base de datos
export async function loader() {
  const products = await getProducts()
  return products
}

export async function action({request} : ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData())
  await updateProductAvailability(+data.id)
  return {}
}

export default function Products() {
  // Pasamos los productos que recogimos en el loader y lo tipamos
  const products = useLoaderData() as Product[]

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-black text-emerald-600">Productos</h2>
        <Link to="productos/nuevo" className="bg-orange-500 hover:bg-orange-600 shadow-sm p-3 rounded-lg text-white font-bold" >Agregar Productos</Link>
      </div>

      <div className="p-2">
        <table className="w-full mt-5 table-auto">
          <thead className="bg-slate-800 text-white">
              <tr>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Disponibilidad</th>
                  <th className="p-2">Acciones</th>
              </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <ProductDetails 
                key={product.id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
    
  )
}
