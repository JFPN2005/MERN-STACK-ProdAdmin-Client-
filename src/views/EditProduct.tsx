import { Form, Link, useActionData, ActionFunctionArgs, redirect, LoaderFunctionArgs, useLoaderData} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { getProductById, updateProduct } from "../services/ProductService";
import { Product } from "../types";
import ProductForm from "../components/ProductForm";

// Recogemos los datos de un producto
export async function loader({params} : LoaderFunctionArgs) {
  // Verificamos que el ID este definido
  if(params.id !== undefined) {
    const product = await getProductById(+params.id)
    if(!product) {
      throw new Response('', { status: 404, statusText: "Producto no Encontrado"})
    } else {
      return product
    }
  }
}

// Accion de envio y validacion de datos en el formulario
export async function action({request, params}: ActionFunctionArgs) {

  // Accedemos a los datos agregados en el formulario
  const data = Object.fromEntries(await request.formData())
  let error = ''

  // Validamos los datos
  if(Object.values(data).includes('')) {
    error = 'Todos los campos son obligatorios'
  }

  // Retornamos un error en caso que haya
  if(error.length) {
    return error
  }

  if(params.id !== undefined) {
    // Esperamos a que los datos se guarden
    await updateProduct(data, +params.id)

    return redirect('/')
  }


}

const availabilityOptions = [
  { name: 'Disponible', value: true},
  { name: 'No Disponible', value: false}
]

export default function EditProduct() {
  
  // Accedemos al error en caso de que haya en el envio de datos
  const error = useActionData() as string  
  const product = useLoaderData() as Product
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-black text-emerald-600">Editar Producto</h2>
        <Link to="/" className="bg-orange-400 hover:bg-orange-500 shadow-sm p-3 rounded-lg text-white font-bold" >Volver a Productos</Link>
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          className="mt-10"
          method="POST"
          >
          
          <ProductForm 
            product={product}
          />

          <div className="mb-4">
            <label
              className="text-gray-800"
              htmlFor="availability"
            >Disponibilidad:</label>
            <select 
              id="availability"
              className="mt-2 block w-full p-3 bg-gray-50"
              name="availability"
              defaultValue={product?.availability.toString()}
            >
              {availabilityOptions.map(option => (
                <option key={option.name} value={option.value.toString()}>{option.name}</option>
              ))}
            </select>
          </div>

          <input
            type="submit"
            className="mt-5 w-full bg-emerald-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
            value="Guardar Cambios"
          />
        </Form>
    </>
  )
}
