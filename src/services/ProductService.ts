import { number, parse, pipe, safeParse, string, transform, } from "valibot";
import { DraftProductSchema, Product, ProductSchema, ProductsSchema } from "../types";
import axios from "axios";
import { toBoolean } from "../utils";

// Tipamos los datos del formulario
type ProductData = {
    [k: string]: FormDataEntryValue;
}

// Funcion para añadir productos
export async function addProduct (data : ProductData) {
    try {
        const result = safeParse(DraftProductSchema, {
            name: data.name,
            price: +data.price
        })

        if(result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/products`

            // Accedemos a los datos de la url
            await axios.post(url, {
                name: result.output.name,
                price: result.output.price
            })
        } else {
            throw new Error('Datos no validos')
        }

    } catch (error) {
        console.log(error)
    }
}

// Funcion para recibir los datos de los productos
export async function getProducts() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products`
        const {data} = await axios(url);
        // Tipamos los datos
        const result = safeParse(ProductsSchema ,data.data)
        if(result.success) {
            // Regresamos el resultado a la vista Products
            return result.output
        } else {
            throw new Error('Hubo un error...')
        }
    } catch (error) {
        console.log(error)
    }
}

// Funciono para recibir los productos
export async function getProductById(id : Product['id'] ) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        const {data} = await axios(url);
        // Tipamos los datos
        const result = safeParse(ProductSchema ,data.data)
        if(result.success) {
            // Regresamos el resultado a la vista Products
            return result.output
        } else {
            throw new Error('Hubo un error...')
        }
    } catch (error) {
        console.log(error)
    }
}

// Funcion para actualizar los productos
export async function updateProduct(data: ProductData, id: Product['id']) {
    try {
        const NumberSchema = pipe(string(), transform(Number), number());
        const result = safeParse(ProductSchema, {
            id,
            name: data.name,
            price: parse(NumberSchema, data.price),
            availability: toBoolean(data.availability.toString())     
        })
        
        // Si todo esta bien actualizamos los datos
        if(result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
            await axios.put(url, result.output)
        }
    } catch (error) {
        console.log(error)
    }
}

// Funcion para eliminar productos
export async function deleteProduct(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error)
    }
}

// Funcion para actualizar disponibilidad
export async function updateProductAvailability(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.patch(url)
    } catch (error) {
        console.log(error)
    }
}