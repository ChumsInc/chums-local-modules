export interface Address {
    name: string;
    address: string;
}
export interface sendMailProps {
    to: (string | Address) | (string | Address)[];
    cc?: (string | Address) | (string | Address)[];
    bcc?: (string | Address) | (string | Address)[];
    replyTo?: string | Address;
    from?: string | Address;
    subject?: string;
    html: string;
    textContent?: string;
    attachments?: any;
}
export declare const getTs: () => number;
export declare const getTs36: () => string;
/**
 *
 * @param {string} ts
 * @return {{path: string, filename: string, cid: string}}
 */
export declare const getLogoImageAttachment: (ts?: string) => {
    filename: string;
    path: string;
    cid: string;
};
export declare const sendGmail: ({ to, cc, bcc, replyTo, from, subject, html, textContent, attachments }: sendMailProps) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendEmail: ({ to, cc, bcc, replyTo, from, subject, html, textContent, attachments }: sendMailProps) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
