import { deleting, get, post } from './Http';

export const loginApi = (data: any) => post(`/login`, JSON.stringify(data));
// export const loginApi = (data: any) => post(`/login2`, JSON.stringify(data));
export const socialLoginApi = (data: any) => post(`/social/login`, JSON.stringify(data));
export const socialRegisterApi = (data: any) => post(`/social/register`, JSON.stringify(data));

export const registerApi = (data: any) => post(`/login-register`, JSON.stringify(data));
export const guestLoginApi = () => post(`/guest/login`);
export const logoutApi = (data: any) => post(`/logout`, JSON.stringify(data));

// export const getHomeApi = () => get(`/user/home-screen`);
export const getHomeApi = ({ latitude, longitude }) => {
    // Building the query string based on optional latitude and longitude
    let url = `/user/home-screen`;
    if (latitude && longitude) {
      url = `/user/home-screen?latitude=${latitude}&longitude=${longitude}`;
    }
    return get(url); // Call the GET API with the URL
  };
// export const getVendorListApi = () => get(`/user/vendor/list`);
// api file
export const getVendorListApi = (params?: {
  category_id?: string | number;
  product_id?: string | number;
}) => {
  if (params?.category_id) {
    return get(`/user/vendor/list?category_id=${params.category_id}`);
  }

  if (params?.product_id) {
    return get(`/user/vendor/list?product_id=${params.product_id}`);
  }

  return get(`/user/vendor/list`);
};

export const searchVendorsApi = (params: any) =>
  get(`/user/vendors/search`, params);

// profile apis
export const getProfileApi = () => get(`/verify`);
export const profileUpdateApi = (data: any) => post(`/user/profile/update`, data, {}, true);


// /user/vendor/profile/10?products=true&reviews=true
export const getVendorProfileApi = (id: string, params = {}) => get(`/user/vendor/profile/${id}`, params);


// $validated = $request->validate([
//     'vendor_id'   => 'required|exists:users,id',
//     'name'        => 'required|string|max:255',
//     'visit_date'  => 'required|date',
//     'visit_time'  => 'required',
//     'note'        => 'nullable|string',
// ]);
export const visitFarmApi = (data: any) => post(`/user/farm-visit/request`, JSON.stringify(data));


// /user/vendor/review (post)
// $request->validate([
//             'vendor_id' => 'required|exists:users,id',
//             'rating' => 'required|integer|min:1|max:5',
//             'review' => 'nullable|string',
//         ]);
export const addFarmReviewApi = (data: any) => post(`/user/vendor/review`, JSON.stringify(data));

export const searchVendorProductsApi = (vendorId: string, params = {}) =>
  get(`/user/vendor/${vendorId}/products`, params);


// cart apis
export const addtoCartApi = (data: any) => post(`/user/cart/add`, JSON.stringify(data));
export const updatetoCartApi = (data: any) => post(`/user/cart/update`, JSON.stringify(data));
export const getCartApi = () => get(`/user/cart`);
export const deleteCartApi = (id: string) => deleting(`/user/cart/remove/${id}`);

// order create & listing
export const createOrderApi = (data: any) => post(`/user/order/create`, JSON.stringify(data));
export const intentPaymentStripeApi = (data: any) => post(`/user/stripe/payment-intent/create`, JSON.stringify(data));
export const getMyOrdersApi = (params: any) =>
  get(`/user/order/list?new=${params.new}&in_progress=${params.in_progress}&shipped=${params.shipped}`);
export const sendfcmTokenApi = (data: any) => post(`/user/save-fcm`, JSON.stringify(data));

// chat apis
export const getChatListApi = () => get(`/user/conversations`);
export const startChatApi = (data: any) => post(`/conversations`, JSON.stringify(data));
export const messageSendApi = (uuid: string, text: string) => post(`/conversations/${uuid}/metadata`, JSON.stringify({
  text: text
}));
export const messageReadApi = (uuid: string) => post(`/conversations/${uuid}/mark-read`);

