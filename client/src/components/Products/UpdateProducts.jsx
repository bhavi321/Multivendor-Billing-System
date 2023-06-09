import { Fragment, React } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { api } from "../../App";

function UpdateProducts() {
  const [error, setError] = useState("");
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [details, setDetails] = useState({
    productName: "",
    unit: "",
    price: "",
  });
  const params = useParams();
  console.log(details);
  useEffect(() => {
    api
      .get(`/products/id/${params.id}`, {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        setDetails(res.data.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }, []);
  function handleChange(e) {
    const { name, value } = e.target;

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { productName, unit, price } = details;
    api
      .put(
        `/products/update/${params.id}`,
        { productName, unit, price },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        }
      )
      .then((response) => {
        setUpdatedProduct(response.data.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
    //error.response.data.error.details
    //backgroundColor:"rgb(252, 171, 171)
  }
  return (
    <Fragment>
      <div className="">
        <div className="container col-lg-3 col-5 shadow p-4 rounded mt-5 updateForm">
          <h1 className="">UPDATE PRODUCT</h1>
          <hr className="" />
          {error && <p className="alert alert-danger">{error}</p>}
          <form>
            <div className="form-group mt-3 mt-4">
              <label htmlFor="productName" className="form-label ">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                name="productName"
                value={details.productName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="unit" className="form-label">
                Unit
              </label>
              <input
                type="text"
                className="form-control"
                id="unit"
                name="unit"
                value={details.unit}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="price" className="form-label ">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={details.price}
                onChange={handleChange}
              />
            </div>

            <input
              type="submit"
              className="form-control btn btn-success  mt-4"
              onClick={handleSubmit}
            ></input>
          </form>
        </div>
        <hr />
        {Object.keys(updatedProduct).length != 0 ? (
          <div
            className="card mx-auto col-lg-4 col-sm-10 mt-3 col-md-5 shadow"
            style={{ width: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">{updatedProduct.productName}</h5>
              <h6 className="mb-2 text-body-primary">
                unit: {updatedProduct.unit}
              </h6>
              <h6 className=" mb-2 text-body-primary">
                price: {updatedProduct.price}
              </h6>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Fragment>
  );
}

export default UpdateProducts;
