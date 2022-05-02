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
/**
 * The following environment variables are required:
 *     <div>
 *         <strong>AMAZON_SES_HOST</strong>
 *         <strong>AMAZON_SES_PORT</strong>
 *         <strong>AMAZON_SES_USERNAME</strong>
 *         <strong>AMAZON_SES_PASSWORD</strong>
 *     </div>
 * @param {string|string[]} [to]
 * @param {string|string[]} [cc]
 * @param {string|string[]} [bcc]
 * @param {string} replyTo
 * @param {string} from
 * @param {string} subject
 * @param {string} html
 * @param {string} [textContent]
 * @param [attachments]
 */
export declare const sendOldSESEmail: ({ to, cc, bcc, replyTo, from, subject, html, textContent, attachments }: sendMailProps) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
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
