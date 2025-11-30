import { cookies } from "next/headers";

export const cookieForwarder = {
  async forwardCookiesToBrowser(headers: Headers): Promise<void> {
    const setCookies = headers.getSetCookie?.() ?? headers.get("set-cookie");

    if (setCookies) {
      const rawCookies = Array.isArray(setCookies) ? setCookies : [setCookies];
      const cookieStore = await cookies();

      for (const c of rawCookies) {
        const [nameValue] = c.split(";");
        const [name, value] = nameValue.split("=");

        cookieStore.set({
          name: name.trim(),
          value: value.trim(),
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
      }
    }
  },
};
