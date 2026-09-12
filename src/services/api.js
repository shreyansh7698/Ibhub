/**
 * Single entry point for every backend call in the visa-application flow.
 * Dispatches to the mock services or the real HTTP client based on
 * `VITE_USE_MOCK_API` (see services/config.js). UI code imports from here only —
 * never from mockApi / httpApi directly.
 */
import { USE_MOCK } from './config.js';
import * as mock from './mockApi.js';
import * as http from './httpApi.js';

const impl = USE_MOCK ? mock : http;

export const isMock = USE_MOCK;

export const createApplication = (...a) => impl.createApplication(...a);
export const getApplication = (...a) => impl.getApplication(...a);
export const updateApplication = (...a) => impl.updateApplication(...a);
export const uploadDocument = (...a) => impl.uploadDocument(...a);
export const removeDocument = (...a) => impl.removeDocument(...a);
export const listDocuments = (...a) => impl.listDocuments(...a);
export const getDocumentBlob = (...a) => impl.getDocumentBlob(...a);

export const createPaymentOrder = (...a) => impl.createPaymentOrder(...a);
export const verifyPayment = (...a) => impl.verifyPayment(...a);
export const getPayment = (...a) => impl.getPayment(...a);

export const userSignup = (...a) => impl.userSignup(...a);
export const userLogin = (...a) => impl.userLogin(...a);
export const userForgotPassword = (...a) => impl.userForgotPassword(...a);
export const userResetPassword = (...a) => impl.userResetPassword(...a);

export const adminLogin = (...a) => impl.adminLogin(...a);
export const adminForgotPassword = (...a) => impl.adminForgotPassword(...a);
export const adminResetPassword = (...a) => impl.adminResetPassword(...a);
export const adminListApplications = (...a) => impl.adminListApplications(...a);
export const adminGetStats = (...a) => impl.adminGetStats(...a);
export const adminGetApplication = (...a) => impl.adminGetApplication(...a);
export const adminSetStatus = (...a) => impl.adminSetStatus(...a);
export const adminSetDocumentStatus = (...a) => impl.adminSetDocumentStatus(...a);
export const adminAddNote = (...a) => impl.adminAddNote(...a);

export const __resetMock = impl.__resetMock;
