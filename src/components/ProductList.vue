<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://cdn.dribbble.com/users/2077073/screenshots/7103423/media/223825c7f91575b639fd71f3accff8f4.gif"
      alt=""
    />
    <ul v-else>
      <li v-for="(product, index) in products" :key="index">
        {{ product.title }} - {{ product.price | currency }} -
        {{ product.inventory }}
        <button @click="addProductToCart(product)">Add to cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
// import store from "../store/index";
// Since we add this import to main.js and we can acess the  store usign this.$store
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    products() {
      // return available products if inventory = 0 return nothing
      return this.$store.getters.availableProducts;
    },
  },
  // dispatch call actions
  created() {
    this.loading = true;
    this.$store.dispatch("fetchProducts").then(() => (this.loading = false));
  },
  methods: {
    addProductToCart(product) {
      this.$store.dispatch("addProductToCart", product);
    },
  },
};
</script>

<style>
</style>