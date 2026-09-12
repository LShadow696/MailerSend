import { createFileRoute } from "@tanstack/react-router";
import { SmsStudio } from "@/components/sms-studio";
import { getSmsLine } from "@/lib/sms/api";
import { FROM_NUMBER } from "@/lib/sms/constants";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getSmsLine();
    } catch {
      return {
        connected: false,
        from: FROM_NUMBER,
        paused: false,
        error: "Nepodařilo se spojit s MailerSend.",
      };
    }
  },
  component: Home,
});

function Home() {
  const line = Route.useLoaderData();
  return (
    <SmsStudio
      initialLine={
        line ?? {
          connected: false,
          from: FROM_NUMBER,
          paused: false,
        }
      }
    />
  );
}
