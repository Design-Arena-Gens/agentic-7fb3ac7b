"use server";

import { revalidatePath } from "next/cache";
import { leadSchema } from "@/lib/validation";
import { sendWhatsAppLeadMessage } from "@/lib/whatsapp";

export type ActionState =
  | {
      status: "idle";
    }
  | {
      status: "success";
      message: string;
      requestId?: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function registerLeadAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = leadSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors
    };
  }

  const result = await sendWhatsAppLeadMessage(parsed.data);

  if (!result.success) {
    return {
      status: "error",
      message:
        result.detail ??
        result.error?.message ??
        "Unable to send WhatsApp message. Try again later."
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "WhatsApp message sent successfully.",
    requestId: result.requestId
  };
}
