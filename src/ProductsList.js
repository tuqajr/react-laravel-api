import React, { useEffect, useState } from "react";
import './App.css';  

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addProduct = () => {
    fetch("https://api.escuelajs.co/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setNewProduct({
          title: "",
          description: "",
          price: 0,
          images: [],
        });
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  const updateProduct = () => {
    fetch(`https://api.escuelajs.co/api/v1/products/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? data : product
        );
        setProducts(updatedProducts);
        setIsEditing(false);
        setEditingProduct(null);
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  const deleteProduct = (id) => {
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  return (
    <div>
      <h2>Product List</h2>
      {isEditing ? (
        <div>
          <h3>Edit Product</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingProduct.title}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                title: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: e.target.value,
              })
            }
          />
          <button onClick={updateProduct}>Update</button>
        </div>
      ) : (
        <div>
          <h3>Add New Product</h3>
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      )}
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.images[0]} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
            <button onClick={() => {
              setIsEditing(true);
              setEditingProduct(product);
            }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
