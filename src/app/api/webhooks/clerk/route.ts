import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { type, data } = evt;

    if (type === "user.created") {
      const user = data;

      const userId = user.id;
      const firstName = user.first_name;
      const lastName = user.last_name;

      const primaryEmail = user.email_addresses.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address;

      console.log(userId, firstName, lastName, primaryEmail);

      const response = await fetch("/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: primaryEmail,
          clerkId: userId,
        }),
      });

      if (!response.ok) {
        return new Response("Failed to save user data", { status: 500 });
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