export const getInfoApi = () => get(`/info`);
export const getFranchiseApi = () => get(`/franchises`);
export const getServiceApi = (detailed = 0) => get(`/services?detailed=${detailed}`);

export const setDeviceApi = (data: any) => post(`/user/device`, JSON.stringify(data));

export const userUpdateApi = (data: any) => post(`/user/update`, data, {}, true);
export const getMyProfileApi = () => get(`/me`);
export const deleteAccountApi = (data: any) => deleting(`/me`, JSON.stringify(data));

export const getUserApi = (id: string) => get(`/user/${id}`);
export const getUsersApi = (data: any) => get(`/users`, data);

export const updateBusinessApi = (data: any) => post(`/business`, data, {}, true);
export const updateServiceApi = (data: any) => post(`/business/categories`, JSON.stringify(data));

export const subscribeApi = (payload: any) => post(`/subscribe`, JSON.stringify(payload));
export const customerHomeApi = () => get(`/home`);

export const changePasswordApi = (data: any) => post(`/change-password`, JSON.stringify(data));
export const forgotPasswordApi = (data: any) => post(`/forgot-password`, JSON.stringify(data));

export const toggleFavoriteApi = (id: string) => get(`/user/favorite/${id}`);

export const setScheduleApi = (data: any) => post(`/schedule`, JSON.stringify(data));

export const getPaymentDetailsApi = () => get(`/payment-details`);

export const getWalletApi = () => get(`/wallet`);
export const walletTopupApi = (data: any) => post(`/wallet/topup`, JSON.stringify(data));
export const getTransactionsApi = (page: any) => get(`/wallet-transactions?page=${page}`);
export const getInvoicesApi = (data: any) => get(`/invoices?page=${data}`);
export const getInvoiceApi = (id: any) => get(`/invoices/${id}`);
export const invoicePayApi = (data: any) => post(`/invoices/pay`, JSON.stringify(data));

export const createCardApi = (data: any) => post(`/card`, JSON.stringify(data));
export const deleteCardApi = (id: string) => deleting(`/card?card_id=${id}`);
export const getCardsApi = () => get(`/cards`);

export const getAllSlotsApi = (id: string) => get(`/all-slots?service_provider_id=${id}`);
export const getTimeSlotsApi = (data: any) => get(`/time-slots`, data);

export const getQuestions = (id: string) => get(`/questionnaire/${id}`);

export const createBookingApi = (data: any) => post(`/appointment`, JSON.stringify(data));
export const getBookingApi = (data: any) => get(`/appointment`, data);
export const viewBookingApi = (id: string) => get(`/appointment/${id}`);
export const updateBookingApi = (data: any) => post(`/appointment/update`, data, {}, true);

export const getJobsApi = (data: any) => get(`/jobs`, data);
export const deleteJobsApi = (id: string) => deleting(`/job/${id}`);
export const applyJobApi = (id: string) => get(`/job/apply/${id}`);
export const declineJobApi = (id: string) => deleting(`/job/apply/${id}`);
// export const getAppliers = ( id: string ) => get(`/job/appliers/${ id }` );
export const hireApplierApi = (payload: any) => post(`/job/hired`, JSON.stringify(payload));

export const createReviewApi = (data: any) => post(`/reviews`, JSON.stringify(data));
export const getReviewApi = (id: string, params = {}) => get(`/reviews/${id}`, params);

export const getNotificationsApi = () => get(`/notifications`);
export const getContentApi = (type: string) => get(`/content/${type}`);

export const messageApi = (id: string) => get(`/messages/${id}`);
export const createMessageApi = (data: any) => post(`/messages`, JSON.stringify(data));

export const getAccountApi = () => get(`/account`);
export const accountApi = (data: any) => post(`/account`, JSON.stringify(data));
export const removeAccountApi = () => deleting(`/account`);

export const contactusApi = (data: any) => post(`/contactus`, JSON.stringify(data));

export const ticketApi = (id: string) => get(`/tickets/${id}`);
export const createTicketMessageApi = (data: any) => post(`/tickets`, JSON.stringify(data));
