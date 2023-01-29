import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../reducers/actions';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';
import { connect } from 'react-redux';

function ProductList(props) {
  //load products from db
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      props.loadProducts(data.products);
    }
  }, [data])

  function filterProducts() {
    if (!props.category) {
      return props.allProducts;
    }

    return props.allProducts.filter(
      (product) => product.category._id === props.category
    );
  };

  

  // useEffect(() => {
  //   if (data) {
  //     dispatch({
  //       type: UPDATE_PRODUCTS,
  //       products: data.products,
  //     });
  //     data.products.forEach((product) => {
  //       idbPromise('products', 'put', product);
  //     });
  //   } else if (!loading) {
  //     idbPromise('products', 'get').then((products) => {
  //       dispatch({
  //         type: UPDATE_PRODUCTS,
  //         products: products,
  //       });
  //     });
  //   }
  // }, [data, loading, dispatch]);

 

    

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {props.allProducts.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}



const mapStateToProps = (state) => {
  return {
    allProducts: state.products,
    category: state.currentCategory
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProducts: (dbProducts) => {
      dispatch({type: UPDATE_PRODUCTS, products: dbProducts});
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
