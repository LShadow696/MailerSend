import { createFileRoute } from "@tanstack/react-router";
import { SmsStudio } from "@/components/sms-studio";
import { getChannelStatus } from "@/lib/sms/api";
import { FROM_NUMBER, IMESSAGE_FROM } from "@/lib/sms/constants";

const FALLBACK = {
  sms: {
    connected: false,
    from: FROM_NUMBER,
    paused: false,
    error: "Nepodařilo se spojit s MailerSend.",
  },
  imessage: {
    connected: false,
    from: IMESSAGE_FROM,
    paused: false,
    error: "Nepodařilo se spojit se Sendblue.",
  },
  whatsapp: {
    connected: false,
    from: "",
    paused: false,
    error: "WhatsApp klíč Meta nepřijala.",
  },
  contacts: [] as Array<{ name: string; phone: string }>,
};

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getChannelStatus();
    } catch {
      return FALLBACK;
    }
  },
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return <SmsStudio initial={data ?? FALLBACK} />;
}
