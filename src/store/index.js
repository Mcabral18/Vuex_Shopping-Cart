import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import shop from "../api/shop";
export default new Vuex.Store({
  // = data
  state: {
    products: [],
    //{{id, quantity}}
    cart: [],
    checkoutStatus: null
  },
  // = state changes, updates
  //update the state
  //update products
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      });
    },
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    }
  },
  // = methods
  // decide when a mutation is fired
  actions: {
    fetchProducts({ commit }) {
      // make the call
      // run setProducts mutation
      return new Promise(resolve => {
        shop.getProducts(products => {
          commit("setProducts", products);
        });
        resolve();
      });
    },
    addProductToCart(context, product) {
      //find cartItem
      if (product.inventory > 0) {
        const cartItem = context.state.cart.find(
          item => item.id === product.id
        );
        if (!cartItem) {
          //pushProductToCart
          context.commit("pushProductToCart", product.id);
        } else {
          //incrementItemQuantity
          context.commit("incrementItemQuantity", cartItem);
        }
        context.commit("decrementProductInventory", product);
      }
    },
    checkout({ state, commit }) {
      shop.buyProducts(state.cart, () => {
        commit("emptyCart");
        commit("setCheckoutStatus", "sucess");
      }),
        () => {
          commit("setCheckoutStatus", "fail");
        };
    }
  },
  // = computed properties
  //automatically update when dependencies changes
  //used to return the date to yours components
  getters: {
    availableProducts(state) {
      //return the array products
      // return state.products;
      // return the array products with a filter
      return state.products.filter(product => product.inventory > 0);
    },
    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(
          product => product.id === cartItem.id
        );
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        };
      });
    },
    cartTotal(state, getters) {
      // let total = 0;
      // getters.cartProducts.forEach(product => {
      //   total += product.price * product.quantity;
      // });
      // return total;
      return getters.cartProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    }
  }
});
