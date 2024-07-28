import { deleteCookie, getCookie, setCookie } from "cookies-next"
import dayjs from "dayjs"
import Swal from "sweetalert2"

// REGEX VALIDATION
export const validateRegex = (value, type, removeTrailing) => {
  let result
  if (type === 'text') {
    result = value.replace(/[^\w.\-\_\s']/g, '') // allow alphanumeric, hyphen, underscore, singlequote
  } else if (type === 'email') {
    result = value.replace(/[^\w.\-\_'\@]/g, '') // allow alphanumeric, hyphen, underscore, singlequote and @
  } else {
    result = value
  }

  if (removeTrailing) {
    result = result.replace(/^\s+|\s+$/g, '') // remove leading & trailing spaces
  }

  return result
}

export const isObject = (data) => {
  if (data && Object.keys(data).length > 0 && data.constructor === Object) {
    return true
  }
  return false
}

export const isArray = (data) => {
  if (data && Array.isArray(data) && data.length) return true
  return false
}

export const setCookieValue = (
  key,
  value,
  options
) => {
  const dataToStore = JSON.stringify(value);
  setCookie(key, dataToStore, options);
};

export const deleteCookieValue = (value) => {
  deleteCookie(value);
};

export const getCookieValueByKey = (key) => {
  const data = getCookie(key) ?? "";
  return data ? JSON.parse(data) : null;
};


export const convDate = (date, customFormat) => {
  const convert = () => {
    return dayjs(date).format(customFormat ? customFormat : 'YYYY-MM-DD');
  };

  if (date && date instanceof Date && !isNaN(date.valueOf())) {
    return convert();
  } else {
    const check = dayjs(date).isValid();
    return check ? convert() : null;
  }
};

// POPUP HELPER

export const showPopup = (type, ...rest) => {
  switch (type) {
    case 'confirm':
      const [message, btnOKText, handleOK] = rest;
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        title: 'Confirmation',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2DC2BD',
        cancelButtonColor: '#E5AF5A',
        confirmButtonText: btnOKText ? btnOKText : 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          handleOK();
        }
      });
      break;
    case 'warning':
      const [warnMessage, warnBtnOKText, warnHandleOK] = rest;
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'WARNING',
        text: warnMessage,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2DC2BD',
        cancelButtonColor: '#E5AF5A',
        confirmButtonText: warnBtnOKText ? warnBtnOKText : 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          warnHandleOK();
        }
      });
      break;
    case 'infohandle':
      const [handleMessage, handleBtnOKText, handleHandleOK] = rest;
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'INFO',
        text: handleMessage,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2DC2BD',
        cancelButtonColor: '#E5AF5A',
        confirmButtonText: handleBtnOKText ? handleBtnOKText : 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          handleHandleOK();
        }
      });
      break;
    case 'info':
      const [infoTitle, infoMessage] = rest;
      Swal.fire(infoTitle, infoMessage, 'info');
      break;
    case 'error':
      const [errorMessage] = rest;
      Swal.fire(
        'Oops...',
        errorMessage ?
          errorMessage :
          `Something is wrong, please try again later...`,
        'error',
      );
      break;
    default:
      return;
  }
};


export const formatCurrency = (number) => {
  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  return addCommas(removeNonNumeric(number))
}

