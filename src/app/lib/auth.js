import { ADMIN_URLs } from "@/services/http.services";
import axios from "axios";
import { cookies } from "next/headers";

export async function getMyProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${ADMIN_URLs.getMyProfile}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      cache: "no-store",
    });

    if (response?.data?.status === 401 || response?.data?.status === 403) {
      return null;
    }

    if (!response?.data?.success) {
      throw new Error("Failed to fetch profile");
    }
  } catch (error) {
    console.error(error?.message);
    return null;
  }
}
