<template>
  <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
      <div class="flex justify-center items-center">
        
        <span class="text-gray-700 font-semibold text-2xl">API Gateway Dashboard</span>
      </div>

     

      <form class="mt-4" @submit.prevent="login">

        <label class="block">
          <span class="text-gray-700 text-sm">Email</span>
          <input
            type="text"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="email"
          />
        </label>

        <label class="block mt-3">
          <span class="text-gray-700 text-sm">Password</span>
          <input
            type="password"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="password"
          />
        </label>

        <div class="flex justify-between items-center mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox text-indigo-600" />
              <span class="mx-2 text-gray-600 text-sm">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm fontme text-indigo-700 hover:underline"
              href="#"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="py-2 px-4 text-center bg-indigo-600 rounded-md w-full text-white text-sm hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>


      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import apiClient from '../services/apiClient';
import { useToast } from "vue-toastification";
import { userStore } from "../store/user-store";

export default defineComponent({
  setup(props, context) {
    const router = useRouter();
    const email = ref("admin");
    const password = ref("admin");
    onBeforeMount(async () => await userStore.init())

    const toast = useToast();
    

    function login() {
      (async () => {
        try {
          // @TODO: rewrite to promise api to avoid verbosity
          let result = await apiClient.post('/auth', { username: email.value, password: password.value }, { withCredentials: true })
          if (!result.data.success || typeof result.data.user.id == 'undefined') {
            throw 'Wrong response data!'
          }
          
          toast.success("Logged in successfully!");
          userStore.setUser({ id: result.data.user.id, name: result.data.user.name, avatar: 'https://some-img' });
          router.push("/dashboard");
          
        } catch(e) {
          let errMsg = 'Unknown error'
          if (e.response?.data?.error) {
            errMsg = e.response?.data?.error
          } else if (e.response?.statusText) {
            errMsg = e.response?.statusText
          } else {
            errMsg = e
          }

          toast.error(errMsg)

        }
      })();
      
    }

    return {
      login,
      email,
      password
    };
  },
});
</script>
