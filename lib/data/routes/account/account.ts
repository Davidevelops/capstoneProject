import {
  Account,
  CreateAccountRequest,
  Permission,
  AssignPermissionsRequest,
} from "@/lib/types";
import axios from "axios";

export const getAccounts = async (): Promise<Account[] | null> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.get(`${api_url}?include=permissions`);

    return response.data.data;
  } catch (error) {
    console.error("Error while getting accounts: ", error);
    return null;
  }
};
export const createAccount = async (accountData: CreateAccountRequest) => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    console.log("Sending account data:", accountData);

    const response = await axios.post(`${api_url}`, accountData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Detailed error:", error.response?.data);
    throw error;
  }
};

export const getAvailablePermissions = async (): Promise<
  Permission[] | null
> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.get(`${api_url}/permissions`);

    return response.data.data;
  } catch (error) {
    console.error("Error while getting available permissions: ", error);
    return null;
  }
};

export const addAccountPermissions = async (
  accountId: string,
): Promise<Permission[] | null> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.post(`${api_url}/${accountId}/permissions`);
    return response.data.data;
  } catch (error) {
    console.error("Error while adding account permissions: ", error);
    return null;
  }
};

export const updateAccount = async (
  accountId: string,
  accountData: { username: string; role: string },
) => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.patch(`${api_url}/${accountId}`, accountData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Update response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error while updating account: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.delete(`${api_url}/${accountId}`);

    console.log("Delete response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error while deleting account: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const changePassword = async (
  accountId: string,
  passwordData: { password: string },
) => {
  try {
    let api_url = process.env.NEXT_PUBLIC_ACCOUNT_API as string;
    const response = await axios.put(
      `${api_url}/${accountId}/password`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Password change response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error while changing password: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};
