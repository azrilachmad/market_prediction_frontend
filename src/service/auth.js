import { setCookieValue } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

// export const loginUser = async (params) => {
//   await axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}/login`, JSON.stringify(params),
//     {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     }
//   ).then(response => {
//     if (response) {
//       // setCookieValue('cred_m', response.data.token)
//       // setCookieValue('user', response.data.nama)
//       localStorage.setItem('cred_m', response.data.token)
//       localStorage.setItem('user', response.data.nama)
//       localStorage.setItem('user_id', response.data.id)
//       window.location.href = '/dashboard'
//     }
//   })
// };

export const logoutUser = async () => {
  const token = localStorage.getItem('cred_m')

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}/logout`, config
    );
    if (response) {
      // console.log(response)
      enqueueSnackbar("Successfully logout", {variant: 'success'})
      localStorage.clear()
      // window.location.href = '/'
      return response
    }
  } catch (error) {
    enqueueSnackbar("Something went wrong", {variant: 'error'})
  }

};
