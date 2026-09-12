export type ChannelStatus = "live" | "provision" | "partner" | "closed";

export type Channel = {
  id: "sms" | "whatsapp" | "rcs" | "imessage" | "telegram";
  name: string;
  status: ChannelStatus;
  summary: string;
  detail: string;
  needs: string;
};

export const channels: Channel[] = [
  {
    id: "imessage",
    name: "iMessage",
    status: "live",
    summary: "Sendblue · +1 917 625 7748",
    detail:
      "Linka je online. Sendblue pošle modrou bublinu, když to číslo iMessage umí. Jinak spadne na RCS nebo SMS. Už jste ověřili české číslo na této lince.",
    needs: "Nic dalšího. Klíč je na serveru, číslo +1 917 625 7748 je připojené.",
  },
  {
    id: "sms",
    name: "SMS",
    status: "live",
    summary: "MailerSend · USA a Kanada",
    detail:
      "Toll-free +1 833 256 2129 pořád posílá přes MailerSend. Jen USA a Kanada. Pro Česko použijte iMessage.",
    needs: "Nic dalšího. MailerSend klíč a číslo jsou připojené.",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    status: "provision",
    summary: "Nastavte Cloud API v Nastavení",
    detail:
      "MailerSend WhatsApp endpoint existuje, ale váš token nemá oprávnění (403). Dřívější klíč WAA Meta Graph API nepřijala. Potřebujete: 1) Meta Business + WABA, 2) ověřené číslo, 3) Phone Number ID, 4) systémový token začínající EAA. Volný text na nový kontakt nejde — Meta chce schválenou šablonu.",
    needs: "Phone Number ID a token EAA z developers.facebook.com → WhatsApp → API Setup.",
  },
  {
    id: "rcs",
    name: "RCS",
    status: "partner",
    summary: "Přes Sendblue na Android",
    detail:
      "Samostatný firemní RCS agent (logo, karty, ověřený odesílatel) tu není. Sendblue ale na Androidu zkusí RCS a jinak SMS. To není totéž jako Google RBM.",
    needs: "Pro branded RCS: Twilio, Sinch nebo Infobip a ověřený agent.",
  },
  {
    id: "telegram",
    name: "Telegram",
    status: "partner",
    summary: "Oficiální Bot API, zdarma",
    detail:
      "Telegram Bot API je veřejné a v Česku běžné. Příjemce musí bota nejdřív spustit.",
    needs: "Token od BotFather.",
  },
];
