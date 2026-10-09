import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import { toast } from 'react-toastify';
import { authHeaders, getSession } from '../../utils/api';

function myState(props) {
    const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)"
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = "white"
        }
    }

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState({
        title: null,
        price: null,
        imageUrl: null,
        category: null,
        description: null,
        time: new Date().toISOString(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const addProduct = async () => {
        if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
            return toast.error("all fields are required")
        }

        setLoading(true)

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(products)
            });
            if (res.ok) {
                toast.success("Add product successfully");
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 800);
                getProductData();
            } else {
                toast.error("Failed to add product");
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const [product, setProduct] = useState([]);

    const getProductData = async () => {

        setLoading(true)

        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            // map _id to id for frontend compatibility
            const productArray = data.map(item => ({ ...item, id: item._id }));
            setProduct(productArray);
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    useEffect(() => {
        getProductData();
    }, []);

    // update product function

    const edithandle = (item) => {
        setProducts(item)
    }

    const updateProduct = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/products/${products.id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(products)
            });
            if (res.ok) {
                toast.success("Product Updated successfully")
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 800);
                getProductData();
            } else {
                toast.error("Failed to update product");
            }
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    // delete product

    const deleteProduct = async (item) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/products/${item.id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (res.ok) {
                toast.success('Product Deleted successfully')
                getProductData();
            } else {
                toast.error("Failed to delete product");
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    const [order, setOrder] = useState([]);

    // Admin gets every order, a normal user only gets their own (decided by the server)
    const getOrderData = async () => {
        if (!getSession()?.token) return;
        setLoading(true)
        try {
            const res = await fetch('/api/orders', { headers: authHeaders() });
            const data = res.ok ? await res.json() : [];
            setOrder(data.map(item => ({ ...item, id: item._id })));
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const [user, setUser] = useState([]);

    // Admin only
    const getUserData = async () => {
        if (getSession()?.user?.role !== 'admin') return;
        setLoading(true)
        try {
            const res = await fetch('/api/users', { headers: authHeaders() });
            setUser(res.ok ? await res.json() : []);
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getOrderData();
        getUserData();
    }, []);

    const [searchkey, setSearchkey] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterPrice, setFilterPrice] = useState('')

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            products, setProducts, addProduct, product,
            edithandle, updateProduct, deleteProduct, order,
            user, searchkey, setSearchkey,filterType,setFilterType,
            filterPrice,setFilterPrice,
            getOrderData, getUserData
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default myState