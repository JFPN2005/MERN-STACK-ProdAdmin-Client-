import { Form, Link, useActionData, ActionFunctionArgs, redirect} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { addProduct } from "../services/ProductService";
import ProductForm from "../components/ProductForm";

// Accion de envio y validacion de datos en el formulario
export async function action({request}: ActionFunctionArgs) {

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

  // Esperamos a que los datos se guarden
  await addProduct(data)

  return redirect('/')
}
export default function NewProduct() {
  
  // Accedemos al error en caso de que haya en el envio de datos
  const error = useActionData() as string
  
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-black text-emerald-600">Crear Producto</h2>
        <Link to="/" className="bg-orange-400 hover:bg-orange-500 shadow-sm p-3 rounded-lg text-white font-bold" >Volver a Productos</Link>
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          className="mt-10"
          method="POST"
          >

          <ProductForm />

          <input
            type="submit"
            className="mt-5 w-full bg-emerald-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
            value="Registrar Producto"
          />
        </Form>
    </>
  )
}
